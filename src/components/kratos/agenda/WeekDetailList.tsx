import { CalendarRange } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export type WeekItem = {
  day: string; // ex: "Seg", "Ter"
  date: string; // ex: "12 mai"
  title: string;
  project: string;
};

type Props = { items: WeekItem[] };

export function WeekDetailList({ items }: Props) {
  return (
    <StatusCard>
      <div className="flex items-center gap-2 mb-3">
        <CalendarRange
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Camada de detalhe · próximos da semana
        </span>
      </div>

      {items.length === 0 ? (
        <div
          className="text-[12px]"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Semana livre depois de fechar a janela atual.
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--kratos-border)" }}>
          {items.map((it, i) => (
            <li
              key={i}
              className="flex items-baseline gap-4 py-2.5 first:pt-0 last:pb-0"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--kratos-border)",
              }}
            >
              <div className="w-16 shrink-0">
                <div
                  className="text-[11px] kratos-mono uppercase tracking-[0.15em]"
                  style={{ color: "var(--kratos-text-secondary)" }}
                >
                  {it.day}
                </div>
                <div
                  className="text-[10px] kratos-mono"
                  style={{ color: "var(--kratos-text-muted)" }}
                >
                  {it.date}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="text-[12px] font-medium leading-snug"
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </StatusCard>
  );
}
