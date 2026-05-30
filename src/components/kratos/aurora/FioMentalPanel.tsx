/**
 * FioMentalPanel — W3-B4
 *
 * Shows the "fio mental" — what OMNIS is actively running right now.
 * Read-only. Driven by useMissions(). Placed inside AuroraPanelContent.
 *
 * Boundary: KRATOS lê / Aurora comanda — zero command buttons here.
 */
import { Brain, Circle, PauseCircle, CheckCircle2 } from "lucide-react";
import { useMissions } from "@/hooks/useMissions";
import type { MissionSummary } from "../../../../api-contract/missions.schema";

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60_000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    return `${hr}h`;
  } catch {
    return "";
  }
}

type StatusVis = { icon: React.ElementType; color: string; pulse: boolean };

function statusVis(status: MissionSummary["status"]): StatusVis {
  switch (status) {
    case "running":
      return { icon: Circle, color: "var(--kr-accent-cyan)", pulse: true };
    case "paused":
      return { icon: PauseCircle, color: "var(--kratos-warn)", pulse: false };
    case "completed":
      return { icon: CheckCircle2, color: "var(--kratos-ok)", pulse: false };
    default:
      return { icon: Circle, color: "var(--kratos-text-muted)", pulse: false };
  }
}

// ── Mission thread row ─────────────────────────────────────────────────────

function MissionThread({ mission }: { mission: MissionSummary }) {
  const vis = statusVis(mission.status);
  const Icon = vis.icon;
  const when = relativeTime(mission.last_event_at);

  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon
        className={`h-2.5 w-2.5 shrink-0 mt-1 ${vis.pulse ? "animate-pulse" : ""}`}
        style={{ color: vis.color }}
        aria-label={mission.status}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-medium leading-tight truncate"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {mission.title}
        </p>
        {mission.current_step ? (
          <p
            className="text-[10px] kratos-mono truncate"
            style={{ color: vis.color, opacity: 0.85 }}
          >
            {mission.current_step}
          </p>
        ) : mission.last_event_label ? (
          <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
            {mission.last_event_label}
            {when ? ` · ${when}` : ""}
          </p>
        ) : null}
      </div>
      {/* Guardrail badges */}
      {mission.budget_exceeded && (
        <span
          className="shrink-0 text-[8px] font-bold uppercase kratos-mono px-1 py-0.5 rounded"
          style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
        >
          $
        </span>
      )}
      {mission.approval_pending && (
        <span
          className="shrink-0 text-[8px] font-bold uppercase kratos-mono px-1 py-0.5 rounded"
          style={{ background: "rgba(251,191,36,0.15)", color: "#F59E0B" }}
        >
          ⏳
        </span>
      )}
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────────────

export function FioMentalPanel() {
  const { missions, isLoading } = useMissions(5);

  // Only show running + paused missions in the fio mental
  const active = missions.filter(
    (m) => m.status === "running" || m.status === "paused",
  );

  // Don't render the panel at all if loading with no prior data
  if (isLoading && active.length === 0) return null;

  return (
    <div
      className="rounded-xl px-3 pt-2.5 pb-2"
      style={{
        background: "rgba(6,81,180,0.07)",
        border: "1px solid rgba(6,81,180,0.18)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <Brain
          className="h-3 w-3 shrink-0"
          style={{ color: "var(--kr-accent-cyan)" }}
          aria-hidden
        />
        <span
          className="text-[9px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "var(--kr-accent-cyan)" }}
        >
          Fio Mental · OMNIS
        </span>
        {active.length > 0 && (
          <span
            className="ml-auto text-[9px] kratos-mono animate-pulse"
            style={{ color: "var(--kr-accent-cyan)" }}
          >
            {active.length} ativo{active.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Thread list */}
      {active.length === 0 ? (
        <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
          Nenhuma missão ativa — OMNIS em standby.
        </p>
      ) : (
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {active.map((m) => (
            <MissionThread key={m.mission_id} mission={m} />
          ))}
        </div>
      )}
    </div>
  );
}
