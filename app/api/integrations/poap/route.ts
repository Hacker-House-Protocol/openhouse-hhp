import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { serverEnv } from "@/env.server"
import type { POAP } from "@/lib/types"

async function getPrivyUserId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try {
    const claims = await privy.utils().auth().verifyAccessToken(token)
    return claims.user_id
  } catch {
    return null
  }
}

interface PoapToken {
  tokenId: string
  event: {
    name: string
    image_url: string
    start_date: string
  }
}

/** Fetch POAPs for a single wallet address */
async function fetchPoapsForWallet(walletAddress: string): Promise<POAP[]> {
  try {
    const response = await fetch(
      `https://api.poap.tech/actions/scan/${walletAddress}`,
      {
        headers: {
          "x-api-key": serverEnv.POAP_APIKEY,
          "Accept": "application/json",
        },
      },
    )

    if (!response.ok) return []

    const tokens = (await response.json()) as PoapToken[]
    return tokens.map((token) => ({
      id: token.tokenId,
      name: token.event.name,
      image_url: token.event.image_url,
      event_date: token.event.start_date,
    }))
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Get user's primary wallet + all data wallets
  const { data: user } = await supabaseServer
    .from("users")
    .select("id, wallet_address")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ poaps: [] })
  }

  // Collect all wallet addresses (primary + data wallets)
  const walletAddresses: string[] = []
  if (user.wallet_address) walletAddresses.push(user.wallet_address)

  const { data: extraWallets } = await supabaseServer
    .from("user_wallets")
    .select("wallet_address")
    .eq("user_id", user.id)
    .eq("is_primary", false)

  if (extraWallets) {
    for (const w of extraWallets) {
      if (!walletAddresses.includes(w.wallet_address)) {
        walletAddresses.push(w.wallet_address)
      }
    }
  }

  if (walletAddresses.length === 0) {
    return NextResponse.json({ poaps: [] })
  }

  // Fetch POAPs from all wallets in parallel
  const results = await Promise.allSettled(
    walletAddresses.map((addr) => fetchPoapsForWallet(addr))
  )

  // Merge and deduplicate by event name + event_date (same event across wallets)
  const seen = new Set<string>()
  const poaps: POAP[] = []

  for (const result of results) {
    if (result.status !== "fulfilled") continue
    for (const poap of result.value) {
      const key = `${poap.name}::${poap.event_date}`
      if (!seen.has(key)) {
        seen.add(key)
        poaps.push(poap)
      }
    }
  }

  await supabaseServer
    .from("users")
    .update({ poaps, updated_at: new Date().toISOString() })
    .eq("privy_id", privyUserId)

  return NextResponse.json({ poaps })
}
