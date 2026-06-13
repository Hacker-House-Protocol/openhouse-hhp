"use client"

import Link from "next/link"
import { ARCHETYPES } from "@/lib/onboarding"
import { ConnectButton } from "./connect-button"
import type { UserProfile, SuggestedBuilder } from "@/lib/types"

interface BuilderCardProps {
  builder: UserProfile | SuggestedBuilder
  currentUserId?: string
  showMatchInfo?: boolean
}

export function BuilderCard({
  builder,
  currentUserId,
}: BuilderCardProps) {
  const archetype = ARCHETYPES.find((a) => a.id === builder.archetype)
  const firstSkill = (builder.talent_tags ?? [])[0] ?? (builder.skills ?? [])[0] ?? null

  const displayName = builder.handle
    ? `@${builder.handle}`
    : builder.wallet_address
      ? `${builder.wallet_address.slice(0, 6)}...${builder.wallet_address.slice(-4)}`
      : "Anonymous Builder"

  const href = builder.handle
    ? `/dashboard/builders/${builder.handle}`
    : undefined

  const isOwnCard = currentUserId === builder.id

  const inner = (
    <div className="p-4 text-center">
      {/* Avatar */}
      <div
        className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-[3px]"
        style={{
          borderColor: archetype
            ? `var(${archetype.colorVar})`
            : "var(--border)",
        }}
      >
        {builder.avatar_url ? (
          <img
            src={builder.avatar_url}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: archetype
                ? `color-mix(in oklch, var(${archetype.colorVar}) 20%, transparent)`
                : "var(--muted)",
            }}
          />
        )}
      </div>

      {/* Handle */}
      <h3 className="font-display font-bold text-foreground text-sm truncate">
        {displayName}
      </h3>

      {/* Archetype badge */}
      {archetype && (
        <span
          className="inline-block px-2 py-0.5 rounded text-xs mt-1"
          style={{
            backgroundColor: `color-mix(in oklch, var(${archetype.colorVar}) 20%, transparent)`,
            color: `var(${archetype.colorVar})`,
          }}
        >
          {archetype.label}
        </span>
      )}

      {/* First skill */}
      {firstSkill && (
        <p className="text-muted-foreground text-xs mt-2">{firstSkill}</p>
      )}

      {/* Connect button */}
      {!isOwnCard && (
        <div className="mt-3" onClick={(e) => e.preventDefault()}>
          <ConnectButton targetUserId={builder.id} />
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200">
      {href ? (
        <Link href={href}>{inner}</Link>
      ) : (
        inner
      )}
    </div>
  )
}
