import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomDockProps {
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  variant?: "compact" | "expanded";
  className?: string;
}

export function BottomDock({
  leftSlot,
  centerSlot,
  rightSlot,
  variant = "compact",
  className,
}: BottomDockProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex items-center z-[var(--kr-z-bottom-dock)]",
        "px-4",
        "border-t",
        variant === "compact" ? "h-[64px]" : "h-[120px]",
        className,
      )}
      style={{
        background: "rgba(8,12,28,0.92)",
        borderColor: "rgba(30,144,255,0.12)",
        backdropFilter: "blur(var(--kr-panel-blur))",
        WebkitBackdropFilter: "blur(var(--kr-panel-blur))",
        boxShadow:
          "0 -8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      role="toolbar"
      aria-label="Bottom dock"
    >
      {/* Left slot */}
      <div className="flex items-center min-w-0 flex-1 justify-start">
        {leftSlot}
      </div>

      {/* Center slot */}
      <div className="flex items-center min-w-0 justify-center flex-shrink-0 px-4">
        {centerSlot}
      </div>

      {/* Right slot */}
      <div className="flex items-center min-w-0 flex-1 justify-end">
        {rightSlot}
      </div>
    </div>
  );
}
