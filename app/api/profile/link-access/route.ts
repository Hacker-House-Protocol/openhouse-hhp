import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"

async function getUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try {
    const claims = await privy.utils().auth().verifyAccessToken(token)
    const { data } = await supabaseServer
      .from("users").select("id").eq("privy_id", claims.user_id).single()
    return data
  } catch {
    return null
  }
}

// GET /api/profile/link-access?target_id=uuid — get status for current user
export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const targetId = req.nextUrl.searchParams.get("target_id")
  const incoming = req.nextUrl.searchParams.get("incoming")

  // incoming=true → return pending requests where I am the target (for owner to see)
  if (incoming === "true") {
    const { data } = await supabaseServer
      .from("link_access_requests")
      .select("id, status, requester_id, requester:users!link_access_requests_requester_id_fkey(id, handle, avatar_url)")
      .eq("target_id", user.id)
      .eq("status", "pending")
    return NextResponse.json({ requests: data ?? [] })
  }

  if (!targetId) return NextResponse.json({ message: "target_id required" }, { status: 400 })

  const { data } = await supabaseServer
    .from("link_access_requests")
    .select("id, status")
    .eq("requester_id", user.id)
    .eq("target_id", targetId)
    .maybeSingle()

  return NextResponse.json({ request: data ?? null })
}

// POST /api/profile/link-access — send request { target_id }
export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { target_id } = await req.json()
  if (!target_id) return NextResponse.json({ message: "target_id required" }, { status: 400 })

  // Verify they are matched (friendship accepted)
  const { data: friendship } = await supabaseServer
    .from("friendships")
    .select("id")
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${target_id}),and(sender_id.eq.${target_id},receiver_id.eq.${user.id})`)
    .eq("status", "accepted")
    .maybeSingle()

  if (!friendship) {
    return NextResponse.json({ message: "You must be connected to request link access" }, { status: 403 })
  }

  const { data, error } = await supabaseServer
    .from("link_access_requests")
    .upsert({ requester_id: user.id, target_id, status: "pending", updated_at: new Date().toISOString() }, { onConflict: "requester_id,target_id" })
    .select("id, status")
    .single()

  if (error) return NextResponse.json({ message: "Failed to send request" }, { status: 500 })

  return NextResponse.json({ request: data })
}
