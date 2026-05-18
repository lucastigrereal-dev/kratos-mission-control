import { cn } from "@/lib/utils";

interface IslandLabelProps {
  /** Island display name */
  title: string;
  /** Optional one-line description */
  subtitle?: string;
  /** Island theme for accent coloring */
  theme?: string;
  /** Position relative to island: above or below */
  position?: "top" | "bottom";
  className?: string;
}

const themeAccentMap: Record<string, string> = {
  omnis: "--kr-island-omnis",
  agencia: "--kr-island-agencia",
  akasha: "--kr-island-akasha",
  filosofia: "--kr-island-filosofia",
  financas: "--kr-island-financas",
  forja: "--kr-island-forja",
  observatorio: "--kr-island-observatorio",
  vila: "--kr-island-vila",
  arena: "--kr-island-arena",
  nimbus: "--kr-island-nimbus",
};

/**
 * IslandLabel — Glass floating label positioned above/below an island.
 *
 * Features:
 * - GlassPanel surface with reduced padding for compactness
 * - Themed left-border accent matching the island color
 * - Small dot indicator connecting to the island
 * - kr-animate-float-medium for subtle drift
 */
export function IslandLabel({
  title,
  subtitle,
  theme,
  position = "bottom",
  className,
}: IslandLabelProps) {
  const accentColor = theme ? themeAccentMap[theme] ?? null : null;

  return (
    <div
      className={cn(
        "kr-animate-float-medium flex flex-col items-center",
        className,
      )}
      style={{ willChange: "transform" }}
    >
      {/* Connection dot — visual link to island */}
      <div
        className="mb-1 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: accentColor
            ? `var(${accentColor})`
            : "var(--kr-text-muted, #6B7280)",
          opacity: 0.6,
        }}
        aria-hidden="true"
      />

      {/* Label panel */}
      <div
        className="flex flex-col items-center rounded-xl px-3 py-1.5"
        style={{
          background: "var(--kr-glass-bg, rgba(11, 18, 32, 0.78))",
          border: `1px solid var(--kr-glass-border, rgba(255, 255, 255, 0.12))`,
          borderLeft: accentColor
            ? `2px solid var(${accentColor})`
            : undefined,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        }}
      >
        <span
          className="text-xs font-bold uppercase tracking-wider whitespace-nowrap"
          style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="mt-0.5 text-[10px] whitespace-nowrap"
            style={{ color: "var(--kr-text-muted, #6B7280)" }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
