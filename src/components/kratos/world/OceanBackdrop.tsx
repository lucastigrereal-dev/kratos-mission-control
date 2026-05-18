import { cn } from "@/lib/utils";

interface OceanBackdropProps {
  className?: string;
}

/**
 * OceanBackdrop — Full viewport background layer.
 *
 * Layers (bottom to top):
 * 1. Deep ocean gradient (fills viewport)
 * 2. Sky gradient (top 55%, light blue)
 * 3. Sun bloom (radial gradient near top-center)
 * 4. Ocean surface shimmer (subtle light play)
 *
 * Pure CSS — zero images, zero canvas.
 */
export function OceanBackdrop({ className }: OceanBackdropProps) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Deep ocean base — fills entire viewport */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--kr-ocean-deep)",
        }}
      />

      {/* Sky gradient — top 55% with light blue blend */}
      <div
        className="absolute inset-x-0 top-0 h-[55%]"
        style={{
          background: `linear-gradient(
            180deg,
            var(--kr-sky-light, #DBEAFE) 0%,
            var(--kr-sky, #60A5FA) 28%,
            var(--kr-ocean, #0A1E3F) 100%
          )`,
        }}
      />

      {/* Ocean layer — bottom 55% with deep blue gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            var(--kr-ocean, #0A1E3F) 18%,
            var(--kr-ocean-deep, #051024) 100%
          )`,
        }}
      />

      {/* Sun bloom — radial glow near top-center */}
      <div
        className="absolute left-1/2 top-[15%] -translate-x-1/2"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "800px",
          maxHeight: "800px",
          background: `radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(219, 234, 254, 0.25) 15%,
            rgba(147, 197, 253, 0.10) 35%,
            transparent 70%
          )`,
          borderRadius: "50%",
          filter: "blur(4px)",
        }}
      />

      {/* Ocean surface shimmer — subtle light play */}
      <div
        className="kr-animate-ocean-shimmer absolute inset-x-0 bottom-0 h-[35%]"
        style={{
          background: `linear-gradient(
            0deg,
            transparent 0%,
            var(--kr-ocean-surface, rgba(14, 165, 233, 0.06)) 50%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
