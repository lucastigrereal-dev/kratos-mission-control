import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { DataSource } from "../../api-contract/source-badge.schema";
import { apiGet } from "../lib/api/client";

// --- Schema do /live/snapshot (campos reais do backend) ---
const CollectorStatusEntrySchema = z.object({
  source: z.string().optional(),
  status: z.string().optional(),
  cpu_percent: z.number().optional(),
  memory_percent: z.number().optional(),
  total: z.number().optional(),
  running: z.number().optional(),
  unhealthy: z.number().optional(),
  error: z.string().optional(),
}).catchall(z.unknown());

const SnapshotDataSchema = z.object({
  context: z.object({
    project: z.string().optional(),
    focus_state: z.string().optional(),
    drift_risk: z.enum(["low", "medium", "high"]).optional(),
  }).optional(),
  collector_status: z.record(z.string(), CollectorStatusEntrySchema).optional(),
  _live_meta: z.object({
    mode: z.string().optional(),
    degraded_count: z.number().optional(),
    build_time_ms: z.number().optional(),
  }).optional(),
}).catchall(z.unknown());

const SnapshotEnvelopeSchema = z.object({
  timestamp: z.string().optional(),
  _live_meta: z.object({ mode: z.string().optional(), degraded_count: z.number().optional() }).optional(),
}).catchall(z.unknown());

// --- Tipos exportados ---
export type SystemHealth = "healthy" | "degraded" | "critical";

export interface SystemPulseData {
  cpuPercent: number;
  ramPercent: number;
  dockerRunning: number;
  dockerTotal: number;
  gitDirty: boolean;
  gitBranch: string | null;
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

interface CollectorDictEntry {
  source?: string;
  status?: string;
  cpu_percent?: number;
  memory_percent?: number;
  total?: number;
  running?: number;
  unhealthy?: number;
  error?: string;
  dirty?: boolean;
  branch?: string;
}

async function fetchSnapshot(): Promise<{ pulse: SystemPulseData | null; sourceType: DataSource }> {
  const result = await apiGet("/live/snapshot");
  if (!result.ok) return { pulse: null, sourceType: "error" };
  const raw = result.raw;
  const parsed = SnapshotEnvelopeSchema.safeParse(raw);
  if (!parsed.success) return { pulse: null, sourceType: "error" };

  const payload = parsed.data;
  const meta = payload._live_meta;
  const sourceType: DataSource = meta?.mode === "live" ? "live"
    : meta?.mode === "degraded" ? "cache"
    : "live";

  // Extract collector data from the real backend shape (dict of named collectors)
  const collectors = (payload.collector_status ?? {}) as Record<string, CollectorDictEntry>;
  const system = collectors.system ?? {};
  const docker = collectors.docker ?? {};

  const cpu = system.cpu_percent ?? 0;
  const ram = system.memory_percent ?? 0;
  const dockerRunning = docker.running ?? 0;
  const dockerTotal = docker.total ?? 0;

  // git: dirty flag + primary branch from kratos collector
  const git = collectors.git ?? {};
  const gitDirty = git.dirty === true;
  const gitBranch = git.branch ?? null;

  const alerts: Array<{ collector: string; status: string; error?: string | null }> = [];
  for (const [name, c] of Object.entries(collectors)) {
    if (c.status === "degraded" || c.status === "error" || c.status === "offline") {
      alerts.push({ collector: name, status: c.status ?? "unknown", error: c.error ?? null });
    }
  }

  const health = deriveHealth(cpu, ram);

  return {
    pulse: { cpuPercent: cpu, ramPercent: ram, dockerRunning, dockerTotal, gitDirty, gitBranch, health, alerts },
    sourceType,
  };
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

  const pulse = query.data?.pulse ?? null;
  const sourceType = query.data?.sourceType ?? (query.isError ? "error" : "cache");

  if (!pulse) {
    return { pulse: null, health: "healthy", isLoading: query.isLoading, sourceType };
  }

  return { pulse, health: pulse.health, isLoading: query.isLoading, sourceType };
}
