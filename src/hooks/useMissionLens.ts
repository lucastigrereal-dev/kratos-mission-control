import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DataSource } from "../../api-contract/source-badge.schema";
import { apiGet } from "../lib/api/client";

// --- Schema Zod inline ---
const MissionLensDataSchema = z.object({
  mission_lens: z
    .object({
      current_mission: z.string().optional(),
      phase: z.string().optional(),
      status: z.string().optional(),
    })
    .optional(),
  today_agenda: z.array(z.record(z.unknown())).optional(),
  recent_checkpoints: z.array(z.record(z.unknown())).optional(),
  mentor_signals: z
    .array(
      z.object({
        tone: z.enum(["critical", "warning", "info", "neutral"]).optional(),
        message: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .optional(),
  alerts: z.array(z.record(z.unknown())).optional(),
  context: z
    .object({
      project: z.string().optional(),
      focus_state: z.string().optional(),
      drift_risk: z.enum(["low", "medium", "high"]).optional(),
    })
    .optional(),
  next_best_action: z
    .object({
      action: z.string().optional(),
      rationale: z.string().optional(),
      score: z.number().optional(),
    })
    .optional(),
  today_execution: z.record(z.unknown()).optional(),
  collector_status: z
    .array(
      z.object({
        collector: z.string(),
        status: z.enum(["healthy", "degraded", "offline", "error"]),
        source: z.string().optional(),
        last_check: z.string().optional(),
        error: z.string().nullable().optional(),
      })
    )
    .optional(),
});

const MissionLensEnvelopeSchema = z.object({
  source: z.enum(["real", "fallback", "cached", "mock", "error"]).optional(),
  data: MissionLensDataSchema.nullable(),
  meta: z
    .object({
      collector: z.string().optional(),
      latency_ms: z.number().optional(),
      cached_at: z.string().nullable().optional(),
    })
    .optional(),
});

export type MissionLensData = z.infer<typeof MissionLensDataSchema>;
export type MissionLensEnvelope = z.infer<typeof MissionLensEnvelopeSchema>;

// --- Fetch function com fallback ---
async function fetchMissionLens(): Promise<{
  data: MissionLensData | null;
  sourceType: DataSource;
}> {
  // Tenta /mission/lens primeiro
  const primary = await apiGet("/mission/lens");
  if (primary.ok) {
    const parsed = MissionLensEnvelopeSchema.safeParse(primary.raw);
    if (parsed.success) {
      const src = parsed.data.source;
      const sourceType: DataSource =
        src === "real"
          ? "live"
          : src === "cached"
            ? "cache"
            : src === "fallback"
              ? "cache"
              : src === "mock"
                ? "mock"
                : src === "error"
                  ? "error"
                  : "live";
      return { data: parsed.data.data, sourceType };
    }
  }

  // Fallback para /live/snapshot
  const fallback = await apiGet("/live/snapshot");
  if (fallback.ok) {
    const parsed = MissionLensEnvelopeSchema.safeParse(fallback.raw);
    if (parsed.success && parsed.data.data) {
      return { data: parsed.data.data, sourceType: "cache" };
    }
  }

  return { data: null, sourceType: "error" };
}

// --- Hook ---
interface UseMissionLensResult {
  lens: MissionLensData | null;
  isLoading: boolean;
  sourceType: DataSource;
  lastUpdatedAt: string | null;
  refetch: () => void;
}

export function useMissionLens(): UseMissionLensResult {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mission-lens"],
    queryFn: fetchMissionLens,
    staleTime: 30_000,
    retry: 1,
  });

  return {
    lens: query.data?.data ?? null,
    isLoading: query.isLoading,
    sourceType: query.data?.sourceType ?? (query.isError ? "error" : "cache"),
    lastUpdatedAt: query.dataUpdatedAt
      ? new Date(query.dataUpdatedAt).toISOString()
      : null,
    refetch: () => qc.invalidateQueries({ queryKey: ["mission-lens"] }),
  };
}
