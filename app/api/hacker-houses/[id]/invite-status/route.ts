import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"

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

/**
 * GET /api/hacker-houses/[id]/invite-status
 * Returns whether the current user has been invited to this house.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ invited: false })
  }

  const { id: hackerHouseId } = await params

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ invited: false })
  }

  // Check if user is the creator (always allowed)
  const { data: house } = await supabaseServer
    .from("hacker_houses")
    .select("creator_id")
    .eq("id", hackerHouseId)
    .single()

  if (house?.creator_id === user.id) {
    return NextResponse.json({ invited: true })
  }

  // Check for invite notification
  const { data: invite } = await supabaseServer
    .from("notifications")
    .select("id")
    .eq("user_id", user.id)
    .eq("type", "hacker_house_invite")
    .eq("link", `/dashboard/hacker-houses/${hackerHouseId}`)
    .maybeSingle()

  return NextResponse.json({ invited: !!invite })
}
