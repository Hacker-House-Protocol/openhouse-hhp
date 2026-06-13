import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { z } from "zod"

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

const addWalletSchema = z.object({
  wallet_address: z.string().min(1),
  label: z.string().max(50).optional(),
})

/** GET — list all wallets for the authenticated user */
export async function GET(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("id, wallet_address")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const { data: wallets } = await supabaseServer
    .from("user_wallets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  return NextResponse.json({ wallets: wallets ?? [] })
}

/** POST — add a data wallet (read-only, never used for payments) */
export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("id, wallet_address")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const body: unknown = await req.json()
  const parsed = addWalletSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 })
  }

  // Prevent adding the primary wallet as a data wallet
  if (user.wallet_address?.toLowerCase() === parsed.data.wallet_address.toLowerCase()) {
    return NextResponse.json({ message: "This is already your primary wallet" }, { status: 400 })
  }

  const { data: wallet, error } = await supabaseServer
    .from("user_wallets")
    .insert({
      user_id: user.id,
      wallet_address: parsed.data.wallet_address,
      label: parsed.data.label ?? null,
      is_primary: false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Wallet already added" }, { status: 409 })
    }
    console.error("[POST /api/wallets]", error)
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ wallet }, { status: 201 })
}

/** DELETE — remove a data wallet */
export async function DELETE(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const walletId = searchParams.get("id")
  if (!walletId) {
    return NextResponse.json({ message: "Missing wallet id" }, { status: 400 })
  }

  const { error } = await supabaseServer
    .from("user_wallets")
    .delete()
    .eq("id", walletId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[DELETE /api/wallets]", error)
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
