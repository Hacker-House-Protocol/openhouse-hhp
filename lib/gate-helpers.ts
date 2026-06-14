import { supabaseServer } from "@/lib/supabase-server"
import type { HouseGate } from "@/lib/types"
import type { GateInput } from "@/lib/schemas/hacker-house"

export type GateEntityType = "hacker_house" | "community" | "hack_space"

/** Save gates for any entity. Deletes existing gates first (replace semantics).
 *  An empty array clears all gates for the entity (used when switching to "open"). */
export async function saveGates(
  entityType: GateEntityType,
  entityId: string,
  gates: GateInput[],
) {
  // Replace semantics: wipe existing gates for this entity first.
  const { error: delError } = await supabaseServer
    .from("gates")
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)

  if (delError) {
    console.error(`[saveGates:delete] ${entityType}/${entityId}`, delError)
  }

  if (!gates.length) return

  const rows = gates.map((g) => ({
    entity_type: entityType,
    entity_id: entityId,
    gate_type: g.gate_type,
    config: g.config,
  }))

  const { error } = await supabaseServer.from("gates").insert(rows)

  if (error) {
    console.error(`[saveGates] ${entityType}/${entityId}`, error)
  }
}

/** Fetch gates for any entity. Returns empty array if none. */
export async function getGates(
  entityType: GateEntityType,
  entityId: string,
): Promise<HouseGate[]> {
  const { data } = await supabaseServer
    .from("gates")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)

  return (data ?? []) as HouseGate[]
}
