import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MissionBannerProps {
  mission: string;
  status: "active" | "paused" | "completed";
  className?: string;
  children?: ReactNode;
}

const statusConfig: Record<
  "active" | "paused" | "completed",
  { dot: string; label: string }
> = {
  active: {
    dot: "var(--kr-success)",
    label: "EM ANDAMENTO",
  },
  paused: {
    dot: "var(--kr-warning)",
    label: "PAUSADA",
  },
  completed: {
    dot: "var(--kr-success)",
    label: "CONCLUIDA",
  },
};

export function MissionBanner({
  mission,
  status,
  className,
  children,
}: MissionBannerProps) {
  const cfg = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-2xl border px-4 py-3",
        className,
      )}
      style={{
        background: "var(--kratos-surface-2)",
        borderColor: "var(--kratos-border)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Status dot */}
      <span
        className="block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{
          backgroundColor: cfg.dot,
          boxShadow: `0 0 8px ${cfg.dot}`,
        }}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <span
          className="block text-[10px] font-medium uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--kratos-font-mono)",
            color: "var(--kratos-text-muted)",
          }}
        >
          MISSÃO ATUAL
        </span>
        <span
          className="mt-0.5 block truncate text-sm font-semibold leading-tight"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {mission}
        </span>
      </div>

      {/* Status label */}
      <span
        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]"
        style={{
          backgroundColor: "var(--kratos-surface-3)",
          color: "var(--kratos-text-secondary)",
          border: "1px solid var(--kratos-border)",
          fontFamily: "var(--kratos-font-mono)",
        }}
      >
        {cfg.label}
      </span>

      {children}
    </div>
  );
}
