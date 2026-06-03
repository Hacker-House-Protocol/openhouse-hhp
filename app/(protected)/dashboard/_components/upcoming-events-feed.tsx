"use client"

import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface UpcomingEvent {
  id: number
  name: string
  city: string
  date: string
  builders: number
  networkGoing: number
  banner: string
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    name: "ETH Global Cannes",
    city: "Cannes",
    date: "May 15",
    builders: 340,
    networkGoing: 3,
    banner: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    name: "ETH BA 2026",
    city: "Buenos Aires",
    date: "Jun 5-7",
    builders: 180,
    networkGoing: 5,
    banner: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Token 2049",
    city: "Singapore",
    date: "Sep 10-12",
    builders: 520,
    networkGoing: 0,
    banner: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    name: "ETH Denver",
    city: "Denver",
    date: "Feb 28",
    builders: 420,
    networkGoing: 2,
    banner: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=400&h=200&fit=crop",
  },
]

export function UpcomingEventsFeed() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground text-lg">Upcoming events</h2>
        <Link
          href="/dashboard/events"
          className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          See all <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Cards */}
      <ScrollArea>
        <div className="flex gap-4 pb-3 w-max lg:grid lg:grid-cols-4 lg:overflow-visible lg:w-auto">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="min-w-[280px] lg:min-w-0 bg-card border border-border rounded-lg overflow-hidden flex-shrink-0 flex flex-col"
            >
              {/* Banner with gradient overlay */}
              <div className="relative h-32 w-full flex-shrink-0">
                <img
                  src={event.banner}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Content — slightly overlapping banner */}
              <div className="p-4 -mt-6 relative flex flex-col flex-1">
                <h3 className="font-display font-bold text-foreground mb-2">{event.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <MapPin className="size-4 flex-shrink-0" />
                  <span className="truncate">{event.city}</span>
                  <span>-</span>
                  <Calendar className="size-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{event.date}</span>
                </div>

                {/* Fixed height for builders row */}
                <div className="h-10 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Users className="size-4 flex-shrink-0" />
                    <span>{event.builders} builders</span>
                    {event.networkGoing > 0 && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs whitespace-nowrap">
                        {event.networkGoing} from your network
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/dashboard/events`}
                  className="w-full py-2 px-4 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary/10 transition-colors text-center block mt-auto"
                >
                  View event
                </Link>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
