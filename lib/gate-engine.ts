import type {
  GateCheckResult,
  GateType,
  HouseGate,
  TalentSkillsGateConfig,
  PoapGateConfig,
  NftGateConfig,
  HumanPassportGateConfig,
  WorldIdGateConfig,
  BlockchainActivityGateConfig,
  POAP,
} from "@/lib/types"

/**
 * User data needed for gate evaluation.
 * This is a subset of the full user row — only internal data, never exposed.
 */
export interface GateUserData {
  talent_tags: string[]
  poaps: POAP[]
  nfts: { contract_address: string; chain_id: number }[]
  human_passport_verified: boolean
  worldid_verified: boolean
  worldid_verification_level: string | null
  chain_activity: {
    total_tx_count?: number
    chains?: number[]
    first_tx_date?: string
  }
}

type GateEvaluator<T> = (config: T, user: GateUserData) => GateCheckResult

// ── Evaluators ────────────────────────────────────────────────────────────

const evaluateTalentSkills: GateEvaluator<TalentSkillsGateConfig> = (config, user) => {
  const userSkills = new Set(user.talent_tags.map((s) => s.toLowerCase()))
  const matched = config.required_skills.filter((s) => userSkills.has(s.toLowerCase()))
  const needed = config.min_count ?? 1
  const passed = matched.length >= needed

  return {
    gate_type: "talent_skills",
    passed,
    reason: passed
      ? `Has ${needed} required skill${needed > 1 ? "s" : ""}`
      : `Requires ${needed} of: ${config.required_skills.join(", ")}`,
  }
}

const evaluatePoap: GateEvaluator<PoapGateConfig> = (config, user) => {
  if (config.mode === "count") {
    const minCount = config.min_count ?? 1
    const passed = user.poaps.length >= minCount
    return {
      gate_type: "poap",
      passed,
      reason: passed
        ? `Has ${minCount}+ POAPs`
        : `Requires at least ${minCount} POAPs`,
    }
  }

  // specific mode
  const userEventIds = new Set(user.poaps.map((p) => p.id))
  const requiredIds = config.event_ids ?? []
  const matched = requiredIds.filter((id) => userEventIds.has(id))
  const passed = matched.length > 0

  return {
    gate_type: "poap",
    passed,
    reason: passed
      ? "Has required POAP"
      : `Requires a specific POAP attendance`,
  }
}

const evaluateNft: GateEvaluator<NftGateConfig> = (config, user) => {
  const userContracts = new Set(
    user.nfts.map((n) => `${n.chain_id}:${n.contract_address.toLowerCase()}`)
  )
  const hasAny = config.contracts.some((c) =>
    userContracts.has(`${c.chain_id}:${c.address.toLowerCase()}`)
  )

  return {
    gate_type: "nft",
    passed: hasAny,
    reason: hasAny
      ? "Holds required NFT"
      : `Requires ownership of a specific NFT`,
  }
}

const evaluateHumanPassport: GateEvaluator<HumanPassportGateConfig> = (_config, user) => ({
  gate_type: "human_passport",
  passed: user.human_passport_verified,
  reason: user.human_passport_verified
    ? "Human Passport verified"
    : "Requires Human Passport verification",
})

const evaluateWorldId: GateEvaluator<WorldIdGateConfig> = (config, user) => {
  if (!user.worldid_verified) {
    return {
      gate_type: "world_id",
      passed: false,
      reason: `Requires World ID (${config.verification_level}) verification`,
    }
  }

  // orb level requires orb; device level accepts either
  const levelOk =
    config.verification_level === "device" ||
    user.worldid_verification_level === "orb"

  return {
    gate_type: "world_id",
    passed: levelOk,
    reason: levelOk
      ? "World ID verified"
      : `Requires World ID orb verification`,
  }
}

const evaluateBlockchainActivity: GateEvaluator<BlockchainActivityGateConfig> = (config, user) => {
  const activity = user.chain_activity
  const reasons: string[] = []
  let passed = true

  if (config.min_tx_count != null) {
    const txCount = activity.total_tx_count ?? 0
    if (txCount < config.min_tx_count) {
      passed = false
      reasons.push(`Requires ${config.min_tx_count}+ transactions`)
    }
  }

  if (config.chains?.length) {
    const userChains = new Set(activity.chains ?? [])
    const hasChain = config.chains.some((c) => userChains.has(c))
    if (!hasChain) {
      passed = false
      reasons.push("Requires activity on specific chains")
    }
  }

  if (config.min_age_days != null && activity.first_tx_date) {
    const firstTx = new Date(activity.first_tx_date)
    const ageDays = Math.floor((Date.now() - firstTx.getTime()) / (1000 * 60 * 60 * 24))
    if (ageDays < config.min_age_days) {
      passed = false
      reasons.push(`Requires ${config.min_age_days}+ days of on-chain history`)
    }
  } else if (config.min_age_days != null && !activity.first_tx_date) {
    passed = false
    reasons.push(`Requires ${config.min_age_days}+ days of on-chain history`)
  }

  return {
    gate_type: "blockchain_activity",
    passed,
    reason: passed ? "Meets blockchain activity requirements" : reasons.join("; "),
  }
}

// ── Router ────────────────────────────────────────────────────────────────

const evaluators: Record<GateType, GateEvaluator<never>> = {
  talent_skills: evaluateTalentSkills as GateEvaluator<never>,
  poap: evaluatePoap as GateEvaluator<never>,
  nft: evaluateNft as GateEvaluator<never>,
  human_passport: evaluateHumanPassport as GateEvaluator<never>,
  world_id: evaluateWorldId as GateEvaluator<never>,
  blockchain_activity: evaluateBlockchainActivity as GateEvaluator<never>,
}

/**
 * Evaluate all gates for a house against a user's data.
 * All gates must pass (AND logic).
 * Returns per-gate results with generic reasons (never leaks user data).
 */
export function evaluateGates(user: GateUserData, gates: HouseGate[]): GateCheckResult[] {
  return gates.map((gate) => {
    const evaluator = evaluators[gate.gate_type]
    if (!evaluator) {
      return { gate_type: gate.gate_type, passed: false, reason: "Unknown gate type" }
    }
    return evaluator(gate.config as never, user)
  })
}

/** Quick check: do all gates pass? */
export function allGatesPassed(results: GateCheckResult[]): boolean {
  return results.every((r) => r.passed)
}
