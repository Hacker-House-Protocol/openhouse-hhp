"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Landmark, Code2, Globe } from "lucide-react"

type Region = "South America" | "North America" | "Europe" | "Asia Pacific"

interface CityEntry {
  name: string
  count: number
  icon: React.ReactNode
  color: string
}

const regions: Region[] = ["South America", "North America", "Europe", "Asia Pacific"]

const citiesByRegion: Record<Region, CityEntry[]> = {
  "South America": [
    {
      name: "Buenos Aires",
      count: 48,
      icon: <Landmark className="size-6" />,
      color: "#6B00C9",
    },
    {
      name: "Medellín",
      count: 23,
      icon: <Building2 className="size-6" />,
      color: "#990070",
    },
    {
      name: "São Paulo",
      count: 31,
      icon: <Code2 className="size-6" />,
      color: "#8B78E6",
    },
    {
      name: "Bogotá",
      count: 15,
      icon: <Globe className="size-6" />,
      color: "#6EE76E",
    },
  ],
  "North America": [
    {
      name: "New York",
      count: 87,
      icon: <Building2 className="size-6" />,
      color: "#6B00C9",
    },
    {
      name: "San Francisco",
      count: 112,
      icon: <Code2 className="size-6" />,
      color: "#8B78E6",
    },
    {
      name: "Denver",
      count: 42,
      icon: <Landmark className="size-6" />,
      color: "#990070",
    },
    {
      name: "Austin",
      count: 56,
      icon: <Globe className="size-6" />,
      color: "#6EE76E",
    },
  ],
  Europe: [
    {
      name: "Lisbon",
      count: 63,
      icon: <Landmark className="size-6" />,
      color: "#8B78E6",
    },
    {
      name: "Berlin",
      count: 74,
      icon: <Building2 className="size-6" />,
      color: "#6B00C9",
    },
    {
      name: "Cannes",
      count: 29,
      icon: <Globe className="size-6" />,
      color: "#990070",
    },
    {
      name: "Amsterdam",
      count: 38,
      icon: <Code2 className="size-6" />,
      color: "#6EE76E",
    },
  ],
  "Asia Pacific": [
    {
      name: "Singapore",
      count: 95,
      icon: <Building2 className="size-6" />,
      color: "#6B00C9",
    },
    {
      name: "Bangkok",
      count: 52,
      icon: <Globe className="size-6" />,
      color: "#8B78E6",
    },
    {
      name: "Tokyo",
      count: 41,
      icon: <Landmark className="size-6" />,
      color: "#990070",
    },
    {
      name: "Seoul",
      count: 33,
      icon: <Code2 className="size-6" />,
      color: "#6EE76E",
    },
  ],
}

export function ActiveCitiesSection() {
  const [activeRegion, setActiveRegion] = useState<Region>("South America")

  const cities = citiesByRegion[activeRegion]

  return (
    <section>
      {/* Title */}
      <h2 className="font-display font-bold text-foreground text-lg mb-4">Explore Local Events</h2>

      {/* Region tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeRegion === region
                ? "bg-card text-foreground border border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* City grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Link
            key={city.name}
            href={`/dashboard/map?city=${encodeURIComponent(city.name)}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors group"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${city.color}20`, color: city.color }}
            >
              {city.icon}
            </div>
            <div>
              <p className="text-foreground font-medium group-hover:text-primary transition-colors">{city.name}</p>
              <p className="text-muted-foreground text-sm">{city.count} Events</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
