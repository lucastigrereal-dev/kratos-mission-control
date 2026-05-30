# SourceBadge Component

## Description
A component that displays the source of data with color-coded visual indicators. Used throughout the KRATOS interface to show the origin and reliability of displayed information.

## Props
- `source`: "live" | "cached" | "fallback" | "mock" | "error" | "unknown" - Data source type
- `label`: string (optional) - Custom label to display
- `compact`: boolean - Compact variant without text label (default: false)

## Implementation
```tsx
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
  const bg = SOURCE_BG[source] || SOURCE_BG.unknown;
  const dotClass = SOURCE_DOT_CLASS[source] || SOURCE_DOT_CLASS.unknown;
  const text = label || DEFAULT_LABELS[source] || source;

  return (
    <span
      className="kr-chip"
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
```

## Usage Examples
```tsx
// Live data source
<SourceBadge source="live" />

// Cached data source
<SourceBadge source="cached" />

// Fallback data source
<SourceBadge source="fallback" />

// Mock data source
<SourceBadge source="mock" />

// Error data source
<SourceBadge source="error" />

// Unknown data source
<SourceBadge source="unknown" />

// Custom label
<SourceBadge source="live" label="servidor" />

// Compact variant
<SourceBadge source="cached" compact />
```

## CSS Classes Used
- `kr-chip` - Base chip styling
- `kr-dot` - Base dot styling
- `kr-dot-live` - Live status dot
- `kr-dot-degraded` - Degraded status dot
- `kr-dot-critical` - Critical status dot
- `kr-dot-offline` - Offline status dot

## Design Tokens Referenced
- `--kr-color-live` - Live data color
- `--kr-yellow-400` - Cached data color
- `--kr-orange-400` - Fallback data color
- `--kr-text-muted` - Mock data color
- `--kr-red-400` - Error data color
- `--kr-text-disabled` - Unknown data color
- `--kr-source-live-bg` - Live data background
- `--kr-source-cached-bg` - Cached data background
- `--kr-source-fallback-bg` - Fallback data background
- `--kr-source-mock-bg` - Mock data background
- `--kr-source-error-bg` - Error data background
- `--kr-source-unknown-bg` - Unknown data background
- `--kr-radius-full` - Full border radius for pill shape
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-500` - Medium font weight