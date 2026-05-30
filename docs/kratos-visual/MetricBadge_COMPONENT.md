# MetricBadge Component

## Description
A data visualization component that displays metrics with clear labeling and color-coded status indicators. Used throughout the KRATOS interface to show key performance indicators and metrics.

## Props
- `label`: string - Label for the metric
- `value`: string | number - Value to display
- `tone`: "neutral" | "good" | "warning" | "danger" | "info" - Color tone for the badge (default: "neutral")
- `compact`: boolean - Compact layout variant (default: false)

## Implementation
```tsx
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

export default function MetricBadge({ 
  label, 
  value, 
  tone = "neutral", 
  compact = false 
}: MetricBadgeProps) {
  return (
    <div className={`kr-metric-badge ${TONE_CLASS[tone]}${compact ? " kr-metric-badge--compact" : ""}`}>
      <span className="kr-metric-badge-value">{value}</span>
      <span className="kr-metric-badge-label">{label}</span>
    </div>
  );
}
```

## Usage Examples
```tsx
// Basic metric badge
<MetricBadge label="Energia" value="87%" />

// Good tone
<MetricBadge label="Progresso" value="100%" tone="good" />

// Warning tone
<MetricBadge label="Atenção" value="75%" tone="warning" />

// Danger tone
<MetricBadge label="Crítico" value="15%" tone="danger" />

// Info tone
<MetricBadge label="XP" value="32.780" tone="info" />

// Compact variant
<MetricBadge label="Nível" value="47" compact />

// Compact with tone
<MetricBadge label="Missões" value="3/5" tone="good" compact />
```

## CSS Classes Used
- `kr-metric-badge` - Base metric badge styling
- `kr-metric-badge--neutral` - Neutral tone styling
- `kr-metric-badge--good` - Good tone styling
- `kr-metric-badge--warning` - Warning tone styling
- `kr-metric-badge--danger` - Danger tone styling
- `kr-metric-badge--info` - Info tone styling
- `kr-metric-badge--compact` - Compact layout variant
- `kr-metric-badge-value` - Value text styling
- `kr-metric-badge-label` - Label text styling

## Design Tokens Referenced
- `--kr-text-primary` - Primary text color
- `--kr-text-muted` - Muted text color
- `--kr-text-xs` - Extra small text size
- `--kr-text-sm` - Small text size
- `--kr-text-xl` - Extra large text size
- `--kr-font-weight-500` - Medium font weight
- `--kr-font-weight-700` - Bold font weight
- `--kr-font-mono` - Monospace font family
- `--kr-radius-md` - Medium border radius
- `--kr-glass-bg` - Glass background
- `--kr-glass-border` - Glass border
- `--kr-green-500` - Good tone color
- `--kr-yellow-500` - Warning tone color
- `--kr-red-500` - Danger tone color
- `--kr-blue-500` - Info tone color
- `--kr-text-muted` - Neutral tone color