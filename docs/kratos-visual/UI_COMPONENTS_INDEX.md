# KRATOS UI Components Index

## Overview
This document provides an index of all UI components that should be available in the KRATOS design system. These components follow the KRATOS visual principles and use the design tokens consistently.

## Component Categories

### 1. Layout & Containers
- **GlassPanel** - Glassmorphism container with multiple depth variants
- **KratosCard** - Content container with title and subtitle support

### 2. Status Indicators
- **StatusChip** - Inline status indicator with color-coded feedback
- **SeverityBadge** - Prominent status badge for important indicators
- **SourceBadge** - Data source indicator with reliability coding

### 3. Data Visualization
- **MetricBadge** - Data visualization component for key metrics
- **ProgressRing** - Circular progress indicator with customizable colors

### 4. State Management
- **EmptyState** - Consistent empty state messaging with optional actions
- **ErrorState** - Error state display with severity levels and retry options
- **LoadingSkeleton** - Loading placeholders with shimmer animation

## Component Implementation Status

| Component | Status | File |
|-----------|--------|------|
| GlassPanel | ✅ Documented | `GlassPanel_COMPONENT.md` |
| StatusChip | ✅ Documented | `StatusChip_COMPONENT.md` |
| SeverityBadge | ✅ Documented | `SeverityBadge_COMPONENT.md` |
| KratosCard | ✅ Documented | `KratosCard_COMPONENT.md` |
| EmptyState | ✅ Documented | `EmptyState_COMPONENT.md` |
| ErrorState | ✅ Documented | `ErrorState_COMPONENT.md` |
| LoadingSkeleton | ✅ Documented | `LoadingSkeleton_COMPONENT.md` |
| ProgressRing | ✅ Documented | `ProgressRing_COMPONENT.md` |
| MetricBadge | ✅ Documented | `MetricBadge_COMPONENT.md` |
| SourceBadge | ✅ Documented | `SourceBadge_COMPONENT.md` |

## Usage Guidelines

### Import Pattern
```tsx
// Individual component import
import GlassPanel from "./components/ui/GlassPanel";
import StatusChip from "./components/ui/StatusChip";

// Or batch import if index file exists
import { GlassPanel, StatusChip } from "./components/ui";
```

### Styling Approach
All components use KRATOS design tokens and CSS classes:
- Prefer CSS classes over inline styles
- Use design tokens for consistent theming
- Leverage existing KRATOS CSS variables

### Accessibility
All components should:
- Include proper ARIA attributes
- Support keyboard navigation
- Provide sufficient color contrast
- Include meaningful labels and titles

## Design Token Integration

Components integrate with the following design token categories:

### Color Tokens
- Status colors (`--kr-status-*`)
- Brand colors (`--kr-*-500`)
- Glass effect colors (`--kr-glass-*`)

### Spacing Tokens
- HUD scale (`--kr-space-hud`)
- Section spacing (`--kr-space-section`)
- Panel spacing (`--kr-space-panel`)

### Typography Tokens
- Font sizes (`--kr-text-*`)
- Font weights (`--kr-font-weight-*`)
- Line heights (`--kr-leading-*`)

### Motion Tokens
- Duration (`--kr-duration-*`)
- Easing (`--kr-ease-*`)

## Future Enhancements

### Component Variants
- Dark mode support
- Reduced motion variants
- High contrast mode support

### Additional Components (Planned)
- **IconButton** - Icon-only button with tooltip
- **DataSparkline** - Miniature data visualization
- **TimelineEvent** - Event timeline item
- **NotificationToast** - Toast notification component
- **ModalDialog** - Modal dialog with glass effect
- **Tooltip** - Contextual tooltip with glass styling

## Component Relationships

### Hierarchy
```
GlassPanel (container)
├── KratosCard (content)
│   ├── MetricBadge (data)
│   ├── StatusChip (status)
│   └── ProgressRing (progress)
├── EmptyState (state)
├── ErrorState (state)
└── LoadingSkeleton (state)

SourceBadge (metadata)
SeverityBadge (status)
```

### Composition Examples
```tsx
// Card with metrics
<GlassPanel>
  <KratosCard title="System Health">
    <MetricBadge label="CPU" value="42%" tone="good" />
    <MetricBadge label="Memory" value="68%" tone="warning" />
    <SourceBadge source="live" />
  </KratosCard>
</GlassPanel>

// Status overview
<GlassPanel variant="strong">
  <div style={{ display: "flex", gap: 8 }}>
    <StatusChip status="healthy" label="API" />
    <StatusChip status="degraded" label="Database" />
    <SeverityBadge severity="degraded" label="ATENÇÃO" />
  </div>
</GlassPanel>
```