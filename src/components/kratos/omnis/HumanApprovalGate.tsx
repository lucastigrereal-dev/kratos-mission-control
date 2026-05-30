/**
 * HumanApprovalGate — W19-B07
 *
 * Gate visual de aprovação humana.
 * Lucas deve marcar todos os itens da checklist antes de poder aprovar.
 * Risco alto/crítico mostra banner vermelho explícito.
 * Nenhum botão "Aprovar" aparece até o checklist estar completo.
 */
import { useState } from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldX, CheckSquare, Square, XCircle } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import type { HumanApprovalGate as HumanApprovalGateType } from "../../../../api-contract/omnis-write-bridge.schema";

const RISK_COLORS: Record<HumanApprovalGateType["risk_level"], string> = {
  low: "var(--kratos-ok)",
  medium: "var(--kratos-warn)",
  high: "var(--kratos-critical)",
  critical: "var(--kratos-critical)",
};

const RISK_LABELS: Record<HumanApprovalGateType["risk_level"], string> = {
  low: "Risco Baixo",
  medium: "Risco Médio",
  high: "Risco Alto",
  critical: "RISCO CRÍTICO",
};

interface HumanApprovalGateProps {
  gate: HumanApprovalGateType;
  onApprove: (checkedIds: string[]) => void;
  onReject: () => void;
  validationError?: string | null;
}

export function HumanApprovalGate({
  gate,
  onApprove,
  onReject,
  validationError,
}: HumanApprovalGateProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const riskColor = RISK_COLORS[gate.risk_level];
  const riskLabel = RISK_LABELS[gate.risk_level];
  const isCritical = gate.risk_level === "critical" || gate.risk_level === "high";
  const requiredIds = gate.checklist.filter((c) => c.required).map((c) => c.id);
  const allChecked = requiredIds.every((id) => checkedIds.includes(id));

  const RiskIcon = isCritical ? ShieldAlert : gate.risk_level === "medium" ? AlertTriangle : ShieldCheck;

  function toggleItem(id: string) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <GlassPanel padding="md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${riskColor} 15%, transparent)`,
            boxShadow: `0 0 16px color-mix(in srgb, ${riskColor} 25%, transparent)`,
          }}
        >
          <RiskIcon className="h-5 w-5" style={{ color: riskColor }} aria-hidden />
        </div>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            Gate de Aprovação Humana
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ color: riskColor }}
          >
            {riskLabel}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{
              background: "color-mix(in srgb, var(--kr-island-omnis) 12%, transparent)",
              color: "var(--kr-island-omnis)",
              border: "1px solid color-mix(in srgb, var(--kr-island-omnis) 20%, transparent)",
            }}
          >
            DRY-RUN
          </span>
        </div>
      </div>

      {/* Critical warning */}
      {isCritical && (
        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2.5 mb-4 text-[11px]"
          style={{
            background: "color-mix(in srgb, var(--kratos-critical) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--kratos-critical) 20%, transparent)",
          }}
        >
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--kratos-critical)" }} aria-hidden />
          <div style={{ color: "var(--kratos-critical)" }}>
            <p className="font-semibold mb-1">Ação de alto risco detectada</p>
            <ul className="list-disc list-inside space-y-0.5 opacity-90">
              {gate.risk_reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Command summary */}
      <div
        className="rounded-lg px-3 py-2.5 mb-4"
        style={{
          background: "color-mix(in srgb, var(--kratos-surface-3) 60%, transparent)",
          border: "1px solid color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)",
        }}
      >
        <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--kratos-text-muted)" }}>
          Comando a executar
        </p>
        <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
          {gate.command_summary}
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--kratos-text-muted)" }}>
          Confirmações obrigatórias
        </p>
        {gate.checklist.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex items-start gap-2 w-full rounded-lg px-3 py-2 transition-colors text-left"
              style={{
                background: isChecked
                  ? "color-mix(in srgb, var(--kratos-ok) 8%, transparent)"
                  : "color-mix(in srgb, var(--kratos-surface-3) 40%, transparent)",
                border: `1px solid ${isChecked
                  ? "color-mix(in srgb, var(--kratos-ok) 20%, transparent)"
                  : "color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)"}`,
              }}
            >
              {isChecked ? (
                <CheckSquare className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--kratos-ok)" }} aria-hidden />
              ) : (
                <Square className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
              )}
              <span
                className="text-[12px]"
                style={{ color: isChecked ? "var(--kratos-text-primary)" : "var(--kratos-text-secondary)" }}
              >
                {item.label}
                {item.required && (
                  <span className="ml-1 text-[9px]" style={{ color: "var(--kratos-critical)" }}>*</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="text-[11px] mb-3" style={{ color: "var(--kratos-critical)" }}>
          {validationError}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onApprove(checkedIds)}
          disabled={!allChecked}
          className="flex-1 rounded-lg px-4 py-2.5 text-[12px] font-semibold transition-all"
          style={{
            background: allChecked
              ? "color-mix(in srgb, var(--kr-island-omnis) 20%, transparent)"
              : "color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)",
            color: allChecked ? "var(--kr-island-omnis)" : "var(--kratos-text-muted)",
            border: `1px solid ${allChecked
              ? "color-mix(in srgb, var(--kr-island-omnis) 30%, transparent)"
              : "color-mix(in srgb, var(--kratos-text-muted) 12%, transparent)"}`,
            cursor: allChecked ? "pointer" : "not-allowed",
            opacity: allChecked ? 1 : 0.5,
          }}
        >
          <ShieldCheck className="h-3.5 w-3.5 inline mr-1.5" aria-hidden />
          Aprovar (Dry-Run)
        </button>
        <button
          type="button"
          onClick={onReject}
          className="rounded-lg px-4 py-2.5 text-[12px] font-semibold transition-colors"
          style={{
            background: "color-mix(in srgb, var(--kratos-critical) 8%, transparent)",
            color: "var(--kratos-critical)",
            border: "1px solid color-mix(in srgb, var(--kratos-critical) 20%, transparent)",
          }}
        >
          <XCircle className="h-3.5 w-3.5 inline mr-1" aria-hidden />
          Cancelar
        </button>
      </div>

      <p className="text-[9px] mt-2 text-center" style={{ color: "var(--kratos-text-muted)" }}>
        Este gate é obrigatório antes de qualquer execução • Modo: DRY-RUN (sem efeito real)
      </p>
    </GlassPanel>
  );
}
