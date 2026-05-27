import { useQuery } from "@tanstack/react-query";
import {
  MissionsEnvelopeSchema,
  type MissionSummary,
} from "../../api-contract/missions.schema";
import { apiGet } from "../lib/api/client";

async function fetchMissions(limit = 10): Promise<MissionSummary[]> {
  const result = await apiGet(`/missions/active?limit=${limit}`);
  if (!result.ok) return [];
  const parsed = MissionsEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return [];
  return parsed.data.data;
}

export function useMissions(limit = 10) {
  const query = useQuery({
    queryKey: ["missions-active", limit],
    queryFn: () => fetchMissions(limit),
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
