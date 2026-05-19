import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MissionBannerProps {
  mission: string;
  status: "active" | "paused" | "completed";
  className?: string;
  children?: ReactNode;
}

const statusConfig: Record<
  "active" | "paused" | "completed",
  { dot: string; label: string }
> = {
  active: {
    dot: "#22C55E",
    label: "EM ANDAMENTO",
  },
  paused: {
    dot: "#F59E0B",
    label: "PAUSADA",
  },
  completed: {
    dot: "#22C55E",
    label: "CONCLUÍDA",
  },
};

/**
 * MissionBanner — Vibrant blue-gold plaque for castle overlay.
 *
 * Mockup match: blue panel with gold "MISSÃO ATUAL" header
 * and white mission text.
 */
export function MissionBanner({
  mission,
  status,
  className,
  children,
}: MissionBannerProps) {
  const cfg = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl border px-5 py-2.5",
        className,
      )}
      style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)",
        borderColor: "#F59E0B",
        boxShadow:
          "0 8px 32px color-mix(in oklab, black 40%, transparent), 0 0 16px color-mix(in oklab, #F59E0B 15%, transparent)",
      }}
    >
      {/* Gold header */}
      <span
        className="text-[9px] font-black uppercase tracking-[0.2em]"
        style={{ color: "#FFD700" }}
      >
        MISSÃO ATUAL
      </span>

      {/* Mission text */}
      <span
        className="mt-0.5 block max-w-[200px] truncate text-center text-sm font-bold leading-tight"
        style={{ color: "#FFFFFF" }}
      >
        {mission}
      </span>

      {/* Subtitle from mockup */}
      <span
        className="mt-0.5 block text-center text-[10px] font-medium"
        style={{ color: "#93C5FD" }}
      >
        ENQUANTO VIVO O PRESENTE
      </span>

      {/* Status dot + label */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className="block h-2 w-2 shrink-0 rounded-full"
          style={{
            backgroundColor: cfg.dot,
            boxShadow: `0 0 6px ${cfg.dot}`,
          }}
        />
        <span
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: cfg.dot }}
        >
          {cfg.label}
        </span>
      </div>

      {children}
    </div>
  );
}
