import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";
import type { DriftState } from "@/hooks/useDriftDetection";
import type { DataSource } from "../../../../api-contract/source-badge.schema";

interface ZombieBadgeProps {
  driftState: DriftState;
  minutesOff: number;
  onResume?: () => void;
  onRetryConnection?: () => void;
  sourceType?: DataSource;
  className?: string;
}

const BADGE_STYLE: Record<
  Exclude<DriftState, "on-mission">,
  {
    color: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  drifting: {
    color: "var(--kratos-warn)",
    bg: "color-mix(in oklab, var(--kratos-warn) 8%, transparent)",
    border: "color-mix(in oklab, var(--kratos-warn) 22%, transparent)",
    label: "Deriva",
  },
  lost: {
    color: "#f97316",
    bg: "color-mix(in oklab, #f97316 8%, transparent)",
    border: "color-mix(in oklab, #f97316 22%, transparent)",
    label: "Perdido",
  },
  zombie: {
    color: "var(--kratos-critical)",
    bg: "color-mix(in oklab, var(--kratos-critical) 10%, transparent)",
    border: "color-mix(in oklab, var(--kratos-critical) 30%, transparent)",
    label: "ZOMBIE",
  },
};

export function ZombieBadge({
  driftState,
  minutesOff,
  onResume,
  onRetryConnection,
  sourceType,
  className = "",
}: ZombieBadgeProps) {
  if (driftState === "on-mission") return null;

  const style = BADGE_STYLE[driftState];
  const isZombie = driftState === "zombie";
  const isLost = driftState === "lost";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${style.label} · ${minutesOff} minutos fora da missão`}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium ${className}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        ...(isZombie
          ? {
              animation: "var(--kr-duration-slow) kratos-pulse 2s ease-in-out infinite",
            }
          : {}),
      }}
    >
      {/* Ícone ou dot */}
      {isLost ? (
        <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden />
      ) : (
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full shrink-0 ${isZombie ? "kratos-pulse" : ""}`}
          style={{ background: style.color }}
          aria-hidden
        />
      )}

      {/* Label + minutos */}
      <span className="kratos-mono">
        {style.label} · {minutesOff}min
      </span>

      {/* Botão Reconectar (quando sourceType === error) */}
      {onRetryConnection && sourceType === "error" && (
        <button
          type="button"
          onClick={onRetryConnection}
          className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] kratos-mono kratos-focus-ring transition-colors"
          style={{
            background: "color-mix(in oklab, var(--kratos-critical) 16%, transparent)",
            border: `1px solid color-mix(in oklab, var(--kratos-critical) 36%, transparent)`,
            color: "var(--kratos-critical)",
          }}
        >
          <RefreshCw className="h-2.5 w-2.5" aria-hidden />
          Reconectar
        </button>
      )}

      {/* Botão Retomar (zombie only) */}
      {isZombie && onResume && (
        <button
          type="button"
          onClick={onResume}
          className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] kratos-mono kratos-focus-ring transition-colors"
          style={{
            background: "color-mix(in oklab, var(--kratos-critical) 16%, transparent)",
            border: `1px solid color-mix(in oklab, var(--kratos-critical) 36%, transparent)`,
            color: "var(--kratos-critical)",
          }}
        >
          <RotateCcw className="h-2.5 w-2.5" aria-hidden />
          Retomar
        </button>
      )}
    </div>
  );
}
