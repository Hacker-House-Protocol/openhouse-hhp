import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { reviewApplicationSchema } from "@/lib/schemas/hack-space"

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

// PATCH /api/hack-spaces/[id]/applications/[appId] — accept or reject
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: hackSpaceId, appId } = await params

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const { data: hackSpace } = await supabaseServer
    .from("hack_spaces")
    .select("id, creator_id, max_team_size, status")
    .eq("id", hackSpaceId)
    .single()

  if (!hackSpace) {
    return NextResponse.json({ message: "Hack Space not found" }, { status: 404 })
  }

  if (hackSpace.creator_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await req.json()
  const parsed = reviewApplicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 })
  }

  const { data: application, error: appError } = await supabaseServer
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", appId)
    .eq("hack_space_id", hackSpaceId)
    .select()
    .single()

  if (appError || !application) {
    return NextResponse.json({ message: "Application not found" }, { status: 404 })
  }

  // If accepted, notify the applicant and check if the team is now full
  if (parsed.data.status === "accepted") {
    const { data: hs } = await supabaseServer
      .from("hack_spaces")
      .select("title")
      .eq("id", hackSpaceId)
      .single()

    await supabaseServer.from("notifications").insert({
      user_id: application.applicant_id,
      type: "hack_space_accepted",
      title: "Application accepted",
      body: `You're in! Your application to "${hs?.title ?? "the Hack Space"}" was accepted.`,
      link: `/dashboard/hack-spaces/${hackSpaceId}`,
    })

    const { count } = await supabaseServer
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("hack_space_id", hackSpaceId)
      .eq("status", "accepted")

    if (count !== null && count >= hackSpace.max_team_size) {
      await supabaseServer
        .from("hack_spaces")
        .update({ status: "full", updated_at: new Date().toISOString() })
        .eq("id", hackSpaceId)
    }
  }

  return NextResponse.json({ application })
}
