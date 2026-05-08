import { Activity } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export type ScoreMetric = {
  label: string;
  value: number; // 0..100
  tone: "ok" | "warn" | "critical" | "info";
};

type Props = { metrics: ScoreMetric[] };

const TONE: Record<ScoreMetric["tone"], string> = {
  ok: "var(--kratos-ok)",
  warn: "var(--kratos-warn)",
  critical: "var(--kratos-critical)",
  info: "var(--kratos-info)",
};

export function ExecutionScoreCard({ metrics }: Props) {
  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Estado do dia
        </span>
      </div>

      <ul className="space-y-3">
        {metrics.map((m) => (
          <li key={m.label}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-[11px] uppercase tracking-[0.12em] kratos-mono"
                style={{ color: "var(--kratos-text-secondary)" }}
              >
                {m.label}
              </span>
              <span
                className="text-[11px] kratos-mono"
                style={{ color: TONE[m.tone] }}
              >
                {m.value}
              </span>
            </div>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: "var(--kratos-surface-3)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(0, Math.min(100, m.value))}%`,
                  background: TONE[m.tone],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StatusCard>
  );
}
