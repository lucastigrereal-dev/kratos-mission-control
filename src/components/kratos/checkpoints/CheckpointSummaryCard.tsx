import { LayoutList } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";

type Props = {
  lastCheckpoint: string;
  todayCount: number;
  recentProject: string;
  risk: { label: string; severity: Severity };
};

export function CheckpointSummaryCard({
  lastCheckpoint,
  todayCount,
  recentProject,
  risk,
}: Props) {
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Último", value: lastCheckpoint },
    { label: "Hoje", value: `${todayCount} checkpoints` },
    { label: "Projeto recente", value: recentProject },
    {
      label: "Risco de contexto",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <StatusDot severity={risk.severity} size="xs" />
          {risk.label}
        </span>
      ),
    },
  ];

  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <LayoutList
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Resumo
        </span>
      </div>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between gap-3"
          >
            <span
              className="text-[11px] kratos-mono uppercase tracking-[0.12em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {r.label}
            </span>
            <span
              className="text-right text-[12px]"
              style={{ color: "var(--kratos-text-primary)" }}
            >
              {r.value}
            </span>
          </li>
        ))}
      </ul>

      <p
        className="mt-5 text-[11px]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Checkpoint salvo é contexto preservado.
      </p>
    </StatusCard>
  );
}
