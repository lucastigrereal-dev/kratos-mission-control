import { useQuery } from "@tanstack/react-query";
import { MissionRunsEnvelopeSchema } from "../../api-contract/omnis-runs.schema";
import type { MissionRun } from "../../api-contract/omnis-runs.schema";

const BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

async function fetchOmnisRuns(limit = 10): Promise<MissionRun[]> {
  try {
    const res = await fetch(`${BASE_URL}/omnis-runs/list?limit=${limit}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const raw: unknown = await res.json();
    const parsed = MissionRunsEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return [];
    return parsed.data.data;
  } catch {
    return [];
  }
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
