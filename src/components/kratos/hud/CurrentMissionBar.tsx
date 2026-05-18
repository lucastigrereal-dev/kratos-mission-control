import { cn } from "@/lib/utils";

interface CurrentMissionBarProps {
  missionTitle?: string;
  progress?: number;
  timeRemaining?: string;
  className?: string;
}

export function CurrentMissionBar({
  missionTitle,
  progress = 0,
  timeRemaining,
  className,
}: CurrentMissionBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn("flex items-center gap-3 rounded-xl overflow-hidden", className)}
      style={{
        background: "var(--kr-glass-bg)",
        border: "1px solid var(--kr-glass-border)",
        backdropFilter: "blur(var(--kr-glass-blur))",
        WebkitBackdropFilter: "blur(var(--kr-glass-blur))",
      }}
    >
      {/* Left accent bar */}
      <div
        className="shrink-0 self-stretch"
        style={{
          width: 4,
          background: missionTitle
            ? "var(--kr-gold)"
            : "var(--kr-text-muted)",
        }}
      />

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 py-2.5 pr-3 min-w-0">
        {/* Mission title */}
        <span
          className="text-xs font-semibold truncate flex-1 min-w-0"
          style={{
            color: missionTitle ? "var(--kr-gold)" : "var(--kr-text-muted)",
          }}
        >
          {missionTitle || "Nenhuma missão ativa"}
        </span>

        {/* Progress bar */}
        {clamped > 0 && (
          <div
            className="shrink-0 rounded-full overflow-hidden"
            style={{
              width: 80,
              height: 2,
              background: "var(--kr-surface-high)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${clamped}%`,
                background: "var(--kr-success)",
              }}
            />
          </div>
        )}

        {/* Time remaining */}
        {timeRemaining && (
          <span
            className="text-[10px] shrink-0"
            style={{ color: "var(--kr-text-secondary)" }}
          >
            {timeRemaining}
          </span>
        )}
      </div>
    </div>
  );
}
