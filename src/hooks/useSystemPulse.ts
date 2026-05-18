import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { DataSource } from "../../api-contract/source-badge.schema";

// --- Schema do /live/snapshot (campos relevantes) ---
const CollectorStatusSchema = z.object({
  collector: z.string(),
  status: z.enum(["healthy", "degraded", "offline", "error"]),
  source: z.string().optional(),
  last_check: z.string().optional(),
  error: z.string().nullable().optional(),
});

const SnapshotDataSchema = z.object({
  context: z.object({
    project: z.string().optional(),
    focus_state: z.string().optional(),
    drift_risk: z.enum(["low", "medium", "high"]).optional(),
  }).optional(),
  collector_status: z.array(CollectorStatusSchema).optional(),
  // Campos de sistema — podem vir em diferentes paths dependendo do backend
  cpu_percent: z.number().optional(),
  ram_percent: z.number().optional(),
  docker_running: z.number().optional(),
  git_dirty: z.boolean().optional(),
}).catchall(z.unknown()); // tolerante a campos extras

const SnapshotEnvelopeSchema = z.object({
  source: z.string().optional(),
  data: SnapshotDataSchema.nullable(),
  meta: z.record(z.unknown()).optional(),
});

// --- Tipos exportados ---
export type SystemHealth = "healthy" | "degraded" | "critical";

export interface SystemPulseData {
  cpuPercent: number;
  ramPercent: number;
  dockerRunning: number;
  gitDirty: boolean;
  health: SystemHealth;
  alerts: Array<{ collector: string; status: string; error?: string | null }>;
}

export interface UseSystemPulseResult {
  pulse: SystemPulseData | null;
  health: SystemHealth;
  isLoading: boolean;
  sourceType: DataSource;
}

// --- Derivar health dos thresholds ---
function deriveHealth(cpu: number, ram: number): SystemHealth {
  if (cpu > 85 || ram > 90) return "critical";
  if (cpu > 70 || ram > 80) return "degraded";
  return "healthy";
}

// --- Fetch ---
const BASE_URL = typeof window !== "undefined"
  ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
  : "http://localhost:5100";

async function fetchSnapshot(): Promise<{ data: z.infer<typeof SnapshotDataSchema> | null; sourceType: DataSource }> {
  try {
    const res = await fetch(`${BASE_URL}/live/snapshot`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { data: null, sourceType: "error" };
    const raw = await res.json();
    const parsed = SnapshotEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return { data: null, sourceType: "error" };
    const src = parsed.data.source;
    const sourceType: DataSource =
      src === "real" ? "live" :
      src === "cached" ? "cache" :
      src === "fallback" ? "cache" :
      src === "mock" ? "mock" :
      src === "error" ? "error" : "live";
    return { data: parsed.data.data, sourceType };
  } catch {
    return { data: null, sourceType: "error" };
  }
}

// --- Hook ---
export function useSystemPulse(): UseSystemPulseResult {
  const query = useQuery({
    queryKey: ["system", "pulse"],
    queryFn: fetchSnapshot,
    staleTime: 10_000,
    refetchInterval: 10_000,
    retry: false,
  });

  const raw = query.data?.data ?? null;
  const sourceType = query.data?.sourceType ?? (query.isError ? "error" : "cache");

  if (!raw) {
    return {
      pulse: null,
      health: "healthy",
      isLoading: query.isLoading,
      sourceType,
    };
  }

  const cpu = raw.cpu_percent ?? 0;
  const ram = raw.ram_percent ?? 0;
  const health = deriveHealth(cpu, ram);

  const alerts = (raw.collector_status ?? [])
    .filter((c) => c.status === "degraded" || c.status === "error" || c.status === "offline")
    .map((c) => ({ collector: c.collector, status: c.status, error: c.error }));

  const pulse: SystemPulseData = {
    cpuPercent: cpu,
    ramPercent: ram,
    dockerRunning: raw.docker_running ?? 0,
    gitDirty: raw.git_dirty ?? false,
    health,
    alerts,
  };

  return { pulse, health, isLoading: query.isLoading, sourceType };
}
