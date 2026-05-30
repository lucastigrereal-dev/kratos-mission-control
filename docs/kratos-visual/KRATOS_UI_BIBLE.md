# KRATOS 1.0 — UI Bible

## 1. Design Philosophy

KRATOS is not a generic SaaS dashboard. It's a local-first operational cockpit that transforms computer, projects, containers, Git, agenda, context, checkpoints, and alerts into clear next actions.

The visual design follows these principles:
- **Apple-clean**: Minimalist, uncluttered interfaces
- **Linear/Raycast clarity**: Information hierarchy and focus
- **HUD operational**: Clear status and actionable information
- **Living world**: Floating islands metaphor
- **Pseudo-3D safely**: Depth without performance issues
- **Aurora contextual**: AI assistance that's helpful, not intrusive
- **Neuro-UX TDAH-first**: Designed for focus and low cognitive load
- **No cyberpunk pollution**: Avoid visual noise and excessive effects
- **No generic SaaS**: Unique identity, not template-based

## 2. Color System

### 2.1 Core Palette
- **Sky & Ocean**: Deep blues and dark backgrounds (#06060d to #0e1e40)
- **Azure/Blue**: Primary accent colors (#3b82f6 family)
- **Ocean/Teal-Cyan**: Secondary accents (#0d9488 to #06b6d4)
- **Island/Green**: Success and positive states (#4d7c0f to #84cc16)
- **Arena/Red-Orange**: Warnings, errors, and critical states (#f43f5e to #f97316)
- **Gold**: KRATOS accent and highlights (#fde047 to #eab308)
- **Aurora/Purple-Violet**: AI and intelligence (#8b5cf6 family)

### 2.2 Semantic Colors
- **Status**: Healthy (green), Degraded (yellow), Critical (red), Offline (muted)
- **Source**: Live (green), Cached (yellow), Fallback (orange), Mock (gray), Error (red)
- **Mission**: Blue-based for active missions and tasks
- **Risk**: Red-based for risk indicators
- **Energy**: Cyan-based for Aurora and system energy

## 3. Typography

### 3.1 Font Stack
- **Primary (UI)**: Inter (system-ui fallbacks)
- **Monospace**: JetBrains Mono (Fira Code, Cascadia Code fallbacks)

### 3.2 Scale
- **Display**: 1.5rem (24px) - Bold
- **Headline**: 1.25rem (20px) - Semi-bold
- **Title**: 1rem (16px) - Regular
- **Body**: 0.8125rem (13px) - Regular
- **Label**: 0.75rem (12px) - Medium
- **Caption**: 0.625rem (10px) - Regular

### 3.3 Hierarchy
- Clear visual hierarchy with font weight and size
- Letter spacing for all caps labels (0.08em)
- Tight line heights (1.2-1.5) for dense information

## 4. Layout & Spacing

### 4.1 Shell Structure
```
┌─────────────────────────────────────────────────────┐
│  TopHUD (48px) — Topbar: breadcrumb + Aurora orb    │
├─────┬───────────────────────────────────────────────┤
│     │   WORLD MAP / ROTAS / ILHAS (flex-1)          │
│ S   │                                               │
│ i   │   /           → Dashboard + WorldMap          │
│ d   │   /agora       → FocusCard, NextAction        │
│ e   │   /agenda      → Calendário, Deadlines        │
│ b   │   /projetos    → ProjectCard, Pipeline        │
│ a   │   /contexto    → CurrentContext, FocusDrift   │
│ r   │   /checkpoints → Timeline, ResumeFromHere     │
│     │   /sistema     → Health, GitHub, OMNIS        │
│     │   /perfil      → Profile, Billing             │
│     │   /ilhas/:id   → 10 island screens            │
├─────┴───────────────────────────────────────────────┤
│  BottomDock (56px)                                  │
└─────────────────────────────────────────────────────┘
```

### 4.2 Spacing Scale
- **HUD scale**: 8px base unit
- **Section**: 16px
- **Panel**: 20px
- **Page**: 32px
- **Component**: 4px rhythm (4px, 8px, 12px, 16px, 20px, 24px, 32px)

## 5. Components

### 5.1 Glass Panel System
The foundation of KRATOS visual identity. Glass panels provide:
- **Depth**: Multiple layers with blur and transparency
- **Clarity**: Clean borders and subtle shadows
- **States**: Normal, hover, active, disabled
- **Variants**: Light, normal, strong, deep

### 5.2 Cards
Content containers with:
- **KratosCard**: Primary content cards
- **MetricBadge**: Data visualization with context
- **ProjectCard**: Project-specific information
- **TaskCard**: Task and action items

### 5.3 Status Indicators
Visual feedback for system states:
- **StatusChip**: Small inline status indicators
- **SeverityBadge**: Prominent status badges
- **ProgressRing**: Circular progress visualization
- **SourceBadge**: Data source indicators

### 5.4 States
Handling different data conditions:
- **EmptyState**: No data available
- **ErrorState**: Error conditions
- **LoadingSkeleton**: Loading placeholders
- **DegradedState**: Partial functionality

### 5.5 Interactive Elements
- **Buttons**: Primary, secondary, ghost variants
- **Inputs**: Text, select, checkbox, radio
- **Navigation**: Sidebar, top bar, breadcrumbs
- **Actions**: Context menus, dropdowns

## 6. Motion & Animation

### 6.1 Principles
- **Subtle**: Enhance without distraction
- **Meaningful**: Purpose-driven animations
- **Performant**: Smooth 60fps experience
- **Accessible**: Respect prefers-reduced-motion

### 6.2 Timing
- **Fast**: 150ms for micro-interactions
- **Normal**: 250ms for state changes
- **Slow**: 400-600ms for page transitions
- **Float**: 6s+ for ambient animations

### 6.3 Easing
- **Spring**: cubic-bezier(0.34, 1.56, 0.64, 1) for bouncy effects
- **Smooth**: cubic-bezier(0.16, 1, 0.3, 1) for natural motion
- **In-out**: cubic-bezier(0.65, 0, 0.35, 1) for balanced transitions

## 7. Islands System

### 7.1 Concept
10 distinct operational domains represented as floating islands:
1. **Agência** (Orange) - Media, publishing, content
2. **Akasha** (Green) - Memory, search, knowledge
3. **Arena** (Red) - CRM, leads, pipeline
4. **Filosofia** (Purple) - Reading, insights, learning
5. **Forja** (Gray) - Fitness, training, body
6. **Nimbus** (Blue) - Weather, logistics
7. **Observatório** (Dark Blue) - Analytics, metrics
8. **OMNIS Lab** (Violet) - AI, automation, execution
9. **Tesouro** (Forest Green) - Finance, wealth
10. **Vila** (Bright Green) - Family, routine, home

### 7.2 Visual Identity
- **Colors**: Distinct per island with glow effects
- **Sizes**: Central Castle (200px), Large (140px), Medium (110px), Small (85px)
- **Gaps**: 40px minimum spacing
- **Interactions**: Hover, click, drag states

## 8. Neuro-UX (TDAH-first)

### 8.1 Cognitive Load Reduction
- **Miller's Law**: Maximum 7±2 decision elements per screen
- **Single Primary Action**: One dominant action per view
- **Spatial Memory**: Fixed positions preserve mental maps
- **No Unexpected Popups**: All modals triggered by explicit user action
- **Fast Animations**: ≤ 0.3s duration, max 2 simultaneous

### 8.2 Focus Preservation
- **Checkpoint System**: 1-click context restoration
- **Focus Mode**: Dims non-essential elements
- **Reduced Motion**: Respects system preferences
- **Clear Next Action**: Always visible path forward

### 8.3 Information Architecture
- **9 Operational Questions**: Quick answers to core operational needs
- **Status Visibility**: Real-time system state awareness
- **Progress Indicators**: Clear task and mission progress
- **Error Recovery**: Easy paths back from errors

## 9. Accessibility

### 9.1 WCAG Compliance
- **Contrast**: Minimum 4.5:1 for text, 3:1 for UI elements
- **Keyboard Navigation**: Full tab navigation support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators

### 9.2 High Contrast Mode
- **Enhanced borders**: Stronger visual boundaries
- **Increased contrast**: Better text/background differentiation
- **Simplified effects**: Reduced transparency and blur

## 10. Responsive Design

### 10.1 Breakpoints
- **Mobile**: 320px-768px
- **Tablet**: 768px-1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

### 10.2 Adaptive Layout
- **Flexible grids**: CSS Grid and Flexbox
- **Component scaling**: Relative sizing with constraints
- **Content prioritization**: Progressive disclosure
- **Touch targets**: Minimum 44px for interactive elements

## 11. Performance

### 11.1 Rendering
- **60fps target**: Smooth animations and interactions
- **Efficient re-renders**: React.memo and useCallback
- **Virtual scrolling**: Large lists and tables
- **Code splitting**: Route-based chunking

### 11.2 Assets
- **Optimized images**: WebP format, proper sizing
- **Icon system**: SVG sprite or component-based
- **Font loading**: Preload critical fonts
- **Bundle analysis**: Regular size audits

## 12. Implementation Guidelines

### 12.1 CSS Architecture
- **Design tokens**: CSS custom properties
- **Component classes**: BEM-like naming
- **Utility classes**: Minimal, purpose-specific
- **Scoped styles**: Component-level encapsulation

### 12.2 Component API
- **Consistent props**: Standardized interfaces
- **Type safety**: TypeScript interfaces
- **Default values**: Sensible defaults
- **Documentation**: Clear prop descriptions

### 12.3 Testing
- **Visual regression**: Chromatic or similar
- **Interaction tests**: User flows and states
- **Accessibility audit**: Regular automated checks
- **Performance monitoring**: Lighthouse and custom metrics