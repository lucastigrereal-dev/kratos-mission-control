import { Lightbulb } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

type Props = {
  reasons: string[];
};

export function ContextReasonCard({ reasons }: Props) {
  return (
    <StatusCard className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Por que esse contexto
        </span>
      </div>

      <ul className="space-y-2">
        {reasons.map((r) => (
          <li
            key={r}
            className="flex gap-2 text-[12px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full"
              style={{ background: "var(--kratos-text-muted)" }}
            />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </StatusCard>
  );
}
