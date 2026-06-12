"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useHackerHouse } from "@/services/api/hacker-houses"
import { useProfile } from "@/services/api/profile"
import { useEscrowState } from "@/hooks/use-escrow-state"
import { useKernelWallet } from "@/hooks/use-kernel-wallet"
import { useBuilderSpot } from "@/hooks/use-builder-spot"
import { PageContainer } from "../../../_components/page-container"
import { EscrowStatus } from "./_components/escrow-status"
import { DepositSection } from "./_components/deposit-section"
import { HostActions } from "./_components/host-actions"
import { parseLocalDate } from "@/lib/utils"

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: house, isLoading } = useHackerHouse(id)
  const { data: profile } = useProfile({ enabled: true })

  const { connect, kernelAddress, isReady: walletReady } = useKernelWallet()

  const escrowAddress = (house?.escrow_address ?? null) as `0x${string}` | null
  const { data: escrow, isLoading: escrowLoading } = useEscrowState(escrowAddress)
  const { data: builderSpot } = useBuilderSpot({
    escrowAddress,
    builderAddress: kernelAddress,
  })

  const isOwner = profile?.id === house?.creator.id

  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </PageContainer>
    )
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground font-display font-bold text-xl">House not found</p>
        <Link href="/dashboard/hacker-houses" className="text-primary text-sm hover:underline">
          ← Back to Hacker Houses
        </Link>
      </div>
    )
  }

  // Escrow not yet deployed — house was created but contract deploy failed or is pending
  if (!escrowAddress) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={`/dashboard/hacker-houses/${id}`}
              className="size-10 bg-card rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="font-display font-bold text-xl text-foreground">Payment</h1>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
            Escrow contract not deployed yet. The host needs to complete house setup.
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/hacker-houses/${id}`}
            className="size-10 bg-card rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">Escrow</h1>
            <p className="text-muted-foreground text-sm">{house.name}</p>
          </div>
        </div>

        {/* House mini card */}
        <div className="bg-gradient-to-br from-primary/20 to-strategist/20 border border-primary/30 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 opacity-20">
            <img src="/assets/hacker-house-protocol-logo.svg" alt="" className="size-12" />
          </div>
          <h2 className="font-display font-bold text-lg text-foreground mb-2">{house.name}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {house.city}, {house.country}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {parseLocalDate(house.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              –
              {parseLocalDate(house.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Escrow Status — always shown */}
        <EscrowStatus house={house} escrow={escrow} escrowLoading={escrowLoading} />

        {/* Deposit Section — builders only */}
        {!isOwner && escrow && (
          <DepositSection
            escrowAddress={escrowAddress}
            escrow={escrow}
            builderSpot={builderSpot}
            walletReady={walletReady}
            onConnect={connect}
          />
        )}

        {/* Host Actions — creator only */}
        {isOwner && escrow && (
          <HostActions
            escrowAddress={escrowAddress}
            escrow={escrow}
          />
        )}

        {/* Escrow address */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
          <span>Escrow contract</span>
          <a
            href={`https://sepolia.arbiscan.io/address/${escrowAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors truncate max-w-[200px]"
          >
            {escrowAddress.slice(0, 10)}…{escrowAddress.slice(-8)}
          </a>
        </div>
      </div>
    </PageContainer>
  )
}
