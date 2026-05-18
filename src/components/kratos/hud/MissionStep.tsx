import { cn } from "@/lib/utils";

interface MissionStepProps {
  mission: string;
  step: string;
  progress: number; // 0-100
  className?: string;
}

export function MissionStep({ mission, step, progress, className }: MissionStepProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
      {/* Mission name + step label */}
      <div className="flex items-baseline gap-2 min-w-0">
        <span
          className="text-[11px] font-semibold tracking-[0.02em] truncate"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {mission}
        </span>
        <span
          className="text-[10px] tracking-[0.05em] uppercase truncate"
          style={{ color: "var(--kr-text-muted)" }}
        >
          {step}
        </span>
      </div>

      {/* 4px progress bar */}
      <div
        className="w-full h-[4px] rounded-full overflow-hidden"
        style={{ background: "var(--kr-surface-high)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedProgress}%`,
            background: "var(--kr-aurora)",
            boxShadow: "0 0 6px color-mix(in oklab, var(--kr-aurora) 50%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
