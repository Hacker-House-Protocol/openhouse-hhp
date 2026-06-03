"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useSuggestedBuilders } from "@/services/api/profile"
import { useProfile } from "@/services/api/profile"
import { BuilderCard } from "./builder-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const PREVIEW_LIMIT = 4

export function SuggestedBuildersFeed() {
  const { data: profile } = useProfile()
  const { data: builders, isLoading } = useSuggestedBuilders()
  const unique = (builders ?? []).filter(
    (b, i, arr) => arr.findIndex((x) => x.id === b.id) === i,
  )
  const preview = unique.slice(0, PREVIEW_LIMIT)

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground text-lg">Builders you might know</h2>
        {unique.length > 0 && (
          <Link
            href="/dashboard/builders"
            className="text-primary text-sm font-medium flex items-center gap-1"
          >
            See all <ArrowRight className="size-4" />
          </Link>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <ScrollArea>
          <div className="flex gap-4 pb-3 w-max lg:grid lg:grid-cols-4 lg:overflow-visible lg:w-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[200px] lg:min-w-0 shrink-0">
                <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-3 h-[240px]">
                  <Skeleton className="size-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 rounded-sm" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : preview.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-lg p-8 flex items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">
            Complete your profile to get builder suggestions
          </p>
        </div>
      ) : (
        <ScrollArea>
          <div className="flex gap-4 pb-3 w-max lg:grid lg:grid-cols-4 lg:overflow-visible lg:w-auto">
            {preview.map((builder) => (
              <div key={builder.id} className="min-w-[200px] lg:min-w-0 shrink-0">
                <BuilderCard builder={builder} currentUserId={profile?.id} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  )
}
