"use client"

import { PageContainer } from "../_components/page-container"
import { FriendRequests } from "./_components/friend-requests"
import { NotificationList } from "./_components/notification-list"

export default function NotificationsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated on connections and applications.
          </p>
        </div>
        <FriendRequests />
        <NotificationList />
      </div>
    </PageContainer>
  )
}
