# GlassPanel Component

## Description
A reusable glass panel component that implements the KRATOS glassmorphism design system with multiple variants for different depth levels.

## Props
- `children`: ReactNode - Content to be rendered inside the panel
- `variant`: "default" | "strong" | "light" | "deep" - Depth variant (default: "default")
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  variant?: "default" | "strong" | "light" | "deep";
  className?: string;
  style?: React.CSSProperties;
}

export default function GlassPanel({
  children,
  variant = "default",
  className = "",
  style,
}: GlassPanelProps) {
  const baseClasses = "kr-glass-panel";
  const variantClasses = {
    default: "",
    strong: "kr-glass-panel--strong",
    light: "kr-glass-panel--light",
    deep: "kr-glass-panel--deep",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
```

## Usage Examples
```tsx
// Default glass panel
<GlassPanel>
  <p>Content in a default glass panel</p>
</GlassPanel>

// Strong variant for important content
<GlassPanel variant="strong">
  <h3>Important Information</h3>
  <p>This content stands out more.</p>
</GlassPanel>

// Light variant for subtle backgrounds
<GlassPanel variant="light">
  <p>Lightweight content panel</p>
</GlassPanel>

// Deep variant for maximum depth
<GlassPanel variant="deep">
  <p>Content with maximum glass effect</p>
</GlassPanel>
```

## CSS Classes Used
- `kr-glass-panel` - Base glass panel styling
- `kr-glass-panel--strong` - Enhanced glass effect with stronger background
- `kr-glass-panel--light` - Lighter glass effect with more transparency
- `kr-glass-panel--deep` - Maximum glass effect with deep background

## Design Tokens Referenced
- `--kr-glass-bg` - Base glass background
- `--kr-glass-bg-strong` - Strong glass background
- `--kr-glass-bg-light` - Light glass background
- `--kr-glass-depth-1` - Light depth background
- `--kr-glass-depth-4` - Deep depth background
- `--kr-glass-blur` - Base blur amount
- `--kr-glass-blur-strong` - Strong blur amount
- `--kr-glass-blur-max` - Maximum blur amount
- `--kr-glass-border` - Base glass border
- `--kr-glass-border-strong` - Strong glass border
- `--kr-shadow-glass` - Glass shadow
- `--kr-shadow-glass-hover` - Glass shadow on hover
- `--kr-radius-lg` - Large border radius