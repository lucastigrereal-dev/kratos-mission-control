import {
  useQuery,
  type QueryKey,
  type UseQueryResult,
} from "@tanstack/react-query"
import { timeoutPromise } from "@/lib/resolve-with-fallback"

type UseSafeQueryOptions<TData> = {
  queryKey: QueryKey
  queryFn: () => Promise<TData>
  fallbackData?: TData
  enabled?: boolean
  staleTime?: number
  timeoutMs?: number
}

export function useSafeQuery<TData>({
  queryKey,
  queryFn,
  fallbackData,
  enabled = true,
  staleTime = 60_000,
  timeoutMs = 2500,
}: UseSafeQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime,
    ...(fallbackData !== undefined
      ? { initialData: fallbackData, placeholderData: fallbackData }
      : {}),
    queryFn: async () => {
      try {
        return await Promise.race([
          queryFn(),
          timeoutPromise<TData>(timeoutMs),
        ])
      } catch (error) {
        if (fallbackData !== undefined) return fallbackData
        if (error instanceof Error) throw error
        throw new Error("safe-query-failed")
      }
    },
  })
}
