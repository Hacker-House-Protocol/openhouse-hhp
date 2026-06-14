"use client"

import { useUnreadNotificationCount } from "@/services/api/notifications"
import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  variant?: "absolute" | "inline"
  className?: string
}

export function NotificationBadge({
  variant = "absolute",
  className,
}: NotificationBadgeProps) {
  const { data: count } = useUnreadNotificationCount()

  if (!count || count === 0) return null

  const label = count > 9 ? "9+" : String(count)

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "ml-auto inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-mono font-bold leading-none",
          className,
        )}
        style={{
          background: "var(--builder-archetype)",
          color: "var(--background)",
        }}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold leading-none",
        className,
      )}
      style={{
        background: "var(--destructive)",
        color: "var(--destructive-foreground)",
      }}
    >
      {label}
    </span>
  )
}
