import { ShieldAlert, DollarSign, Clock } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useMissions } from "@/hooks/useMissions";
import type { MissionSummary } from "../../../../api-contract/missions.schema";

// ── Alert items from real mission state ────────────────────────────────────

interface GuardrailAlert {
  type: "budget_exceeded" | "approval_pending";
  missionTitle: string;
  reason?: string | null;
}

function collectAlerts(missions: MissionSummary[]): GuardrailAlert[] {
  const alerts: GuardrailAlert[] = [];
  for (const m of missions) {
    if (m.budget_exceeded) {
      alerts.push({ type: "budget_exceeded", missionTitle: m.title });
    }
    if (m.approval_pending) {
      alerts.push({ type: "approval_pending", missionTitle: m.title, reason: m.approval_reason });
    }
  }
  return alerts;
}

// ── AlertRow ───────────────────────────────────────────────────────────────

function AlertRow({ alert }: { alert: GuardrailAlert }) {
  const isBudget = alert.type === "budget_exceeded";
  const color = isBudget ? "var(--kratos-critical)" : "var(--kr-warning)";
  const Icon = isBudget ? DollarSign : Clock;
  const label = isBudget ? "Budget excedido" : "Aguardando aprovação";

  return (
    <div className="flex items-start gap-2.5 py-1.5" style={{ borderBottom: "1px solid var(--kratos-border)" }}>
      <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color }} />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-medium block" style={{ color: "var(--kratos-text-primary)" }}>
          {label}
        </span>
        <span className="text-[10px] kratos-mono block truncate" style={{ color: "var(--kratos-text-muted)" }}>
          {alert.missionTitle}
          {alert.reason && ` · ${alert.reason}`}
        </span>
      </div>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

export function GuardrailAlertCard() {
  const { missions, isLoading } = useMissions(20);

  if (isLoading) {
    return (
      <GlassPanel padding="md" className="animate-pulse space-y-2">
        <div className="h-3 w-32 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-3/4 rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  const alerts = collectAlerts(missions);

  if (!alerts.length) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" style={{ color: "var(--kr-success)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Sem bloqueios ativos — guardrails limpos
          </span>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel padding="md" className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 shrink-0" style={{ color: "var(--kr-warning)" }} />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Guardrails Ativos
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded"
          style={{
            background: "color-mix(in oklab, var(--kr-warning) 12%, transparent)",
            color: "var(--kr-warning)",
          }}
        >
          {alerts.length} alerta{alerts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Alerts */}
      <div>
        {alerts.map((a, i) => (
          <AlertRow key={`${a.type}-${i}`} alert={a} />
        ))}
      </div>
    </GlassPanel>
  );
}
