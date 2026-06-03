"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react"
import { PageContainer } from "../_components/page-container"

const REGION_FILTERS = ["All", "LATAM", "Europe", "Asia", "North America"] as const

const EVENTS = [
  {
    id: "1",
    name: "ETH Global Cannes",
    city: "Cannes, France",
    date: "May 15-17, 2026",
    builders: 340,
    networkGoing: 3,
    hackerHouses: 2,
    hackSpaces: 5,
    region: "Europe",
    banner: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&h=200&fit=crop",
  },
  {
    id: "2",
    name: "ETH BA 2026",
    city: "Buenos Aires, Argentina",
    date: "Jun 5-7, 2026",
    builders: 180,
    networkGoing: 5,
    hackerHouses: 3,
    hackSpaces: 8,
    region: "LATAM",
    banner: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Token 2049",
    city: "Singapore",
    date: "Sep 10-12, 2026",
    builders: 520,
    networkGoing: 0,
    hackerHouses: 4,
    hackSpaces: 12,
    region: "Asia",
    banner: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=200&fit=crop",
  },
  {
    id: "6",
    name: "ETH Tokyo",
    city: "Tokyo, Japan",
    date: "Apr 12-14, 2026",
    builders: 380,
    networkGoing: 2,
    hackerHouses: 2,
    hackSpaces: 6,
    region: "Asia",
    banner: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
  },
  {
    id: "5",
    name: "ETH Denver 2026",
    city: "Denver, USA",
    date: "Feb 28 - Mar 2, 2026",
    builders: 420,
    networkGoing: 2,
    hackerHouses: 5,
    hackSpaces: 15,
    region: "North America",
    banner: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=400&h=200&fit=crop",
  },
  {
    id: "7",
    name: "Devcon Bangkok",
    city: "Bangkok, Thailand",
    date: "Nov 12-15, 2026",
    builders: 850,
    networkGoing: 4,
    hackerHouses: 6,
    hackSpaces: 20,
    region: "Asia",
    banner: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=200&fit=crop",
  },
]

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")

  const filteredEvents =
    selectedFilter === "All"
      ? EVENTS
      : EVENTS.filter((e) => e.region === selectedFilter)

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-foreground">Events</h1>
          <p className="text-muted-foreground">Discover Web3 events and hackathons worldwide.</p>
        </div>

        {/* Region filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-6">
          {REGION_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Events grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
            >
              {/* Banner */}
              <div className="relative h-36 w-full">
                <img
                  src={event.banner}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                {event.networkGoing > 0 && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-primary/90 text-primary-foreground rounded text-xs">
                    {event.networkGoing} from your network
                  </span>
                )}
              </div>

              <div className="p-4 -mt-4 relative">
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {event.name}
                </h3>

                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.city}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>

                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.builders} builders</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{event.hackerHouses} Hacker Houses</span>
                  <span>{event.hackSpaces} Hack Spaces</span>
                </div>

                <span className="w-full py-2 px-4 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary/10 transition-colors text-center block">
                  View event <ArrowRight className="w-4 h-4 inline ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
