"use client"

import { formatUnits } from "viem"
import { cn } from "@/lib/utils"
import type { HackerHouse } from "@/lib/types"
import type { useEscrowState } from "@/hooks/use-escrow-state"

type EscrowData = NonNullable<ReturnType<typeof useEscrowState>["data"]>

interface Props {
  house: HackerHouse
  escrow: EscrowData | undefined
  escrowLoading: boolean
}

export function EscrowStatus({ house, escrow, escrowLoading }: Props) {
  if (escrowLoading || !escrow) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 animate-pulse h-36" />
    )
  }

  const spotsFilledNum = Number(escrow.spotsFilledCount)
  const capacityNum = Number(escrow.capacity)
  const progress = capacityNum > 0 ? Math.round((spotsFilledNum / capacityNum) * 100) : 0
  const totalDepositedUsdc = formatUnits(escrow.totalDeposited, 6)
  const depositAmountUsdc = formatUnits(escrow.depositAmount, 6)

  const withdrawDate = new Date(Number(escrow.withdrawDate) * 1000)
  const msUntilWithdraw = withdrawDate.getTime() - Date.now()
  const daysUntilWithdraw = Math.max(0, Math.ceil(msUntilWithdraw / (1000 * 60 * 60 * 24)))

  const status = escrow.isCancelled ? "Cancelled" : escrow.isReleased ? "Released" : "Active"
  const statusCls = escrow.isCancelled
    ? "border-destructive/50 text-destructive bg-destructive/10"
    : escrow.isReleased
    ? "border-muted-foreground text-muted-foreground bg-muted"
    : "border-primary text-primary bg-primary/10"

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground">Escrow Status</h2>
        <span className={cn("text-xs px-2.5 py-1 rounded-sm border font-mono", statusCls)}>
          {status}
        </span>
      </div>

      {/* Spots progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5 text-sm">
          <span className="text-foreground font-medium">{spotsFilledNum} / {capacityNum} spots filled</span>
          <span className="text-muted-foreground text-xs">{progress}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-strategist rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 text-sm border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total deposited</span>
          <span className="text-foreground font-medium">{Number(totalDepositedUsdc).toFixed(2)} USDC</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Deposit per spot</span>
          <span className="text-foreground font-medium">{Number(depositAmountUsdc).toFixed(2)} USDC</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Withdraw date</span>
          <span className="text-foreground font-medium">
            {withdrawDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {!escrow.isWithdrawDatePassed && (
              <span className="text-muted-foreground ml-1.5 font-normal">({daysUntilWithdraw}d)</span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
