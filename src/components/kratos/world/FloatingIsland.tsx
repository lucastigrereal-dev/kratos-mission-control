import { type CSSProperties, useMemo } from "react";
import {
  Cpu,
  Palette,
  Database,
  BookOpen,
  Wallet,
  Flame,
  Telescope,
  Home,
  Target,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingIslandProps {
  /** Island size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Label displayed below the island */
  label?: string;
  /** Theme name for glow color and accent */
  theme?: string;
  /** Click handler — renders the island as a button */
  onClick?: () => void;
  /** Visual status: affects border and glow intensity */
  status?: "active" | "idle" | "alert";
  className?: string;
}

const sizeMap: Record<"sm" | "md" | "lg" | "xl", { width: number; height: number; iconSize: number }> = {
  sm: { width: 80, height: 48, iconSize: 20 },
  md: { width: 120, height: 72, iconSize: 28 },
  lg: { width: 160, height: 96, iconSize: 36 },
  xl: { width: 220, height: 132, iconSize: 44 },
};

const islandThemes: Record<string, { var: string; name: string }> = {
  omnis: { var: "--kr-island-omnis", name: "omnis" },
  agencia: { var: "--kr-island-agencia", name: "agencia" },
  akasha: { var: "--kr-island-akasha", name: "akasha" },
  filosofia: { var: "--kr-island-filosofia", name: "filosofia" },
  financas: { var: "--kr-island-financas", name: "financas" },
  forja: { var: "--kr-island-forja", name: "forja" },
  observatorio: { var: "--kr-island-observatorio", name: "observatorio" },
  vila: { var: "--kr-island-vila", name: "vila" },
  arena: { var: "--kr-island-arena", name: "arena" },
  nimbus: { var: "--kr-island-nimbus", name: "nimbus" },
};

const iconMap: Record<string, LucideIcon> = {
  omnis: Cpu,
  agencia: Palette,
  akasha: Database,
  filosofia: BookOpen,
  financas: Wallet,
  forja: Flame,
  observatorio: Telescope,
  vila: Home,
  arena: Target,
  nimbus: Cloud,
};

const statusBorder: Record<"active" | "idle" | "alert", string> = {
  active: "2px solid color-mix(in oklab, var(--kr-success, #22C55E) 60%, transparent)",
  idle: "1px solid color-mix(in oklab, var(--kr-text-primary, #E5E7EB) 8%, transparent)",
  alert: "2px solid color-mix(in oklab, var(--kr-danger, #EF4444) 50%, transparent)",
};

/**
 * FloatingIsland — Organic-shaped floating island with pseudo-3D depth.
 *
 * Visual layers:
 * - Glow aura behind the island
 * - Green grass top with organic border-radius
 * - Earth/rock base extrusion
 * - Dark shadow beneath (ground-level depth cue)
 * - Lucide icon on top (no emojis)
 *
 * Float animation via kr-float-slow (6s ease-in-out infinite).
 */
export function FloatingIsland({
  size = "lg",
  label,
  theme,
  onClick,
  status = "idle",
  className,
}: FloatingIslandProps) {
  const dims = sizeMap[size];
  const themeToken = theme ? islandThemes[theme] ?? null : null;

  const glowColor = themeToken
    ? `var(${themeToken.var})`
    : "var(--kr-azure, #1E90FF)";

  const IslandIcon = useMemo(() => {
    if (!theme) return Cloud;
    return iconMap[theme] ?? Cloud;
  }, [theme]);

  const Component = onClick ? "button" : "div";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Glow aura */}
      <div
        className="kr-animate-pulse-glow absolute rounded-full"
        style={{
          width: dims.width * 1.6,
          height: dims.height * 1.6,
          background: `radial-gradient(ellipse at center, color-mix(in oklab, ${glowColor} 13%, transparent) 0%, transparent 70%)`,
          filter: "blur(24px)",
        }}
        aria-hidden="true"
      />

      {/* Main island container with perspective */}
      <div style={{ perspective: "600px" }}>
        {/* Island shape — grass top with organic curves */}
        <Component
          onClick={onClick}
          type={onClick ? "button" : undefined}
          className={cn(
            "kr-animate-float-slow relative flex items-end justify-center",
            onClick &&
              "cursor-pointer transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
          style={{
            width: dims.width,
            height: dims.height,
            background: `linear-gradient(
              180deg,
              var(--kr-grass, #22C55E) 0%,
              var(--kr-grass-light, #4ADE80) 15%,
              var(--kr-grass, #22C55E) 25%,
              var(--kr-earth, #92400E) 50%,
              var(--kr-earth-dark, #78350F) 100%
            )`,
            borderRadius: "44% 56% 50% 50% / 52% 48% 54% 46%",
            border: statusBorder[status],
            boxShadow: `var(--kr-shadow-island, 0 24px 70px color-mix(in oklab, black 35%, transparent)),
              ${themeToken ? `0 0 30px color-mix(in oklab, ${glowColor} 25%, transparent)` : ""}`,
            willChange: "transform",
          } as CSSProperties}
        >
          {/* Grass highlight — subtle top edge */}
          <div
            className="absolute inset-x-0 top-0 h-[30%] rounded-t-[inherit]"
            style={{
              background: `linear-gradient(
                180deg,
                var(--kr-grass-light, #4ADE80) 0%,
                transparent 100%
              )`,
              opacity: 0.5,
            }}
            aria-hidden="true"
          />

          {/* Lucide icon on top */}
          <IslandIcon
            className="relative z-10 mb-2 drop-shadow-lg"
            size={dims.iconSize}
            style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
            aria-hidden="true"
          />
        </Component>

        {/* Earth base — bottom extrusion for 3D depth */}
        <div
          className="mx-auto rounded-b-2xl"
          style={{
            width: dims.width * 0.85,
            height: dims.height * 0.2,
            background: `linear-gradient(
              180deg,
              var(--kr-earth-dark, #78350F) 0%,
              var(--kr-surface-abyss, #020617) 100%
            )`,
            marginTop: -2,
            opacity: 0.65,
          }}
          aria-hidden="true"
        />

        {/* Dark shadow beneath island */}
        <div
          className="mx-auto rounded-full"
          style={{
            width: dims.width * 0.75,
            height: dims.height * 0.15,
            background: "color-mix(in oklab, black 35%, transparent)",
            filter: "blur(8px)",
            marginTop: dims.height * 0.05,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Label below the island */}
      {label && (
        <span
          className="mt-2 text-center text-xs font-semibold uppercase tracking-wider"
          style={{
            color: "var(--kr-text-secondary, #9CA3AF)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
