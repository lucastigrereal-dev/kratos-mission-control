import { Globe } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";

type ItemStatus = "active" | "stale" | "distraction" | "unknown";

const STATUS_META: Record<ItemStatus, { label: string; severity: Severity }> = {
  active: { label: "ATIVA", severity: "ok" },
  stale: { label: "PARADA", severity: "muted" },
  distraction: { label: "DISTRAÇÃO", severity: "critical" },
  unknown: { label: "INDEFINIDA", severity: "info" },
};

type Item = {
  title: string;
  domain: string;
  project: string;
  status: ItemStatus;
};

type Props = {
  items: Item[];
};

export function BrowserContextList({ items }: Props) {
  // Hard cap at 5 — never a table, never a log view.
  const visible = items.slice(0, 5);

  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Globe
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Contextos do navegador
        </span>
      </div>

      <ul className="space-y-2">
        {visible.map((item) => {
          const meta = STATUS_META[item.status];
          return (
            <li
              key={`${item.domain}-${item.title}`}
              className="rounded-md px-3 py-2.5"
              style={{
                background: "var(--kratos-surface-3)",
                border: "1px solid var(--kratos-border)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div
                    className="truncate text-[13px] font-medium"
                    style={{ color: "var(--kratos-text-primary)" }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="mt-0.5 truncate text-[11px] kratos-mono"
                    style={{ color: "var(--kratos-text-muted)" }}
                  >
                    {item.domain} · {item.project}
                  </div>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] kratos-mono"
                  style={{
                    color: "var(--kratos-text-secondary)",
                    background: "var(--kratos-surface-2)",
                    border: "1px solid var(--kratos-border)",
                  }}
                >
                  <StatusDot severity={meta.severity} size="xs" />
                  {meta.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </StatusCard>
  );
}
