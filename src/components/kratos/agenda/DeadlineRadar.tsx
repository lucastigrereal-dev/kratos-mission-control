import { Radar } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";

export type RadarItem = {
  title: string;
  project: string;
  bucket: "today" | "next3" | "week";
};

type Props = { items: RadarItem[] };

const BUCKETS: { key: RadarItem["bucket"]; label: string; sev: Severity }[] = [
  { key: "today", label: "Hoje", sev: "critical" },
  { key: "next3", label: "Próximos 3 dias", sev: "warn" },
  { key: "week", label: "Esta semana", sev: "info" },
];

export function DeadlineRadar({ items }: Props) {
  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Radar
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Radar de prazos
        </span>
      </div>

      <div className="space-y-4">
        {BUCKETS.map((b) => {
          const bItems = items.filter((i) => i.bucket === b.key);
          return (
            <section key={b.key}>
              <div className="flex items-center gap-2 mb-1.5">
                <StatusDot severity={b.sev} size="xs" />
                <span
                  className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
                  style={{ color: "var(--kratos-text-secondary)" }}
                >
                  {b.label}
                </span>
              </div>
              {bItems.length === 0 ? (
                <div
                  className="pl-4 text-[11px]"
                  style={{ color: "var(--kratos-text-muted)" }}
                >
                  Nada na janela.
                </div>
              ) : (
                <ul className="pl-4 space-y-1">
                  {bItems.map((it, i) => (
                    <li key={i}>
                      <div
                        className="text-[12px] leading-snug"
                        style={{ color: "var(--kratos-text-primary)" }}
                      >
                        {it.title}
                      </div>
                      <div
                        className="text-[10px] kratos-mono uppercase tracking-[0.12em]"
                        style={{ color: "var(--kratos-text-muted)" }}
                      >
                        {it.project}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </StatusCard>
  );
}
