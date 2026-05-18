import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  interactive?: boolean;
  blur?: "glass" | "panel";
}

const paddingMap: Record<"sm" | "md" | "lg", string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, padding = "md", interactive = false, blur = "panel" }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border",
          paddingMap[padding],
          interactive &&
            "cursor-pointer transition-all duration-200 hover:border-white/20 hover:shadow-lg hover:shadow-black/30",
          className,
        )}
        style={{
          background: "var(--kratos-surface-2)",
          borderColor: "var(--kratos-border)",
          backdropFilter: `blur(${blur === "panel" ? "24px" : "16px"})`,
          WebkitBackdropFilter: `blur(${blur === "panel" ? "24px" : "16px"})`,
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = "GlassPanel";
