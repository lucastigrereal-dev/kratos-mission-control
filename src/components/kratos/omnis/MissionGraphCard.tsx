import { GitBranch, Circle, CheckCircle2, XCircle, PauseCircle, Clock, RotateCcw, Save, Play } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useMissions } from "@/hooks/useMissions";
import type { MissionSummary } from "../../../../api-contract/missions.schema";

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  running:   { icon: Circle,       color: "var(--kr-accent-cyan)",      label: "Rodando",   pulse: true  },
  paused:    { icon: PauseCircle,  color: "var(--kr-warning)",          label: "Pausado",   pulse: false },
  draft:     { icon: Clock,        color: "var(--kratos-text-muted)",   label: "Rascunho",  pulse: false },
  completed: { icon: CheckCircle2, color: "var(--kr-success)",          label: "Concluído", pulse: false },
  failed:    { icon: XCircle,      color: "var(--kratos-critical)",     label: "Falhou",    pulse: false },
  cancelled: { icon: XCircle,      color: "var(--kratos-text-muted)",   label: "Cancelado", pulse: false },
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
  } catch {
    return "";
  }
}

// ── MissionRow ─────────────────────────────────────────────────────────────

function MissionRow({ mission }: { mission: MissionSummary }) {
  const cfg = STATUS_CFG[mission.status] ?? STATUS_CFG.draft;
  const Icon = cfg.icon;
  const accentColor = "var(--kr-accent-cyan)";

  return (
    <div
      className="py-2.5 space-y-1.5"
      style={{ borderBottom: "1px solid var(--kratos-border)" }}
    >
      {/* Title + status */}
      <div className="flex items-center gap-2">
        <Icon
          className={`h-3.5 w-3.5 shrink-0 ${cfg.pulse ? "animate-pulse" : ""}`}
          style={{ color: cfg.color }}
          aria-label={cfg.label}
        />
        <span
          className="text-[12px] font-medium flex-1 min-w-0 truncate"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {mission.title}
        </span>
        <span
          className="text-[9px] kratos-mono shrink-0 px-1.5 py-0.5 rounded uppercase tracking-wider"
          style={{
            background: `color-mix(in oklab, ${cfg.color} 12%, transparent)`,
            color: cfg.color,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Current step */}
      {mission.current_step && (
        <div className="flex items-center gap-1.5 ml-5">
          <div
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: accentColor }}
          />
          <span className="text-[11px] kratos-mono" style={{ color: accentColor }}>
            {mission.current_step}
          </span>
        </div>
      )}

      {/* Last event */}
      {mission.last_event_label && (
        <div className="flex items-center gap-1.5 ml-5">
          <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
            {mission.last_event_label}
          </span>
          {mission.last_event_at && (
            <span className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
              · {relativeTime(mission.last_event_at)}
            </span>
          )}
        </div>
      )}

      {/* W3 — Checkpoint: onde parou / retomável */}
      {mission.checkpoint_id && mission.checkpoint_label && (
        <div
          className="flex items-start gap-1.5 ml-5 px-1.5 py-1 rounded"
          style={{ background: "color-mix(in oklab, var(--kr-success) 6%, transparent)" }}
        >
          <Play className="h-2.5 w-2.5 shrink-0 mt-0.5" style={{ color: "var(--kr-success)" }} />
          <div className="min-w-0">
            <span className="text-[10px] leading-tight block" style={{ color: "var(--kr-success)" }}>
              {mission.checkpoint_label}
            </span>
            {mission.checkpoint_pause_reason && (
              <span className="text-[9px] kratos-mono block" style={{ color: "var(--kratos-text-muted)" }}>
                pausado: {mission.checkpoint_pause_reason}
              </span>
            )}
            {mission.checkpoint_at && (
              <span className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                salvo {relativeTime(mission.checkpoint_at)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Badges row: retry + checkpoint + cost */}
      <div className="flex items-center gap-2 ml-5 flex-wrap">
        {mission.retry_count > 0 && (
          <span
            className="flex items-center gap-1 text-[9px] kratos-mono px-1 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kr-warning) 10%, transparent)",
              color: "var(--kr-warning)",
            }}
            title={mission.last_retry_node ? `nó: ${mission.last_retry_node}` : undefined}
          >
            <RotateCcw className="h-2.5 w-2.5" />
            tentativa {mission.retry_count}/{mission.max_retries ?? 3}
          </span>
        )}
        {mission.checkpoint_id && (
          <span
            className="flex items-center gap-1 text-[9px] kratos-mono px-1 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kr-success) 10%, transparent)",
              color: "var(--kr-success)",
            }}
            title={mission.checkpoint_label ?? undefined}
          >
            <Save className="h-2.5 w-2.5" />
            retomável
          </span>
        )}
        {mission.cumulative_cost_usd > 0 && (
          <span className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
            ${mission.cumulative_cost_usd.toFixed(4)}
          </span>
        )}
        {mission.error_count > 0 && (
          <span
            className="text-[9px] kratos-mono px-1 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kratos-critical) 10%, transparent)",
              color: "var(--kratos-critical)",
            }}
          >
            {mission.error_count} erro{mission.error_count > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

export function MissionGraphCard() {
  const { missions, isLoading } = useMissions(10);

  const accentColor = "var(--kr-accent-cyan)";

  if (isLoading) {
    return (
      <GlassPanel padding="md" className="animate-pulse space-y-2">
        <div className="h-3 w-36 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-full rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-2/3 rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  if (!missions.length) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Nenhuma missão registrada — aguardando OMNIS iniciar
          </span>
        </div>
      </GlassPanel>
    );
  }

  const runningCount = missions.filter((m) => m.status === "running").length;

  return (
    <GlassPanel padding="md" className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Mission Graph
        </span>
        {runningCount > 0 && (
          <span
            className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded animate-pulse"
            style={{
              background: `color-mix(in oklab, ${accentColor} 12%, transparent)`,
              color: accentColor,
            }}
          >
            {runningCount} ativo{runningCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Mission list */}
      <div>
        {missions.map((m) => (
          <MissionRow key={m.mission_id} mission={m} />
        ))}
      </div>
    </GlassPanel>
  );
}
