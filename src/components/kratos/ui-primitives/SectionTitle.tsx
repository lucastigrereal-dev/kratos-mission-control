import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionTitleAction {
  label: string;
  onClick: () => void;
}

interface SectionTitleProps {
  icon?: LucideIcon;
  title: string;
  action?: SectionTitleAction;
  divider?: boolean;
}

export function SectionTitle({
  icon: Icon,
  title,
  action,
  divider = false,
}: SectionTitleProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
              aria-hidden
            />
          )}
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {title}
          </h2>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors hover:bg-white/5"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {action.label}
          </button>
        )}
      </div>

      {divider && (
        <div
          className={cn("mt-2", Icon ? "ml-0" : "ml-0")}
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
