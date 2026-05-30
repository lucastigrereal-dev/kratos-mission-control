# KRATOS Visual Frontend Architecture

## Overview
This document provides a comprehensive overview of the KRATOS Mission Control frontend architecture, detailing the component structure, design system integration, and implementation guidelines.

## Architecture Layers

### 1. Design System Foundation
The KRATOS visual frontend is built on a robust design system that ensures consistency and coherence across all interface elements.

#### Core Principles
- **Neurocompatibility**: Designed for TDAH-first cognitive flow
- **Glassmorphism**: Translucent layers with depth and clarity
- **Island Metaphor**: Floating islands representing different domains
- **HUD Priority**: Mission-critical information always visible
- **Motion with Purpose**: Animations that communicate state

#### Design Tokens
All components utilize a comprehensive set of design tokens that define:
- Color palette with thematic island colors
- Typography scales for hierarchical information
- Spacing system for consistent layout
- Motion parameters for smooth transitions
- Z-index hierarchy for layer management

### 2. Component Hierarchy

#### Shell Layer (5-Zone Grid)
The application shell implements a fixed 5-zone grid layout:

1. **Top HUD** (`KratosTopBar`)
   - Operator greeting and identity
   - System status and connection state
   - Time and date display
   - Data source indicators

2. **Left Sidebar** (`LeftSidebar`)
   - Main navigation to all islands
   - Section-based organization
   - Active state management
   - Collapsible behavior

3. **Main Content Area**
   - Primary workspace for current island
   - Contextual content display
   - OperatorWelcomeCard for overview
   - Island-specific components

4. **Right Rail** (`RightRail`)
   - Aurora AI insights and recommendations
   - Risk radar and monitoring
   - Checkpoint access
   - Signal notifications

5. **Bottom Dock** (`BottomDock`)
   - Mission status and progress
   - Next action guidance
   - Active squad indicators
   - Continuation controls

#### UI Primitives Layer
Reusable foundational components that provide consistent visual language:

- **GlassPanel**: Glassmorphism container with depth variants
- **StatusChip**: Inline status indicators with color coding
- **SeverityBadge**: Prominent status badges for important states
- **KratosCard**: Content containers with title support
- **EmptyState**: Consistent empty state messaging
- **ErrorState**: Error display with severity levels
- **LoadingSkeleton**: Loading placeholders with shimmer animation
- **ProgressRing**: Circular progress visualization
- **MetricBadge**: Data visualization with contextual labels
- **SourceBadge**: Data source reliability indicators

#### Specialized Components Layer
Domain-specific components that serve unique functions:

- **LiveStatusBadge**: Real-time system status with pulse animation
- **SystemPulseBadge**: System health with animated pulse effects
- **AuroraPanel**: AI insights and decision guidance
- **NavItemButton**: Navigation items with icon and badge support
- **MissionBar**: Mission progress and next action display

### 3. Component Relationships

#### Shell Composition
```tsx
<KratosAppShell
  topHud={<KratosTopBar />}
  sidebar={<LeftSidebar />}
  rightRail={<RightRail />}
  bottomDock={<BottomDock />}
>
  <OperatorWelcomeCard />
</KratosAppShell>
```

#### Data Flow
1. **State Management**: Components consume data from centralized hooks
2. **Live Updates**: SSE integration for real-time data
3. **Source Tracking**: All data displays its origin (live, cached, etc.)
4. **Error Boundaries**: Graceful degradation for failed components

#### Thematic Integration
Each of the 11 canonical islands has its own color theme:
- **OMNIS Lab**: Purple (#7C3AED) + Cyan (#06B6D4)
- **Akasha / Gringotts**: Emerald (#059669) + Gold (#F59E0B)
- **Arena Comercial**: Red (#DC2626) + Gold (#F59E0B)
- **Agência / Estúdio**: Orange (#F97316)
- **Vila Viva**: Green (#16A34A)
- **Observatório**: Navy (#1E3A8A) + Cyan (#0EA5E9)
- **Nimbus Academy**: Cyan (#0EA5E9)
- **Tesouro / Finanças**: Dark Green (#166534) + Gold (#FACC15)
- **Forja / Corpo**: Gray (#475569) + Orange (#EA580C)
- **Filosofia & Sabedoria**: Violet (#7C3AED) + Lilac (#C4B5FD)

### 4. Implementation Guidelines

#### Styling Approach
- **CSS Classes**: Prefer semantic class names over inline styles
- **Design Tokens**: Use CSS custom properties for consistency
- **Glassmorphism**: Implement with backdrop-filter and rgba backgrounds
- **Responsive Design**: Mobile-first with desktop optimization

#### Accessibility Standards
- **Semantic HTML**: Proper element usage for screen readers
- **ARIA Attributes**: Roles and states for dynamic content
- **Keyboard Navigation**: Full tab-based interface navigation
- **Color Contrast**: WCAG AA compliance for all text
- **Focus Management**: Visible focus states for interactive elements

#### Performance Optimization
- **Lazy Loading**: Island components loaded on demand
- **Memoization**: useMemo and useCallback for expensive operations
- **Virtualization**: Long lists rendered efficiently
- **Bundle Splitting**: Code splitting by route and feature
- **Animation Performance**: GPU-accelerated transforms only

#### Motion Design
- **Reduced Motion**: Respect user preferences for motion
- **Purposeful Animation**: Every animation communicates meaning
- **Smooth Transitions**: Consistent easing and duration
- **Performance Conscious**: 60fps target for all animations

### 5. Component Documentation Index

#### Shell Components
- [`KratosAppShell`](./KratosAppShell_COMPONENT.md) - Main application shell
- [`KratosTopBar`](./KratosTopBar_COMPONENT.md) - Top navigation HUD
- [`LeftSidebar`](./LeftSidebar_COMPONENT.md) - Main navigation sidebar
- [`NavItemButton`](./NavItemButton_COMPONENT.md) - Navigation items
- [`RightRail`](./RightRail_COMPONENT.md) - Contextual information panel
- [`BottomDock`](./BottomDock_COMPONENT.md) - Mission status dock
- [`OperatorWelcomeCard`](./OperatorWelcomeCard_COMPONENT.md) - Welcome overview

#### UI Primitives
- [`GlassPanel`](./GlassPanel_COMPONENT.md) - Glassmorphism containers
- [`StatusChip`](./StatusChip_COMPONENT.md) - Inline status indicators
- [`SeverityBadge`](./SeverityBadge_COMPONENT.md) - Prominent status badges
- [`KratosCard`](./KratosCard_COMPONENT.md) - Content containers
- [`EmptyState`](./EmptyState_COMPONENT.md) - Empty state messaging
- [`ErrorState`](./ErrorState_COMPONENT.md) - Error state display
- [`LoadingSkeleton`](./LoadingSkeleton_COMPONENT.md) - Loading placeholders
- [`ProgressRing`](./ProgressRing_COMPONENT.md) - Circular progress
- [`MetricBadge`](./MetricBadge_COMPONENT.md) - Data visualization
- [`SourceBadge`](./SourceBadge_COMPONENT.md) - Data source indicators

#### Specialized Components
- [`LiveStatusBadge`](./LiveStatusBadge_COMPONENT.md) - Real-time status
- [`SystemPulseBadge`](./SystemPulseBadge_COMPONENT.md) - System health
- [`AuroraPanel`](./AuroraPanel_COMPONENT.md) - AI insights panel

### 6. Development Workflow

#### Component Creation Process
1. **Design Review**: Ensure alignment with KRATOS visual principles
2. **Token Usage**: Leverage existing design tokens
3. **Accessibility**: Implement proper ARIA and keyboard support
4. **Testing**: Create unit tests for all variants
5. **Documentation**: Provide comprehensive usage examples
6. **Integration**: Verify component works within shell context

#### Code Organization
```
src/
├── components/
│   ├── layout/          # Shell components
│   ├── ui/              # UI primitives
│   ├── world/           # World map components
│   ├── overlay/         # Overlay components
│   ├── interaction/     # Interactive components
│   └── stage/           # Stage area components
├── styles/
│   ├── kratos-tokens.css # Design tokens
│   ├── shell.css         # Shell layout
│   ├── components.css    # Component styles
│   ├── world.css         # World map styles
│   ├── motion.css        # Animation styles
│   └── responsive.css    # Responsive styles
├── hooks/
│   ├── useLiveKratos.ts  # Live data hook
│   └── useReducedMotion.ts # Motion preference hook
└── motion/
    └── variants.ts       # Framer Motion variants
```

#### Quality Assurance
- **Visual QA**: Compare against design specifications
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Multiple viewport sizes
- **Performance Testing**: Lighthouse audits
- **Accessibility Testing**: axe-core and manual testing

### 7. Future Enhancements

#### Planned Features
- **Dark/Light Mode**: Theme switching capability
- **Customizable Layout**: User-adjustable panel sizes
- **Advanced Animations**: Enhanced motion design
- **Voice Commands**: Audio-based navigation
- **Gesture Support**: Touch and pointer interactions

#### Technical Improvements
- **Micro Frontends**: Island-based component isolation
- **Web Components**: Standardized component interface
- **Server Components**: SSR for improved performance
- **Progressive Enhancement**: Graceful degradation strategy

#### Component Expansion
- **Data Visualization**: Charts and graphs
- **Timeline Components**: Event and progress tracking
- **Notification System**: Toast and banner notifications
- **Modal Dialogs**: Contextual overlays
- **Form Components**: Input and validation controls

### 8. Anti-Patterns and Best Practices

#### What NOT to Do
- **Avoid Generic SaaS Patterns**: No dashboard templates or CRM layouts
- **No Clutter**: One purpose per component
- **No Hidden Mission**: Always show current mission context
- **No Generic Icons**: Use meaningful, contextual icons
- **No Flat Design**: Always use glassmorphism and depth

#### Best Practices
- **Mission First**: Always prioritize mission-critical information
- **Consistent Motion**: Use established animation patterns
- **Thematic Colors**: Match components to island themes
- **Source Transparency**: Always show data origin
- **Neuro-Friendly**: Reduce cognitive load and decision fatigue

This architecture ensures that the KRATOS Mission Control frontend remains a cohesive, purposeful, and delightful experience that supports the operator's mission while maintaining the highest standards of visual design and technical excellence.