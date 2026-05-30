# LeftSidebar Component

## Description
The main navigation sidebar component that provides access to all KRATOS islands and systems. Features a clean, organized navigation structure with thematic icons and active state indicators.

## Props
- `collapsed`: boolean - Whether the sidebar is collapsed (default: false)
- `onNavigate`: (path: string) => void - Callback when navigation occurs
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { useState } from "react";
import NavItemButton from "./NavItemButton";

interface NavItem {
  id: string;
  to: string;
  label: string;
  icon: string;
  badge?: number | string;
  section: "top" | "bottom";
}

const NAV_ITEMS: NavItem[] = [
  // Top section items
  { id: "mundo", to: "/visao-geral", label: "Mundo", icon: "◈", section: "top" },
  { id: "missao", to: "/mission-lens", label: "Missão", icon: "◉", section: "top" },
  { id: "acoes", to: "/tarefas", label: "Ações", icon: "☰", section: "top" },
  { id: "iniciativas", to: "/projetos", label: "Iniciativas", icon: "⬡", section: "top" },
  { id: "contexto", to: "/contexto", label: "Contexto", icon: "◎", section: "top" },
  { id: "sistemas", to: "/sistema", label: "Sistemas", icon: "⚙", section: "top" },
  { id: "checkpoints", to: "/checkpoints", label: "Checkpoints", icon: "◆", section: "top" },
  
  // Bottom section items
  { id: "omnis", to: "/omnis", label: "OMNIS Lab", icon: "◬", section: "bottom" },
  { id: "approvals", to: "/approvals", label: "Approvals", icon: "◷", section: "bottom" },
  { id: "aurora", to: "/aurora", label: "Aurora FS", icon: "✦", section: "bottom" },
];

interface LeftSidebarProps {
  collapsed?: boolean;
  onNavigate?: (path: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function LeftSidebar({
  collapsed = false,
  onNavigate,
  className = "",
  style,
}: LeftSidebarProps) {
  const [activeItem, setActiveItem] = useState("mundo");

  const handleNavigation = (path: string, id: string) => {
    setActiveItem(id);
    onNavigate?.(path);
  };

  const topItems = NAV_ITEMS.filter(item => item.section === "top");
  const bottomItems = NAV_ITEMS.filter(item => item.section === "bottom");

  return (
    <nav 
      className={`kr-sidebar ${collapsed ? "kr-sidebar--collapsed" : ""} ${className}`.trim()}
      style={style}
      aria-label="Navegação principal"
    >
      <div className="kr-sidebar-section">
        {topItems.map((item) => (
          <NavItemButton
            key={item.id}
            id={item.id}
            to={item.to}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            active={activeItem === item.id}
            collapsed={collapsed}
            onClick={() => handleNavigation(item.to, item.id)}
          />
        ))}
      </div>

      <div className="kr-sidebar-divider" />

      <div className="kr-sidebar-section">
        {bottomItems.map((item) => (
          <NavItemButton
            key={item.id}
            id={item.id}
            to={item.to}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            active={activeItem === item.id}
            collapsed={collapsed}
            onClick={() => handleNavigation(item.to, item.id)}
          />
        ))}
      </div>
    </nav>
  );
}
```

## Usage Example
```tsx
import { useState } from "react";
import LeftSidebar from "./components/layout/LeftSidebar";

export default function SidebarContainer() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // Implement actual navigation logic here
  };

  return (
    <LeftSidebar
      collapsed={isCollapsed}
      onNavigate={handleNavigation}
    />
  );
}
```

## CSS Classes Used
- `kr-sidebar` - Base sidebar styling
- `kr-sidebar--collapsed` - Collapsed state styling
- `kr-sidebar-section` - Navigation section grouping
- `kr-sidebar-divider` - Visual divider between sections

## Design Tokens Referenced
- `--kr-sidebar-bg` - Sidebar background color
- `--kr-sidebar-border` - Sidebar border color
- `--kr-space-section` - Section spacing
- `--kr-space-hud` - HUD spacing
- `--kr-radius-md` - Medium border radius
- `--kr-glass-bg-strong` - Strong glass background
- `--kr-glass-border` - Glass border
- `--kr-glass-blur-strong` - Strong glass blur
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color

## Navigation Structure
### Top Section (Main Navigation)
1. **Mundo** - World overview and map
2. **Missão** - Current mission lens and focus
3. **Ações** - Task management and actions
4. **Iniciativas** - Projects and initiatives
5. **Contexto** - Contextual information and references
6. **Sistemas** - System status and health
7. **Checkpoints** - Saved checkpoints and progress

### Bottom Section (Specialized Areas)
1. **OMNIS Lab** - AI agents and automation lab
2. **Approvals** - Approval workflows and decisions
3. **Aurora FS** - Aurora file system and knowledge base

## Interactive Features
- Active state highlighting for current location
- Hover effects for improved discoverability
- Badge support for notifications or counts
- Collapsible state for compact viewing
- Keyboard navigation support

## Accessibility Features
- Proper navigation landmark with aria-label
- Semantic HTML structure
- Keyboard focus management
- Screen reader friendly labels
- Sufficient color contrast
- Logical tab order

## State Management
- Active item tracking with useState
- Navigation callback propagation
- Collapsed state handling
- Section-based organization

## Responsive Behavior
- Collapsed variant for smaller screens
- Flexible width based on design tokens
- Appropriate spacing for touch targets
- Icon-only display when collapsed