import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  value: number | string;
  label: string;
  delta?: number;
  tone?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function MetricBadge({
  value,
  label,
  delta,
  tone = "neutral",
  icon: Icon,
  className,
}: MetricBadgeProps) {
  const toneColor = (() => {
    switch (tone) {
      case "positive":
        return "var(--kratos-ok)";
      case "negative":
        return "var(--kratos-critical)";
      default:
        return "var(--kratos-text-muted)";
    }
  })();

  const DeltaIcon = tone === "positive" ? ArrowUp : tone === "negative" ? ArrowDown : Minus;

  return (
    <div
      className={cn(
        "inline-flex flex-col items-start gap-1 rounded-xl p-3",
        className,
      )}
      style={{
        background: "var(--kratos-surface-2)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--kratos-text-muted)" }}
            aria-hidden
          />
        )}
        <span
          className="text-lg font-bold leading-none"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {value}
        </span>
      </div>

      <span
        className="text-[10px] uppercase tracking-wider"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {label}
      </span>

      {delta !== undefined && delta !== 0 && (
        <div className="flex items-center gap-1 mt-0.5">
          <DeltaIcon
            className="h-3 w-3"
            style={{ color: toneColor }}
            aria-hidden
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: toneColor }}
          >
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
        </div>
      )}
    </div>
  );
}
