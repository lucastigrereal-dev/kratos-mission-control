import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IslandGlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  accentLine?: string;
  interactive?: boolean;
}

const paddingMap = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

// Card de vidro escuro para telas de ilha.
// Mais opaco que GlassPanel para vencer o background do mockup.
export const IslandGlassCard = forwardRef<HTMLDivElement, IslandGlassCardProps>(
  ({ children, className, padding = "md", accentLine, interactive = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[20px] overflow-hidden",
          paddingMap[padding],
          interactive &&
            "cursor-pointer transition-all duration-200 hover:border-white/15 hover:shadow-xl hover:shadow-black/50",
          className,
        )}
        style={{
          background: "rgba(8, 12, 28, 0.82)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {accentLine && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: accentLine }}
            aria-hidden
          />
        )}
        {children}
      </div>
    );
  },
);

IslandGlassCard.displayName = "IslandGlassCard";
