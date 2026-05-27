import { useQuery } from "@tanstack/react-query";
import type { AuroraInsight } from "../../api-contract/aurora.schema";
import { AuroraInsightEnvelopeSchema } from "../../api-contract/aurora.schema";
import { apiGet } from "../lib/api/client";

async function fetchAuroraInsight(): Promise<{
  insight: AuroraInsight | null;
  isLive: boolean;
}> {
  const result = await apiGet("/aurora/insight");
  if (!result.ok) return { insight: null, isLive: false };
  const parsed = AuroraInsightEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return { insight: null, isLive: false };
  return {
    insight: parsed.data.data,
    isLive: parsed.data.source === "live",
  };
}

interface UseAuroraInsightResult {
  insight: AuroraInsight | null;
  isLoading: boolean;
  isLive: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useAuroraInsight(): UseAuroraInsightResult {
  const query = useQuery({
    queryKey: ["aurora-insight"],
    queryFn: fetchAuroraInsight,
    staleTime: 60_000,        // revalida a cada 60s — OMNIS atualiza em ciclos
    refetchInterval: 120_000, // poll a cada 2min enquanto painel aberto
    retry: 1,
  });

  return {
    insight: query.data?.insight ?? null,
    isLoading: query.isLoading,
    isLive: query.data?.isLive ?? false,
    isError: query.isError,
    refetch: () => query.refetch(),
  };
}
