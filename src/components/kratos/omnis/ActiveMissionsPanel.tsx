/**
 * ActiveMissionsPanel — W4
 * Exibe missões ativas do OMNIS de forma compacta no Dashboard.
 * Leitura apenas — KRATOS não comanda o OMNIS.
 *
 * Mostra: máximo 3 missões (running + paused).
 * Guardrail alerts (budget_exceeded / approval_pending) aparecem como badges.
 * Oculto quando não há missões e não está carregando.
 */

import { Circle, PauseCircle, ShieldAlert, BadgeDollarSign } from "lucide-react";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import type { MissionSummary } from "../../../../api-contract/missions.schema";
import type { DataSource } from "../../../../api-contract/source-badge.schema";

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min  = Math.floor(diff / 60_000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}m atrás`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h atrás`;
    return `${Math.floor(hr / 24)}d atrás`;
  } catch {
    return "";
  }
}

// ── MissionRow ────────────────────────────────────────────────────────────────

function MissionRow({ m }: { m: MissionSummary }) {
  const isRunning = m.status === "running";
  const dotColor  = isRunning ? "var(--kratos-ok)" : "var(--kratos-warn)";
  const Icon      = isRunning ? Circle : PauseCircle;

  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon
        className={`h-3 w-3 shrink-0 mt-0.5 ${isRunning ? "animate-pulse" : ""}`}
        style={{ color: dotColor }}
        aria-label={m.status}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[11px] font-medium truncate"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {m.title}
          </span>

          {m.budget_exceeded && (
            <span
              className="inline-flex items-center gap-0.5 text-[9px] kratos-mono rounded-full px-1.5 py-0 border"
              style={{
                color:      "var(--kratos-critical)",
                borderColor: "var(--kratos-critical)",
                background:  "color-mix(in oklab, var(--kratos-critical) 8%, transparent)",
              }}
              title="Orçamento excedido"
            >
              <BadgeDollarSign className="h-2.5 w-2.5" />
              budget
            </span>
          )}

          {m.approval_pending && (
            <span
              className="inline-flex items-center gap-0.5 text-[9px] kratos-mono rounded-full px-1.5 py-0 border"
              style={{
                color:      "var(--kratos-warn)",
                borderColor: "var(--kratos-warn)",
                background:  "color-mix(in oklab, var(--kratos-warn) 8%, transparent)",
              }}
              title={m.approval_reason ?? "Aprovação pendente"}
            >
              <ShieldAlert className="h-2.5 w-2.5" />
              aprovação
            </span>
          )}
        </div>

        {m.current_step && (
          <div
            className="text-[10px] kratos-mono truncate"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {m.current_step}
            {m.last_event_at && (
              <span className="ml-1 opacity-60">· {relativeTime(m.last_event_at)}</span>
            )}
          </div>
        )}
      </div>

      {m.cumulative_cost_usd > 0 && (
        <span
          className="shrink-0 text-[9px] kratos-mono"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          ${m.cumulative_cost_usd.toFixed(4)}
        </span>
      )}
    </div>
  );
}

// ── ActiveMissionsPanel (export) ──────────────────────────────────────────────

export interface ActiveMissionsPanelProps {
  missions:   MissionSummary[];
  sourceType: DataSource;
  isLoading?: boolean;
}

export function ActiveMissionsPanel({
  missions,
  sourceType,
  isLoading = false,
}: ActiveMissionsPanelProps) {
  const active = missions
    .filter((m) => m.status === "running" || m.status === "paused")
    .slice(0, 3);

  const sourceMeta = {
    source:     sourceType,
    stale:      sourceType === "stale" || sourceType === "cache",
    updated_at: new Date().toISOString(),
    errors:     sourceType === "error" ? ["Missões indisponíveis"] : [],
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--kratos-surface-2)",
        border:     "1px solid var(--kratos-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          OMNIS · Missões ativas
        </span>
        <SourceBadgeIndicator meta={sourceMeta} size="sm" />
      </div>

      {/* Body */}
      {isLoading ? (
        <LoadingState lines={2} compact />
      ) : active.length === 0 ? (
        <div
          className="text-[11px]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Nenhuma missão em execução agora.
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--kratos-border)" }}>
          {active.map((m) => (
            <MissionRow key={m.mission_id} m={m} />
          ))}
        </div>
      )}

      {/* Footer: total count when more than 3 */}
      {missions.length > 3 && !isLoading && (
        <div
          className="mt-2 text-[10px] kratos-mono"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          +{missions.length - 3} outras missões
        </div>
      )}
    </div>
  );
}
