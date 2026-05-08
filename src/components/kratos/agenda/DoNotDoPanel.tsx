import { Ban } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

type Props = { items: string[] };

export function DoNotDoPanel({ items }: Props) {
  return (
    <StatusCard accent="off_focus" className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Ban
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-critical)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Não fazer agora
        </span>
      </div>

      <ul className="space-y-2">
        {items.map((txt, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[12px] leading-snug"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            <span
              className="mt-1 inline-block h-px w-3 shrink-0"
              style={{ background: "var(--kratos-critical)" }}
            />
            {txt}
          </li>
        ))}
      </ul>

      <div
        className="mt-3 text-[11px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Hoje é dia de reduzir frentes, não criar novas.
      </div>
    </StatusCard>
  );
}
