import { cn } from "@/lib/utils";

interface WorldCharacterMarkerProps {
  position: { x: string; y: string };
  label?: string;
  isActive?: boolean;
  hasCheckpoint?: boolean;
}

/**
 * WorldCharacterMarker — Lucas avatar facing the castle.
 *
 * Mockup match: visible character with red cape, standing
 * directly in front of the castle gate, facing it.
 */
export function WorldCharacterMarker({
  position,
  label,
  isActive = false,
  hasCheckpoint = false,
}: WorldCharacterMarkerProps) {
  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        zIndex: 55,
      }}
    >
      {/* Character body — larger and more visible */}
      <div className="relative">
        {/* Cape (behind) — larger red cape */}
        <div
          className="absolute -left-3 top-0 rounded-t-lg"
          style={{
            width: 48,
            height: 60,
            background: "linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)",
            transform: "rotate(-6deg)",
            zIndex: 1,
            borderRadius: "8px 8px 3px 3px",
          }}
        />
        {/* Head */}
        <div
          className="relative z-10 mx-auto rounded-full"
          style={{
            width: 24,
            height: 24,
            background: "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)",
            border: "2px solid #EA580C",
          }}
        />
        {/* Torso — K shirt */}
        <div
          className="relative z-10 mx-auto flex items-center justify-center rounded-md"
          style={{
            width: 32,
            height: 40,
            background: "linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)",
            marginTop: -3,
          }}
        >
          <span className="text-[12px] font-black" style={{ color: "#FFD700" }}>K</span>
          {/* Belt */}
          <div
            className="absolute bottom-1 left-0 right-0"
            style={{
              height: 4,
              background: "#F59E0B",
            }}
          />
        </div>
        {/* Legs */}
        <div className="relative z-10 flex justify-center gap-1">
          <div
            className="rounded-b-md"
            style={{
              width: 11,
              height: 18,
              background: "#1E3A8A",
            }}
          />
          <div
            className="rounded-b-md"
            style={{
              width: 11,
              height: 18,
              background: "#1E3A8A",
            }}
          />
        </div>

        {/* Checkpoint pip */}
        {hasCheckpoint && (
          <div
            className="absolute -top-1 -right-1 z-20 h-2.5 w-2.5 rounded-full border border-white"
            style={{
              background: "#FACC15",
              boxShadow: "0 0 6px #FACC15",
            }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <span
          className="mt-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{
            color: "#FFFFFF",
            background: "color-mix(in oklab, black 50%, transparent)",
            textShadow: "0 1px 2px black",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
