"use client"

import { useQueryClient } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppMutation, useAppQuery } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type { UserWallet } from "@/lib/types"

export const useWallets = () =>
  useAppQuery<{ wallets: UserWallet[] }>({
    fetcher: async () => {
      return genericAuthRequest<{ wallets: UserWallet[] }>("get", "/api/wallets")
    },
    queryKey: [queryKeys.wallets],
  })

interface AddWalletInput {
  wallet_address: string
  label?: string
}

export const useAddWallet = () => {
  const queryClient = useQueryClient()
  return useAppMutation<AddWalletInput, { wallet: UserWallet }>({
    fetcher: async (input) => {
      return await genericAuthRequest<{ wallet: UserWallet }>(
        "post",
        "/api/wallets",
        input,
      )
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallets] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.profile] })
      },
    },
  })
}

export const useRemoveWallet = () => {
  const queryClient = useQueryClient()
  return useAppMutation<string, { success: boolean }>({
    fetcher: async (walletId) => {
      return await genericAuthRequest<{ success: boolean }>(
        "delete",
        `/api/wallets?id=${walletId}`,
      )
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallets] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.profile] })
      },
    },
  })
}
