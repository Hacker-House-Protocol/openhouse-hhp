import { SlideShell, SlideCard } from "../slide-shell"

const functions = [
  { fn: "createHouse()", who: "Factory", what: "Deploys Escrow + SpotNFT + YieldAdapter in one tx" },
  { fn: "deposit()", who: "Builder", what: "Locks USDC, mints SpotNFT, forwards to yield adapter" },
  { fn: "release()", who: "Host", what: "Withdraws + distributes yield → 99.5% host + 0.5% fee" },
  { fn: "cancelHouse()", who: "Creator", what: "100% refund to all builders, SpotNFTs burned" },
  { fn: "transferSpot()", who: "Holder", what: "Transfers spot + deposit record to another builder" },
  { fn: "pendingYield()", who: "View", what: "Accrued yield from the adapter, in real time" },
]

const deployed = [
  { name: "HackerHouseFactory", addr: "0x751ea80F…3ffcfB5" },
  { name: "MockUSDC", addr: "0x999579cc…9122Ad93" },
]

const why = [
  "Deploy cost ~$0.01 — critical for $50–$500 co-living deposits.",
  "GMX V2 native yield for staking — no bridging needed.",
  "Privy + ZeroDev already support it — embedded wallets and AA.",
]

export function SlideContract() {
  return (
    <SlideShell
      eyebrow="Smart Contract · The Arbitrum Differentiator"
      title="The contract does the work that blind trust used to do."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SlideCard className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3">
            <span className="font-display text-sm font-bold text-[#6EE76E]">
              HackerHouseEscrow + Factory
            </span>
            <span className="rounded-full bg-[#6EE76E]/12 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-[#6EE76E]">
              ✓ Deployed · 26/26 tests
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {functions.map((f) => (
              <div
                key={f.fn}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-0.5 px-5 py-2.5 sm:grid-cols-[150px_70px_1fr]"
              >
                <code className="font-mono text-xs text-[#8B78E6]">{f.fn}</code>
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[#7B7A8E] sm:block">
                  {f.who}
                </span>
                <span className="col-span-2 text-xs text-[#C9C8D6] sm:col-span-1">
                  {f.what}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 border-t border-white/10 px-5 py-3">
            {deployed.map((d) => (
              <div key={d.name} className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-[#9D9CB0]">{d.name}</span>
                <code className="font-mono text-[11px] text-[#6EE76E]">{d.addr}</code>
              </div>
            ))}
            <span className="mt-1 font-mono text-[10px] tracking-widest text-[#7B7A8E]">
              Arbitrum Sepolia · verified on Arbiscan
            </span>
          </div>
        </SlideCard>

        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7B7A8E]">
              Why Arbitrum
            </p>
            <ul className="flex flex-col gap-2">
              {why.map((w) => (
                <li
                  key={w}
                  className="flex gap-2 text-sm leading-relaxed text-[#9D9CB0]"
                >
                  <span className="text-[#6EE76E]">▸</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <SlideCard className="border-[#8B78E6]/30">
            <p className="font-display text-sm font-bold text-white">
              Account Abstraction (ZeroDev)
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#9D9CB0]">
              The non-crypto builder enters with an embedded wallet, no seed
              phrase. approve + deposit in a single gasless transaction.
            </p>
          </SlideCard>
          <SlideCard className="border-[#6EE76E]/25">
            <p className="font-display text-sm font-bold text-white">
              Isolated per house
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#9D9CB0]">
              Each house is its own contract with its own yield adapter. If one
              has issues, the others are unaffected.
            </p>
          </SlideCard>
        </div>
      </div>
    </SlideShell>
  )
}
