import { useQuery } from "@tanstack/react-query";
import {
  MissionsEnvelopeSchema,
  type MissionSummary,
} from "../../api-contract/missions.schema";
import { apiGet } from "../lib/api/client";
import type { DataSource } from "../../api-contract/source-badge.schema";

interface MissionsFetchResult {
  missions:   MissionSummary[];
  sourceType: DataSource;
}

async function fetchMissions(limit = 10): Promise<MissionsFetchResult> {
  const result = await apiGet(`/missions/active?limit=${limit}`);
  if (!result.ok) return { missions: [], sourceType: "error" };
  const parsed = MissionsEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return { missions: [], sourceType: "partial" };
  const sourceType: DataSource = parsed.data.source === "live" ? "live" : "partial";
  return { missions: parsed.data.data, sourceType };
}

export function useMissions(limit = 10) {
  const query = useQuery({
    queryKey:        ["missions-active", limit],
    queryFn:         () => fetchMissions(limit),
    staleTime:       20_000,
    refetchInterval: 30_000,
    retry:           1,
  });

  return {
    missions:   query.data?.missions ?? [],
    sourceType: query.data?.sourceType ?? (query.isError ? "error" : "cache") as DataSource,
    isLoading:  query.isLoading,
    isError:    query.isError,
  };
}
