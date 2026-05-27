import { Play, Clock, AlertTriangle, ChevronUp, Minus, ChevronDown } from "lucide-react";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import type { DataSource } from "../../../../api-contract/source-badge.schema";
import type { MissionLensData } from "@/hooks/useMissionLens";

type Priority = "critical" | "high" | "medium" | "low";

interface Props {
  action?: MissionLensData["next_best_action"];
  sourceType: DataSource;
  updatedAt?: string | null;
  onStart?: () => void;
}

const PRIORITY_CONFIG: Record<Priority, { color: string; icon: typeof ChevronUp; label: string }> = {
  critical: { color: "var(--kratos-critical)", icon: AlertTriangle, label: "Crítico" },
  high:     { color: "var(--kratos-warn)",     icon: ChevronUp,     label: "Alto" },
  medium:   { color: "var(--kratos-info)",     icon: Minus,         label: "Médio" },
  low:      { color: "var(--kratos-text-muted)", icon: ChevronDown, label: "Baixo" },
};

function scoreToPriority(score?: number): Priority {
  if (!score) return "medium";
  if (score >= 0.9) return "critical";
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}

function makeSourceMeta(sourceType: DataSource, updatedAt?: string | null) {
  return {
    source: sourceType,
    stale: sourceType === "stale",
    updated_at: updatedAt ?? new Date().toISOString(),
    errors: sourceType === "error" ? ["Falha ao carregar próxima ação"] : [],
  };
}

export function NextActionBlock({ action, sourceType, updatedAt, onStart }: Props) {
  if (sourceType === "error") {
    return (
      <div
        className="relative rounded-xl p-5"
        style={{
          background: "var(--kratos-surface-2)",
          border: "1px solid var(--kratos-border)",
        }}
      >
        <ErrorState
          title="Próxima ação indisponível"
          description="Não foi possível conectar ao sistema. Verifique se o backend está rodando."
          variant="external_unavailable"
        />
      </div>
    );
  }

  const priority = scoreToPriority(action?.score);
  const cfg = PRIORITY_CONFIG[priority];
  const PriorityIcon = cfg.icon;
  const actionText = action?.action ?? "Nenhuma ação definida";
  const rationale = action?.rationale;

  return (
    <div
      className="relative rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--kratos-surface-2)",
        border: `1px solid ${sourceType === "mock" ? "rgba(124,58,237,0.3)" : "var(--kratos-border-live)"}`,
      }}
    >
      {/* Banner MOCK */}
      {sourceType === "mock" && (
        <div
          className="rounded-md px-3 py-1.5 text-[11px] font-medium text-center"
          style={{
            background: "color-mix(in oklab, #7c3aed 15%, transparent)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
          }}
        >
          DEMONSTRAÇÃO
        </div>
      )}

      {/* Header: label + SourceBadge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Próxima ação
        </span>
        <SourceBadgeIndicator meta={makeSourceMeta(sourceType, updatedAt)} size="sm" />
      </div>

      {/* Texto principal — destaque máximo */}
      <div
        className="text-xl font-bold leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {actionText}
      </div>

      {/* Rationale */}
      {rationale && (
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {rationale}
        </p>
      )}

      {/* Footer: priority + tempo + botão */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Priority badge */}
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: `color-mix(in oklab, ${cfg.color} 12%, transparent)`,
            border: `1px solid color-mix(in oklab, ${cfg.color} 30%, transparent)`,
            color: cfg.color,
          }}
        >
          <PriorityIcon className="h-3 w-3" aria-hidden />
          {cfg.label}
        </span>

        {/* Tempo estimado — derivado do score */}
        <span
          className="inline-flex items-center gap-1 text-[11px]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          <Clock className="h-3 w-3" aria-hidden />
          {action?.score ? `~${Math.round((1 - action.score) * 60 + 5)} min` : "~30 min"}
        </span>

        {/* Botão Iniciar */}
        <button
          type="button"
          onClick={onStart}
          className="ml-auto inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold kratos-focus-ring"
          style={{
            background: "var(--kratos-accent)",
            color: "var(--kratos-text-primary)",
            boxShadow: "0 0 8px color-mix(in oklab, var(--kratos-accent) 40%, transparent)",
          }}
        >
          <Play className="h-3.5 w-3.5" aria-hidden />
          Iniciar
        </button>
      </div>
    </div>
  );
}
