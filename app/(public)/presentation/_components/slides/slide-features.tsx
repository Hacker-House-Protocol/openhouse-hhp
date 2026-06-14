import {
  Fingerprint,
  Home,
  ShieldCheck,
  BadgeCheck,
  Boxes,
  Users,
  Compass,
  Map,
} from "lucide-react"
import { SlideShell, SlideCard } from "../slide-shell"

const features = [
  {
    Icon: Fingerprint,
    title: "Cypher Identity",
    body: "Email/social/wallet login via Privy. Imports Talent Protocol score and POAPs; link multiple read-only data wallets to aggregate credentials.",
  },
  {
    Icon: Home,
    title: "Hacker Houses",
    body: "Full on-chain flow: create, deploy escrow, gasless deposit, SpotNFT per spot, yield, release, and cancel with 100% refund.",
  },
  {
    Icon: ShieldCheck,
    title: "Identity Gates",
    body: "Hosts set on-chain access rules (score, POAP count, specific POAPs). Evaluated server-side — applicants see ✓/✗, never raw data.",
  },
  {
    Icon: Boxes,
    title: "Hack Spaces",
    body: "Post virtual projects with open roles; algorithmic matching connects you with the right builders.",
  },
  {
    Icon: Users,
    title: "Communities",
    body: "Create or join builder communities with invite links. Community badge surfaces on profiles; filter discovery and houses by community.",
  },
  {
    Icon: Compass,
    title: "Builder Discovery",
    body: "Explore by archetype, skills, location and language; suggested connections and a “skills I'm looking for” match boost.",
  },
  {
    Icon: BadgeCheck,
    title: "Verified Badge",
    body: "Communities and companies go through manual verification and receive a ✓ Verified badge.",
  },
  {
    Icon: Map,
    title: "Interactive Map",
    body: "Active houses and events by city, with a direct CTA to apply or join.",
  },
]

export function SlideFeatures() {
  return (
    <SlideShell
      eyebrow="Features"
      title="What already lives in the product."
      lead="It's not an idea — it's a shipped product, with the on-chain layer live and verifiable."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <SlideCard key={f.title} className="hover:border-[#6B00C9]/60">
            <f.Icon className="mb-3 h-6 w-6 text-[#8B78E6]" strokeWidth={1.5} />
            <h3 className="mb-1.5 font-display text-base font-bold text-white">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#9D9CB0]">{f.body}</p>
          </SlideCard>
        ))}
      </div>
    </SlideShell>
  )
}
