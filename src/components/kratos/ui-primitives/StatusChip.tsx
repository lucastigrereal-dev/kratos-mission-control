import { cn } from "@/lib/utils";

type StatusChipStatus = "online" | "executing" | "error" | "offline" | "degraded";

interface StatusChipProps {
  status: StatusChipStatus;
  label?: string;
  pulse?: boolean;
}

const statusMeta: Record<
  StatusChipStatus,
  { color: string; defaultLabel: string }
> = {
  online: {
    color: "var(--kratos-ok)",
    defaultLabel: "Online",
  },
  executing: {
    color: "var(--kratos-info)",
    defaultLabel: "Executando",
  },
  error: {
    color: "var(--kratos-critical)",
    defaultLabel: "Erro",
  },
  offline: {
    color: "var(--kratos-text-muted)",
    defaultLabel: "Offline",
  },
  degraded: {
    color: "var(--kratos-warn)",
    defaultLabel: "Degradado",
  },
};

export function StatusChip({
  status,
  label,
  pulse = false,
}: StatusChipProps) {
  const meta = statusMeta[status];
  const shouldPulse = pulse || status === "executing";

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          "block h-2 w-2 shrink-0 rounded-full",
          shouldPulse && "animate-pulse",
        )}
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />
      <span
        className="text-xs font-medium"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        {label ?? meta.defaultLabel}
      </span>
    </div>
  );
}
