import { useQuery } from "@tanstack/react-query";
import { OmnisHealthEnvelopeSchema } from "../../api-contract/omnis-health.schema";
import type { OmnisHealthScore } from "../../api-contract/omnis-health.schema";
import { apiGet } from "../lib/api/client";

async function fetchOmnisHealthScore(): Promise<OmnisHealthScore | null> {
  const result = await apiGet("/omnis-health/score");
  if (!result.ok) return null;
  const parsed = OmnisHealthEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return null;
  return parsed.data.data;
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
