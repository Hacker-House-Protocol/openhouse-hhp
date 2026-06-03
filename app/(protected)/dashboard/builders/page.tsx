"use client"

import { useState, useRef } from "react"
import { useQueryStates, parseAsString } from "nuqs"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  useFilteredBuilders,
  useProfile,
  useSuggestedBuilders,
} from "@/services/api/profile"
import { useDebounce } from "@/hooks/use-debounce"
import { BuilderCard } from "../_components/builder-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageContainer } from "../_components/page-container"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ARCHETYPES } from "@/lib/onboarding"
import type { BuilderListParams } from "@/lib/types"

export default function BuildersPage() {
  const [filters, setFilters] = useQueryStates({
    archetype: parseAsString.withDefault(""),
    q: parseAsString.withDefault(""),
  })

  const [searchInput, setSearchInput] = useState(filters.q)
  const debouncedSearch = useDebounce(searchInput)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: profile } = useProfile({ enabled: true })
  const { data: suggestedBuilders, isLoading: isSuggestionsLoading } =
    useSuggestedBuilders()

  // Build activeFilters stripping empty strings
  const activeFilters: BuilderListParams = {}
  if (filters.archetype) activeFilters.archetype = filters.archetype
  if (debouncedSearch) activeFilters.q = debouncedSearch
  if (profile?.id) activeFilters.exclude_id = profile.id

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFilteredBuilders(activeFilters)

  const builders = data?.pages.flatMap((p) => p.builders) ?? []
  const total = data?.pages[0]?.total ?? 0

  const hasActiveFilters = !!filters.archetype || !!filters.q

  function handleClearFilters() {
    void setFilters({ archetype: "", q: "" })
    setSearchInput("")
  }

  function scrollSuggestions(direction: "left" | "right") {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  const showSuggestions =
    profile &&
    !hasActiveFilters &&
    suggestedBuilders &&
    suggestedBuilders.length > 0

  return (
    <PageContainer className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-foreground text-2xl">
          Builders
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : `Showing ${builders.length} of ${total} builder${total !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Suggestions section */}
      {isSuggestionsLoading && profile && !hasActiveFilters && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Suggested for you
          </h2>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl min-w-[220px] flex flex-col items-center gap-3 p-5"
              >
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-sm" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Suggested for you
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                Builders with similar interests and complementary skills
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollSuggestions("left")}
                className="size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSuggestions("right")}
                className="size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-1"
          >
            {suggestedBuilders.slice(0, 6).map((builder) => (
              <div key={builder.id} className="min-w-[220px] max-w-[220px]">
                <BuilderCard
                  builder={builder}
                  currentUserId={profile?.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3">
        {/* Search row */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search builders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-8 font-mono text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Archetype row + clear */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest shrink-0">
              Archetype
            </span>
            <div className="flex gap-2">
              {ARCHETYPES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    void setFilters({
                      archetype: filters.archetype === a.id ? "" : a.id,
                    })
                  }
                  className={cn(
                    "text-xs px-3 py-1 rounded-full border font-mono transition-all cursor-pointer whitespace-nowrap",
                    filters.archetype === a.id
                      ? "border-current"
                      : "border-border text-muted-foreground hover:border-border/80",
                  )}
                  style={
                    filters.archetype === a.id
                      ? {
                          color: `var(${a.colorVar})`,
                          borderColor: `var(${a.colorVar})`,
                          backgroundColor: `color-mix(in oklch, var(${a.colorVar}) 10%, transparent)`,
                        }
                      : undefined
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            >
              Clear filters x
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl flex flex-col items-center gap-3 p-5"
            >
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-sm" />
              <div className="flex flex-col gap-1.5 w-full items-center">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-5 w-14 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-px w-full mt-auto" />
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      ) : builders.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-16 flex flex-col items-center gap-4 text-center">
          <span className="text-4xl">👥</span>
          <div className="flex flex-col gap-1">
            <p className="font-display font-semibold text-foreground">
              No builders found.
            </p>
            <p className="text-muted-foreground text-sm">
              {hasActiveFilters
                ? "Try clearing filters."
                : "No builders have completed onboarding yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builders.map((builder) => (
            <BuilderCard
              key={builder.id}
              builder={builder}
              currentUserId={profile?.id}
            />
          ))}
        </div>
      )}

      {/* Load more / end indicator */}
      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full font-mono text-sm px-6"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
      {!hasNextPage && builders.length > 0 && !isLoading && (
        <p className="text-center text-xs font-mono text-muted-foreground pt-2">
          All {total} builder{total !== 1 ? "s" : ""} loaded
        </p>
      )}
    </PageContainer>
  )
}
