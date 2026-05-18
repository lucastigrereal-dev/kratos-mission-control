import { useEffect, useRef } from "react";

interface Props {
  value: number;       // 0-100
  size?: number;       // px, default 48
  strokeWidth?: number; // default 4
  color?: string;      // default var(--kratos-ok)
  trackColor?: string; // default var(--kratos-surface-3)
  label?: string;      // texto central opcional
}

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = "var(--kratos-ok)",
  trackColor = "var(--kratos-surface-3)",
  label,
}: Props) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const progressRef = useRef<SVGCircleElement>(null);

  // Animação no mount: de 0 → offset final
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.strokeDashoffset = String(circumference);
    // Força reflow para a transição funcionar
    void el.getBoundingClientRect();
    el.style.transition = `stroke-dashoffset 150ms cubic-bezier(0.16, 1, 0.3, 1)`;
    el.style.strokeDashoffset = String(offset);
  }, [circumference, offset]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${clampedValue}%` : `${clampedValue}%`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={progressRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {label !== undefined && (
        <span
          className="absolute text-[10px] font-medium kratos-mono"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
