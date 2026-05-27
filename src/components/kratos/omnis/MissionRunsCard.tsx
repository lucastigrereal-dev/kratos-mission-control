import { Terminal, CheckCircle2, XCircle, Clock } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useOmnisRuns } from "@/hooks/useOmnisRuns";
import type { MissionRun } from "../../../../api-contract/omnis-runs.schema";

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60_000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}m atrás`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h atrás`;
    return `${Math.floor(hr / 24)}d atrás`;
  } catch {
    return "";
  }
}

const STATUS_CFG = {
  success: { icon: CheckCircle2, color: "var(--kr-success)",        label: "OK"      },
  error:   { icon: XCircle,      color: "var(--kratos-critical)",   label: "Erro"    },
  running: { icon: Clock,        color: "var(--kr-warning)",        label: "Rodando" },
  pending: { icon: Clock,        color: "var(--kratos-text-muted)", label: "Pendente"},
} as const;

// ── Row ────────────────────────────────────────────────────────────────────

function RunRow({ run }: { run: MissionRun }) {
  const cfg = STATUS_CFG[run.status] ?? STATUS_CFG.pending;
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-2.5 py-1.5" style={{ borderBottom: "1px solid var(--kratos-border)" }}>
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} aria-label={cfg.label} />
      <div className="flex-1 min-w-0">
        <span className="text-[12px] font-medium truncate block" style={{ color: "var(--kratos-text-primary)" }}>
          {run.command}
        </span>
        {run.module && (
          <span className="text-[10px] kratos-mono truncate block" style={{ color: "var(--kratos-text-muted)" }}>
            {run.module}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <span className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
          {relativeTime(run.started_at)}
        </span>
        {run.duration_ms !== undefined && (
          <span className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
            {run.duration_ms}ms
          </span>
        )}
      </div>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

export function MissionRunsCard() {
  const { runs, isLoading } = useOmnisRuns(5);

  if (isLoading) {
    return (
      <GlassPanel padding="md" className="animate-pulse space-y-2">
        <div className="h-3 w-32 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-full rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-3/4 rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  if (!runs.length) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Nenhum run registrado — aguardando OMNIS executar uma missão
          </span>
        </div>
      </GlassPanel>
    );
  }

  const successCount = runs.filter((r) => r.status === "success").length;
  const accentColor = "var(--kr-accent-cyan)";

  return (
    <GlassPanel padding="md" className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Mission Runs
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded"
          style={{
            background: `color-mix(in oklab, ${accentColor} 12%, transparent)`,
            color: accentColor,
          }}
        >
          {successCount}/{runs.length} OK
        </span>
      </div>

      {/* Run list */}
      <div>
        {runs.map((run) => (
          <RunRow key={run.run_id} run={run} />
        ))}
      </div>
    </GlassPanel>
  );
}
