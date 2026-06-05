"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useFriendships, useUpdateFriendship } from "@/services/api/friendships"
import { ARCHETYPES } from "@/lib/onboarding"
import type { FriendshipWithUser } from "@/lib/types"

function FriendRequestRow({ friendship }: { friendship: FriendshipWithUser }) {
  const updateFriendship = useUpdateFriendship(friendship.id)

  const { other_user: requester } = friendship
  const archetype = ARCHETYPES.find((a) => a.id === requester.archetype)
  const displayName = requester.handle ? `@${requester.handle}` : "Anonymous"

  return (
    <div className="flex items-center gap-3 p-4">
      <Link
        href={requester.handle ? `/dashboard/builders/${requester.handle}` : "#"}
        className="flex items-center gap-3 min-w-0 flex-1 group"
      >
        <div
          className="size-10 rounded-full border-2 overflow-hidden shrink-0"
          style={{
            borderColor: archetype ? `var(${archetype.colorVar})` : "var(--border)",
          }}
        >
          {requester.avatar_url ? (
            <img
              src={requester.avatar_url}
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
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {displayName}
          </p>
          {archetype && (
            <span
              className="text-[10px] font-mono w-fit px-1.5 py-0.5 rounded-sm"
              style={{
                backgroundColor: `color-mix(in oklch, var(${archetype.colorVar}) 15%, transparent)`,
                color: `var(${archetype.colorVar})`,
              }}
            >
              {archetype.label}
            </span>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          size="sm"
          disabled={updateFriendship.isPending}
          onClick={() => updateFriendship.mutate({ status: "accepted" })}
          className="rounded-full"
        >
          {updateFriendship.isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <Check className="size-3.5" />
          )}
          Accept
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={updateFriendship.isPending}
          onClick={() => updateFriendship.mutate({ status: "rejected" })}
          className="rounded-full text-muted-foreground hover:border-destructive hover:text-destructive"
        >
          Decline
        </Button>
      </div>
    </div>
  )
}

export function FriendRequests() {
  const { data: pendingFriendships, isLoading } = useFriendships("pending")

  const received = (pendingFriendships ?? []).filter(
    (f) => f.direction === "received",
  )

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-xl" />
  }

  if (received.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        Connection requests ({received.length})
      </h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {received.map((friendship, index) => (
          <div key={friendship.id}>
            <FriendRequestRow friendship={friendship} />
            {index < received.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
