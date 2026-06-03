"use client"

import { use } from "react"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Globe,
  Clock,
  Building2,
  ArrowLeft,
} from "lucide-react"
import { PageContainer } from "../../_components/page-container"

/* ── Hardcoded event data ── */

interface EventDetail {
  id: string
  name: string
  description: string
  city: string
  venue: string
  dates: string
  banner: string
  website: string
  type: string
  builders: number
  prizes: string
  networkGoing: { id: number; username: string; archetypeColor: string }[]
  hackerHouses: { id: number; name: string; mode: string; spots: string; dates: string }[]
  hackSpaces: { id: number; name: string; category: string; members: string }[]
  schedule: { day: string; title: string; time: string }[]
}

const ALL_EVENTS: Record<string, EventDetail> = {
  "1": {
    id: "1",
    name: "ETH Global Cannes",
    description:
      "ETH Global Cannes brings together the brightest minds in Web3 for an intense weekend of building, learning, and networking. Located in the heart of the French Riviera, this hackathon offers an unparalleled experience combining cutting-edge blockchain development with Mediterranean vibes.",
    city: "Cannes, France",
    venue: "Palais des Festivals",
    dates: "May 15-17, 2026",
    banner:
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&h=400&fit=crop",
    website: "https://ethglobal.com/cannes",
    type: "Hackathon",
    builders: 340,
    prizes: "$500K",
    networkGoing: [
      { id: 1, username: "dexterdev", archetypeColor: "#6EE76E" },
      { id: 2, username: "luna_ux", archetypeColor: "#8B78E6" },
      { id: 3, username: "max_btr", archetypeColor: "#990070" },
    ],
    hackerHouses: [
      { id: 1, name: "HHP Cannes 2026", mode: "CO-PAYMENT", spots: "4/8", dates: "May 13-19" },
      { id: 2, name: "Builder Collective Cannes", mode: "STAKING", spots: "2/6", dates: "May 14-18" },
    ],
    hackSpaces: [
      { id: 1, name: "ZeroLend v2", category: "DeFi", members: "2/5" },
      { id: 6, name: "Cyberpunk Lobster", category: "AI", members: "2/6" },
    ],
    schedule: [
      { day: "Day 1", title: "Opening & Team Formation", time: "9:00 AM" },
      { day: "Day 2", title: "Hacking & Workshops", time: "All Day" },
      { day: "Day 3", title: "Submissions & Demos", time: "2:00 PM" },
    ],
  },
  "2": {
    id: "2",
    name: "ETH BA 2026",
    description:
      "ETH Buenos Aires is Latin America's premier Ethereum event, bringing together developers, entrepreneurs, and enthusiasts from across the region. Experience the vibrant Buenos Aires tech scene while building the future of decentralized applications.",
    city: "Buenos Aires, Argentina",
    venue: "Centro Cultural Kirchner",
    dates: "Jun 5-7, 2026",
    banner:
      "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200&h=400&fit=crop",
    website: "https://ethba.org",
    type: "Conference + Hackathon",
    builders: 180,
    prizes: "$200K",
    networkGoing: [
      { id: 6, username: "carlos_web3", archetypeColor: "#6EE76E" },
      { id: 1, username: "dexterdev", archetypeColor: "#6EE76E" },
      { id: 2, username: "luna_ux", archetypeColor: "#8B78E6" },
      { id: 4, username: "alex_dev", archetypeColor: "#6EE76E" },
      { id: 3, username: "max_btr", archetypeColor: "#990070" },
    ],
    hackerHouses: [
      { id: 2, name: "Buenos Aires Builder House", mode: "SPONSORED", spots: "6/10", dates: "Jun 5-7" },
    ],
    hackSpaces: [
      { id: 1, name: "ZeroLend v2", category: "DeFi", members: "2/5" },
      { id: 2, name: "CryptoCats Arena", category: "Gaming", members: "3/4" },
    ],
    schedule: [
      { day: "Day 1", title: "Conference & Talks", time: "10:00 AM" },
      { day: "Day 2", title: "Hackathon Kickoff", time: "9:00 AM" },
      { day: "Day 3", title: "Demo Day & Awards", time: "3:00 PM" },
    ],
  },
  "3": {
    id: "3",
    name: "Token 2049",
    description:
      "Token 2049 is Asia's premier crypto conference, attracting the global Web3 ecosystem to Singapore. Connect with industry leaders, discover emerging trends, and network with thousands of builders, investors, and innovators shaping the future of digital assets.",
    city: "Singapore",
    venue: "Marina Bay Sands",
    dates: "Sep 10-12, 2026",
    banner:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=400&fit=crop",
    website: "https://token2049.com",
    type: "Conference",
    builders: 520,
    prizes: "N/A",
    networkGoing: [],
    hackerHouses: [
      { id: 3, name: "Singapore Crypto House", mode: "CO-PAYMENT", spots: "8/12", dates: "Sep 8-14" },
    ],
    hackSpaces: [
      { id: 5, name: "AI Agent Framework", category: "AI", members: "2/5" },
      { id: 3, name: "ChainLink Oracle Dashboard", category: "Infrastructure", members: "3/6" },
    ],
    schedule: [
      { day: "Day 1", title: "Opening Keynotes", time: "9:00 AM" },
      { day: "Day 2", title: "Industry Panels & Networking", time: "10:00 AM" },
      { day: "Day 3", title: "Closing Sessions", time: "11:00 AM" },
    ],
  },
  "5": {
    id: "5",
    name: "ETH Denver 2026",
    description:
      "ETH Denver is the largest and longest-running Ethereum event in the world. This annual gathering in the Rocky Mountains combines a hackathon, conference, and community celebration that has launched countless projects and careers in the Web3 space.",
    city: "Denver, Colorado",
    venue: "National Western Complex",
    dates: "Feb 28 - Mar 2, 2026",
    banner:
      "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=1200&h=400&fit=crop",
    website: "https://ethdenver.com",
    type: "Hackathon + Conference",
    builders: 420,
    prizes: "$1M",
    networkGoing: [
      { id: 4, username: "alex_dev", archetypeColor: "#6EE76E" },
      { id: 1, username: "dexterdev", archetypeColor: "#6EE76E" },
    ],
    hackerHouses: [
      { id: 4, name: "Denver Builder Loft", mode: "CO-PAYMENT", spots: "5/8", dates: "Feb 25 - Mar 2" },
    ],
    hackSpaces: [
      { id: 6, name: "Cyberpunk Lobster", category: "AI", members: "2/6" },
      { id: 5, name: "AI Agent Framework", category: "AI", members: "2/5" },
    ],
    schedule: [
      { day: "Day 1", title: "BUIDLathon Kickoff", time: "8:00 AM" },
      { day: "Day 2", title: "Hacking & Workshops", time: "All Day" },
      { day: "Day 3", title: "Final Submissions & Demo", time: "12:00 PM" },
    ],
  },
  "6": {
    id: "6",
    name: "ETH Tokyo",
    description:
      "ETH Tokyo brings the Ethereum community to Japan's vibrant capital. Experience the unique fusion of cutting-edge blockchain technology and Japanese innovation culture. Connect with local and international builders, explore the thriving Tokyo Web3 scene, and build projects that bridge East and West.",
    city: "Tokyo, Japan",
    venue: "Tokyo International Forum",
    dates: "Apr 12-14, 2026",
    banner:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=400&fit=crop",
    website: "https://ethtokyo.com",
    type: "Hackathon + Conference",
    builders: 380,
    prizes: "$400K",
    networkGoing: [
      { id: 5, username: "emily_ai", archetypeColor: "#6EE76E" },
      { id: 6, username: "yuki_dev", archetypeColor: "#6EE76E" },
    ],
    hackerHouses: [
      { id: 4, name: "Tokyo Builder Loft", mode: "CO-PAYMENT", spots: "5/8", dates: "Apr 10-16" },
    ],
    hackSpaces: [
      { id: 5, name: "AI Agent Framework", category: "AI", members: "2/5" },
      { id: 2, name: "CryptoCats Arena", category: "Gaming", members: "3/4" },
    ],
    schedule: [
      { day: "Day 1", title: "Opening & Hacking Begins", time: "9:00 AM" },
      { day: "Day 2", title: "Workshops & Mentorship", time: "10:00 AM" },
      { day: "Day 3", title: "Demo Day & Awards Ceremony", time: "2:00 PM" },
    ],
  },
  "7": {
    id: "7",
    name: "Devcon Bangkok",
    description:
      "Devcon is the Ethereum Foundation's annual conference for developers, researchers, thinkers, and makers. Devcon Bangkok brings the global Ethereum community to Thailand for four days of deep technical content, workshops, and community building.",
    city: "Bangkok, Thailand",
    venue: "Queen Sirikit National Convention Center",
    dates: "Nov 12-15, 2026",
    banner:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&h=400&fit=crop",
    website: "https://devcon.org",
    type: "Conference",
    builders: 850,
    prizes: "N/A",
    networkGoing: [
      { id: 1, username: "dexterdev", archetypeColor: "#6EE76E" },
      { id: 2, username: "luna_ux", archetypeColor: "#8B78E6" },
      { id: 3, username: "max_btr", archetypeColor: "#990070" },
      { id: 4, username: "alex_dev", archetypeColor: "#6EE76E" },
    ],
    hackerHouses: [
      { id: 6, name: "Bangkok Builder House", mode: "CO-PAYMENT", spots: "8/12", dates: "Nov 10-17" },
      { id: 7, name: "Devcon Community House", mode: "SPONSORED", spots: "10/15", dates: "Nov 11-16" },
    ],
    hackSpaces: [
      { id: 1, name: "ZeroLend v2", category: "DeFi", members: "2/5" },
      { id: 3, name: "ChainLink Oracle Dashboard", category: "Infrastructure", members: "3/6" },
      { id: 6, name: "Cyberpunk Lobster", category: "AI", members: "2/6" },
    ],
    schedule: [
      { day: "Day 1", title: "Opening Ceremony & Core Tracks", time: "9:00 AM" },
      { day: "Day 2", title: "Technical Deep Dives", time: "9:00 AM" },
      { day: "Day 3", title: "Workshops & Community Day", time: "10:00 AM" },
      { day: "Day 4", title: "Closing & Future of Ethereum", time: "10:00 AM" },
    ],
  },
}

const MODE_BADGE: Record<string, string> = {
  SPONSORED: "bg-[#6EE76E]/20 text-[#6EE76E]",
  "CO-PAYMENT": "bg-[#F59E0B]/20 text-[#F59E0B]",
  STAKING: "bg-[#8B78E6]/20 text-[#8B78E6]",
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const event = ALL_EVENTS[resolvedParams.id] ?? ALL_EVENTS["1"]

  return (
    <PageContainer className="!px-0 !py-0">
      <div className="max-w-4xl mx-auto pb-24">
        {/* Back */}
        <div className="px-4 py-4">
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Banner */}
        <div className="relative h-48 md:h-64 w-full">
          <img
            src={event.banner}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
            {event.type}
          </span>
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 -mt-8 relative">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
            {event.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.dates}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{event.builders} builders</span>
            </div>
          </div>
          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <Globe className="w-4 h-4" />
              Visit website
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-primary font-bold text-2xl">{event.builders}</p>
              <p className="text-muted-foreground text-sm">Builders</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-[#6EE76E] font-bold text-2xl">{event.prizes}</p>
              <p className="text-muted-foreground text-sm">In Prizes</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-[#8B78E6] font-bold text-2xl">{event.hackerHouses.length}</p>
              <p className="text-muted-foreground text-sm">Houses</p>
            </div>
          </div>

          {/* About */}
          <section className="mb-8">
            <h2 className="font-display font-bold text-lg text-foreground mb-3">About this event</h2>
            <p className="text-foreground leading-relaxed">{event.description}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Venue: {event.venue}</span>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="mb-8">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Schedule</h2>
            <div className="space-y-3">
              {event.schedule.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-card border border-border rounded-lg p-4"
                >
                  <div className="w-16 text-center">
                    <p className="text-primary font-bold text-sm">{item.day}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Network Going */}
          {event.networkGoing.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display font-bold text-lg text-foreground mb-2">
                From your network
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {event.networkGoing.length} builders you know are attending
              </p>
              <div className="flex flex-wrap gap-3">
                {event.networkGoing.map((builder) => (
                  <Link
                    key={builder.id}
                    href={`/dashboard/builders/${builder.username}`}
                    className="flex items-center gap-2 bg-card border border-border rounded-lg p-3 hover:border-primary transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 bg-muted"
                      style={{ borderColor: builder.archetypeColor }}
                    />
                    <span className="text-foreground text-sm">@{builder.username}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Hacker Houses */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Hacker Houses for this event
              </h2>
              <Link href="/dashboard/hacker-houses" className="text-primary text-sm hover:underline">
                See all
              </Link>
            </div>
            {event.hackerHouses.length > 0 ? (
              <div className="space-y-3">
                {event.hackerHouses.map((house) => (
                  <Link
                    key={house.id}
                    href={`/dashboard/hacker-houses/${house.id}`}
                    className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div>
                      <p className="text-foreground font-medium">{house.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {house.dates} - {house.spots} spots
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${MODE_BADGE[house.mode] ?? MODE_BADGE["CO-PAYMENT"]}`}
                    >
                      {house.mode}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No hacker houses available for this event yet.
              </p>
            )}
          </section>

          {/* Hack Spaces */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Hack Spaces for this event
              </h2>
              <Link href="/dashboard/hack-spaces" className="text-primary text-sm hover:underline">
                See all
              </Link>
            </div>
            {event.hackSpaces.length > 0 ? (
              <div className="space-y-3">
                {event.hackSpaces.map((space) => (
                  <Link
                    key={space.id}
                    href={`/dashboard/hack-spaces/${space.id}`}
                    className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div>
                      <p className="text-foreground font-medium">{space.name}</p>
                      <p className="text-muted-foreground text-sm">{space.members} members</p>
                    </div>
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                      {space.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No hack spaces targeting this event yet.
              </p>
            )}
          </section>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 lg:left-[15rem] border-t border-border p-4"
          style={{ background: "var(--background)" }}
        >
          <div className="max-w-4xl mx-auto">
            <button
              type="button"
              className="w-full py-4 px-6 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Mark as attending
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
