import { useEffect } from "react";
import { GitBranch, Circle, CheckCircle2, XCircle, PauseCircle, Clock, RotateCcw, Save, ChevronRight } from "lucide-react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useIslandDock } from "./shared/IslandDockContext";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { useMissions } from "@/hooks/useMissions";
import type { MissionSummary } from "../../../../api-contract/missions.schema";

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  running:   { icon: Circle,       color: "var(--kr-accent-cyan)",    label: "Ativo",     pulse: true  },
  paused:    { icon: PauseCircle,  color: "var(--kr-warning)",        label: "Pausado",   pulse: false },
  draft:     { icon: Clock,        color: "var(--kratos-text-muted)", label: "Rascunho",  pulse: false },
  completed: { icon: CheckCircle2, color: "var(--kr-success)",        label: "Concluído", pulse: false },
  failed:    { icon: XCircle,      color: "var(--kratos-critical)",   label: "Falhou",    pulse: false },
  cancelled: { icon: XCircle,      color: "var(--kratos-text-muted)", label: "Cancelado", pulse: false },
} as const;

function relativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60_000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}m atrás`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h atrás`;
    return `${Math.floor(hr / 24)}d atrás`;
  } catch { return ""; }
}

// ── MissionCard ────────────────────────────────────────────────────────────

function MissionCard({ mission }: { mission: MissionSummary }) {
  const cfg = STATUS_CFG[mission.status] ?? STATUS_CFG.draft;
  const Icon = cfg.icon;

  return (
    <GlassPanel padding="md" className="space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Icon
          className={`h-4 w-4 shrink-0 mt-0.5 ${cfg.pulse ? "animate-pulse" : ""}`}
          style={{ color: cfg.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--kratos-text-primary)" }}>
            {mission.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="text-[10px] kratos-mono px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{
                background: `color-mix(in oklab, ${cfg.color} 12%, transparent)`,
                color: cfg.color,
              }}
            >
              {cfg.label}
            </span>
            {mission.sector && (
              <span className="text-[10px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                {mission.sector}
              </span>
            )}
            <span className="text-[10px] kratos-mono ml-auto" style={{ color: "var(--kratos-text-muted)" }}>
              {mission.event_count} evento{mission.event_count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Progress row */}
      <div className="space-y-1.5">
        {/* Current step */}
        {mission.current_step ? (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0" style={{ background: "var(--kr-accent-cyan)" }} />
            <span className="text-[11px] kratos-mono" style={{ color: "var(--kr-accent-cyan)" }}>
              {mission.current_step}
            </span>
          </div>
        ) : (
          mission.last_event_label && (
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
              <span className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
                {mission.last_event_label}
                {mission.last_event_at && ` · ${relativeTime(mission.last_event_at)}`}
              </span>
            </div>
          )
        )}

        {/* Completed steps badges (from checkpoint) */}
        {(mission.checkpoint_completed_steps?.length ?? 0) > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {mission.checkpoint_completed_steps!.map((step) => (
              <span
                key={step}
                className="text-[9px] kratos-mono px-1 py-0.5 rounded"
                style={{
                  background: "color-mix(in oklab, var(--kr-success) 8%, transparent)",
                  color: "var(--kr-success)",
                }}
              >
                ✓ {step}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta row: retry + checkpoint + cost */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5" style={{ borderTop: "1px solid var(--kratos-border)" }}>
        {mission.retry_count > 0 && (
          <span
            className="flex items-center gap-1 text-[9px] kratos-mono px-1.5 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kr-warning) 10%, transparent)",
              color: "var(--kr-warning)",
            }}
          >
            <RotateCcw className="h-2.5 w-2.5" />
            {mission.retry_count}/{mission.max_retries ?? 3} tentativas
          </span>
        )}
        {mission.checkpoint_id && (
          <span
            className="flex items-center gap-1 text-[9px] kratos-mono px-1.5 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kr-success) 10%, transparent)",
              color: "var(--kr-success)",
            }}
            title={mission.checkpoint_label ?? undefined}
          >
            <Save className="h-2.5 w-2.5" />
            {mission.checkpoint_at ? relativeTime(mission.checkpoint_at) : "checkpoint"}
          </span>
        )}
        {mission.error_count > 0 && (
          <span
            className="text-[9px] kratos-mono px-1.5 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kratos-critical) 10%, transparent)",
              color: "var(--kratos-critical)",
            }}
          >
            {mission.error_count} erro{mission.error_count > 1 ? "s" : ""}
          </span>
        )}
        {mission.cumulative_cost_usd > 0 && (
          <span className="text-[9px] kratos-mono ml-auto" style={{ color: "var(--kratos-text-muted)" }}>
            ${mission.cumulative_cost_usd.toFixed(4)}
          </span>
        )}
        {mission.cumulative_cost_usd === 0 && (
          <span className="text-[9px] kratos-mono ml-auto" style={{ color: "var(--kratos-text-muted)" }}>
            $0 (local)
          </span>
        )}
      </div>
    </GlassPanel>
  );
}

// ── MissionsScreen ─────────────────────────────────────────────────────────

interface MissionsScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function MissionsScreen({
  isLoading: externalLoading = false,
  error = null,
  isEmpty = false,
}: MissionsScreenProps) {
  const { missions, isLoading: queryLoading } = useMissions(20);
  const { setData } = useIslandDock();
  const loading = externalLoading || queryLoading;

  const runningCount = missions.filter((m) => m.status === "running").length;
  const completedCount = missions.filter((m) => m.status === "completed").length;

  useEffect(() => {
    setData({
      islandId: "omnis",
      label: "Missões",
      value: missions.length > 0 ? `${runningCount} ativas` : "—",
      progress: missions.length > 0
        ? Math.round((completedCount / missions.length) * 100)
        : 0,
      progressColor: "var(--kr-island-omnis)",
      quickActions: [{ label: "Run Crew" }, { label: "Stop All" }],
    });
    return () => setData(null);
  }, [setData, missions.length, runningCount, completedCount]);

  return (
    <IslandPageFrame theme="omnis">
      {loading ? (
        <LoadingState lines={4} />
      ) : error || (isEmpty && !missions.length) ? (
        <EmptyState
          title="Sem missões registradas"
          description="Nenhuma missão encontrada no OMNIS. Execute uma missão com `omnis run` para ver aqui."
        />
      ) : (
        <>
          <IslandPageHeader
            title="MISSÕES"
            subtitle="Estado em tempo real das missões OMNIS"
            theme="omnis"
          />

          {/* Summary strip */}
          <div className="flex items-center gap-3 mb-4 px-1">
            <span className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
              {missions.length} missão{missions.length !== 1 ? "ões" : ""}
            </span>
            {runningCount > 0 && (
              <span
                className="text-[10px] kratos-mono px-1.5 py-0.5 rounded animate-pulse"
                style={{
                  background: "color-mix(in oklab, var(--kr-accent-cyan) 12%, transparent)",
                  color: "var(--kr-accent-cyan)",
                }}
              >
                {runningCount} ativo{runningCount > 1 ? "s" : ""}
              </span>
            )}
            {completedCount > 0 && (
              <span
                className="text-[10px] kratos-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "color-mix(in oklab, var(--kr-success) 10%, transparent)",
                  color: "var(--kr-success)",
                }}
              >
                {completedCount} concluída{completedCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Mission cards */}
          <div className="space-y-3">
            {missions.length === 0 ? (
              <EmptyState
                title="Fila vazia"
                description="Nenhuma missão registrada — execute `omnis run` para iniciar."
              />
            ) : (
              missions.map((m) => (
                <MissionCard key={m.mission_id} mission={m} />
              ))
            )}
          </div>
        </>
      )}
    </IslandPageFrame>
  );
}
