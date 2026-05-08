import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  title = "Sem dados",
  description = "Nada para exibir agora.",
  icon,
  compact = false,
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-6" : "py-10"
      }`}
      style={{ color: "var(--kratos-text-secondary)" }}
    >
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: "var(--kratos-surface-3)",
          color: "var(--kratos-text-muted)",
        }}
      >
        {icon ?? <Inbox className="h-4 w-4" />}
      </div>
      <div
        className="text-[13px] font-medium"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {title}
      </div>
      <div className="mt-1 text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
        {description}
      </div>
    </div>
  );
}
