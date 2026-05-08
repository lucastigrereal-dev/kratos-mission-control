import { ListChecks } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";

export type TodayItem = {
  title: string;
  window: string;
  project: string;
  status: "now" | "next" | "later" | "blocked";
};

type Props = { items: TodayItem[] };

const STATUS_LABEL: Record<TodayItem["status"], string> = {
  now: "Agora",
  next: "Próximo",
  later: "Mais tarde",
  blocked: "Bloqueado",
};

const STATUS_SEV: Record<TodayItem["status"], Severity> = {
  now: "ok",
  next: "info",
  later: "muted",
  blocked: "critical",
};

const STATUS_HINT: Record<TodayItem["status"], string> = {
  now: "Faça isso primeiro.",
  next: "Depois do atual, sem desviar.",
  later: "Pode esperar a janela certa.",
  blocked: "Aguardando dependência.",
};

export function TodayExecutionPanel({ items }: Props) {
  const visible = items.slice(0, 5);

  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Plano de hoje · {visible.length} itens
        </span>
      </div>

      <ul className="space-y-2">
        {visible.map((it, i) => {
          const isNow = it.status === "now";
          return (
            <li
              key={i}
              className="flex items-start gap-3 rounded-md p-3"
              style={{
                background: isNow
                  ? "color-mix(in oklab, var(--kratos-ok) 6%, var(--kratos-surface-3))"
                  : "var(--kratos-surface-3)",
                border: `1px solid ${
                  isNow ? "var(--kratos-border-on-focus)" : "var(--kratos-border)"
                }`,
              }}
            >
              <div className="pt-1.5">
                <StatusDot
                  severity={STATUS_SEV[it.status]}
                  pulse={isNow}
                  size="sm"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
                    style={{ color: "var(--kratos-text-muted)" }}
                  >
                    {STATUS_LABEL[it.status]} · {it.window}
                  </span>
                  <span
                    className="text-[10px] kratos-mono uppercase tracking-[0.12em]"
                    style={{ color: "var(--kratos-text-muted)" }}
                  >
                    · {it.project}
                  </span>
                </div>
                <div
                  className="mt-0.5 text-[13px] font-medium leading-snug"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  {it.title}
                </div>
                <div
                  className="mt-0.5 text-[11px] leading-relaxed"
                  style={{ color: "var(--kratos-text-secondary)" }}
                >
                  {STATUS_HINT[it.status]}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </StatusCard>
  );
}
