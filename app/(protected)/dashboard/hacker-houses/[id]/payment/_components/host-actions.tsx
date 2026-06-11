"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRelease } from "@/hooks/use-release"
import { useCancelHouse } from "@/hooks/use-cancel-house"
import { queryKeys } from "@/lib/query-keys"
import type { useEscrowState } from "@/hooks/use-escrow-state"

type EscrowData = NonNullable<ReturnType<typeof useEscrowState>["data"]>

interface Props {
  escrowAddress: `0x${string}`
  escrow: EscrowData
}

export function HostActions({ escrowAddress, escrow }: Props) {
  const queryClient = useQueryClient()
  const { release, isLoading: releasing, error: releaseError } = useRelease()
  const { cancelHouse, isLoading: cancelling, error: cancelError } = useCancelHouse()
  const [confirmAction, setConfirmAction] = useState<"release" | "cancel" | null>(null)
  const [done, setDone] = useState<"released" | "cancelled" | null>(null)

  const canRelease = escrow.isWithdrawDatePassed && !escrow.isReleased && !escrow.isCancelled
  const canCancel = !escrow.isCancelled && !escrow.isReleased

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [queryKeys.escrowState, escrowAddress] })
  }

  async function handleRelease() {
    await release({ escrowAddress })
    invalidate()
    setDone("released")
    setConfirmAction(null)
  }

  async function handleCancel() {
    await cancelHouse({ escrowAddress })
    invalidate()
    setDone("cancelled")
    setConfirmAction(null)
  }

  // Show terminal state after action or if already resolved on-chain
  if (done === "released" || escrow.isReleased) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 text-muted-foreground text-sm">
        <CheckCircle2 className="size-5 shrink-0 text-primary" />
        <span>Funds released to the host safe. House complete.</span>
      </div>
    )
  }

  if (done === "cancelled" || escrow.isCancelled) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 text-muted-foreground text-sm">
        <CheckCircle2 className="size-5 shrink-0" />
        <span>House cancelled. All builders have been refunded in full.</span>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <h3 className="font-display font-bold text-foreground">Host Actions</h3>

      {/* Release confirmation */}
      {confirmAction === "release" && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex flex-col gap-3">
          <p className="text-sm text-foreground">
            Release all funds to the host safe? This cannot be undone. A 0.5% protocol fee applies.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirmAction(null)} disabled={releasing}>
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleRelease} disabled={releasing}>
              {releasing ? "Releasing…" : "Confirm Release"}
            </Button>
          </div>
          {releaseError && (
            <p className="text-xs text-destructive font-mono">{releaseError}</p>
          )}
        </div>
      )}

      {/* Cancel confirmation */}
      {confirmAction === "cancel" && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2 text-destructive">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <p className="text-sm">Cancel the house? All builders will be fully refunded. No protocol fee charged.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirmAction(null)} disabled={cancelling}>
              Keep
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? "Cancelling…" : "Confirm Cancel"}
            </Button>
          </div>
          {cancelError && (
            <p className="text-xs text-destructive font-mono">{cancelError}</p>
          )}
        </div>
      )}

      {/* Default action buttons */}
      {confirmAction === null && (
        <div className="flex flex-col gap-2">
          <Button
            variant="default"
            className="w-full"
            disabled={!canRelease || releasing}
            onClick={() => setConfirmAction("release")}
          >
            Release Funds
          </Button>
          {!canRelease && (
            <p className="text-xs text-muted-foreground text-center font-mono">
              {escrow.isWithdrawDatePassed
                ? "Already completed"
                : "Available after the withdraw date"}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={!canCancel || cancelling}
            onClick={() => setConfirmAction("cancel")}
          >
            Cancel House
          </Button>
        </div>
      )}
    </div>
  )
}
