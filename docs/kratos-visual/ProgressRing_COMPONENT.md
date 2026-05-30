# ProgressRing Component

## Description
A circular progress indicator component that visually represents progress or completion percentage. Uses SVG to create a smooth, animated progress ring with customizable colors and labels.

## Props
- `value`: number - Progress percentage (0-100)
- `size`: number - Size of the ring in pixels (default: 48)
- `strokeWidth`: number - Width of the ring stroke (default: 4)
- `label`: string (optional) - Text label to display in the center
- `variant`: "default" | "success" | "warning" | "danger" - Color variant (default: "default")

## Implementation
```tsx
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

export default function ProgressRing({ 
  value, 
  size = 48, 
  strokeWidth = 4, 
  label, 
  variant = "default" 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div 
      className="kr-progress-ring" 
      style={{ width: size, height: size }} 
      role="progressbar" 
      aria-valuenow={clamped} 
      aria-valuemin={0} 
      aria-valuemax={100} 
      aria-label={label ?? `${clamped}%`}
    >
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
```

## Usage Examples
```tsx
// Basic progress ring
<ProgressRing value={75} />

// Progress ring with label
<ProgressRing value={50} label="50%" />

// Success variant
<ProgressRing value={100} variant="success" label="Completo" />

// Warning variant
<ProgressRing value={25} variant="warning" label="Atenção" />

// Danger variant
<ProgressRing value={10} variant="danger" label="Crítico" />

// Custom size
<ProgressRing value={60} size={64} strokeWidth={6} />
```

## CSS Classes Used
- `kr-progress-ring` - Base progress ring container
- `kr-progress-ring-track` - Background track circle
- `kr-progress-ring-fill` - Progress fill circle
- `kr-progress-ring-label` - Center label styling

## Design Tokens Referenced
- `--kr-azure-500` - Default progress color
- `--kr-green-500` - Success progress color
- `--kr-yellow-500` - Warning progress color
- `--kr-red-500` - Danger progress color
- `--kr-glass-border` - Track border color
- `--kr-text-secondary` - Label text color
- `--kr-text-xs` - Label text size
- `--kr-font-weight-700` - Label font weight
- `--kr-ease-smooth` - Smooth easing for transitions
- `--kr-duration-medium` - Medium duration for transitions