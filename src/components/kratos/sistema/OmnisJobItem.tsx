import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import { timeAgo } from "@/lib/utils";
import type { OmnisJob } from "../../../../api-contract/omnis.schema";

const JOB_SEVERITY: Record<OmnisJob["status"], "ok" | "warn" | "critical" | "info"> = {
  done: "ok",
  running: "warn",
  queued: "warn",
  failed: "critical",
  needs_review: "info",
};

const JOB_LABELS: Record<OmnisJob["status"], string> = {
  queued: "NA FILA",
  running: "EXECUTANDO",
  done: "CONCLUIDO",
  failed: "FALHOU",
  needs_review: "REVISAO",
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

interface Props {
  job: OmnisJob;
}

export function OmnisJobItem({ job }: Props) {
  const severity = JOB_SEVERITY[job.status];

  return (
    <StatusCard accent="none">
      <div className="flex items-center gap-3">
        <span
          className="text-[11px] kratos-mono shrink-0 w-[68px]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {job.id.slice(0, 8)}
        </span>
        <span className="kratos-chip text-[10px]">{job.tipo}</span>
        <StatusDot severity={severity} pulse={job.status === "running"} />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.12em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {JOB_LABELS[job.status]}
        </span>
        <span
          className="text-[10px] ml-auto shrink-0"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {timeAgo(job.criadoEm)}
        </span>
      </div>
      {(job.duracaoSegundos || job.outputTipo) && (
        <div className="flex items-center gap-3 mt-1 ml-[80px]">
          {job.duracaoSegundos && (
            <span
              className="text-[10px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {formatDuration(job.duracaoSegundos)}
            </span>
          )}
          {job.outputTipo && (
            <span
              className="text-[10px]"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              {job.outputTipo}
            </span>
          )}
        </div>
      )}
    </StatusCard>
  );
}
