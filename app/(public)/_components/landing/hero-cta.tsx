"use client"

import Link from "next/link"
import { AuthButton } from "@/components/auth/auth-button"
import { useAuth } from "@/hooks/use-auth"

const btnClass =
  "h-14 px-10 inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl border-2 border-purple-400/30 shadow-2xl transition-all duration-300 hover:scale-[1.02]"

export function HeroCta() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (isAuthenticated) {
    return (
      <Link href="/dashboard" className={btnClass}>
        Go to Dashboard →
      </Link>
    )
  }

  return <AuthButton className={btnClass} />
}
