import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-10 text-center", className)}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "var(--kratos-surface-3)",
          color: "var(--kratos-text-muted)",
        }}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>

      <h3
        className="text-sm font-medium"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="mt-1 max-w-xs text-xs"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {description}
        </p>
      )}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors hover:bg-white/10"
          style={{
            background: "var(--kratos-surface-3)",
            color: "var(--kratos-text-primary)",
            border: "1px solid var(--kratos-border)",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
