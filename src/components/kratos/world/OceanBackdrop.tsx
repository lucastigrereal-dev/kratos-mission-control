import { cn } from "@/lib/utils";

interface OceanBackdropProps {
  className?: string;
}

/**
 * OceanBackdrop — Vibrant gamified world background.
 *
 * Mockup match: bright sky blue (#87CEEB), turquoise ocean (#20B2AA),
 * warm sun bloom, no dark mode — the map IS the interface.
 */
export function OceanBackdrop({ className }: OceanBackdropProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Base sky — bright blue */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #87CEEB 0%, #60A5FA 25%, #38BDF8 50%, #0EA5E9 75%, #0284C7 100%)",
        }}
      />

      {/* Ocean layer — turquoise blend at bottom 55% */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            #0EA5E9 10%,
            #0891B2 35%,
            #0E7490 60%,
            #155E75 100%
          )`,
        }}
      />

      {/* Sun bloom — warm yellow-white glow top-center */}
      <div
        className="absolute left-1/2 top-[10%] -translate-x-1/2"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: "900px",
          maxHeight: "900px",
          background: `radial-gradient(
            ellipse at center,
            color-mix(in oklab, #FFF7ED 55%, transparent) 0%,
            color-mix(in oklab, #FDBA74 30%, transparent) 12%,
            color-mix(in oklab, #60A5FA 12%, transparent) 35%,
            transparent 65%
          )`,
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />

      {/* Ocean shimmer — subtle light reflections */}
      <div
        className="kr-animate-ocean-shimmer absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background: `linear-gradient(
            0deg,
            transparent 0%,
            color-mix(in oklab, #22D3EE 10%, transparent) 40%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
