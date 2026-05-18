import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconTileProps {
  icon: ReactNode;
  label?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

const sizeMap: Record<"sm" | "md" | "lg", number> = {
  sm: 40,
  md: 56,
  lg: 72,
};

const iconSizeMap: Record<"sm" | "md" | "lg", number> = {
  sm: 14,
  md: 20,
  lg: 26,
};

const DEFAULT_COLOR = "var(--kr-azure)";

export function IconTile({
  icon,
  label,
  color = DEFAULT_COLOR,
  size = "md",
  onClick,
  className,
}: IconTileProps) {
  const pixelSize = sizeMap[size];
  const iconPx = iconSizeMap[size];

  const isInteractive = typeof onClick === "function";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1",
        isInteractive && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-xl transition-all duration-200",
          isInteractive && "hover:scale-105 hover:shadow-lg",
        )}
        style={{
          width: pixelSize,
          height: pixelSize,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 24%, transparent)`,
          borderRadius: 12,
          color: color,
        }}
      >
        <span style={{ width: iconPx, height: iconPx, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </span>
      </div>

      {label && (
        <span
          className="text-[10px] leading-tight text-center max-w-[80px] truncate"
          style={{ color: "var(--kr-text-muted)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
