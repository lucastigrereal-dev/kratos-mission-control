import { AppWindow } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

type Props = {
  app: string;
  window: string;
  domain: string;
  duration: string;
};

export function ActiveWindowCard({ app, window: windowName, domain, duration }: Props) {
  return (
    <StatusCard className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <AppWindow
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Janela ativa
        </span>
      </div>

      <div
        className="text-[15px] font-medium leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {windowName}
      </div>

      <div
        className="mt-1 text-[12px]"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        {app}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className="truncate text-[11px] kratos-mono"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {domain}
        </span>
        <span
          className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] kratos-mono uppercase tracking-[0.12em]"
          style={{
            color: "var(--kratos-text-secondary)",
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
          }}
        >
          {duration}
        </span>
      </div>
    </StatusCard>
  );
}
