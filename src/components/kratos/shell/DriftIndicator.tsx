import { RotateCcw } from "lucide-react";
import type { DriftState } from "@/hooks/useDriftDetection";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import type { DataSource } from "../../../../api-contract/source-badge.schema";

interface Props {
  driftState: DriftState;
  minutesOff: number;
  nudgeMessage: string;
  originalMission?: string;
  onResume?: () => void;
  sourceType?: DataSource;
}

const DRIFT_COLOR: Record<DriftState, string> = {
  "on-mission": "var(--kratos-ok)",
  "drifting":   "var(--kratos-warn)",
  "lost":       "#f97316",
  "zombie":     "var(--kratos-critical)",
};

function barWidth(minutesOff: number): string {
  return `${Math.min(100, (minutesOff / 45) * 100)}%`;
}

export function DriftIndicator({ driftState, minutesOff, nudgeMessage, originalMission, onResume, sourceType }: Props) {
  if (driftState === "on-mission") return null;

  const color = DRIFT_COLOR[driftState];
  const message = nudgeMessage || `Saiu da missão há ${minutesOff}min.`;

  return (
    <div
      className="w-full flex flex-col gap-1"
      style={{ transition: "all 200ms ease" }}
      role="status"
      aria-live="polite"
      aria-label={`Deriva detectada: ${message}`}
    >
      <div
        className="h-0.5 w-full rounded-full overflow-hidden"
        style={{ background: "var(--kratos-surface-3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: barWidth(minutesOff),
            background: color,
            boxShadow: `0 0 6px color-mix(in oklab, ${color} 50%, transparent)`,
          }}
        />
      </div>

      <div
        className="flex items-center justify-between gap-3 px-1 py-1"
        style={{
          background: `color-mix(in oklab, ${color} 6%, transparent)`,
          borderBottom: `1px solid color-mix(in oklab, ${color} 20%, transparent)`,
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
            style={{ background: color }}
            aria-hidden
          />
          <span
            className="text-[11px] truncate"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {message}
          </span>
          {originalMission && (
            <span
              className="text-[10px] truncate hidden sm:inline"
              style={{ color: "var(--kratos-text-muted)", fontFamily: "var(--kratos-font-mono, monospace)" }}
            >
              · {originalMission}
            </span>
          )}
        </div>

        {sourceType && (
          <SourceBadgeIndicator
            meta={{
              source: sourceType,
              origin: "drift",
              errors: [],
              stale: sourceType === "error" || sourceType === "stale",
              updated_at: new Date().toISOString(),
              confidence: sourceType === "live" ? 95 : 60,
            }}
            size="sm"
          />
        )}
        {onResume && (
          <button
            type="button"
            onClick={onResume}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              background: `color-mix(in oklab, ${color} 12%, transparent)`,
              border: `1px solid color-mix(in oklab, ${color} 30%, transparent)`,
              color,
            }}
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Retomar missão
          </button>
        )}
      </div>
    </div>
  );
}
