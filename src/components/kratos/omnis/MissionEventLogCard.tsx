import {
  Play,
  CheckCircle2,
  XCircle,
  PauseCircle,
  RotateCcw,
  Save,
  Zap,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Package,
  ChevronRight,
  Clock,
  ScrollText,
  Circle,
} from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useMissionEvents } from "@/hooks/useMissionEvents";
import type { MissionEvent } from "../../../../api-contract/missions.schema";

// ── Event label map (mirrors backend EVENT_LABELS) ─────────────────────────

const EVENT_LABELS: Record<string, string> = {
  mission_created:    "Criado",
  mission_started:    "Iniciado",
  plan_drafted:       "Planejando",
  plan_approved:      "Plano aprovado",
  mission_planned:    "Planejado",
  step_started:       "Executando step",
  step_completed:     "Step concluído",
  tool_invoked:       "Tool invocada",
  tool_returned:      "Tool retornou",
  skill_invoked:      "Skill invocada",
  skill_returned:     "Skill retornou",
  approval_requested: "Aguardando aprovação",
  approval_granted:   "Aprovado",
  approval_rejected:  "Rejeitado",
  artifact_produced:  "Artefato gerado",
  retry_attempted:    "Tentativa retry",
  budget_exceeded:    "Budget excedido",
  mission_paused:     "Pausado",
  mission_resumed:    "Retomado",
  mission_completed:  "Concluído",
  mission_failed:     "Falhou",
  mission_cancelled:  "Cancelado",
  checkpoint_created: "Checkpoint salvo",
  error_logged:       "Erro registrado",
};

// ── Icon + color config per event family ──────────────────────────────────

type EventCfg = { icon: React.ElementType; color: string };

function getEventCfg(eventType: string): EventCfg {
  switch (eventType) {
    case "mission_created":
    case "mission_started":
    case "mission_resumed":
      return { icon: Play,          color: "var(--kr-accent-cyan)" };

    case "mission_completed":
    case "step_completed":
    case "tool_returned":
    case "skill_returned":
    case "artifact_produced":
    case "plan_approved":
      return { icon: CheckCircle2,  color: "var(--kr-success)" };

    case "mission_failed":
    case "mission_cancelled":
    case "error_logged":
      return { icon: XCircle,       color: "var(--kratos-critical)" };

    case "mission_paused":
      return { icon: PauseCircle,   color: "var(--kr-warning)" };

    case "step_started":
    case "plan_drafted":
    case "mission_planned":
      return { icon: ChevronRight,  color: "rgba(167,139,250,0.9)" };

    case "tool_invoked":
    case "skill_invoked":
      return { icon: Zap,           color: "rgba(167,139,250,0.7)" };

    case "retry_attempted":
      return { icon: RotateCcw,     color: "var(--kr-warning)" };

    case "budget_exceeded":
      return { icon: AlertTriangle, color: "var(--kr-warning)" };

    case "approval_requested":
      return { icon: ShieldAlert,   color: "var(--kr-warning)" };

    case "approval_granted":
      return { icon: ShieldCheck,   color: "var(--kr-success)" };

    case "approval_rejected":
      return { icon: ShieldX,       color: "var(--kratos-critical)" };

    case "checkpoint_created":
      return { icon: Save,          color: "var(--kr-success)" };

    default:
      return { icon: Circle,        color: "var(--kratos-text-muted)" };
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 0) return "agora";
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

/** Extracts a short highlight from event payload (read-only). */
function payloadHighlight(event: MissionEvent): string | null {
  const p = event.payload;
  if (!p) return null;

  // Error events
  const error = p.error ?? p.message ?? p.reason;
  if (typeof error === "string" && error) return error;

  // Step / tool / skill names
  const name =
    p.step_name ?? p.step ?? p.tool_name ?? p.tool ?? p.skill_name ?? p.skill;
  if (typeof name === "string" && name) return name;

  // Node for retry
  if (typeof p.node === "string" && p.node) return `nó: ${p.node}`;

  // Checkpoint label
  if (typeof p.label === "string" && p.label) return p.label;

  // Artifact path/name
  if (typeof p.path === "string" && p.path) return p.path;
  if (typeof p.artifact_name === "string" && p.artifact_name) return p.artifact_name;

  return null;
}

// ── Event Row ──────────────────────────────────────────────────────────────

function EventRow({ event, isLast }: { event: MissionEvent; isLast: boolean }) {
  const cfg = getEventCfg(event.event_type);
  const Icon = cfg.icon;
  const label = EVENT_LABELS[event.event_type] ?? event.event_type;
  const highlight = payloadHighlight(event);

  return (
    <div className="flex gap-2.5 py-2" style={!isLast ? { borderBottom: "1px solid var(--kratos-border)" } : undefined}>
      {/* Timeline connector */}
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <Icon className="h-3 w-3 shrink-0" style={{ color: cfg.color }} aria-label={label} />
        {!isLast && (
          <div
            className="flex-1 w-px min-h-[12px]"
            style={{ background: "rgba(255,255,255,0.07)" }}
            aria-hidden
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {label}
          </span>
          <span
            className="text-[9px] kratos-mono shrink-0 flex items-center gap-0.5"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            <Clock className="h-2.5 w-2.5" aria-hidden />
            {relativeTime(event.timestamp)}
          </span>
        </div>

        {/* Payload highlight */}
        {highlight && (
          <p
            className="text-[10px] kratos-mono mt-0.5 truncate"
            style={{ color: "rgba(255,255,255,0.45)" }}
            title={highlight}
          >
            {highlight}
          </p>
        )}

        {/* Cost */}
        {event.cumulative_cost_usd != null && event.cumulative_cost_usd > 0 && (
          <span
            className="text-[9px] kratos-mono"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            ${event.cumulative_cost_usd.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────

function EventSkeleton() {
  return (
    <GlassPanel padding="md" className="animate-pulse space-y-3">
      <div className="h-3 w-40 rounded" style={{ background: "var(--kratos-surface-4)" }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-2.5">
          <div className="h-3 w-3 rounded-full shrink-0 mt-0.5" style={{ background: "var(--kratos-surface-4)" }} />
          <div className="flex-1 space-y-1">
            <div className="h-2.5 rounded w-3/4" style={{ background: "var(--kratos-surface-4)" }} />
            <div className="h-2 rounded w-1/2" style={{ background: "var(--kratos-surface-4)" }} />
          </div>
          <div className="h-2 w-10 rounded shrink-0" style={{ background: "var(--kratos-surface-4)" }} />
        </div>
      ))}
    </GlassPanel>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

interface MissionEventLogCardProps {
  missionId: string | null;
  limit?: number;
}

export function MissionEventLogCard({ missionId, limit = 12 }: MissionEventLogCardProps) {
  const { eventLog, isLoading, isError } = useMissionEvents(missionId, limit);

  const accentColor = "var(--kr-accent-cyan)";

  // ── No mission selected ──────────────────────────────────────────────────
  if (!missionId) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2 mb-2">
          <ScrollText className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
          <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-muted)" }}>
            Event Log
          </span>
        </div>
        <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          Nenhuma missão ativa detectada — aguardando OMNIS iniciar uma missão.
        </p>
      </GlassPanel>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return <EventSkeleton />;

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !eventLog) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-critical)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Falha ao carregar eventos — backend OMNIS indisponível.
          </span>
        </div>
      </GlassPanel>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (eventLog.data.length === 0) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2 mb-2">
          <ScrollText className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
          <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            Event Log
          </span>
        </div>
        <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          Nenhum evento registrado para esta missão ainda.
        </p>
      </GlassPanel>
    );
  }

  // ── Events ───────────────────────────────────────────────────────────────
  return (
    <GlassPanel padding="md" className="space-y-0">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px solid var(--kratos-border)" }}>
        <ScrollText className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Event Log
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded"
          style={{
            background: `color-mix(in oklab, ${accentColor} 10%, transparent)`,
            color: accentColor,
          }}
        >
          {eventLog.total} total
        </span>
      </div>

      {/* Event rows — most recent first (backend already reversed) */}
      <div className="pt-1">
        {eventLog.data.map((event, i) => (
          <EventRow
            key={`${event.sequence ?? i}-${event.event_type}`}
            event={event}
            isLast={i === eventLog.data.length - 1}
          />
        ))}
      </div>

      {/* Footer: more events indicator */}
      {eventLog.total > eventLog.data.length && (
        <div
          className="pt-2 text-[10px] kratos-mono text-center"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          + {eventLog.total - eventLog.data.length} eventos anteriores
        </div>
      )}
    </GlassPanel>
  );
}
