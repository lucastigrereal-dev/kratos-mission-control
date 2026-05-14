type MetricTone = "neutral" | "good" | "warning" | "danger" | "info";

interface MetricBadgeProps {
  label: string;
  value: string | number;
  tone?: MetricTone;
  compact?: boolean;
}

const TONE_CLASS: Record<MetricTone, string> = {
  neutral: "kr-metric-badge--neutral",
  good: "kr-metric-badge--good",
  warning: "kr-metric-badge--warning",
  danger: "kr-metric-badge--danger",
  info: "kr-metric-badge--info",
};

export default function MetricBadge({ label, value, tone = "neutral", compact = false }: MetricBadgeProps) {
  return (
    <div className={`kr-metric-badge ${TONE_CLASS[tone]}${compact ? " kr-metric-badge--compact" : ""}`}>
      <span className="kr-metric-badge-value">{value}</span>
      <span className="kr-metric-badge-label">{label}</span>
    </div>
  );
}
