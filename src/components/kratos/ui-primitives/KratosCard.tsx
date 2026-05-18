import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./GlassPanel";

interface KratosCardProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  accent?: string;
  highlighted?: boolean;
  className?: string;
}

export function KratosCard({
  header,
  footer,
  children,
  accent,
  highlighted = false,
  className,
}: KratosCardProps) {
  return (
    <GlassPanel
      className={cn("flex flex-col gap-3", highlighted && "overflow-hidden", className)}
      padding="md"
    >
      {/* Highlighted left border + glow */}
      {highlighted && accent && (
        <div
          className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl"
          style={{
            backgroundColor: accent,
            boxShadow: `0 0 12px ${accent}, 0 0 24px ${accent}40`,
          }}
          aria-hidden
        />
      )}

      {header && (
        <div
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: "var(--kratos-border)" }}
        >
          {header}
        </div>
      )}

      <div className="flex-1">{children}</div>

      {footer && (
        <div
          className="flex items-center gap-2 border-t pt-3"
          style={{ borderColor: "var(--kratos-border)" }}
        >
          {footer}
        </div>
      )}
    </GlassPanel>
  );
}
