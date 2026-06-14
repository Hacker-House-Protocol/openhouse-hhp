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

// PATCH /api/profile/link-access/[requestId] — accept or deny { status: "accepted" | "denied" }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { requestId } = await params
  const { status } = await req.json()

  if (status !== "accepted" && status !== "denied") {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 })
  }

  // Only the target (the person whose links were requested) can respond
  const { data: existing } = await supabaseServer
    .from("link_access_requests")
    .select("id, target_id")
    .eq("id", requestId)
    .maybeSingle()

  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 })
  if (existing.target_id !== user.id) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { data, error } = await supabaseServer
    .from("link_access_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .select("id, status")
    .single()

  if (error) return NextResponse.json({ message: "Failed to update" }, { status: 500 })

  return NextResponse.json({ request: data })
}
