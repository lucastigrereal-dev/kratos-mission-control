# StatusChip Component

## Description
An inline status indicator component that displays the status of an item with color-coded visual feedback. Used throughout the KRATOS interface to show health, progress, or state information.

## Props
- `status`: "healthy" | "degraded" | "critical" | "offline" | "stale" | "info" | "neutral" - Status type
- `label`: string - Text label to display
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { ReactNode } from "react";

interface StatusChipProps {
  status: "healthy" | "degraded" | "critical" | "offline" | "stale" | "info" | "neutral";
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function StatusChip({
  status,
  label,
  className = "",
  style,
}: StatusChipProps) {
  const statusClasses = {
    healthy: "kr-chip-healthy",
    degraded: "kr-chip-degraded",
    critical: "kr-chip-critical",
    offline: "kr-chip-offline",
    stale: "kr-chip-degraded",
    info: "kr-chip-info",
    neutral: "kr-chip-neutral",
  };

  const classes = `kr-chip ${statusClasses[status]} ${className}`.trim();

  return (
    <span className={classes} style={style}>
      {label}
    </span>
  );
}
```

## Usage Examples
```tsx
// Healthy status
<StatusChip status="healthy" label="Operacional" />

// Degraded status
<StatusChip status="degraded" label="Atenção" />

// Critical status
<StatusChip status="critical" label="Crítico" />

// Offline status
<StatusChip status="offline" label="Offline" />

// Stale status
<StatusChip status="stale" label="Desatualizado" />

// Info status
<StatusChip status="info" label="Informação" />

// Neutral status
<StatusChip status="neutral" label="Neutro" />
```

## CSS Classes Used
- `kr-chip` - Base chip styling
- `kr-chip-healthy` - Healthy status styling
- `kr-chip-degraded` - Degraded status styling
- `kr-chip-critical` - Critical status styling
- `kr-chip-offline` - Offline status styling
- `kr-chip-info` - Info status styling
- `kr-chip-neutral` - Neutral status styling

## Design Tokens Referenced
- `--kr-status-healthy` - Healthy status color
- `--kr-status-degraded` - Degraded status color
- `--kr-status-critical` - Critical status color
- `--kr-status-offline` - Offline status color
- `--kr-status-stale` - Stale status color
- `--kr-color-info` - Info status color
- `--kr-color-neutral` - Neutral status color
- `--kr-radius-full` - Full border radius for pill shape
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-500` - Medium font weight