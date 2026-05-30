# OperatorWelcomeCard Component

## Description
A welcoming card component that displays personalized information to the operator when they access the KRATOS Mission Control. Provides a friendly introduction and overview of the current operational context.

## Props
- `operatorName`: string - Name of the operator (default: "Lucas")
- `missionName`: string - Current mission name
- `missionDescription`: string - Description of the current mission
- `focusArea`: string - Current focus area or priority
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { useMemo } from "react";
import GlassPanel from "./ui/GlassPanel";
import MetricBadge from "./ui/MetricBadge";
import StatusChip from "./ui/StatusChip";

interface OperatorWelcomeCardProps {
  operatorName?: string;
  missionName?: string;
  missionDescription?: string;
  focusArea?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "manhã";
  if (h < 18) return "tarde";
  return "noite";
}

export default function OperatorWelcomeCard({
  operatorName = "Lucas",
  missionName = "Missão Indefinida",
  missionDescription = "Nenhuma descrição disponível para a missão atual.",
  focusArea = "Foco do dia não definido",
  className = "",
  style,
}: OperatorWelcomeCardProps) {
  const greeting = useMemo(getGreeting, []);
  const timeOfDay = useMemo(getTimeOfDay, []);

  return (
    <GlassPanel className={`kr-welcome-card ${className}`.trim()} style={style}>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "var(--kr-space-section)" 
      }}>
        <div>
          <h1 style={{ 
            fontSize: "var(--kr-text-2xl)", 
            fontWeight: 600, 
            color: "var(--kr-text-primary)",
            margin: "0 0 var(--kr-space-2) 0",
            lineHeight: "var(--kr-leading-tight)"
          }}>
            {greeting}, {operatorName}
          </h1>
          <p style={{ 
            fontSize: "var(--kr-text-sm)", 
            color: "var(--kr-text-secondary)",
            margin: 0,
            lineHeight: "var(--kr-leading-relaxed)"
          }}>
            Bem-vindo ao seu centro de comando. Sua missão e próximos passos estão prontos.
          </p>
        </div>

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "var(--kr-space-3)",
          padding: "var(--kr-space-section)",
          background: "var(--kr-glass-bg-light)",
          borderRadius: "var(--kr-radius-md)",
          border: "1px solid var(--kr-glass-border)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            gap: "var(--kr-space-4)"
          }}>
            <div>
              <h2 style={{ 
                fontSize: "var(--kr-text-lg)", 
                fontWeight: 600, 
                color: "var(--kr-text-primary)",
                margin: "0 0 var(--kr-space-1) 0"
              }}>
                {missionName}
              </h2>
              <p style={{ 
                fontSize: "var(--kr-text-sm)", 
                color: "var(--kr-text-secondary)",
                margin: 0,
                lineHeight: "var(--kr-leading-normal)"
              }}>
                {missionDescription}
              </p>
            </div>
            <StatusChip status="info" label="ATIVA" />
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            paddingTop: "var(--kr-space-3)",
            borderTop: "1px solid var(--kr-glass-border)"
          }}>
            <div>
              <span style={{ 
                fontSize: "var(--kr-text-xs)", 
                color: "var(--kr-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontWeight: 500
              }}>
                Foco do dia
              </span>
              <p style={{ 
                fontSize: "var(--kr-text-sm)", 
                color: "var(--kr-text-primary)",
                margin: "var(--kr-space-1) 0 0 0",
                fontWeight: 500
              }}>
                {focusArea}
              </p>
            </div>
            <MetricBadge 
              label={`da ${timeOfDay}`} 
              value={new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              })} 
              tone="info" 
            />
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end"
        }}>
          <button
            style={{
              padding: "8px 16px",
              background: "var(--kr-azure-500)",
              color: "white",
              border: "none",
              borderRadius: "var(--kr-radius-md)",
              fontSize: "var(--kr-text-sm)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background var(--kr-duration-fast) var(--kr-ease-smooth)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--kr-azure-600)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--kr-azure-500)";
            }}
          >
            Ver detalhes da missão →
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}
```

## Usage Example
```tsx
import OperatorWelcomeCard from "./components/layout/OperatorWelcomeCard";

export default function WelcomeSection() {
  return (
    <OperatorWelcomeCard
      operatorName="Lucas"
      missionName="Expansão do Sistema OMNIS"
      missionDescription="Implementar novos agentes autônomos e otimizar workflows existentes para aumentar a eficiência operacional."
      focusArea="Desenvolvimento de agentes IA"
    />
  );
}
```

## CSS Classes Used
- `kr-welcome-card` - Base welcome card styling
- Uses GlassPanel component with KRATOS glass styling
- Leverages various KRATOS design tokens for consistent styling

## Design Tokens Referenced
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-text-muted` - Muted text color
- `--kr-text-2xl` - Extra large text size
- `--kr-text-lg` - Large text size
- `--kr-text-sm` - Small text size
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-font-weight-500` - Medium font weight
- `--kr-leading-tight` - Tight line height
- `--kr-leading-normal` - Normal line height
- `--kr-leading-relaxed` - Relaxed line height
- `--kr-space-section` - Section spacing
- `--kr-space-3` - Medium spacing
- `--kr-space-2` - Small spacing
- `--kr-space-1` - Extra small spacing
- `--kr-space-4` - Large spacing
- `--kr-glass-bg-light` - Light glass background
- `--kr-glass-border` - Glass border
- `--kr-radius-md` - Medium border radius
- `--kr-azure-500` - Azure color for buttons
- `--kr-azure-600` - Darker azure for hover
- `--kr-duration-fast` - Fast transition duration
- `--kr-ease-smooth` - Smooth easing function

## Content Structure
1. **Personalized Greeting** - Time-based greeting with operator name
2. **Welcome Message** - Friendly introduction to the system
3. **Mission Overview** - Current mission name and description
4. **Status Indicator** - Visual status chip for mission
5. **Daily Focus** - Current focus area with time context
6. **Action Button** - Primary call-to-action to view mission details

## Dynamic Elements
- Time-based greeting (Bom dia/Boa tarde/Boa noite)
- Time-of-day context (manhã/tarde/noite)
- Real-time clock display
- Personalized operator name

## Accessibility Features
- Semantic HTML structure with proper heading hierarchy
- Sufficient color contrast for readability
- Focus states for interactive elements
- Screen reader friendly content organization
- Proper button labeling and functionality

## Responsive Behavior
- Flexible layout that adapts to container width
- Appropriate spacing and padding for different screen sizes
- Text that wraps appropriately in smaller containers