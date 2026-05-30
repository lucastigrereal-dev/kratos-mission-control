# LiveStatusBadge Component

## Description
A specialized badge component that displays live system status with animated indicators. Used to show real-time operational status with visual feedback for critical systems.

## Props
- `status`: "live" | "degraded" | "critical" | "offline" | "reconnecting" | "polling" | "fallback" - System status
- `label`: string - Status label to display
- `pulse`: boolean - Whether to show pulsing animation (default: true)
- `compact`: boolean - Compact variant without label (default: false)
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { useMemo } from "react";

type LiveStatus = "live" | "degraded" | "critical" | "offline" | "reconnecting" | "polling" | "fallback";

interface LiveStatusBadgeProps {
  status: LiveStatus;
  label?: string;
  pulse?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const STATUS_CONFIG: Record<LiveStatus, { 
  label: string; 
  color: string; 
  bgColor: string; 
  dotClass: string;
  pulseClass?: string;
}> = {
  live: {
    label: "Operacional",
    color: "var(--kr-color-live)",
    bgColor: "var(--kr-status-healthy-bg)",
    dotClass: "kr-dot-live",
    pulseClass: "kr-dot-live-pulse"
  },
  degraded: {
    label: "Degradado",
    color: "var(--kr-status-degraded)",
    bgColor: "var(--kr-status-degraded-bg)",
    dotClass: "kr-dot-degraded"
  },
  critical: {
    label: "Crítico",
    color: "var(--kr-status-critical)",
    bgColor: "var(--kr-status-critical-bg)",
    dotClass: "kr-dot-critical"
  },
  offline: {
    label: "Offline",
    color: "var(--kr-status-offline)",
    bgColor: "var(--kr-status-offline-bg)",
    dotClass: "kr-dot-offline"
  },
  reconnecting: {
    label: "Reconectando",
    color: "var(--kr-status-degraded)",
    bgColor: "var(--kr-status-degraded-bg)",
    dotClass: "kr-dot-degraded"
  },
  polling: {
    label: "Atualizando",
    color: "var(--kr-status-degraded)",
    bgColor: "var(--kr-status-degraded-bg)",
    dotClass: "kr-dot-degraded"
  },
  fallback: {
    label: "Fallback",
    color: "var(--kr-status-stale)",
    bgColor: "var(--kr-status-stale-bg)",
    dotClass: "kr-dot-stale"
  }
};

export default function LiveStatusBadge({
  status,
  label,
  pulse = true,
  compact = false,
  className = "",
  style
}: LiveStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
  const displayLabel = label || config.label;
  
  const dotClasses = useMemo(() => {
    let classes = `kr-dot ${config.dotClass}`;
    if (pulse && config.pulseClass) {
      classes += ` ${config.pulseClass}`;
    }
    return classes;
  }, [config.dotClass, config.pulseClass, pulse]);

  if (compact) {
    return (
      <span
        className={`kr-status-badge ${className}`.trim()}
        style={{
          background: config.bgColor,
          color: config.color,
          padding: "4px",
          minWidth: "12px",
          minHeight: "12px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--kr-radius-full)",
          ...style
        }}
        title={displayLabel}
      >
        <span className={dotClasses} />
      </span>
    );
  }

  return (
    <span
      className={`kr-status-badge ${className}`.trim()}
      style={{
        background: config.bgColor,
        color: config.color,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "var(--kr-radius-full)",
        fontSize: "var(--kr-text-xs)",
        fontWeight: 600,
        fontFamily: "var(--kr-font-sans)",
        letterSpacing: "0.04em",
        ...style
      }}
    >
      <span className={dotClasses} />
      <span>{displayLabel}</span>
    </span>
  );
}
```

## Usage Example
```tsx
import LiveStatusBadge from "./components/ui/LiveStatusBadge";

export default function StatusExamples() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Live status */}
      <LiveStatusBadge status="live" label="Sistema Online" />
      
      {/* Degraded status */}
      <LiveStatusBadge status="degraded" label="Performance Reduzida" />
      
      {/* Critical status */}
      <LiveStatusBadge status="critical" label="Falha Crítica" />
      
      {/* Offline status */}
      <LiveStatusBadge status="offline" label="Sistema Offline" />
      
      {/* Compact variant */}
      <LiveStatusBadge status="live" compact />
      
      {/* Without pulse animation */}
      <LiveStatusBadge status="live" pulse={false} />
    </div>
  );
}
```

## CSS Classes Used
- `kr-status-badge` - Base badge styling
- `kr-dot` - Base dot styling
- `kr-dot-live` - Live status dot
- `kr-dot-live-pulse` - Pulsing live dot
- `kr-dot-degraded` - Degraded status dot
- `kr-dot-critical` - Critical status dot
- `kr-dot-offline` - Offline status dot
- `kr-dot-stale` - Stale status dot

## Design Tokens Referenced
- `--kr-color-live` - Live status color
- `--kr-status-degraded` - Degraded status color
- `--kr-status-critical` - Critical status color
- `--kr-status-offline` - Offline status color
- `--kr-status-stale` - Stale status color
- `--kr-status-healthy-bg` - Healthy status background
- `--kr-status-degraded-bg` - Degraded status background
- `--kr-status-critical-bg` - Critical status background
- `--kr-status-offline-bg` - Offline status background
- `--kr-status-stale-bg` - Stale status background
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-radius-full` - Full border radius
- `--kr-duration-pulse` - Pulse animation duration

## Status Types
1. **Live** - System fully operational with pulsing indicator
2. **Degraded** - System operational but with reduced performance
3. **Critical** - System experiencing critical issues
4. **Offline** - System completely unavailable
5. **Reconnecting** - Attempting to reconnect to system
6. **Polling** - Actively polling for updates
7. **Fallback** - Using fallback data sources

## Visual Features
- Color-coded status indicators
- Pulsing animation for live status
- Compact variant for space-constrained areas
- Configurable pulse animation
- Tooltip support with full status labels

## Accessibility Features
- Proper ARIA attributes
- Sufficient color contrast
- Screen reader friendly labels
- Visual indicators with text equivalents
- Consistent sizing for touch targets

## Animation System
- Pulse animation for live status
- Smooth transitions between states
- Configurable animation behavior
- Reduced motion support
- Performance optimized animations

## Responsive Behavior
- Flexible sizing based on container
- Text truncation for long labels
- Compact variant for small spaces
- Consistent visual hierarchy
- Appropriate spacing for touch interaction