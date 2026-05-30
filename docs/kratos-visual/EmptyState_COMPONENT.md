# EmptyState Component

## Description
A component that displays a consistent empty state message with optional action button. Used when there is no data to display, providing clear feedback to the user.

## Props
- `title`: string - Main title for the empty state
- `description`: string (optional) - Additional description text
- `actionLabel`: string (optional) - Label for the action button
- `onAction`: () => void (optional) - Callback function for the action button
- `icon`: string (optional) - Icon to display (default: "◇")
- `variant`: "default" | "glass" - Style variant (default: "default")

## Implementation
```tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  variant?: "default" | "glass";
}

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = "◇",
  variant = "default"
}: EmptyStateProps) {
  const baseClasses = "kr-empty-state";
  const variantClasses = variant === "glass" ? " kr-empty-state--glass" : "";
  const classes = `${baseClasses}${variantClasses}`;

  return (
    <div className={classes}>
      <span className="kr-empty-state-icon" aria-hidden="true">{icon}</span>
      <h3 className="kr-empty-state-title">{title}</h3>
      {description && <p className="kr-empty-state-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="kr-empty-state-action" onClick={onAction} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

## Usage Examples
```tsx
// Basic empty state
<EmptyState 
  title="Nenhum dado encontrado" 
  description="Não há informações para exibir neste momento." 
/>

// Empty state with action
<EmptyState 
  title="Nenhuma missão ativa" 
  description="Você não tem missões em andamento." 
  actionLabel="Criar nova missão"
  onAction={() => console.log("Create mission")}
/>

// Empty state with custom icon
<EmptyState 
  title="Conexão perdida" 
  description="Não foi possível conectar ao servidor." 
  icon="⚠"
/>

// Glass variant empty state
<EmptyState 
  title="Nenhum resultado" 
  description="Tente ajustar seus filtros de busca." 
  variant="glass"
/>
```

## CSS Classes Used
- `kr-empty-state` - Base empty state styling
- `kr-empty-state-icon` - Icon styling
- `kr-empty-state-title` - Title styling
- `kr-empty-state-desc` - Description styling
- `kr-empty-state-action` - Action button styling
- `kr-empty-state--glass` - Glass variant styling

## Design Tokens Referenced
- `--kr-text-muted` - Muted text color
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-space-section` - Section spacing
- `--kr-space-10` - Large spacing
- `--kr-text-sm` - Small text size
- `--kr-text-md` - Medium text size
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-radius-md` - Medium border radius
- `--kr-radius-lg` - Large border radius
- `--kr-glass-bg` - Glass background
- `--kr-glass-bg-strong` - Strong glass background
- `--kr-glass-border` - Glass border
- `--kr-glass-border-strong` - Strong glass border
- `--kr-glass-blur` - Glass blur effect