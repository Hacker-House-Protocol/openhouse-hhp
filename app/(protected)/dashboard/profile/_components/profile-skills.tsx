"use client"

import { SkillCard } from "./skill-card"
import type { UserProfile } from "@/lib/types"

interface ProfileSkillsProps {
  profile: UserProfile
}

export function ProfileSkills({ profile }: ProfileSkillsProps) {
  const skills = profile.skills ?? []

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          Skills
        </p>
        {skills.length > 0 && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {skills.length}
          </span>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {skills.map((skill) => (
            <SkillCard key={skill} skill={skill} size="sm" />
          ))}
        </div>
      )}
    </div>
  )
}
