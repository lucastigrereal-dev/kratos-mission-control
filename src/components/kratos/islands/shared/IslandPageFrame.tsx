import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IslandPageFrameProps {
  children: ReactNode;
  theme: "omnis" | "agencia" | "akasha" | "nimbus";
  className?: string;
}

const themeBorderMap: Record<IslandPageFrameProps["theme"], string> = {
  omnis: "rgba(124, 58, 237, 0.5)",
  agencia: "rgba(249, 115, 22, 0.5)",
  akasha: "rgba(5, 150, 105, 0.5)",
  nimbus: "rgba(14, 165, 233, 0.5)",
};

const themeBgMap: Record<IslandPageFrameProps["theme"], string> = {
  omnis: "rgba(124, 58, 237, 0.06)",
  agencia: "rgba(249, 115, 22, 0.06)",
  akasha: "rgba(5, 150, 105, 0.06)",
  nimbus: "rgba(14, 165, 233, 0.06)",
};

export function IslandPageFrame({
  children,
  theme,
  className,
}: IslandPageFrameProps) {
  const borderColor = themeBorderMap[theme];
  const bgTint = themeBgMap[theme];

  return (
    <div className={cn("min-h-screen w-full", className)}>
      {/* Themed top border */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${borderColor} 20%, ${borderColor} 80%, transparent 95%)`,
        }}
        aria-hidden
      />

      {/* Page content area */}
      <div
        className="mx-auto w-full max-w-[1280px] px-6 py-8"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${bgTint} 0%, transparent 70%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
