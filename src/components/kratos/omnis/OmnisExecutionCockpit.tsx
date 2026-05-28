/**
 * OmnisExecutionCockpit — W15 Live Execution Monitor
 *
 * Deep execution dashboard for OmnisLab.
 * Surfaces: stats (success rate, avg duration, errors today), active runs,
 * skill launcher, and execution health trend.
 *
 * Data: useOmnisRuns + useOmnisJobs. Real-time via refetchInterval.
 */
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Timer,
  TrendingUp,
  Play,
  RotateCcw,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { useOmnisRuns } from "@/hooks/useOmnisRuns";
import { useOmnisJobs } from "@/hooks/useOmnis";
import type { MissionRun } from "../../../../api-contract/omnis-runs.schema";

const accent = "var(--kr-island-omnis)";

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60_000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}m atrás`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h atrás`;
    return `${Math.floor(hr / 24)}d atrás`;
  } catch {
    return "—";
  }
}

function formatDuration(ms: number | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

// ── Execution Stats ───────────────────────────────────────────────────────────

interface ExecStats {
  total: number;
  succeeded: number;
  failed: number;
  running: number;
  successRate: number;
  avgDurationMs: number | null;
  errorsToday: number;
}

function computeStats(runs: MissionRun[]): ExecStats {
  const today = new Date().toISOString().slice(0, 10);
  const total = runs.length;
  const succeeded = runs.filter((r) => r.status === "success").length;
  const failed = runs.filter((r) => r.status === "error").length;
  const running = runs.filter((r) => r.status === "running").length;
  const successRate = total > 0 ? Math.round((succeeded / total) * 100) : 0;

  const completed = runs.filter((r) => r.duration_ms != null);
  const avgDurationMs =
    completed.length > 0
      ? Math.round(completed.reduce((s, r) => s + (r.duration_ms ?? 0), 0) / completed.length)
      : null;

  const errorsToday = runs.filter(
    (r) => r.status === "error" && r.started_at.startsWith(today),
  ).length;

  return { total, succeeded, failed, running, successRate, avgDurationMs, errorsToday };
}

// ── Stats row ─────────────────────────────────────────────────────────────────

interface StatTileProps {
  icon: typeof Activity;
  label: string;
  value: string;
  color?: string;
}

function StatTile({ icon: Icon, label, value, color = accent }: StatTileProps) {
  return (
    <GlassPanel padding="sm" className="!p-3 text-center">
      <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color }} aria-hidden />
      <p
        className="text-lg font-bold leading-none"
        style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
      >
        {value}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
        {label}
      </p>
    </GlassPanel>
  );
}

// ── Run row ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  success: { icon: CheckCircle2, color: "var(--kr-success)",        label: "OK",       pulse: false },
  error:   { icon: XCircle,      color: "var(--kratos-critical)",   label: "Erro",     pulse: false },
  running: { icon: Clock,        color: "var(--kr-warning)",        label: "Rodando",  pulse: true  },
  pending: { icon: Clock,        color: "var(--kratos-text-muted)", label: "Pendente", pulse: false },
} as const;

function RunRow({ run }: { run: MissionRun }) {
  const cfg = STATUS_CFG[run.status] ?? STATUS_CFG.pending;
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 kratos-card-hover">
      <div className="relative shrink-0">
        <Icon className={`h-3.5 w-3.5 ${cfg.pulse ? "animate-pulse" : ""}`} style={{ color: cfg.color }} aria-hidden />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold truncate" style={{ color: "var(--kratos-text-primary)" }}>
          {run.command}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {run.module && (
            <span className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
              {run.module}
            </span>
          )}
          {run.errors.length > 0 && (
            <span className="text-[10px] font-semibold" style={{ color: "var(--kratos-critical)" }}>
              {run.errors.length} erro{run.errors.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p
          className="text-[11px] font-semibold"
          style={{ color: cfg.color, fontFamily: "var(--kratos-font-mono)" }}
        >
          {formatDuration(run.duration_ms)}
        </p>
        <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
          {relativeTime(run.started_at)}
        </p>
      </div>
    </div>
  );
}

// ── Skill Launcher (structure only — requires OMNIS W28 for real execute) ─────

const QUICK_SKILLS = [
  { id: "daily_brief",    label: "Briefing do Dia",    icon: Zap,      tag: "automação" },
  { id: "content_queue",  label: "Fila de Conteúdo",   icon: Play,     tag: "agência"   },
  { id: "lead_qualifier", label: "Qualificar Lead",    icon: TrendingUp, tag: "arena"    },
  { id: "akasha_sync",    label: "Sync Akasha",        icon: RotateCcw, tag: "memória"  },
  { id: "insight_daily",  label: "Insight do Dia",     icon: Terminal,  tag: "sabedoria" },
];

function SkillLauncher() {
  return (
    <div className="space-y-1.5">
      {QUICK_SKILLS.map((skill) => {
        const Icon = skill.icon;
        return (
          <button
            key={skill.id}
            type="button"
            disabled
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-150 opacity-70 cursor-not-allowed"
            style={{
              background: "color-mix(in oklab, var(--kratos-surface-3) 60%, transparent)",
              border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 8%, transparent)",
            }}
            title="Requer OMNIS W28 — disponível em breve"
            aria-label={`Executar ${skill.label} (indisponível)`}
          >
            <div
              className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)` }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-secondary)" }}>
                {skill.label}
              </p>
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded shrink-0"
              style={{
                background: `color-mix(in oklab, ${accent} 8%, transparent)`,
                color: "var(--kratos-text-muted)",
              }}
            >
              {skill.tag}
            </span>
          </button>
        );
      })}
      <p
        className="text-[10px] text-center pt-1"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Execução de skills via OMNIS W28 (em desenvolvimento)
      </p>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function OmnisExecutionCockpit() {
  const { runs, isLoading: runsLoading } = useOmnisRuns(20);
  const { data: jobs, isLoading: jobsLoading } = useOmnisJobs(5);

  const isLoading = runsLoading || jobsLoading;
  const stats = computeStats(runs);

  const activeRuns = runs.filter((r) => r.status === "running");
  const recentRuns = runs.filter((r) => r.status !== "running").slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <KratosCard header={<SectionTitle icon={Activity} title="Execution Stats" />}>
        {isLoading ? (
          <LoadingState lines={2} />
        ) : runs.length === 0 ? (
          <EmptyState
            compact
            icon={<Activity className="h-4 w-4" />}
            title="Nenhum run registrado"
            description="Execute uma skill/crew no OMNIS para ver o histórico aqui."
          />
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <StatTile
              icon={TrendingUp}
              label="Taxa Sucesso"
              value={`${stats.successRate}%`}
              color={stats.successRate >= 80 ? "var(--kr-success)" : stats.successRate >= 50 ? "var(--kr-warning)" : "var(--kratos-critical)"}
            />
            <StatTile
              icon={Timer}
              label="Duração Média"
              value={formatDuration(stats.avgDurationMs ?? undefined)}
            />
            <StatTile
              icon={CheckCircle2}
              label="Sucesso / Total"
              value={`${stats.succeeded}/${stats.total}`}
              color="var(--kr-success)"
            />
            <StatTile
              icon={AlertTriangle}
              label="Erros Hoje"
              value={String(stats.errorsToday)}
              color={stats.errorsToday > 0 ? "var(--kratos-critical)" : "var(--kratos-text-muted)"}
            />
          </div>
        )}
      </KratosCard>

      {/* Active Runs */}
      {activeRuns.length > 0 && (
        <KratosCard
          header={
            <div className="flex items-center gap-2">
              <SectionTitle icon={Zap} title="Rodando Agora" />
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--kr-warning)" }}
                aria-hidden
              />
            </div>
          }
        >
          <div className="space-y-1">
            {activeRuns.map((r) => (
              <RunRow key={r.run_id} run={r} />
            ))}
          </div>
        </KratosCard>
      )}

      {/* Execution History */}
      <KratosCard header={<SectionTitle icon={Terminal} title="Histórico de Execução" />}>
        {isLoading ? (
          <LoadingState lines={4} />
        ) : recentRuns.length === 0 ? (
          <EmptyState
            compact
            icon={<Terminal className="h-4 w-4" />}
            title="Histórico vazio"
            description="Os runs aparecerão aqui após a primeira execução."
          />
        ) : (
          <div className="space-y-0.5">
            {recentRuns.map((r) => (
              <RunRow key={r.run_id} run={r} />
            ))}
          </div>
        )}
      </KratosCard>

      {/* Skill Launcher */}
      <KratosCard
        header={
          <div className="flex items-center gap-2">
            <SectionTitle icon={Play} title="Lançador de Skills" />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded"
              style={{
                background: "color-mix(in oklab, var(--kr-warning) 12%, transparent)",
                color: "var(--kr-warning)",
              }}
            >
              W28
            </span>
          </div>
        }
      >
        <SkillLauncher />
      </KratosCard>
    </div>
  );
}
