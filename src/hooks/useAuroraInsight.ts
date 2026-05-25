import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { AuroraInsight } from "../../api-contract/aurora.schema";
import { AuroraInsightEnvelopeSchema } from "../../api-contract/aurora.schema";

const BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

async function fetchAuroraInsight(): Promise<{
  insight: AuroraInsight | null;
  isLive: boolean;
}> {
  try {
    const res = await fetch(`${BASE_URL}/aurora/insight`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { insight: null, isLive: false };
    const raw: unknown = await res.json();
    const parsed = AuroraInsightEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return { insight: null, isLive: false };
    return {
      insight: parsed.data.data,
      isLive: parsed.data.source === "live",
    };
  } catch {
    return { insight: null, isLive: false };
  }
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
