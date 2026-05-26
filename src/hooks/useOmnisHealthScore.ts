import { useQuery } from "@tanstack/react-query";
import { OmnisHealthEnvelopeSchema } from "../../api-contract/omnis-health.schema";
import type { OmnisHealthScore } from "../../api-contract/omnis-health.schema";

const BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

async function fetchOmnisHealthScore(): Promise<OmnisHealthScore | null> {
  try {
    const res = await fetch(`${BASE_URL}/omnis-health/score`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const raw: unknown = await res.json();
    const parsed = OmnisHealthEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return null;
    return parsed.data.data;
  } catch {
    return null;
  }
}

export function useOmnisHealthScore() {
  const query = useQuery({
    queryKey: ["omnis-health-score"],
    queryFn: fetchOmnisHealthScore,
    staleTime: 60_000,
    refetchInterval: 120_000,
    retry: 1,
  });

  return {
    healthScore: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
