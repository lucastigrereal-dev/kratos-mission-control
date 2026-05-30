import { cn } from "@/lib/utils";

interface IslandLabelProps {
  title: string;
  subtitle?: string;
  theme?: string;
  position?: "top" | "bottom";
  className?: string;
}

const themeAccentMap: Record<string, { color: string; bg: string }> = {
  omnis: {
    color: "var(--kr-island-omnis)",
    bg: "color-mix(in oklab, var(--kr-island-omnis) 40%, black)",
  },
  agencia: {
    color: "var(--kr-island-agencia)",
    bg: "color-mix(in oklab, var(--kr-island-agencia) 40%, black)",
  },
  akasha: {
    color: "var(--kr-island-akasha)",
    bg: "color-mix(in oklab, var(--kr-island-akasha) 40%, black)",
  },
  filosofia: {
    color: "var(--kr-island-filosofia)",
    bg: "color-mix(in oklab, var(--kr-island-filosofia) 40%, black)",
  },
  financas: {
    color: "var(--kr-island-financas)",
    bg: "color-mix(in oklab, var(--kr-island-financas) 40%, black)",
  },
  forja: {
    color: "var(--kr-island-forja)",
    bg: "color-mix(in oklab, var(--kr-island-forja) 40%, black)",
  },
  observatorio: {
    color: "var(--kr-island-observatorio)",
    bg: "color-mix(in oklab, var(--kr-island-observatorio) 40%, black)",
  },
  vila: {
    color: "var(--kr-island-vila)",
    bg: "color-mix(in oklab, var(--kr-island-vila) 40%, black)",
  },
  arena: {
    color: "var(--kr-island-arena)",
    bg: "color-mix(in oklab, var(--kr-island-arena) 40%, black)",
  },
  nimbus: {
    color: "var(--kr-island-nimbus)",
    bg: "color-mix(in oklab, var(--kr-island-nimbus) 40%, black)",
  },
};

/**
 * IslandLabel — Colorful opaque plaque label matching mockup style.
 *
 * No glass, no blur — solid themed colors with clear typography.
 */
export function IslandLabel({
  title,
  subtitle,
  theme,
  position = "bottom",
  className,
}: IslandLabelProps) {
  const accent = theme ? themeAccentMap[theme] ?? null : null;

  return (
    <div
      className={cn(
        "kr-animate-float-medium flex flex-col items-center",
        position === "top" && "flex-col-reverse",
        className,
      )}
      style={{ willChange: "transform" }}
    >
      {/* Connection dot */}
      <div
        className="mb-1 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: accent?.color ?? "var(--kr-text-muted)",
          opacity: 0.8,
        }}
        aria-hidden="true"
      />

      {/* Plaque */}
      <div
        className="flex flex-col items-center rounded-lg px-3 py-1"
        style={{
          background: accent?.bg ?? "var(--kr-surface-mid)",
          border: `1.5px solid ${accent?.color ?? "var(--kr-surface-high)"}`,
          boxShadow: `0 4px 12px color-mix(in oklab, black 35%, transparent), 0 0 8px color-mix(in oklab, ${accent?.color ?? "var(--kr-surface-high)"} 20%, transparent)`,
          minWidth: 100,
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="mt-0.5 text-[9px] whitespace-nowrap"
            style={{ color: accent?.color ?? "var(--kr-text-secondary)" }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
