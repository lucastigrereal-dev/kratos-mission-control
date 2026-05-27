import { Activity } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useOmnisHealthScore } from "@/hooks/useOmnisHealthScore";
import type { OmnisHealthCheck } from "../../../../api-contract/omnis-health.schema";

// ── Cor semântica por score ────────────────────────────────────────────────

const COLOR_MAP = {
  green:  { fg: "var(--kr-success)",   bg: "color-mix(in oklab, var(--kr-success)   12%, transparent)", label: "Saudável" },
  yellow: { fg: "var(--kr-warning)",   bg: "color-mix(in oklab, var(--kr-warning)   12%, transparent)", label: "Atenção"  },
  red:    { fg: "var(--kratos-critical)", bg: "color-mix(in oklab, var(--kratos-critical) 12%, transparent)", label: "Crítico" },
} as const;

// ── Barra de progresso do score ────────────────────────────────────────────

function ScoreBar({ score, color }: { score: number; color: keyof typeof COLOR_MAP }) {
  const { fg, bg } = COLOR_MAP[color] ?? COLOR_MAP.yellow;
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: fg, boxShadow: `0 0 6px ${bg}` }}
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Health score: ${score}/100`}
      />
    </div>
  );
}

// ── Check individual ──────────────────────────────────────────────────────

function CheckRow({ check }: { check: OmnisHealthCheck }) {
  const statusColor =
    check.status === "ok"   ? "var(--kr-success)"      :
    check.status === "warn" ? "var(--kr-warning)"      :
    check.status === "fail" ? "var(--kratos-critical)" :
    "var(--kratos-text-muted)";

  const dot = check.status === "ok" ? "●" : check.status === "fail" ? "✕" : "◉";

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="shrink-0" style={{ color: statusColor }} aria-hidden>{dot}</span>
      <span className="flex-1 truncate" style={{ color: "var(--kratos-text-secondary)" }}>
        {check.name}
      </span>
      <span className="kratos-mono shrink-0" style={{ color: statusColor }}>
        {check.score}/{check.max_score}
      </span>
    </div>
  );
}

// ── Card principal ────────────────────────────────────────────────────────

export function HealthScoreCard() {
  const { healthScore, isLoading } = useOmnisHealthScore();

  if (isLoading) {
    return (
      <GlassPanel padding="md" className="animate-pulse space-y-2">
        <div className="h-3 w-32 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-6 w-16 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-1.5 w-full rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  if (!healthScore) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Health score indisponível — aguardando OMNIS executar health check
          </span>
        </div>
      </GlassPanel>
    );
  }

  const colorKey = (healthScore.color ?? "yellow") as keyof typeof COLOR_MAP;
  const { fg, bg, label } = COLOR_MAP[colorKey] ?? COLOR_MAP.yellow;

  return (
    <GlassPanel padding="md" className="space-y-3">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 shrink-0" style={{ color: fg }} />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Health Score OMNIS
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded"
          style={{ background: bg, color: fg }}
        >
          {label}
        </span>
      </div>

      {/* ── Score em destaque ── */}
      <div className="flex items-end gap-1.5">
        <span className="text-[36px] font-black kratos-mono leading-none" style={{ color: fg }}>
          {healthScore.score}
        </span>
        <span className="text-[14px] font-medium mb-1" style={{ color: "var(--kratos-text-muted)" }}>
          /100
        </span>
      </div>

      {/* ── Barra ── */}
      <ScoreBar score={healthScore.score} color={colorKey} />

      {/* ── Checks — só mostra se vieram no payload ── */}
      {healthScore.checks.length > 0 && (
        <div className="space-y-1.5 pt-1" style={{ borderTop: "1px solid var(--kratos-border)" }}>
          {healthScore.checks.map((c) => (
            <CheckRow key={c.name} check={c} />
          ))}
        </div>
      )}

      {/* ── Timestamp ── */}
      {healthScore.generated_at && (
        <p className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
          {healthScore.generated_at.slice(0, 16).replace("T", " ")}
        </p>
      )}
    </GlassPanel>
  );
}
