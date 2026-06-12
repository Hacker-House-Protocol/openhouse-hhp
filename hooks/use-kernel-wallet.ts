"use client"

import { useState, useCallback } from "react"
import { useWallets, useCreateWallet, getEmbeddedConnectedWallet } from "@privy-io/react-auth"
import { createWalletClient, custom } from "viem"
import { arbitrumSepolia } from "viem/chains"
import { createKernelClient, getKernelAddress } from "@/lib/zerodev"
import type { KernelAccountClient } from "@zerodev/sdk/clients"

type KernelWalletState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; kernelClient: KernelAccountClient; kernelAddress: `0x${string}` }
  | { status: "error"; error: string }

/**
 * Connects the user's Privy wallet to a ZeroDev Kernel smart account.
 * Call `connect()` after the user has authenticated with Privy.
 *
 * Supports both:
 *   - External wallets (MetaMask, etc.) — uses wallets[0]
 *   - Embedded wallets (email/social login) — auto-creates if needed
 *
 * Returns:
 *   - connect()       — initializes the Kernel client from the first connected wallet
 *   - kernelClient    — the gasless smart account client (use to send txs)
 *   - kernelAddress   — the smart wallet address (save to user profile)
 *   - status          — "idle" | "loading" | "ready" | "error"
 */
export function useKernelWallet() {
  const { wallets } = useWallets()
  const { createWallet } = useCreateWallet()
  const [state, setState] = useState<KernelWalletState>({ status: "idle" })

  const connect = useCallback(async () => {
    setState({ status: "loading" })

    try {
      // 1. Try embedded wallet first (email/social login users)
      let wallet = getEmbeddedConnectedWallet(wallets)
      console.log("[KernelWallet] wallets count:", wallets.length, "embedded:", !!wallet)
      console.log("[KernelWallet] wallet types:", wallets.map(w => `${w.walletClientType}:${w.address?.slice(0, 8)}`))

      // 2. Fall back to any connected wallet (MetaMask, etc.)
      if (!wallet) {
        wallet = wallets[0] ?? null
        console.log("[KernelWallet] fallback to wallets[0]:", !!wallet)
      }

      // 3. If still no wallet, create an embedded one (first-time email users)
      if (!wallet) {
        console.log("[KernelWallet] no wallet found, creating embedded wallet...")
        try {
          const created = await createWallet()
          console.log("[KernelWallet] created wallet:", created?.address?.slice(0, 10))
          wallet = created as unknown as typeof wallets[0]
        } catch (createErr) {
          console.log("[KernelWallet] createWallet error:", createErr)
          // createWallet throws if embedded wallet already exists
          // retry getting it from the array
          wallet = getEmbeddedConnectedWallet(wallets) ?? wallets[0] ?? null
          console.log("[KernelWallet] retry after error:", !!wallet)
        }
      }

      if (!wallet) {
        setState({ status: "error", error: "No wallet available. Please log in first." })
        return null
      }

      console.log("[KernelWallet] using wallet:", wallet.walletClientType, wallet.address?.slice(0, 10))

      const provider = await wallet.getEthereumProvider()
      const address = wallet.address as `0x${string}`

      const walletClient = createWalletClient({
        account: address,
        chain: arbitrumSepolia,
        transport: custom(provider),
      })

      const [kernelClient, kernelAddress] = await Promise.all([
        createKernelClient(walletClient),
        getKernelAddress(walletClient),
      ])

      setState({ status: "ready", kernelClient, kernelAddress })
      return { kernelClient, kernelAddress }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initialize smart wallet"
      setState({ status: "error", error: message })
      return null
    }
  }, [wallets, createWallet])

  return {
    connect,
    status: state.status,
    kernelClient: state.status === "ready" ? state.kernelClient : null,
    kernelAddress: state.status === "ready" ? state.kernelAddress : null,
    error: state.status === "error" ? state.error : null,
    isLoading: state.status === "loading",
    isReady: state.status === "ready",
  }
}
