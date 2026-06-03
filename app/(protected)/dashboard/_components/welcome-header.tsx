"use client"

import { useProfile } from "@/services/api/profile"
import { Skeleton } from "@/components/ui/skeleton"

export function WelcomeHeader() {
  const { data: profile } = useProfile()

  if (!profile) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Avatar"
        className="size-12 rounded-full border-[3px] border-[#6EE76E] object-cover flex-shrink-0"
      />
      <div className="flex flex-col">
        <span className="font-display font-bold text-white text-xl leading-tight">Welcome back</span>
        <span className="text-[#7B7A8E] text-sm">@{profile.handle ?? "builder"}</span>
      </div>
    </div>
  )
}
