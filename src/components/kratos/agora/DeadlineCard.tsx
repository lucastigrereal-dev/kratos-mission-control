import { Clock } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export type Deadline = {
  title: string;
  remaining: string; // ex: "2d", "4h", "hoje"
  due: string; // ex: "10 mai 2026"
  urgency?: "calm" | "soon" | "urgent";
};

type Props = {
  deadline?: Deadline;
};

const TONE: Record<NonNullable<Deadline["urgency"]>, string> = {
  calm: "var(--kratos-info)",
  soon: "var(--kratos-warn)",
  urgent: "var(--kratos-critical)",
};

export function DeadlineCard({ deadline }: Props) {
  return (
    <StatusCard className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Clock
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Deadline mais urgente
        </span>
      </div>

      {deadline ? (
        <>
          <div
            className="text-[14px] font-medium leading-snug"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {deadline.title}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="text-[28px] font-semibold leading-none kratos-mono"
              style={{ color: TONE[deadline.urgency ?? "soon"] }}
            >
              {deadline.remaining}
            </span>
            <span
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              · {deadline.due}
            </span>
          </div>
        </>
      ) : (
        <>
          <div
            className="text-[14px] font-medium"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Sem deadline urgente.
          </div>
          <p
            className="mt-2 text-[11px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Use a janela para fechar o que está aberto.
          </p>
        </>
      )}
    </StatusCard>
  );
}
