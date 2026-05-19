import { type CSSProperties, useMemo } from "react";
import { cn } from "@/lib/utils";

interface CloudLayerProps {
  className?: string;
  /** Number of clouds to render (default 4) */
  count?: number;
}

interface CloudConfig {
  width: number;
  height: number;
  top: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
  blur: string;
}

/**
 * Generates deterministic pseudo-random clouds.
 * Using a simple seed pattern so clouds don't shift on re-render.
 */
function generateClouds(count: number): CloudConfig[] {
  const clouds: CloudConfig[] = [];
  const baseDelay = 7;
  const baseDuration = 110;

  for (let i = 0; i < count; i++) {
    // Pseudo-random using index to keep it stable across renders
    const seed = ((i * 17 + 3) % 11) / 10;
    const seed2 = ((i * 23 + 7) % 13) / 13;

    clouds.push({
      width: Math.round(180 + seed * 320),
      height: Math.round(50 + seed2 * 70),
      top: `${10 + seed * 45}%`,
      animationDelay: `${baseDelay * seed2}s`,
      animationDuration: `${baseDuration + seed * 60}s`,
      opacity: 0.35 + seed2 * 0.35,
      blur: seed2 > 0.6 ? "blur-3xl" : "blur-2xl",
    });
  }

  return clouds;
}

/**
 * CloudLayer — Decorative drifting clouds over the sky.
 *
 * Renders 3-5 soft, heavily-blurred white shapes that drift
 * horizontally across the viewport. Uses the kr-cloud-drift
 * keyframe defined in kratos-tokens.css.
 */
export function CloudLayer({ className, count = 4 }: CloudLayerProps) {
  const clouds = useMemo(() => generateClouds(count), [count]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {clouds.map((cloud, index) => (
        <div
          key={index}
          className="kr-animate-cloud-drift absolute"
          style={
            {
              top: cloud.top,
              left: "-20%",
              width: `${cloud.width}px`,
              height: `${cloud.height}px`,
              animationDelay: cloud.animationDelay,
              animationDuration: cloud.animationDuration,
              opacity: cloud.opacity,
              background: `linear-gradient(
                180deg,
                color-mix(in oklab, var(--kr-cloud, #F8FAFC) 90%, transparent) 0%,
                color-mix(in oklab, var(--kr-cloud, #F8FAFC) 40%, transparent) 60%,
                color-mix(in oklab, var(--kr-cloud, #F8FAFC) 5%, transparent) 100%
              )`,
              borderRadius: "9999px",
              filter: `blur(${cloud.blur === "blur-3xl" ? "48px" : "32px"})`,
              WebkitFilter: `blur(${cloud.blur === "blur-3xl" ? "48px" : "32px"})`,
              willChange: "transform",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
