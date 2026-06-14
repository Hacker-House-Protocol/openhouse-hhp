import { SlideShell } from "../slide-shell"
import { FlowDiagram } from "../flow-diagram"

export function SlideHowItWorks() {
  return (
    <SlideShell
      eyebrow="How It Works"
      title="From discovery to Booking NFT — all on-chain."
      lead="Your reservation isn't a confirmation email. It's an asset in your wallet."
    >
      <FlowDiagram />
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[#7B7A8E]">
        The on-chain flow runs live on the escrow deployed and verified on
        Arbitrum Sepolia — gasless deposits, automatic release and refund, with
        a SpotNFT minted to each builder.
      </p>
    </SlideShell>
  )
}
