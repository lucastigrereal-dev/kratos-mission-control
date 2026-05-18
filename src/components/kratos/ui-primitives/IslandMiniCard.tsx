import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IslandMiniCardProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  theme: string; // island color e.g. "var(--kratos-accent)"
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function IslandMiniCard({
  icon: Icon,
  label,
  subtitle,
  theme,
  onClick,
  active = false,
  className,
}: IslandMiniCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200",
        "hover:-translate-y-[2px]",
        active && "ring-1 ring-white/10",
        className,
      )}
      style={{
        background: active
          ? "var(--kratos-surface-3)"
          : "var(--kratos-surface-2)",
        border: "1px solid var(--kratos-border)",
        borderLeftWidth: "4px",
        borderLeftColor: theme,
        boxShadow: active
          ? `0 0 24px ${theme}40, 0 8px 32px rgba(0,0,0,0.4)`
          : "0 4px 16px rgba(0,0,0,0.2)",
        transform: "translateY(0)",
      }}
    >
      {/* Hover glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 20px ${theme}20`,
        }}
        aria-hidden
      />

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${theme}20`, color: theme }}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="truncate text-[13px] font-medium"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {label}
        </p>
        {subtitle && (
          <p
            className="truncate text-[11px]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
}
