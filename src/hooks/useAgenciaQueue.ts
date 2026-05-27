import { useQuery } from "@tanstack/react-query";
import { AgenciaQueueEnvelopeSchema } from "../../api-contract/agencia.schema";
import type { AgenciaQueueSummary } from "../../api-contract/agencia.schema";
import { apiGet } from "../lib/api/client";

async function fetchAgenciaQueue(): Promise<AgenciaQueueSummary | null> {
  const result = await apiGet("/agencia/queue-summary");
  if (!result.ok) return null;
  const parsed = AgenciaQueueEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return null;
  return parsed.data.data;
}

export function useAgenciaQueue() {
  const query = useQuery({
    queryKey: ["agencia-queue"],
    queryFn: fetchAgenciaQueue,
    staleTime: 60_000,
    refetchInterval: 120_000, // W11-B3: dados de fila de marketing refrescam a cada 2min se SSE cair
    retry: 1,
  });

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
