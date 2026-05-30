# SystemPulseBadge Component

## Description
A specialized badge component that displays system health with animated pulse effects. Used to indicate system activity levels and operational health with visual pulse animations.

## Props
- `level`: "low" | "medium" | "high" | "critical" - System activity level
- `label`: string - Badge label to display
- `pulseSpeed`: "slow" | "medium" | "fast" - Pulse animation speed (default: "medium")
- `compact`: boolean - Compact variant without label (default: false)
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { useMemo } from "react";

type PulseLevel = "low" | "medium" | "high" | "critical";
type PulseSpeed = "slow" | "medium" | "fast";

interface SystemPulseBadgeProps {
  level: PulseLevel;
  label?: string;
  pulseSpeed?: PulseSpeed;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PULSE_CONFIG: Record<PulseLevel, { 
  label: string; 
  color: string; 
  bgColor: string; 
  pulseColor: string;
  animationClass: string;
}> = {
  low: {
    label: "Baixa Atividade",
    color: "var(--kr-green-400)",
    bgColor: "var(--kr-status-healthy-bg)",
    pulseColor: "var(--kr-green-400)",
    animationClass: "kr-pulse-slow"
  },
  medium: {
    label: "Atividade Média",
    color: "var(--kr-yellow-400)",
    bgColor: "var(--kr-status-degraded-bg)",
    pulseColor: "var(--kr-yellow-400)",
    animationClass: "kr-pulse-medium"
  },
  high: {
    label: "Alta Atividade",
    color: "var(--kr-orange-400)",
    bgColor: "var(--kr-risk-high-bg)",
    pulseColor: "var(--kr-orange-400)",
    animationClass: "kr-pulse-fast"
  },
  critical: {
    label: "Atividade Crítica",
    color: "var(--kr-red-400)",
    bgColor: "var(--kr-risk-critical-bg)",
    pulseColor: "var(--kr-red-400)",
    animationClass: "kr-pulse-critical"
  }
};

const SPEED_CONFIG: Record<PulseSpeed, string> = {
  slow: "kr-pulse-slow",
  medium: "kr-pulse-medium",
  fast: "kr-pulse-fast"
};

export default function SystemPulseBadge({
  level,
  label,
  pulseSpeed = "medium",
  compact = false,
  className = "",
  style
}: SystemPulseBadgeProps) {
  const config = PULSE_CONFIG[level] || PULSE_CONFIG.low;
  const displayLabel = label || config.label;
  const animationClass = SPEED_CONFIG[pulseSpeed] || config.animationClass;
  
  const badgeClasses = useMemo(() => {
    return `kr-system-pulse-badge ${animationClass} ${className}`.trim();
  }, [animationClass, className]);

  if (compact) {
    return (
      <span
        className={badgeClasses}
        style={{
          background: config.bgColor,
          width: "16px",
          height: "16px",
          borderRadius: "var(--kr-radius-full)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          ...style
        }}
        title={displayLabel}
      >
        <span
          className="kr-system-pulse-inner"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "var(--kr-radius-full)",
            background: config.color,
          }}
        />
        <span
          className="kr-system-pulse-ring"
          style={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "var(--kr-radius-full)",
            border: `2px solid ${config.pulseColor}`,
            opacity: 0.4,
            animation: `${animationClass} 2s infinite`
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={badgeClasses}
      style={{
        background: config.bgColor,
        color: config.color,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        borderRadius: "var(--kr-radius-full)",
        fontSize: "var(--kr-text-xs)",
        fontWeight: 600,
        position: "relative",
        ...style
      }}
    >
      <span
        className="kr-system-pulse-indicator"
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "var(--kr-radius-full)",
          background: config.color,
          position: "relative"
        }}
      >
        <span
          className="kr-system-pulse-ring"
          style={{
            position: "absolute",
            inset: "-3px",
            borderRadius: "var(--kr-radius-full)",
            border: `1px solid ${config.pulseColor}`,
            opacity: 0.3,
            animation: `${animationClass} 2s infinite`
          }}
        />
      </span>
      <span>{displayLabel}</span>
    </span>
  );
}
```

## Usage Example
```tsx
import SystemPulseBadge from "./components/ui/SystemPulseBadge";

export default function PulseExamples() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Low activity */}
      <SystemPulseBadge level="low" label="Sistema Estável" />
      
      {/* Medium activity */}
      <SystemPulseBadge level="medium" label="Processando Dados" pulseSpeed="medium" />
      
      {/* High activity */}
      <SystemPulseBadge level="high" label="Alta Carga" pulseSpeed="fast" />
      
      {/* Critical activity */}
      <SystemPulseBadge level="critical" label="Sobrecarga" pulseSpeed="fast" />
      
      {/* Compact variants */}
      <div style={{ display: "flex", gap: "12px" }}>
        <SystemPulseBadge level="low" compact />
        <SystemPulseBadge level="medium" compact />
        <SystemPulseBadge level="high" compact />
        <SystemPulseBadge level="critical" compact />
      </div>
    </div>
  );
}
```

## CSS Classes Used
- `kr-system-pulse-badge` - Base badge styling
- `kr-system-pulse-inner` - Inner pulse indicator
- `kr-system-pulse-indicator` - Main pulse indicator
- `kr-system-pulse-ring` - Animated pulse ring
- `kr-pulse-slow` - Slow pulse animation
- `kr-pulse-medium` - Medium pulse animation
- `kr-pulse-fast` - Fast pulse animation
- `kr-pulse-critical` - Critical pulse animation

## Design Tokens Referenced
- `--kr-green-400` - Green color for low activity
- `--kr-yellow-400` - Yellow color for medium activity
- `--kr-orange-400` - Orange color for high activity
- `--kr-red-400` - Red color for critical activity
- `--kr-status-healthy-bg` - Healthy status background
- `--kr-status-degraded-bg` - Degraded status background
- `--kr-risk-high-bg` - High risk background
- `--kr-risk-critical-bg` - Critical risk background
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-radius-full` - Full border radius

## Activity Levels
1. **Low** - System stable with minimal activity (green)
2. **Medium** - System processing with moderate activity (yellow)
3. **High** - System under heavy load (orange)
4. **Critical** - System overload or critical processing (red)

## Animation System
- Configurable pulse speeds (slow, medium, fast)
- Smooth opacity transitions
- Circular pulse ring effects
- Performance optimized animations
- Reduced motion support

## Visual Features
- Color-coded activity levels
- Animated pulse rings
- Compact variant for space-constrained areas
- Configurable animation speeds
- Tooltip support with full labels

## Accessibility Features
- Proper ARIA attributes
- Sufficient color contrast
- Screen reader friendly labels
- Visual indicators with text equivalents
- Consistent sizing for touch targets

## Responsive Behavior
- Flexible sizing based on container
- Text truncation for long labels
- Compact variant for small spaces
- Consistent visual hierarchy
- Appropriate spacing for touch interaction