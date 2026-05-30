# KratosCard Component

## Description
A content container component that follows the KRATOS design system. Provides a consistent way to display content with proper spacing and styling.

## Props
- `children`: ReactNode - Content to be rendered inside the card
- `title`: string (optional) - Card title
- `subtitle`: string (optional) - Card subtitle
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { ReactNode } from "react";

interface KratosCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function KratosCard({
  children,
  title,
  subtitle,
  className = "",
  style,
}: KratosCardProps) {
  const classes = `kr-card ${className}`.trim();

  return (
    <div className={classes} style={style}>
      {(title || subtitle) && (
        <div style={{ marginBottom: "12px" }}>
          {title && (
            <h3 style={{ 
              fontSize: "var(--kr-text-lg)", 
              fontWeight: 600, 
              color: "var(--kr-text-primary)",
              margin: "0 0 4px 0"
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ 
              fontSize: "var(--kr-text-sm)", 
              color: "var(--kr-text-secondary)",
              margin: 0
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
```

## Usage Examples
```tsx
// Basic card
<KratosCard>
  <p>Basic card content</p>
</KratosCard>

// Card with title
<KratosCard title="System Status">
  <p>System is operational</p>
</KratosCard>

// Card with title and subtitle
<KratosCard title="Mission Progress" subtitle="Current mission status overview">
  <p>Mission is 75% complete</p>
</KratosCard>
```

## CSS Classes Used
- `kr-card` - Base card styling

## Design Tokens Referenced
- `--kr-bg-card` - Card background color
- `--kr-border-default` - Default border color
- `--kr-radius-lg` - Large border radius
- `--kr-space-section` - Section spacing
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-text-lg` - Large text size
- `--kr-text-sm` - Small text size
- `--kr-font-weight-600` - Semi-bold font weight