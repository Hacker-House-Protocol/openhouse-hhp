import { SlideShell, SlideCard } from "../slide-shell"

const team = [
  {
    initial: "D",
    name: "Dex",
    role: "Founder & Tech Lead",
    body: "Originated the idea coordinating a hacker house at EthGlobal Buenos Aires. The product's visionary, and built the on-chain layer: escrow on Arbitrum + yield via GMX.",
    color: "#990070",
  },
  {
    initial: "S",
    name: "Sergio",
    role: "Fullstack",
    body: "Co-lived that same hacker house with Dex. The team IS the user.",
    color: "#8B78E6",
  },
  {
    initial: "J",
    name: "Julio",
    role: "Mentor & Web3 Support",
    body: "Mentored the team on the Web3 architecture and supported the on-chain integration.",
    color: "#6EE76E",
  },
]

export function SlideTeam() {
  return (
    <SlideShell
      eyebrow="Team"
      title="3 builders who lived the problem firsthand."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {team.map((m) => (
          <SlideCard key={m.name} className="flex flex-col items-center gap-3 text-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 font-display text-2xl font-bold text-white"
              style={{ borderColor: m.color, backgroundColor: `${m.color}22` }}
            >
              {m.initial}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-white">{m.name}</h3>
              <p className="font-mono text-xs tracking-widest" style={{ color: m.color }}>
                {m.role}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[#9D9CB0]">{m.body}</p>
          </SlideCard>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[#9D9CB0]">
        <span className="text-white">The team IS the user.</span> Dex and Sergio
        met coordinating a hacker house — literally the product&apos;s use case. Julio
        joined as a Web3 mentor supporting the on-chain build. The moat is the accumulated
        reputation and network of communities: it isn&apos;t cloned, it&apos;s built.
      </p>
    </SlideShell>
  )
}
