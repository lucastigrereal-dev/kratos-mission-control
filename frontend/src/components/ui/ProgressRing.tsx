type RingVariant = "default" | "success" | "warning" | "danger";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  variant?: RingVariant;
}

const VARIANT_COLORS: Record<RingVariant, string> = {
  default: "var(--kr-azure-500)",
  success: "var(--kr-green-500)",
  warning: "var(--kr-yellow-500)",
  danger: "var(--kr-red-500)",
};

export default function ProgressRing({ value, size = 48, strokeWidth = 4, label, variant = "default" }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="kr-progress-ring" style={{ width: size, height: size }} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? `${clamped}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="kr-progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="kr-progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={VARIANT_COLORS[variant]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label && <span className="kr-progress-ring-label">{label}</span>}
    </div>
  );
}
