import { useQuery } from "@tanstack/react-query";
import { AgenciaQueueEnvelopeSchema } from "../../api-contract/agencia.schema";
import type { AgenciaQueueSummary } from "../../api-contract/agencia.schema";

const BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

async function fetchAgenciaQueue(): Promise<AgenciaQueueSummary | null> {
  try {
    const res = await fetch(`${BASE_URL}/agencia/queue-summary`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const raw: unknown = await res.json();
    const parsed = AgenciaQueueEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return null;
    return parsed.data.data;
  } catch {
    return null;
  }
}

export function useAgenciaQueue() {
  const query = useQuery({
    queryKey: ["agencia-queue"],
    queryFn: fetchAgenciaQueue,
    staleTime: 60_000,
    retry: 1,
  });

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
