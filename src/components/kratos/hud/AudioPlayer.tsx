import { Play, Pause, SkipForward, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  trackName?: string;
  artist?: string;
  compact?: boolean;
  className?: string;
}

export function AudioPlayer({
  trackName = "Nenhuma faixa",
  artist = "---",
  compact = false,
  className,
}: AudioPlayerProps) {
  if (compact) {
    return (
      <div
        className={cn("flex items-center gap-2.5", className)}
        role="region"
        aria-label="Audio player"
      >
        {/* Play/Pause */}
        <button
          type="button"
          className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 kratos-focus-ring"
          style={{
            background: "var(--kr-surface-high)",
            color: "var(--kr-text-primary)",
          }}
          aria-label="Play"
        >
          <Play className="h-3.5 w-3.5" aria-hidden />
        </button>

        {/* Track info */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Music
            className="h-3 w-3 flex-shrink-0"
            style={{ color: "var(--kr-text-muted)" }}
            aria-hidden
          />
          <span
            className="text-[11px] font-medium truncate"
            style={{ color: "var(--kr-text-secondary)" }}
          >
            {trackName}
          </span>
        </div>

        {/* Skip */}
        <button
          type="button"
          className="flex items-center justify-center w-6 h-6 rounded transition-all duration-150 kratos-focus-ring"
          style={{ color: "var(--kr-text-muted)" }}
          aria-label="Skip"
        >
          <SkipForward className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="region"
      aria-label="Audio player"
    >
      {/* Play/Pause */}
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 kratos-focus-ring"
        style={{
          background: "var(--kr-surface-high)",
          color: "var(--kr-text-primary)",
        }}
        aria-label="Play"
      >
        <Play className="h-4 w-4" aria-hidden />
      </button>

      {/* Track info */}
      <div className="flex flex-col min-w-0 flex-1">
        <span
          className="text-[12px] font-semibold truncate"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {trackName}
        </span>
        <span
          className="text-[10px] truncate"
          style={{ color: "var(--kr-text-muted)" }}
        >
          {artist}
        </span>
      </div>

      {/* Skip */}
      <button
        type="button"
        className="flex items-center justify-center w-7 h-7 rounded transition-all duration-150 kratos-focus-ring"
        style={{ color: "var(--kr-text-muted)" }}
        aria-label="Skip"
      >
        <SkipForward className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
