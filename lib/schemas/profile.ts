import { z } from "zod"
import { ARCHETYPE_IDS } from "@/lib/onboarding"

export const patchProfileSchema = z.object({
  archetype: z.enum(ARCHETYPE_IDS).optional(),
  skills: z.array(z.string()).optional(),
  handle: z
    .string()
    .regex(
      /^[a-z0-9_]{3,20}$/,
      "Handle must be 3–20 lowercase chars, numbers, or underscores",
    )
    .optional(),
  bio: z.string().max(160).optional(),
  avatar_url: z.string().optional(),
  languages: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  github_url: z.string().optional(),
  twitter_url: z.string().optional(),
  farcaster_url: z.string().optional(),
  website_url: z.string().optional(),
  is_verified: z.boolean().optional(),
  talent_protocol_score: z.number().int().optional(),
  poaps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string(),
    event_date: z.string(),
  })).optional(),
  featured_poaps: z.array(z.string()).optional(),
  seeking_skills: z.array(z.string()).optional(),
  banner_url: z.string().optional(),
  matching_cities: z.array(z.string()).optional(),
  onboarding_step: z
    .enum(["archetype", "identity", "skills", "context", "complete"])
    .optional(),
})

export type PatchProfileInput = z.infer<typeof patchProfileSchema>
