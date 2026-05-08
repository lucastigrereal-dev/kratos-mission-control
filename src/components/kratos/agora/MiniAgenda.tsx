import { CalendarDays } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export type AgendaItem = {
  time: string;
  title: string;
  hint?: string;
};

type Props = {
  items: AgendaItem[];
};

export function MiniAgenda({ items }: Props) {
  return (
    <StatusCard>
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Próximos
        </span>
      </div>

      {items.length === 0 ? (
        <div
          className="text-[12px]"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Sem itens próximos. Janela livre para foco profundo.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span
                className="w-14 shrink-0 text-[11px] kratos-mono uppercase tracking-[0.12em]"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                {it.time}
              </span>
              <div className="min-w-0">
                <div
                  className="text-[12px] font-medium leading-snug"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  {it.title}
                </div>
                {it.hint && (
                  <div
                    className="text-[11px] leading-relaxed"
                    style={{ color: "var(--kratos-text-secondary)" }}
                  >
                    {it.hint}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StatusCard>
  );
}
