import { cn } from "@/lib/utils";

interface IslandLabelProps {
  title: string;
  subtitle?: string;
  theme?: string;
  position?: "top" | "bottom";
  className?: string;
}

const themeAccentMap: Record<string, { color: string; bg: string }> = {
  omnis: { color: "#60A5FA", bg: "#1E3A8A" },
  agencia: { color: "#F87171", bg: "#7F1D1D" },
  akasha: { color: "#34D399", bg: "#064E3B" },
  filosofia: { color: "#A78BFA", bg: "#4C1D95" },
  financas: { color: "#34D399", bg: "#064E3B" },
  forja: { color: "#FB923C", bg: "#7C2D12" },
  observatorio: { color: "#60A5FA", bg: "#1E3A8A" },
  vila: { color: "#34D399", bg: "#064E3B" },
  arena: { color: "#F87171", bg: "#7F1D1D" },
  nimbus: { color: "#5EEAD4", bg: "#0F766E" },
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
          background: accent?.color ?? "#9CA3AF",
          opacity: 0.8,
        }}
        aria-hidden="true"
      />

      {/* Plaque */}
      <div
        className="flex flex-col items-center rounded-lg px-3 py-1"
        style={{
          background: accent?.bg ?? "#1E293B",
          border: `1.5px solid ${accent?.color ?? "#475569"}`,
          boxShadow: `0 4px 12px color-mix(in oklab, black 35%, transparent), 0 0 8px color-mix(in oklab, ${accent?.color ?? "#475569"} 20%, transparent)`,
          minWidth: 100,
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="mt-0.5 text-[9px] whitespace-nowrap"
            style={{ color: accent?.color ?? "#94A3B8" }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
