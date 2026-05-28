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
  const wrappedQueryFn = async (): Promise<TData> => {
    try {
      return await Promise.race([queryFn(), timeoutPromise<TData>(timeoutMs)]);
    } catch (error) {
      if (fallbackData !== undefined) return fallbackData;
      if (error instanceof Error) throw error;
      throw new Error("safe-query-failed");
    }
  };

  // Separate overloads: with initialData (DefinedUseQueryResult) vs without
  if (fallbackData !== undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery({
      queryKey,
      enabled,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime,
      initialData: fallbackData as NonNullable<TData>,
      queryFn: wrappedQueryFn,
    }) as UseQueryResult<TData, Error>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery({
    queryKey,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime,
    queryFn: wrappedQueryFn,
  });
}
