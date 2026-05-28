import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getContextSnapshot, getContextoSnapshot } from "@/lib/contexto-server-fns";
import type { ContextSnapshot, ContextoSnapshotData } from "../../api-contract/contexto.schema";
import type { SourceBadgeMeta, DataSource } from "../../api-contract/source-badge.schema";
import { ContextCurrentAPISchema, type ContextCurrentAPI } from "../../api-contract/context-api.schema";
import { apiGet } from "@/lib/api/client";

export function useContextSnapshot() {
  const qc = useQueryClient();

  const query = useQuery<{ data: ContextSnapshot | null; error: string | null }>({
    queryKey: ["contexto", "snapshot"],
    queryFn: () => getContextSnapshot({ data: { refresh: false } }),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: false,
  });

  return {
    snapshot: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["contexto", "snapshot"] }),
  };
}

// ── Mission-level contexto snapshot (Sprint A getContextoSnapshot) ──

export function useContextoMissionSnapshot(opts?: { refresh?: boolean }) {
  const qc = useQueryClient();
  const refresh = opts?.refresh ?? false;

  const query = useQuery<{
    data: ContextoSnapshotData | null;
    error: { code: string; message: string; detail?: string } | null;
    meta: SourceBadgeMeta;
  }>({
    queryKey: ["contexto", "mission-snapshot"],
    queryFn: () => getContextoSnapshot({ data: { refresh } }),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: false,
  });

  return {
    data: query.data?.data ?? null,
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError || query.data?.error !== null,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["contexto", "mission-snapshot"] }),
  };
}

// ── useContextAPI — Python backend /context/current (W3) ─────────────────────

/** Normalize confidence: Python classifier returns 0.0–1.0 float; mock returns 0–100 int. */
function normalizeConfidence(raw: number): number {
  return Math.min(100, Math.max(0, Math.round(raw > 1 ? raw : raw * 100)));
}

/** Map Python drift severity → frontend DriftLevel. */
function mapDriftLevel(ctx: ContextCurrentAPI): "none" | "light" | "high" {
  const sev = ctx.drift?.severity;
  if (sev === "high") return "high";
  if (sev === "medium" || sev === "low") return "light";
  if (!ctx.on_focus && ctx.drift_minutes > 0) return "light";
  return "none";
}

/** Map Python /context/current payload → TypeScript ContextSnapshot shape. */
export function contextAPIToSnapshot(raw: ContextCurrentAPI): ContextSnapshot {
  const confidence = normalizeConfidence(raw.confidence);
  const drift      = mapDriftLevel(raw);
  const focusStatus =
    raw.on_focus             ? ("on_focus"  as const) :
    raw.drift?.state === "off_focus" ? ("off_focus" as const) :
    ("unknown" as const);

  const reasons: string[] = [];
  if (raw.reason_guess) reasons.push(raw.reason_guess);
  if (drift !== "none" && raw.drift?.reason) reasons.push(raw.drift.reason);
  if (reasons.length === 0) reasons.push("Contexto determinado automaticamente.");

  return {
    id:                   crypto.randomUUID(),
    capturedAt:           new Date().toISOString(),
    project:              raw.project_guess ?? raw.focus_project_today ?? "—",
    mission:              raw.mission_guess ?? "—",
    app:                  raw.current_app,
    window:               raw.current_title,
    focusStatus,
    confidence,
    drift,
    driftMinutes:         raw.drift_minutes,
    activeWindowApp:      raw.current_app,
    activeWindowTitle:    raw.current_title,
    activeWindowDomain:   raw.current_domain || undefined,
    activeWindowDuration: raw.active_since.length >= 16
      ? `desde ${raw.active_since.slice(11, 16)}`
      : "—",
    reasons,
    browserTabs: [],
  };
}

async function fetchContextFromAPI(): Promise<{
  snapshot: ContextSnapshot;
  source:   string;
  meta:     SourceBadgeMeta;
} | null> {
  const result = await apiGet("/context/current");
  if (!result.ok || result.raw == null) return null;
  const parsed = ContextCurrentAPISchema.safeParse(result.raw);
  if (!parsed.success) throw new Error(`context schema mismatch: ${parsed.error.message}`);
  const raw = parsed.data;

  const sourceStr = raw.source ?? "fallback";
  const source: DataSource =
    sourceStr === "real"     ? "live"    :
    sourceStr === "mock"     ? "mock"    :
    "partial";

  const meta: SourceBadgeMeta = {
    source,
    origin:     "local",
    stale:      sourceStr !== "real",
    updated_at: new Date().toISOString(),
    errors:     raw.collector_status === "offline" ? ["ActivityWatch offline"] : [],
  };

  return { snapshot: contextAPIToSnapshot(raw), source: sourceStr, meta };
}

export interface UseContextAPIResult {
  snapshot:   ContextSnapshot | null;
  meta:       SourceBadgeMeta | null;
  sourceType: DataSource;
  isLoading:  boolean;
  isError:    boolean;
  error:      string | null;
  refetch:    () => void;
}

export function useContextAPI(): UseContextAPIResult {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:             ["context", "api"],
    queryFn:              fetchContextFromAPI,
    staleTime:            20_000,
    refetchInterval:      30_000,
    retry:                1,
    refetchOnWindowFocus: false,
  });

  const sourceType = query.data?.source === "real" ? "live" as const
    : query.data?.source === "mock" ? "mock" as const
    : query.isError ? "error" as const
    : "partial" as const;

  return {
    snapshot:   query.data?.snapshot ?? null,
    meta:       query.data?.meta ?? null,
    sourceType,
    isLoading:  query.isLoading,
    isError:    query.isError,
    error:      query.isError ? "Contexto indisponível. Verifique o backend." : null,
    refetch:    () => void qc.invalidateQueries({ queryKey: ["context", "api"] }),
  };
}
