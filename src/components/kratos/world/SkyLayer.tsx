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
    colorStart: "rgba(255, 220, 160, 0.40)",
    colorMid: "rgba(251, 191, 36, 0.18)",
    intensity: 0.35,
  },
  noon: {
    sunTop: "8%",
    sunLeft: "50%",
    colorStart: "rgba(255, 255, 255, 0.48)",
    colorMid: "rgba(219, 234, 254, 0.22)",
    intensity: 0.5,
  },
  evening: {
    sunTop: "20%",
    sunLeft: "68%",
    colorStart: "rgba(251, 146, 60, 0.38)",
    colorMid: "rgba(234, 88, 12, 0.16)",
    intensity: 0.3,
  },
};

/**
 * SkyLayer — Semi-transparent overlay with radial sun glow.
 *
 * Renders a positioned sun bloom that adjusts based on timeOfDay.
 * Overlays OceanBackdrop for atmospheric depth.
 * pointer-events-none so it doesn't block island clicks.
 */
export function SkyLayer({ className, timeOfDay = "noon" }: SkyLayerProps) {
  const config = timeConfig[timeOfDay];

  return (
    <div
      className={cn("pointer-events-none fixed inset-0", className)}
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

      {/* Atmosphere gradient — subtle warm/cool tint across the sky */}
      <div
        className="absolute inset-x-0 top-0 h-[45%]"
        style={{
          background: `linear-gradient(
            180deg,
            ${config.colorStart.replace("0.40", "0.12").replace("0.38", "0.10").replace("0.48", "0.14")} 0%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
