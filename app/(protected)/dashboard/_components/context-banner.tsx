import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ContextBanner() {
  return (
    <div className="bg-[#1E1B4B] border border-border rounded-lg p-4">
      <p className="text-foreground">
        <span className="font-medium">3 builders</span> in your network are going to{" "}
        <span className="font-medium">ETH Cannes</span> in 18 days —{" "}
        <span className="font-medium">2 Hacker Houses</span> open for that event.
      </p>
      <Link
        href="/dashboard/hacker-houses"
        className="text-primary text-sm font-medium mt-2 inline-flex items-center gap-1"
      >
        See houses <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
