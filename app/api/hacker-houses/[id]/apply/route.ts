import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { applyToHackerHouseSchema } from "@/lib/schemas/hacker-house"
import { evaluateGates, allGatesPassed } from "@/lib/gate-engine"
import type { HouseGate } from "@/lib/types"

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: hackerHouseId } = await params

  const { data: user } = await supabaseServer
    .from("users")
    .select("id, handle")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const { data: hackerHouse } = await supabaseServer
    .from("hacker_houses")
    .select("id, name, creator_id, status")
    .eq("id", hackerHouseId)
    .single()

  if (!hackerHouse) {
    return NextResponse.json({ message: "Hacker House not found" }, { status: 404 })
  }

  if (hackerHouse.status !== "open") {
    return NextResponse.json({ message: "This Hacker House is not accepting applications" }, { status: 400 })
  }

  // ── Gate validation ──────────────────────────────────────────────────
  const { data: gates } = await supabaseServer
    .from("gates")
    .select("*")
    .eq("entity_type", "hacker_house")
    .eq("entity_id", hackerHouseId)

  if (gates?.length) {
    // Fetch full user data for gate evaluation
    const { data: fullUser } = await supabaseServer
      .from("users")
      .select("talent_tags, poaps, nfts, human_passport_verified, worldid_verified, worldid_verification_level, chain_activity")
      .eq("id", user.id)
      .single()

    if (fullUser) {
      const results = evaluateGates(
        {
          talent_tags: fullUser.talent_tags ?? [],
          poaps: fullUser.poaps ?? [],
          nfts: fullUser.nfts ?? [],
          human_passport_verified: fullUser.human_passport_verified ?? false,
          worldid_verified: fullUser.worldid_verified ?? false,
          worldid_verification_level: fullUser.worldid_verification_level ?? null,
          chain_activity: fullUser.chain_activity ?? {},
        },
        gates as HouseGate[],
      )

      if (!allGatesPassed(results)) {
        const failed = results.filter((r) => !r.passed)
        return NextResponse.json(
          { message: "You don't meet the requirements for this house", gates: failed },
          { status: 403 },
        )
      }
    }
  }

  const body: unknown = await req.json()
  const parsed = applyToHackerHouseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  // Check for existing application — idempotent: pending = OK, accepted = block
  const { data: existing } = await supabaseServer
    .from("applications")
    .select("id, status")
    .eq("hacker_house_id", hackerHouseId)
    .eq("applicant_id", user.id)
    .maybeSingle()

  if (existing) {
    if (existing.status === "accepted") {
      return NextResponse.json({ message: "You are already a member" }, { status: 409 })
    }
    // Already pending — return success without re-notifying
    return NextResponse.json({ application: existing })
  }

  const { data, error } = await supabaseServer
    .from("applications")
    .insert({
      hacker_house_id: hackerHouseId,
      hack_space_id: null,
      target_type: "hacker_house",
      applicant_id: user.id,
      message: parsed.data.message ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error("[POST /api/hacker-houses/:id/apply]", error)
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  // Notify creator (only on first apply)
  await supabaseServer.from("notifications").insert({
    user_id: hackerHouse.creator_id,
    type: "hacker_house_application",
    title: "New application",
    body: `${user.handle ?? "Someone"} applied to your hacker house "${hackerHouse.name}".`,
    link: `/dashboard/hacker-houses/${hackerHouseId}`,
  })

  return NextResponse.json({ application: data }, { status: 201 })
}
