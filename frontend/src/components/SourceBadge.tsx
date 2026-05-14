export type SourceType = "live" | "cached" | "fallback" | "mock" | "error" | "unknown";

interface SourceBadgeProps {
  source: SourceType;
  label?: string;
  compact?: boolean;
}

const SOURCE_COLORS: Record<SourceType, string> = {
  live: "var(--kr-color-live)",
  cached: "var(--kr-yellow-400)",
  fallback: "var(--kr-orange-400)",
  mock: "var(--kr-text-muted)",
  error: "var(--kr-red-400)",
  unknown: "var(--kr-text-disabled)",
};

const SOURCE_DOT_CLASS: Record<SourceType, string> = {
  live: "kr-dot kr-dot-live",
  cached: "kr-dot kr-dot-degraded",
  fallback: "kr-dot kr-dot-degraded",
  mock: "kr-dot kr-dot-offline",
  error: "kr-dot kr-dot-critical",
  unknown: "kr-dot kr-dot-offline",
};

const DEFAULT_LABELS: Record<SourceType, string> = {
  live: "ao vivo",
  cached: "cache",
  fallback: "fallback",
  mock: "mock",
  error: "erro",
  unknown: "desconhecido",
};

export default function SourceBadge({ source, label, compact = false }: SourceBadgeProps) {
  const color = SOURCE_COLORS[source] || SOURCE_COLORS.unknown;
  const dotClass = SOURCE_DOT_CLASS[source] || SOURCE_DOT_CLASS.unknown;
  const text = label || DEFAULT_LABELS[source] || source;

  return (
    <span
      className="kr-chip"
      style={{
        color,
        background: `${color}1a`,
        fontSize: "var(--kr-text-xs)",
        gap: compact ? 0 : 4,
      }}
      title={`Fonte dos dados: ${text}`}
    >
      <span className={dotClass} />
      {!compact && <span>{text}</span>}
    </span>
  );
}
