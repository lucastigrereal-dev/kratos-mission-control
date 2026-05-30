# ErrorState Component

## Description
A component that displays consistent error states with appropriate severity levels and optional retry functionality. Used when something goes wrong in the application to provide clear feedback to the user.

## Props
- `title`: string - Main title for the error state
- `description`: string (optional) - Additional description text
- `retryLabel`: string (optional) - Label for the retry button
- `onRetry`: () => void (optional) - Callback function for the retry button
- `severity`: "warning" | "error" | "info" - Severity level (default: "error")

## Implementation
```tsx
type ErrorSeverity = "warning" | "error" | "info";

interface ErrorStateProps {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  severity?: ErrorSeverity;
}

const ICON_MAP: Record<ErrorSeverity, string> = {
  error: "⚠",
  warning: "⚡",
  info: "ℹ",
};

const TONE_MAP: Record<ErrorSeverity, string> = {
  error: "kr-error-state--danger",
  warning: "kr-error-state--warning",
  info: "kr-error-state--info",
};

export default function ErrorState({ 
  title, 
  description, 
  retryLabel, 
  onRetry, 
  severity = "error" 
}: ErrorStateProps) {
  return (
    <div className={`kr-error-state ${TONE_MAP[severity]}`} role="alert">
      <span className="kr-error-state-icon" aria-hidden="true">{ICON_MAP[severity]}</span>
      <h3 className="kr-error-state-title">{title}</h3>
      {description && <p className="kr-error-state-desc">{description}</p>}
      {retryLabel && onRetry && (
        <button className="kr-error-state-retry" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
```

## Usage Examples
```tsx
// Error state
<ErrorState 
  title="Falha na conexão" 
  description="Não foi possível conectar ao servidor." 
  severity="error"
/>

// Error state with retry
<ErrorState 
  title="Falha ao carregar dados" 
  description="Ocorreu um erro ao buscar as informações." 
  retryLabel="Tentar novamente"
  onRetry={() => console.log("Retry")}
  severity="error"
/>

// Warning state
<ErrorState 
  title="Conexão lenta" 
  description="A conexão está mais lenta que o normal." 
  severity="warning"
/>

// Info state
<ErrorState 
  title="Manutenção programada" 
  description="O sistema estará em manutenção das 02h às 04h." 
  severity="info"
/>
```

## CSS Classes Used
- `kr-error-state` - Base error state styling
- `kr-error-state--danger` - Error severity styling
- `kr-error-state--warning` - Warning severity styling
- `kr-error-state--info` - Info severity styling
- `kr-error-state-icon` - Icon styling
- `kr-error-state-title` - Title styling
- `kr-error-state-desc` - Description styling
- `kr-error-state-retry` - Retry button styling

## Design Tokens Referenced
- `--kr-red-500` - Error color
- `--kr-yellow-500` - Warning color
- `--kr-blue-500` - Info color
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-space-section` - Section spacing
- `--kr-text-sm` - Small text size
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-radius-md` - Medium border radius
- `--kr-glass-bg-strong` - Strong glass background
- `--kr-glass-border-strong` - Strong glass border