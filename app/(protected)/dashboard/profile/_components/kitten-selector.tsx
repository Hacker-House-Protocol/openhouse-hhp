"use client"

import { CYPHER_KITTENS } from "@/lib/onboarding"
import { cn } from "@/lib/utils"

interface KittenSelectorProps {
  value: string | null
  onChange: (src: string) => void
}

export function KittenSelector({ value, onChange }: KittenSelectorProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
      {CYPHER_KITTENS.map((kitten) => {
        const isSelected = value === kitten.src
        return (
          <button
            key={kitten.id}
            type="button"
            onClick={() => onChange(kitten.src)}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-lg border-2 p-1.5",
              "transition-all duration-200 cursor-pointer aspect-square",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            style={{
              borderColor: isSelected ? "var(--primary)" : "var(--border)",
              background: isSelected
                ? "color-mix(in oklch, var(--primary) 8%, var(--card))"
                : "var(--card)",
              boxShadow: isSelected
                ? "0 0 24px color-mix(in oklch, var(--primary) 20%, transparent)"
                : "none",
            }}
          >
            {isSelected && (
              <div
                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold z-10"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                ✓
              </div>
            )}
            <img
              src={kitten.src}
              alt={kitten.label}
              className="w-[80%] aspect-square rounded-lg object-cover shrink-0"
            />
            <span
              className="text-[9px] font-mono font-medium transition-colors leading-tight"
              style={{ color: isSelected ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {kitten.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
