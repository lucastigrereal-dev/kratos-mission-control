# KratosAppShell Component

## Description
The main application shell component that provides the overall layout structure for the KRATOS Mission Control interface. It implements the 5-zone grid layout with Top HUD, Sidebar, Main Content, Right Rail, and Bottom Dock.

## Props
- `topHud`: ReactNode - Top HUD component
- `sidebar`: ReactNode - Sidebar component
- `rightRail`: ReactNode - Right rail component
- `bottomDock`: ReactNode - Bottom dock component
- `children`: ReactNode - Main content to be rendered
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { ReactNode } from "react";

interface KratosAppShellProps {
  topHud: ReactNode;
  sidebar: ReactNode;
  rightRail: ReactNode;
  bottomDock: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function KratosAppShell({
  topHud,
  sidebar,
  rightRail,
  bottomDock,
  children,
  className = "",
  style,
}: KratosAppShellProps) {
  const classes = `kr-shell ${className}`.trim();

  return (
    <div className={classes} style={style}>
      <header className="kr-shell-top-hud">{topHud}</header>
      <aside className="kr-shell-sidebar">{sidebar}</aside>
      <main className="kr-shell-main">{children}</main>
      <aside className="kr-shell-right-rail">{rightRail}</aside>
      <footer className="kr-shell-bottom-dock">{bottomDock}</footer>
    </div>
  );
}
```

## Usage Example
```tsx
import { useState } from "react";
import KratosAppShell from "./components/layout/KratosAppShell";
import KratosTopBar from "./components/layout/KratosTopBar";
import LeftSidebar from "./components/layout/LeftSidebar";
import RightRail from "./components/layout/RightRail";
import BottomDock from "./components/layout/BottomDock";
import OperatorWelcomeCard from "./components/layout/OperatorWelcomeCard";

export default function App() {
  const [isAuroraOpen, setAuroraOpen] = useState(false);
  const [isSpotlightOpen, setSpotlightOpen] = useState(false);

  return (
    <KratosAppShell
      topHud={<KratosTopBar />}
      sidebar={<LeftSidebar />}
      rightRail={<RightRail onOpenAurora={() => setAuroraOpen(true)} />}
      bottomDock={<BottomDock onOpenNimbus={() => setSpotlightOpen(true)} />}
    >
      <OperatorWelcomeCard />
    </KratosAppShell>
  );
}
```

## CSS Classes Used
- `kr-shell` - Base shell styling with grid layout
- `kr-shell-top-hud` - Top HUD area
- `kr-shell-sidebar` - Sidebar area
- `kr-shell-main` - Main content area
- `kr-shell-right-rail` - Right rail area
- `kr-shell-bottom-dock` - Bottom dock area

## Design Tokens Referenced
- `--kr-shell-sidebar-width` - Sidebar width
- `--kr-shell-rightrail-width` - Right rail width
- `--kr-shell-bottomdock-height` - Bottom dock height
- `--kr-shell-tophud-height` - Top HUD height
- `--kr-sky-top` - Sky gradient top color
- `--kr-sky-mid` - Sky gradient middle color
- `--kr-sky-horizon` - Sky gradient horizon color
- `--kr-ocean-deep` - Ocean deep color
- `--kr-ocean-abyss` - Ocean abyss color
- `--kr-z-hud` - HUD z-index
- `--kr-z-sidebar` - Sidebar z-index
- `--kr-z-rail` - Right rail z-index
- `--kr-z-dock` - Bottom dock z-index

## Grid Layout Structure
```
┌────────────────────────────────────────────────────────────────┐
│  TOP HUD — 44px fixed z-100 (glass)                            │
├───────────┬──────────────────────────────────────┬─────────────┤
│           │                                      │             │
│ SIDEBAR   │      MAIN CONTENT AREA               │ RIGHT RAIL  │
│  220px    │         Flexible space               │   320px     │
│  fixed    │                                      │   fixed     │
│  z-200    │                                      │   z-200     │
│           │                                      │             │
├───────────┴──────────────────────────────────────┴─────────────┤
│  BOTTOM DOCK — 72px fixed z-300 (glass adaptativo)             │
└────────────────────────────────────────────────────────────────┘
```

## Accessibility Features
- Semantic HTML elements (header, aside, main, footer)
- Proper ARIA roles and landmarks
- Keyboard navigable structure
- Focus management considerations

## Responsive Behavior
- Desktop-first 16:9 layout
- Grid-based responsive design
- Scrollable content areas
- Fixed position HUD elements