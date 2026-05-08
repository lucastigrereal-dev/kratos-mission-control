import { Flag } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export type FinishLineItem = {
  title: string;
  remaining: string; // ex: "1 ajuste", "2 revisões"
};

type Props = { items: FinishLineItem[] };

export function FinishLinePanel({ items }: Props) {
  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Flag
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-ok)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Quase finalizados
        </span>
      </div>

      {items.length === 0 ? (
        <div
          className="text-[12px]"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Nada perto da linha de chegada.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((it, i) => (
            <li key={i}>
              <div
                className="text-[12px] font-medium leading-snug"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {it.title}
              </div>
              <div
                className="mt-0.5 text-[11px] kratos-mono uppercase tracking-[0.12em]"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                Falta: {it.remaining}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        className="mt-3 text-[11px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Quase finalizado. Só falta fechar.
      </div>
    </StatusCard>
  );
}
