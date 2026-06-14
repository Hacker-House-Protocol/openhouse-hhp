"use client"

import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type {
  UserProfile,
  BuilderListParams,
  BuilderListResponse,
  SuggestedBuilder,
} from "@/lib/types"
import type { PatchProfileInput } from "@/lib/schemas/profile"

export async function syncAndGetProfile(): Promise<UserProfile> {
  await genericAuthRequest("post", "/api/auth/sync")
  const { user } = await genericAuthRequest<{ user: UserProfile }>("get", "/api/profile")
  return user
}

export const useProfile = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useAppQuery<UserProfile>({
    fetcher: async () => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>("get", "/api/profile")
      return user
    },
    queryKey: [queryKeys.profile],
    enabled,
  })
}

export const useBuilderProfile = (username: string) => {
  return useAppQuery<UserProfile>({
    fetcher: async () => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>(
        "get",
        `/api/builders/${username}`,
      )
      return user
    },
    queryKey: [queryKeys.builderProfile, username],
    enabled: !!username,
  })
}

const BUILDERS_PAGE_SIZE = 12

export const useFilteredBuilders = (filters: BuilderListParams) => {
  return useInfiniteQuery<BuilderListResponse, Error>({
    queryKey: [queryKeys.builders, "filtered", filters],
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0
      return genericAuthRequest<BuilderListResponse>("get", "/api/builders", {
        ...filters,
        limit: BUILDERS_PAGE_SIZE,
        offset,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const fetched = lastPage.offset + lastPage.builders.length
      return fetched < lastPage.total ? fetched : undefined
    },
  })
}

export const useSuggestedBuilders = () =>
  useAppQuery<SuggestedBuilder[]>({
    fetcher: async () => {
      const { suggestions } = await genericAuthRequest<{
        suggestions: SuggestedBuilder[]
      }>("get", "/api/builders/suggestions")
      return suggestions
    },
    queryKey: [queryKeys.builders, "suggestions"],
  })

export const usePatchProfile = () => {
  const queryClient = useQueryClient()
  return useAppMutation<PatchProfileInput, UserProfile>({
    fetcher: async (input) => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>(
        "patch",
        "/api/profile",
        input,
      )
      return user
    },
    options: {
      onSuccess: (updated) => {
        queryClient.setQueryData([queryKeys.profile], updated)
      },
    },
  })
}

// ── Link Access ──────────────────────────────────────────────────────────────

export interface LinkAccessRequest {
  id: string
  status: "pending" | "accepted" | "denied"
}

export interface IncomingLinkRequest {
  id: string
  status: "pending"
  requester_id: string
  requester: { id: string; handle: string | null; avatar_url: string | null }
}

export const useLinkAccessStatus = (targetId: string) =>
  useAppQuery<LinkAccessRequest | null>({
    fetcher: async () => {
      const { request } = await genericAuthRequest<{ request: LinkAccessRequest | null }>(
        "get",
        "/api/profile/link-access",
        { target_id: targetId },
      )
      return request
    },
    queryKey: [queryKeys.linkAccess, "status", targetId],
    enabled: !!targetId,
  })

export const useIncomingLinkRequests = () =>
  useAppQuery<IncomingLinkRequest[]>({
    fetcher: async () => {
      const { requests } = await genericAuthRequest<{ requests: IncomingLinkRequest[] }>(
        "get",
        "/api/profile/link-access",
        { incoming: "true" },
      )
      return requests
    },
    queryKey: [queryKeys.linkAccess, "incoming"],
  })

export const useRequestLinkAccess = () => {
  const queryClient = useQueryClient()
  return useAppMutation<{ target_id: string }, LinkAccessRequest>({
    fetcher: async (body) => {
      const { request } = await genericAuthRequest<{ request: LinkAccessRequest }>(
        "post",
        "/api/profile/link-access",
        body,
      )
      return request
    },
    options: {
      onSuccess: (data, vars) => {
        queryClient.setQueryData([queryKeys.linkAccess, "status", vars.target_id], data)
      },
    },
  })
}

export const useRespondLinkAccess = (requestId: string) => {
  const queryClient = useQueryClient()
  return useAppMutation<{ status: "accepted" | "denied" }, LinkAccessRequest>({
    fetcher: async (body) => {
      const { request } = await genericAuthRequest<{ request: LinkAccessRequest }>(
        "patch",
        `/api/profile/link-access/${requestId}`,
        body,
      )
      return request
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.linkAccess, "incoming"] })
      },
    },
  })
}

export const useUploadBanner = () => {
  const queryClient = useQueryClient()
  return useAppMutation<File, { banner_url: string }>({
    fetcher: async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      return genericAuthRequest<{ banner_url: string }>("post", "/api/profile/upload-banner", formData)
    },
    options: {
      onSuccess: (data) => {
        queryClient.setQueryData([queryKeys.profile], (old: UserProfile | undefined) =>
          old ? { ...old, banner_url: data.banner_url } : old,
        )
      },
    },
  })
}
