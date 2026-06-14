import { Check, Rocket } from "lucide-react"
import { SlideShell } from "../slide-shell"

const done = [
  "Smart contracts deployed + verified on Arbitrum Sepolia — Factory + escrow, 26/26 tests passing",
  "Gasless deposits E2E — approve + deposit in a single ZeroDev transaction",
  "SpotNFT minted per deposit · on-chain release, cancel & 100% refund",
  "Yield adapter system — 10% APY on testnet, pluggable for GMX V2 (zero frontend change)",
  "Identity gates — server-side ✓/✗, aggregated across all linked wallets",
  "Multi-wallet identity + privacy model — Kernel wallets, ownership-proven data wallets",
  "Full product — Cypher Identity, Houses, Communities, Hack Spaces, Discovery, map, admin",
]

const next = [
  "GMX V2 mainnet yield adapter — swap in with no frontend changes",
  "Hybrid staking mode — partial payment + partial stake",
  "Human Passport + World ID verification",
  "Private Bridge via Railgun — anonymous withdrawals",
]

export function SlideTraction() {
  return (
    <SlideShell
      eyebrow="Traction · Current Status"
      title="The on-chain layer is live and verifiable."
      lead="We're not here to start — we shipped a working product with a deployed, tested escrow on Arbitrum. Here's what's done, and what ships next."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6EE76E]/15 text-[#6EE76E]">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6EE76E]">
              Done and working
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {done.map((d) => (
              <li
                key={d}
                className="flex gap-2 text-sm leading-relaxed text-[#9D9CB0]"
              >
                <span className="mt-1 text-[#6EE76E]">✓</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8B78E6]/15 text-[#8B78E6]">
              <Rocket className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8B78E6]">
              Shipping next
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {next.map((d) => (
              <li
                key={d}
                className="flex gap-2 text-sm leading-relaxed text-[#9D9CB0]"
              >
                <span className="mt-1 text-[#8B78E6]">→</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  )
}
