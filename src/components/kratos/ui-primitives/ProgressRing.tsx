import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number; // default 48
  strokeWidth?: number; // default 4
  color?: string; // default --kratos-ok
  trackColor?: string;
  glow?: boolean;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = "var(--kratos-ok)",
  trackColor = "var(--kratos-surface-3)",
  glow = false,
  label,
  className,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.strokeDashoffset = String(circumference);
    void el.getBoundingClientRect();
    el.style.transition = "stroke-dashoffset 600ms var(--kr-ease-out)";
    el.style.strokeDashoffset = String(offset);
  }, [circumference, offset]);

  const glowFilterId = glow ? `progress-glow-${clampedValue}-${size}` : undefined;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${clampedValue}%`}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: "rotate(-90deg)",
          filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
        }}
      >
        {glow && (
          <defs>
            <filter id={glowFilterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>
        )}

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
          ref={circleRef}
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
          className="absolute text-[10px] font-semibold select-none"
          style={{
            color: "var(--kratos-text-primary)",
            fontFamily: "var(--kratos-font-mono)",
            fontFeatureSettings: '"tnum", "ss01"',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
