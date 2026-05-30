# NavItemButton Component

## Description
A navigation item button component used within the sidebar navigation. Provides consistent styling for navigation items with icon, label, and optional badge support.

## Props
- `id`: string - Unique identifier for the navigation item
- `to`: string - Navigation path
- `label`: string - Navigation item label
- `icon`: string - Icon character or component
- `badge`: number | string (optional) - Badge content for notifications
- `active`: boolean - Whether the item is currently active
- `collapsed`: boolean - Whether the sidebar is collapsed
- `onClick`: () => void - Click handler
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
interface NavItemButtonProps {
  id: string;
  to: string;
  label: string;
  icon: string;
  badge?: number | string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function NavItemButton({
  id,
  label,
  icon,
  badge,
  active,
  collapsed,
  onClick,
  className = "",
  style,
}: NavItemButtonProps) {
  const classes = `kr-sidebar-item ${active ? "kr-sidebar-item--active" : ""} ${className}`.trim();

  return (
    <button
      id={id}
      className={classes}
      onClick={onClick}
      aria-label={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      style={style}
    >
      <span className="kr-sidebar-item-icon" aria-hidden="true">{icon}</span>
      {!collapsed && (
        <>
          <span className="kr-sidebar-item-label">{label}</span>
          {badge && (
            <span className="kr-sidebar-item-badge">{badge}</span>
          )}
        </>
      )}
    </button>
  );
}
```

## Usage Example
```tsx
import NavItemButton from "./components/layout/NavItemButton";

export default function NavigationExample() {
  return (
    <div style={{ width: 220 }}>
      <NavItemButton
        id="world-nav"
        to="/visao-geral"
        label="Mundo"
        icon="◈"
        active={true}
        collapsed={false}
        onClick={() => console.log("Navigate to world")}
      />
      
      <NavItemButton
        id="mission-nav"
        to="/mission-lens"
        label="Missão"
        icon="◉"
        badge={3}
        active={false}
        collapsed={false}
        onClick={() => console.log("Navigate to mission")}
      />
      
      <NavItemButton
        id="collapsed-nav"
        to="/tarefas"
        label="Ações"
        icon="☰"
        active={false}
        collapsed={true}
        onClick={() => console.log("Navigate to actions")}
      />
    </div>
  );
}
```

## CSS Classes Used
- `kr-sidebar-item` - Base navigation item styling
- `kr-sidebar-item--active` - Active state styling
- `kr-sidebar-item-icon` - Icon styling
- `kr-sidebar-item-label` - Label text styling
- `kr-sidebar-item-badge` - Badge styling

## Design Tokens Referenced
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-space-hud` - HUD spacing
- `--kr-radius-md` - Medium border radius
- `--kr-text-sm` - Small text size
- `--kr-font-weight-400` - Regular font weight
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-azure-500` - Azure color for active state
- `--kr-glass-bg-light` - Light glass background for hover
- `--kr-duration-fast` - Fast transition duration
- `--kr-ease-smooth` - Smooth easing function

## Visual States
1. **Default State** - Inactive navigation item
2. **Active State** - Currently selected item with left border indicator
3. **Hover State** - Interactive state with background change
4. **Collapsed State** - Icon-only display without labels

## Accessibility Features
- Proper ARIA attributes (aria-label, aria-current)
- Semantic button element
- Keyboard focusable
- Screen reader friendly labels
- Sufficient touch target size (minimum 44px height)

## Interactive Behavior
- Click handler for navigation
- Visual feedback on hover
- Active state indication
- Smooth transitions between states
- Badge visibility based on content

## Responsive Features
- Collapsed mode hides labels and badges
- Icon-only display when sidebar is collapsed
- Appropriate spacing for both modes
- Consistent height regardless of content

## Styling Details
- Left border indicator for active items
- Subtle hover effects for discoverability
- Badge styling with contrasting background
- Icon sizing and alignment
- Text truncation for long labels