"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileIdentity } from "./profile-identity"
import { ProfileSkills } from "./profile-skills"
import { ProfileLocation } from "./profile-location"
import { ProfileLinks } from "./profile-links"
import { ProfileOnchain } from "./profile-onchain"
import { ProfileWallets } from "./profile-wallets"
import { ProfileActivity } from "./profile-activity"
import { ProfileEditForm } from "./profile-edit-form"
import { ConnectButton } from "../../_components/connect-button"
import type { UserProfile } from "@/lib/types"

interface ProfileViewProps {
  profile: UserProfile
  isOwner: boolean
}

export function ProfileView({ profile, isOwner }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)

  const hasLocationSection = !!(
    profile.city ||
    profile.region ||
    (profile.languages ?? []).length > 0
  )
  const hasLinksSection = !!(
    profile.github_url ||
    profile.twitter_url ||
    profile.farcaster_url
  )

  if (isEditing) {
    return (
      <Card>
        <CardContent>
          <ProfileEditForm
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      {/* LEFT COLUMN — sticky sidebar on desktop */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-20">
        <div className="relative">
          <ProfileIdentity profile={profile} />
          <div className="absolute top-4 right-4 z-10">
            {isOwner ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="shrink-0 font-mono rounded-lg text-xs h-8 px-3 backdrop-blur-sm"
                style={{
                  background:
                    "color-mix(in oklch, var(--card) 70%, transparent)",
                }}
              >
                ✏ Edit
              </Button>
            ) : (
              <ConnectButton targetUserId={profile.id} />
            )}
          </div>
        </div>

        {hasLocationSection && (
          <Card>
            <CardContent>
              <ProfileLocation profile={profile} />
            </CardContent>
          </Card>
        )}

        {hasLinksSection && (
          <Card>
            <CardContent>
              <ProfileLinks profile={profile} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* RIGHT COLUMN — main content */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent>
            <ProfileSkills profile={profile} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <ProfileOnchain profile={profile} isOwner={isOwner} />
          </CardContent>
        </Card>

        {isOwner && (
          <Card>
            <CardContent>
              <ProfileWallets profile={profile} isOwner={isOwner} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <ProfileActivity profile={profile} isOwner={isOwner} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
