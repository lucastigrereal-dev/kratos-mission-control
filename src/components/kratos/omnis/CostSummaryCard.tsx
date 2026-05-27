import { DollarSign } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useMissions } from "@/hooks/useMissions";

export function CostSummaryCard() {
  const { missions, isLoading } = useMissions(20);

  const accentColor = "var(--kr-accent-cyan)";

  if (isLoading) {
    return (
      <GlassPanel padding="md" className="animate-pulse space-y-2">
        <div className="h-3 w-28 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-full rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  if (!missions.length) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Sem missões — custo $0
          </span>
        </div>
      </GlassPanel>
    );
  }

  const totalCostUsd = missions.reduce((sum, m) => sum + (m.cumulative_cost_usd ?? 0), 0);
  const totalTokens = 0; // tokens not tracked at mission level yet
  const isLocal = totalCostUsd === 0;

  return (
    <GlassPanel padding="md" className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Custo por Missão
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded"
          style={{
            background: `color-mix(in oklab, ${accentColor} 10%, transparent)`,
            color: accentColor,
          }}
        >
          {isLocal ? "Ollama local" : `$${totalCostUsd.toFixed(4)}`}
        </span>
      </div>

      {/* Per-mission cost rows */}
      <div className="space-y-0">
        {missions.map((m) => (
          <div
            key={m.mission_id}
            className="flex items-center gap-2 py-1.5"
            style={{ borderBottom: "1px solid var(--kratos-border)" }}
          >
            <span
              className="flex-1 min-w-0 text-[11px] truncate"
              style={{ color: "var(--kratos-text-primary)" }}
            >
              {m.title}
            </span>
            <span className="text-[10px] kratos-mono shrink-0" style={{ color: "var(--kratos-text-muted)" }}>
              {m.cumulative_cost_usd > 0 ? `$${m.cumulative_cost_usd.toFixed(4)}` : "$0"}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between pt-1"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--kratos-text-muted)" }}>
          Total acumulado
        </span>
        <span className="text-[12px] font-semibold kratos-mono" style={{ color: accentColor }}>
          {isLocal ? "$0 — 100% local" : `$${totalCostUsd.toFixed(4)}`}
        </span>
      </div>
      {totalTokens === 0 && (
        <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
          Modelo: Ollama local — sem custo de API
        </p>
      )}
    </GlassPanel>
  );
}
