"use client"

import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { SKILL_LIBRARY, SKILL_CATEGORIES, resolveSkill, type SkillCategory } from "@/lib/skill-icons"
import { SkillCard } from "./skill-card"

interface SkillPickerProps {
  selected: string[]
  onChange: (skills: string[]) => void
  max?: number
  triggerLabel?: string
  title?: string
}

export function SkillPicker({
  selected,
  onChange,
  max = 10,
  triggerLabel = "Add skills",
  title = "Select skills",
}: SkillPickerProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all")

  const filteredSkills = useMemo(() => {
    const query = search.toLowerCase().trim()
    return Object.entries(SKILL_LIBRARY)
      .filter(([key, def]) => {
        if (activeCategory !== "all" && def.category !== activeCategory) return false
        if (!query) return true
        return key.includes(query) || def.label.toLowerCase().includes(query)
      })
      .sort((a, b) => {
        const catOrder = SKILL_CATEGORIES.indexOf(a[1].category) - SKILL_CATEGORIES.indexOf(b[1].category)
        if (catOrder !== 0) return catOrder
        return a[1].label.localeCompare(b[1].label)
      })
  }, [search, activeCategory])

  const customSearchTerm = search.trim().toLowerCase()
  const isCustom =
    customSearchTerm.length >= 2 &&
    !SKILL_LIBRARY[customSearchTerm] &&
    !selected.includes(customSearchTerm) &&
    filteredSkills.length === 0

  function toggle(key: string) {
    if (selected.includes(key)) {
      onChange(selected.filter((s) => s !== key))
    } else if (selected.length < max) {
      onChange([...selected, key])
    }
  }

  function addCustom() {
    if (customSearchTerm && selected.length < max && !selected.includes(customSearchTerm)) {
      onChange([...selected, customSearchTerm])
      setSearch("")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg font-mono text-xs h-7 border-primary/40 text-primary hover:bg-primary/10"
        >
          <Plus className="size-3 mr-1" /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <p className="text-xs font-mono text-muted-foreground">
            {selected.length}/{max} selected
          </p>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full h-9 rounded-lg border bg-transparent pl-9 pr-3 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className="text-[10px] px-2.5 py-1 rounded-md border font-mono transition-all cursor-pointer"
            style={{
              borderColor: activeCategory === "all" ? "var(--primary)" : "var(--border)",
              color: activeCategory === "all" ? "var(--primary)" : "var(--muted-foreground)",
              background: activeCategory === "all" ? "color-mix(in oklch, var(--primary) 10%, transparent)" : "transparent",
            }}
          >
            All
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="text-[10px] px-2.5 py-1 rounded-md border font-mono transition-all cursor-pointer"
              style={{
                borderColor: activeCategory === cat ? "var(--primary)" : "var(--border)",
                color: activeCategory === cat ? "var(--primary)" : "var(--muted-foreground)",
                background: activeCategory === cat ? "color-mix(in oklch, var(--primary) 10%, transparent)" : "transparent",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {filteredSkills.map(([key]) => (
              <SkillCard
                key={key}
                skill={key}
                selected={selected.includes(key)}
                onClick={() => toggle(key)}
                size="sm"
              />
            ))}
          </div>

          {/* Custom skill option */}
          {isCustom && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg border border-dashed border-primary/40">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">{resolveSkill(customSearchTerm).icon}</span>
                <span className="text-sm font-mono text-foreground truncate">{customSearchTerm}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustom}
                className="shrink-0 font-mono text-xs h-7 rounded-lg"
              >
                Add custom
              </Button>
            </div>
          )}

          {filteredSkills.length === 0 && !isCustom && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No matching skills found.
            </p>
          )}
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="font-mono text-xs self-end">
            Done
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
