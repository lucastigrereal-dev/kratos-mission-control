import { useQuery } from "@tanstack/react-query";
import type { MissionSummary } from "../../api-contract/missions.schema";
import { fetchMissionsV1 } from "../lib/missions-server-fns";

export function useMissions(limit = 10) {
  const query = useQuery({
    queryKey: ["missions-active", limit],
    queryFn: async (): Promise<MissionSummary[]> => {
      const result = await fetchMissionsV1({ data: { limit } });
      return result.data ?? [];
    },
    staleTime: 20_000,
    refetchInterval: 30_000,
    retry: 1,
  });

  return {
    missions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
