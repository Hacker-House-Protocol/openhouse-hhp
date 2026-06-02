import type { Metadata } from "next"
import { Navbar } from "./_components/landing/navbar"
import { Hero } from "./_components/landing/hero"
import { Marquee } from "./_components/landing/marquee"
import { Features } from "./_components/landing/features"
import { Archetypes } from "./_components/landing/archetypes"
import { Verification } from "./_components/landing/verification"
import { HackTheWorld } from "./_components/landing/hack-the-world"
import { ProblemWeSolve } from "./_components/landing/problem-we-solve"
import { OurSolution } from "./_components/landing/our-solution"
import { HowItWorks } from "./_components/landing/how-it-works"
import { FinalCta } from "./_components/landing/final-cta"
import { Footer } from "./_components/landing/footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://hackerhouse.app"),
  title: "Hacker House Protocol — Find your Builder. Build together.",
  description:
    "The operating system for the Web3 builder scene. Match with co-founders by archetype, form your team online, and coordinate IRL at Hacker Houses near events.",
  openGraph: {
    title: "Hacker House Protocol — Find your Builder. Build together.",
    description:
      "The operating system for the Web3 builder scene. Match with co-founders by archetype, form your team online, and coordinate IRL.",
    url: "https://hackerhouse.app",
    siteName: "Hacker House Protocol",
    images: [
      {
        url: "/assets/hacker-house-protocol-logo.svg",
        width: 840,
        height: 800,
        alt: "Hacker House Protocol",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hacker House Protocol — Find your Builder. Build together.",
    description: "The operating system for the Web3 builder scene.",
  },
}

export default function LandingPage() {
  return (
    <main className="bg-[#180149]">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Archetypes />
      <Verification />
      <HackTheWorld />
      <ProblemWeSolve />
      <OurSolution />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </main>
  )
}
