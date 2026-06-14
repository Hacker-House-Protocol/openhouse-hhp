"use client"

import { useState, useCallback } from "react"
import { X, Plus, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePatchProfile } from "@/services/api/profile"
import type { UserProfile } from "@/lib/types"

interface ProfileLocationProps {
  profile: UserProfile
  isOwner?: boolean
}

export function ProfileLocation({ profile, isOwner = false }: ProfileLocationProps) {
  const hasLocation = profile.city || profile.region
  const hasLanguages = (profile.languages ?? []).length > 0
  const matchingCities = profile.matching_cities ?? []
  const [cityInput, setCityInput] = useState("")
  const patchProfile = usePatchProfile()

  const addCity = useCallback(
    async (city: string) => {
      const trimmed = city.trim()
      if (!trimmed || matchingCities.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return
      const updated = [...matchingCities, trimmed]
      try {
        await patchProfile.mutateAsync({ matching_cities: updated })
      } catch {
        toast.error("Failed to update cities")
      }
    },
    [matchingCities, patchProfile],
  )

  const removeCity = useCallback(
    async (city: string) => {
      const updated = matchingCities.filter((c) => c !== city)
      try {
        await patchProfile.mutateAsync({ matching_cities: updated })
      } catch {
        toast.error("Failed to update cities")
      }
    },
    [matchingCities, patchProfile],
  )

  function handleCityKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (cityInput.trim()) {
        addCity(cityInput)
        setCityInput("")
      }
    }
  }

  const locationParts = [profile.city, profile.region].filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
        Location & Languages
      </p>

      {hasLocation && (
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground/40 text-xs mt-px leading-none select-none">◎</span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-foreground font-mono leading-tight">
              {locationParts.join(" · ")}
            </p>
            {profile.timezone && (
              <p className="text-xs text-muted-foreground font-mono">
                {profile.timezone}
              </p>
            )}
          </div>
        </div>
      )}

      {hasLanguages && (
        <div className="flex flex-wrap gap-1.5">
          {(profile.languages ?? []).map((lang) => (
            <Badge key={lang} variant="secondary" className="font-mono text-xs">
              {lang}
            </Badge>
          ))}
        </div>
      )}

      {/* Matching Cities */}
      {(isOwner || matchingCities.length > 0) && (
        <div className="flex flex-col gap-2 pt-1 border-t border-border">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-primary" />
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
              {isOwner ? "Cities I want to match with" : "Matching in"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchingCities.map((city) => (
              <Badge
                key={city}
                variant="outline"
                className="font-mono text-xs border-primary/40 bg-primary/10 text-primary gap-1 pr-1"
              >
                {city}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={handleCityKeyDown}
                placeholder="Add a city..."
                className="flex-1 h-8 rounded-lg border bg-transparent px-3 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderColor: "var(--border)" }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (cityInput.trim()) {
                    addCity(cityInput)
                    setCityInput("")
                  }
                }}
                disabled={!cityInput.trim() || patchProfile.isPending}
                className="rounded-lg font-mono text-xs h-8"
              >
                <Plus className="size-3 mr-1" /> Add
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
