"use client"

import { useState } from "react"
import { useWallets, getEmbeddedConnectedWallet } from "@privy-io/react-auth"
import { Wallet, Copy, Check, ExternalLink, Shield } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletBadge() {
  const { wallets } = useWallets()
  const [copied, setCopied] = useState(false)

  const embedded = getEmbeddedConnectedWallet(wallets)
  const privyWallet = wallets.find(w => w.walletClientType === "privy")
  const wallet = embedded ?? privyWallet ?? wallets[0] ?? null
  const address = wallet?.address ?? null
  const walletType = wallet?.walletClientType ?? null

  if (!address) return null

  const walletLabel = walletType === "privy" ? "Embedded" : walletType === "metamask" ? "MetaMask" : walletType === "phantom" ? "Phantom" : "Wallet"

  function handleCopy() {
    navigator.clipboard.writeText(address!)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex justify-end px-4 py-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 h-8 px-3 rounded-full border border-border bg-card hover:bg-muted transition-colors"
          >
            <div className="size-2 rounded-full bg-builder-archetype shrink-0" />
            <Wallet className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">Connected</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-0">
          <div className="p-4 flex flex-col gap-3">
            {/* Privacy notice */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
              <Shield className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This is your <span className="text-foreground font-medium">smart wallet</span>, created by the platform to protect your identity on-chain. Your personal wallet is never exposed.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Network</span>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-builder-archetype" />
                <span className="text-xs font-mono text-foreground">Arbitrum Sepolia</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Wallet</span>
              <span className="text-xs font-mono text-foreground">{walletLabel}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Address</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-mono text-foreground hover:text-primary transition-colors"
              >
                {truncate(address)}
                {copied ? <Check className="size-3 text-builder-archetype" /> : <Copy className="size-3" />}
              </button>
            </div>

            <a
              href={`https://sepolia.arbiscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors pt-2 border-t border-border"
            >
              View on Arbiscan
              <ExternalLink className="size-3" />
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
