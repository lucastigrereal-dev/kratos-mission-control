import { AlertTriangle } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { AlertBadge } from "@/components/kratos/base/AlertBadge";

export type OverdueItem = {
  title: string;
  daysLate: number;
  project: string;
  severity: "warn" | "critical";
};

type Props = { items: OverdueItem[] };

export function OverduePanel({ items }: Props) {
  return (
    <StatusCard
      className="h-full"
      accent={items.some((i) => i.severity === "critical") ? "off_focus" : "none"}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Atrasados
        </span>
      </div>

      {items.length === 0 ? (
        <div
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Sem atrasados críticos agora.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((it, i) => (
            <li key={i}>
              <div className="flex items-start justify-between gap-2">
                <div
                  className="text-[12px] font-medium leading-snug"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  {it.title}
                </div>
                <AlertBadge
                  severity={it.severity}
                  label={`+${it.daysLate}d`}
                />
              </div>
              <div
                className="mt-0.5 text-[11px] kratos-mono uppercase tracking-[0.12em]"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                {it.project}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StatusCard>
  );
}
