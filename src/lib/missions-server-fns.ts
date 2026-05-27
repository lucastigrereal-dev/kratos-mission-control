import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import {
  MissionEventLogSchema,
  MissionsEnvelopeSchema,
  type MissionEventLog,
  type MissionSummary,
} from "../../api-contract/missions.schema";

type Envelope<T> = { data: T | null; error: string | null };

const OMNIS_BASE_URL = process.env.OMNIS_API_BASE_URL ?? "http://localhost:5100";
const OMNIS_API_KEY =
  process.env.KRATOS_OMNIS_API_KEY ??
  process.env.OMNIS_API_KEY ??
  "";

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (OMNIS_API_KEY) {
    // Header canônico v1 + alias temporário para compat.
    (headers as Record<string, string>)["X-KRATOS-KEY"] = OMNIS_API_KEY;
    (headers as Record<string, string>)["X-API-Key"] = OMNIS_API_KEY;
  }
  return headers;
}

function fallbackMissions(): MissionSummary[] {
  return [
    {
      mission_id: "mock-m1",
      title: "Parallel Fabric P2 — intelligent layer",
      sector: "Produto & Tecnologia",
      status: "running",
      current_step: "wave-status-skill",
      retry_count: 0,
      max_retries: 3,
      checkpoint_completed_steps: [],
      cumulative_cost_usd: 0.0042,
      last_event_type: "mission:update",
      last_event_label: "Executando step",
      last_event_at: new Date(Date.now() - 4 * 60_000).toISOString(),
      error_count: 0,
      event_count: 12,
      budget_exceeded: false,
      approval_pending: false,
    },
  ];
}

export const fetchMissionsV1 = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      limit: z.number().int().min(1).max(200).optional().default(10),
      status: z.string().optional(),
    }),
  )
  .handler(
    async ({ data }: { data: { limit?: number; status?: string } }): Promise<Envelope<MissionSummary[]>> => {
      try {
        const params = new URLSearchParams();
        params.set("limit", String(data.limit ?? 10));
        if (data.status) params.set("status", data.status);
        const url = `${OMNIS_BASE_URL}/v1/missions?${params.toString()}`;

        const res = await fetch(url, {
          method: "GET",
          headers: buildHeaders(),
          signal: AbortSignal.timeout(5_000),
        });
        if (!res.ok) {
          return { data: fallbackMissions(), error: `OMNIS ${res.status}` };
        }

        const raw: unknown = await res.json();
        const parsed = MissionsEnvelopeSchema.safeParse(raw);
        if (!parsed.success) {
          return { data: fallbackMissions(), error: parsed.error.message };
        }
        return { data: parsed.data.data, error: null };
      } catch (e) {
        return {
          data: fallbackMissions(),
          error: e instanceof Error ? e.message : "Falha ao buscar missões OMNIS",
        };
      }
    },
  );

export const fetchMissionEventsV1 = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      missionId: z.string().min(1),
      limit: z.number().int().min(1).max(500).optional().default(20),
    }),
  )
  .handler(
    async ({ data }: { data: { missionId: string; limit?: number } }): Promise<Envelope<MissionEventLog>> => {
      try {
        const url = `${OMNIS_BASE_URL}/v1/missions/${data.missionId}/events?limit=${data.limit ?? 20}`;
        const res = await fetch(url, {
          method: "GET",
          headers: buildHeaders(),
          signal: AbortSignal.timeout(5_000),
        });
        if (!res.ok) {
          return { data: null, error: `OMNIS ${res.status}` };
        }
        const raw: unknown = await res.json();
        const parsed = MissionEventLogSchema.safeParse(raw);
        if (!parsed.success) {
          return { data: null, error: parsed.error.message };
        }
        return { data: parsed.data, error: null };
      } catch (e) {
        return {
          data: null,
          error: e instanceof Error ? e.message : "Falha ao buscar eventos da missão",
        };
      }
    },
  );
