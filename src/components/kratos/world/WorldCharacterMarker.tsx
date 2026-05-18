import { cn } from "@/lib/utils";

interface WorldCharacterMarkerProps {
  position: { x: string; y: string };
  label?: string;
  isActive?: boolean;
  hasCheckpoint?: boolean;
}

export function WorldCharacterMarker({
  position,
  label,
  isActive = false,
  hasCheckpoint = false,
}: WorldCharacterMarkerProps) {
  return (
    <div
      className={cn("absolute flex flex-col items-center gap-1")}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        zIndex: "var(--kr-z-island-label)",
      }}
    >
      {/* Pulsing ring */}
      <div className="relative">
      <div
        className={cn(
          "absolute rounded-full",
          isActive && "kr-animate-pulse-glow",
        )}
        style={{
          width: 24,
          height: 24,
          background: "transparent",
          border: `2px solid ${"var(--kr-azure)"}`,
          opacity: isActive ? 1 : 0.5,
        }}
      />
      {/* Checkpoint pip */}
      {hasCheckpoint && (
        <div
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            top: -1,
            right: -1,
            background: "var(--kr-gold)",
            boxShadow: "0 0 4px var(--kr-gold)",
          }}
        />
      )}
      </div>

      {/* Central dot */}
      <div
        className="rounded-full"
        style={{
          width: 8,
          height: 8,
          background: "var(--kr-gold)",
          boxShadow: "0 0 8px var(--kr-gold)",
        }}
      />

      {/* Label */}
      {label && (
        <span
          className="text-[10px] font-medium uppercase tracking-wider whitespace-nowrap mt-1.5"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
