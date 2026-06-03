"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  useFriendshipStatus,
  useSendFriendRequest,
  useUpdateFriendship,
  useRemoveFriendship,
} from "@/services/api/friendships"
import { Skeleton } from "@/components/ui/skeleton"

interface ConnectButtonProps {
  targetUserId: string
}

export function ConnectButton({ targetUserId }: ConnectButtonProps) {
  const { data: friendshipData, isLoading } = useFriendshipStatus(targetUserId)
  const sendRequest = useSendFriendRequest()
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const friendshipId = friendshipData?.friendship_id ?? ""
  const updateFriendship = useUpdateFriendship(friendshipId)
  const removeFriendship = useRemoveFriendship(friendshipId)

  if (isLoading) {
    return <Skeleton className="h-9 w-24" />
  }

  const status = friendshipData?.status ?? null
  const direction = friendshipData?.direction ?? null

  // No friendship exists or was rejected
  if (!status || status === "rejected") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={sendRequest.isPending}
        onClick={() => sendRequest.mutate({ receiver_id: targetUserId })}
        className="w-full rounded-full border-primary text-primary hover:bg-primary/10 text-sm font-medium"
      >
        {sendRequest.isPending ? (
          <>
            <Spinner className="mr-1.5 size-3" /> Sending...
          </>
        ) : (
          "Connect"
        )}
      </Button>
    )
  }

  // Pending - I sent the request
  if (status === "pending" && direction === "sent") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        className="font-mono text-xs"
      >
        Pending
      </Button>
    )
  }

  // Pending - I received the request
  if (status === "pending" && direction === "received") {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          disabled={updateFriendship.isPending}
          onClick={() => updateFriendship.mutate({ status: "accepted" })}
          className="font-mono text-xs"
        >
          {updateFriendship.isPending ? (
            <Spinner className="size-3" />
          ) : (
            "Accept"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={updateFriendship.isPending}
          onClick={() => updateFriendship.mutate({ status: "rejected" })}
          className="font-mono text-xs"
        >
          Decline
        </Button>
      </div>
    )
  }

  // Accepted - connected
  if (status === "accepted") {
    if (showRemoveConfirm) {
      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={removeFriendship.isPending}
            onClick={() => removeFriendship.mutate(undefined)}
            className="font-mono text-xs"
          >
            {removeFriendship.isPending ? (
              <Spinner className="size-3" />
            ) : (
              "Remove"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowRemoveConfirm(false)}
            className="font-mono text-xs"
          >
            Cancel
          </Button>
        </div>
      )
    }

    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowRemoveConfirm(true)}
        className="font-mono text-xs"
      >
        Connected
      </Button>
    )
  }

  return null
}
