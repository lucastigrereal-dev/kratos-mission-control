import { useQuery } from "@tanstack/react-query";
import {
  MissionsEnvelopeSchema,
  type MissionSummary,
} from "../../api-contract/missions.schema";

const BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

async function fetchMissions(limit = 10): Promise<MissionSummary[]> {
  try {
    const res = await fetch(`${BASE_URL}/missions/active?limit=${limit}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const raw: unknown = await res.json();
    const parsed = MissionsEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return [];
    return parsed.data.data;
  } catch {
    return [];
  }
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
