import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IslandPageFrameProps {
  children: ReactNode;
  theme: string;
  className?: string;
}

export function IslandPageFrame({
  children,
  theme,
  className,
}: IslandPageFrameProps) {
  const accent = `var(--kr-island-${theme}, var(--kratos-accent))`;

  return (
    <div className={cn("min-h-full w-full", className)}>
      {/* Themed top border */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent 5%, color-mix(in oklab, ${accent} 50%, transparent) 20%, color-mix(in oklab, ${accent} 50%, transparent) 80%, transparent 95%)`,
        }}
        aria-hidden
      />

      {/* Page content area */}
      <div
        className="mx-auto w-full max-w-[1280px] px-6 py-8"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in oklab, ${accent} 6%, transparent) 0%, transparent 70%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
