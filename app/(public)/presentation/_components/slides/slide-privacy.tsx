import { EyeOff, Fingerprint, Wallet, Shield } from "lucide-react"
import { SlideShell, SlideCard } from "../slide-shell"

const privacy = [
  {
    Icon: EyeOff,
    title: "Verified, not revealed",
    body: "Gates are checked server-side and return only ✓ / ✗. The host never sees your score, wallet or POAP list.",
  },
  {
    Icon: Shield,
    title: "On-chain anonymity",
    body: "All interactions go through your ZeroDev Kernel wallet. Your personal address never appears on-chain — no link to your identity or email.",
  },
  {
    Icon: Fingerprint,
    title: "Selective disclosure",
    body: "You choose which POAPs and skills are public. The rest is used internally for matching and gates only.",
  },
  {
    Icon: Wallet,
    title: "Multi-wallet, ownership-proven",
    body: "Link read-only data wallets to aggregate POAPs across all of them. Each requires a Privy signature to prove you own it; a wallet can't be reused across accounts.",
  },
]

export function SlidePrivacy() {
  return (
    <SlideShell
      eyebrow="Privacy by Design"
      title="Identity is a credential — not an exposure."
      lead="Privacy is a first-class feature, not an afterthought. You present credentials from wallets you actually hold, without revealing anything you don't choose to."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {privacy.map((p) => (
          <SlideCard key={p.title} className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8B78E6]/15 text-[#8B78E6]">
              <p.Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="mb-1 font-display text-base font-bold text-white">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#9D9CB0]">{p.body}</p>
            </div>
          </SlideCard>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#9D9CB0]">
        <span className="text-[#6EE76E]">Planned:</span> a Private Bridge via
        Railgun on Arbitrum for anonymous withdrawals — breaking the on-chain
        link between your Kernel wallet and any destination.
      </p>
    </SlideShell>
  )
}
