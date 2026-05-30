import React from 'react';

export type SourceType = "live" | "cached" | "fallback" | "mock" | "error" | "unknown";

interface SourceBadgeProps {
  source: SourceType;
  label?: string;
  compact?: boolean;
  className?: string;
}

const SOURCE_COLORS: Record<SourceType, string> = {
  live: "var(--kr-color-live)",
  cached: "var(--kr-yellow-400)",
  fallback: "var(--kr-orange-400)",
  mock: "var(--kr-text-muted)",
  error: "var(--kr-red-400)",
  unknown: "var(--kr-text-disabled)",
};

const SOURCE_BG: Record<SourceType, string> = {
  live: "var(--kr-source-live-bg)",
  cached: "var(--kr-source-cached-bg)",
  fallback: "var(--kr-source-fallback-bg)",
  mock: "var(--kr-source-mock-bg)",
  error: "var(--kr-source-error-bg)",
  unknown: "var(--kr-source-unknown-bg)",
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

export default function SourceBadge({
  source,
  label,
  compact = false,
  className = ''
}: SourceBadgeProps) {
  const color = SOURCE_COLORS[source] || SOURCE_COLORS.unknown;
  const bg = SOURCE_BG[source] || SOURCE_BG.unknown;
  const dotClass = SOURCE_DOT_CLASS[source] || SOURCE_DOT_CLASS.unknown;
  const text = label || DEFAULT_LABELS[source] || source;

  return (
    <span
      className={`kr-chip ${className}`.trim()}
      style={{
        color,
        background: bg,
        gap: compact ? 0 : 4,
      }}
      title={`Fonte dos dados: ${text}`}
    >
      <span className={dotClass} />
      {!compact && <span>{text}</span>}
    </span>
  );
}