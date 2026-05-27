import { useQuery } from "@tanstack/react-query";
import { MissionRunsEnvelopeSchema } from "../../api-contract/omnis-runs.schema";
import type { MissionRun } from "../../api-contract/omnis-runs.schema";
import { apiGet } from "../lib/api/client";

async function fetchOmnisRuns(limit = 10): Promise<MissionRun[]> {
  const result = await apiGet(`/omnis-runs/list?limit=${limit}`);
  if (!result.ok) return [];
  const parsed = MissionRunsEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return [];
  return parsed.data.data;
}

export function useOmnisRuns(limit = 10) {
  const query = useQuery({
    queryKey: ["omnis-runs", limit],
    queryFn: () => fetchOmnisRuns(limit),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  return {
    runs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
