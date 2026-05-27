import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

type Envelope<T> = { data: T | null; error: string | null };

const OMNIS_BASE_URL = process.env.OMNIS_API_BASE_URL ?? "http://localhost:5100";
const OMNIS_API_KEY =
  process.env.KRATOS_OMNIS_API_KEY ??
  process.env.OMNIS_API_KEY ??
  "";

const EventsStatusSchema = z.object({
  subscribers: z.number().int().min(0),
  status: z.string(),
  ts: z.number(),
});

export interface LiveEventsStatus {
  connected: boolean;
  subscribers: number;
  endpoint: "/v1/events/status" | "/live/status";
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  if (OMNIS_API_KEY) {
    // Header canônico v1 + alias temporário para compat.
    (headers as Record<string, string>)["X-KRATOS-KEY"] = OMNIS_API_KEY;
    (headers as Record<string, string>)["X-API-Key"] = OMNIS_API_KEY;
  }
  return headers;
}

async function probe(path: "/v1/events/status" | "/live/status"): Promise<LiveEventsStatus> {
  const res = await fetch(`${OMNIS_BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(),
    signal: AbortSignal.timeout(4_000),
  });
  if (!res.ok) throw new Error(`OMNIS ${res.status} ${path}`);

  const raw: unknown = await res.json();
  const parsed = EventsStatusSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid SSE status payload on ${path}`);
  }

  return {
    connected: parsed.data.status === "ok",
    subscribers: parsed.data.subscribers,
    endpoint: path,
  };
}

export const fetchLiveEventsStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<LiveEventsStatus>> => {
    try {
      // Canonical v1 path first.
      const data = await probe("/v1/events/status");
      return { data, error: null };
    } catch (primaryErr) {
      try {
        // Legacy alias fallback while migration window is open.
        const data = await probe("/live/status");
        return { data, error: null };
      } catch (fallbackErr) {
        const msg =
          fallbackErr instanceof Error
            ? fallbackErr.message
            : primaryErr instanceof Error
              ? primaryErr.message
              : "Falha ao consultar status SSE OMNIS";
        return { data: null, error: msg };
      }
    }
  },
);
