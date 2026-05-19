import { cn } from "@/lib/utils";

interface SkyLayerProps {
  className?: string;
  /** Adjusts sun position and color temperature */
  timeOfDay?: "morning" | "noon" | "evening";
}

const timeConfig: Record<
  "morning" | "noon" | "evening",
  {
    sunTop: string;
    sunLeft: string;
    colorStart: string;
    colorMid: string;
    intensity: number;
  }
> = {
  morning: {
    sunTop: "18%",
    sunLeft: "35%",
    colorStart: "color-mix(in oklab, #FFDC9E 40%, transparent)",
    colorMid: "color-mix(in oklab, #FBBF24 18%, transparent)",
    intensity: 0.35,
  },
  noon: {
    sunTop: "8%",
    sunLeft: "50%",
    colorStart: "color-mix(in oklab, #FFFFFF 55%, transparent)",
    colorMid: "color-mix(in oklab, #DBEAFE 28%, transparent)",
    intensity: 0.6,
  },
  evening: {
    sunTop: "20%",
    sunLeft: "68%",
    colorStart: "color-mix(in oklab, #FB923C 38%, transparent)",
    colorMid: "color-mix(in oklab, #EA580C 16%, transparent)",
    intensity: 0.3,
  },
};

/**
 * SkyLayer — Vibrant sun bloom overlay.
 *
 * Hardcoded bright colors so the sky stays vibrant regardless
 * of dark-mode token values.
 */
export function SkyLayer({ className, timeOfDay = "noon" }: SkyLayerProps) {
  const config = timeConfig[timeOfDay];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      {/* Sun orb */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: config.sunLeft,
          top: config.sunTop,
          width: "50vw",
          height: "50vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background: `radial-gradient(
            ellipse at center,
            ${config.colorStart} 0%,
            ${config.colorMid} 30%,
            transparent 65%
          )`,
          opacity: config.intensity,
          filter: "blur(3px)",
        }}
      />

      {/* Atmosphere gradient — very subtle warm/cool tint */}
      <div
        className="absolute inset-x-0 top-0 h-[35%]"
        style={{
          background: `linear-gradient(
            180deg,
            ${config.colorStart.replace("0.55", "0.08").replace("0.40", "0.06").replace("0.38", "0.05")} 0%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
