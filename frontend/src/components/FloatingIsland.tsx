interface FloatingIslandProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
  size?: "sm" | "md" | "lg" | "central";
  x: number;
  y: number;
  onClick?: () => void;
  pulse?: boolean;
}

const SIZE_MAP = {
  sm: { w: 85, h: 85, font: "var(--kr-text-xs)" },
  md: { w: 110, h: 110, font: "var(--kr-text-sm)" },
  lg: { w: 140, h: 140, font: "var(--kr-text-md)" },
  central: { w: 200, h: 200, font: "var(--kr-text-lg)" },
};

export default function FloatingIsland({
  id,
  label,
  icon,
  color,
  glowColor,
  size = "md",
  x,
  y,
  onClick,
  pulse = false,
}: FloatingIslandProps) {
  const dims = SIZE_MAP[size];

  return (
    <button
      className={`kr-island kr-island--${size}${pulse ? " kr-island--pulse" : ""}`}
      style={{
        left: `calc(${x}% - ${dims.w / 2}px)`,
        top: `calc(${y}% - ${dims.h / 2}px)`,
        width: dims.w,
        height: dims.h,
        "--kr-island-accent": color,
        "--kr-island-glow": glowColor,
      } as React.CSSProperties}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <div className="kr-island-platform">
        <div className="kr-island-top" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${color} 25%, var(--kr-isle-fern)) 0%, var(--kr-isle-moss) 40%, var(--kr-earth-mid) 100%)` }}>
          <div className="kr-island-grass" />
        </div>
        <div className="kr-island-body" />
        <div className="kr-island-buildings">
          <span className="kr-island-icon" style={{ color }}>{icon}</span>
        </div>
        <div className="kr-island-shadow" />
      </div>
      <span className="kr-island-label">{label}</span>
    </button>
  );
}
