# SeverityBadge Component

## Description
A prominent status badge component used to display severity levels with clear visual hierarchy. Larger and more prominent than StatusChip, used for important status indicators.

## Props
- `severity`: "live" | "degraded" | "critical" | "offline" | "stale" - Severity level
- `label`: string - Text label to display
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { ReactNode } from "react";

interface SeverityBadgeProps {
  severity: "live" | "degraded" | "critical" | "offline" | "stale";
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SeverityBadge({
  severity,
  label,
  className = "",
  style,
}: SeverityBadgeProps) {
  const severityClasses = {
    live: "kr-status-badge--live",
    degraded: "kr-status-badge--degraded",
    critical: "kr-status-badge--critical",
    offline: "kr-status-badge--offline",
    stale: "kr-status-badge--stale",
  };

  const classes = `kr-status-badge ${severityClasses[severity]} ${className}`.trim();

  return (
    <span className={classes} style={style}>
      {label}
    </span>
  );
}
```

## Usage Examples
```tsx
// Live status
<SeverityBadge severity="live" label="AO VIVO" />

// Degraded status
<SeverityBadge severity="degraded" label="DEGRADADO" />

// Critical status
<SeverityBadge severity="critical" label="CRÍTICO" />

// Offline status
<SeverityBadge severity="offline" label="OFFLINE" />

// Stale status
<SeverityBadge severity="stale" label="DESATUALIZADO" />
```

## CSS Classes Used
- `kr-status-badge` - Base badge styling
- `kr-status-badge--live` - Live status styling
- `kr-status-badge--degraded` - Degraded status styling
- `kr-status-badge--critical` - Critical status styling
- `kr-status-badge--offline` - Offline status styling
- `kr-status-badge--stale` - Stale status styling

## Design Tokens Referenced
- `--kr-color-live` - Live status color
- `--kr-status-degraded` - Degraded status color
- `--kr-status-critical` - Critical status color
- `--kr-status-offline` - Offline status color
- `--kr-status-stale` - Stale status color
- `--kr-radius-full` - Full border radius for pill shape
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-tracking-label` - Letter spacing for labels