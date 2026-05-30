# RightRail Component

## Description
The right rail component that displays contextual information, Aurora AI insights, and system monitoring data. Provides a secondary information panel that complements the main content area.

## Props
- `onOpenAurora`: () => void - Callback when Aurora panel is opened
- `signals`: Array of signal objects - Aurora signals to display
- `focusState`: string - Current focus state
- `driftRisk`: "low" | "medium" | "high" - Risk level of focus drift
- `risks`: Array of risk objects - Risks to display in radar
- `checkpointAvailable`: boolean - Whether checkpoint is available
- `checkpointLabel`: string - Label for checkpoint button
- `nextAction`: string - Next recommended action
- `missionSummary`: string - Current mission summary
- `blocker`: string - Current blocker information
- `recommendation`: string - AI recommendation
- `doNotDo`: string - Things to avoid
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import AuroraPanel from "./AuroraPanel";
import { ReactNode } from "react";

interface RiskItem {
  title: string;
  severity: "low" | "medium" | "high";
}

interface Signal {
  text: string;
  tone: "critical" | "warning" | "info" | "neutral";
  action?: string;
}

interface RightRailProps {
  onOpenAurora?: () => void;
  signals?: Signal[];
  focusState?: string;
  driftRisk?: "low" | "medium" | "high";
  risks?: RiskItem[];
  checkpointAvailable?: boolean;
  checkpointLabel?: string;
  nextAction?: string;
  missionSummary?: string;
  blocker?: string;
  recommendation?: string;
  doNotDo?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RightRail({
  onOpenAurora,
  signals = [],
  focusState,
  driftRisk,
  risks = [],
  checkpointAvailable = false,
  checkpointLabel,
  nextAction,
  missionSummary,
  blocker,
  recommendation,
  doNotDo,
  className = "",
  style,
}: RightRailProps) {
  return (
    <div className={`kr-right-rail ${className}`.trim()} style={style}>
      <AuroraPanel
        signals={signals}
        focusState={focusState}
        driftRisk={driftRisk}
        nextAction={nextAction}
        missionSummary={missionSummary}
        blocker={blocker}
        recommendation={recommendation}
        doNotDo={doNotDo}
        onOpenAurora={onOpenAurora}
      />

      {risks.length > 0 && (
        <div className="kr-right-rail-section">
          <div className="kr-section-title">RISCOS NO RADAR</div>
          <div className="kr-right-rail-risks">
            {risks.slice(0, 3).map((r, i) => (
              <div key={i} className="kr-right-rail-risk">
                <span
                  className={`kr-dot ${
                    r.severity === "high" ? "kr-dot-critical" :
                    r.severity === "medium" ? "kr-dot-degraded" :
                    "kr-dot-offline"
                  }`}
                />
                <span style={{ fontSize: "var(--kr-text-xs)" }}>{r.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {checkpointAvailable && (
        <div className="kr-right-rail-section">
          <div className="kr-section-title">CHECKPOINT</div>
          <button
            className="kr-checkpoint-btn"
            onClick={() => window.location.assign("/checkpoints")}
          >
            <span className="kr-dot kr-dot-live" />
            {checkpointLabel || "Retomar contexto"}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Usage Example
```tsx
import { useState } from "react";
import RightRail from "./components/layout/RightRail";

export default function RightRailContainer() {
  const [isAuroraOpen, setAuroraOpen] = useState(false);

  const signals = [
    { text: "Nova mensagem do time de vendas", tone: "info", action: "Ver" },
    { text: "Deadline de projeto se aproxima", tone: "warning" },
    { text: "Sistema OMNIS atualizado", tone: "neutral" }
  ];

  const risks = [
    { title: "Atraso no projeto Alpha", severity: "high" },
    { title: "Baixa energia no servidor", severity: "medium" },
    { title: "Reunião agendada", severity: "low" }
  ];

  return (
    <RightRail
      onOpenAurora={() => setAuroraOpen(true)}
      signals={signals}
      focusState="Desenvolvimento OMNIS"
      driftRisk="low"
      risks={risks}
      checkpointAvailable={true}
      checkpointLabel="Retomar trabalho de ontem"
      nextAction="Revisar documentação do agente"
      missionSummary="Implementar novo agente de análise de dados"
      blocker="Aguardando acesso ao dataset"
      recommendation="Priorizar tarefas de baixa dependência"
      doNotDo="Não iniciar novas features sem aprovação"
    />
  );
}
```

## CSS Classes Used
- `kr-right-rail` - Base right rail styling
- `kr-right-rail-section` - Section grouping
- `kr-right-rail-risks` - Risk items container
- `kr-right-rail-risk` - Individual risk item
- `kr-checkpoint-btn` - Checkpoint button styling
- `kr-section-title` - Section title styling
- `kr-dot` - Base dot styling
- `kr-dot-critical` - Critical status dot
- `kr-dot-degraded` - Degraded status dot
- `kr-dot-offline` - Offline status dot
- `kr-dot-live` - Live status dot

## Design Tokens Referenced
- `--kr-right-rail-width` - Right rail width
- `--kr-space-section` - Section spacing
- `--kr-space-hud` - HUD spacing
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-text-muted` - Muted text color
- `--kr-text-xs` - Extra small text size
- `--kr-radius-md` - Medium border radius
- `--kr-radius-sm` - Small border radius
- `--kr-radius-full` - Full border radius
- `--kr-glass-depth-2` - Glass depth level 2
- `--kr-glass-bg` - Glass background
- `--kr-glass-bg-light` - Light glass background
- `--kr-glass-border` - Glass border
- `--kr-glass-blur-strong` - Strong glass blur
- `--kr-shadow-glass` - Glass shadow
- `--kr-azure-500` - Azure color for buttons
- `--kr-arena-coral` - Arena coral color for critical
- `--kr-yellow-400` - Yellow color for warnings
- `--kr-green-400` - Green color for live status
- `--kr-duration-fast` - Fast transition duration
- `--kr-ease-smooth` - Smooth easing function

## Content Sections
1. **Aurora Panel** - AI insights and recommendations
2. **Risk Radar** - Current system and project risks
3. **Checkpoint** - Saved progress restoration point

## Aurora Panel Integration
- Displays AI-generated insights
- Shows mission summary and context
- Provides action recommendations
- Visual focus state indicators
- Drift risk assessment

## Risk Management
- Color-coded risk severity (low/medium/high)
- Visual dot indicators for quick scanning
- Limited display (top 3 risks)
- Clear section labeling

## Checkpoint System
- Availability indicator
- Contextual labels
- Direct navigation to checkpoints
- Live status indicator

## Accessibility Features
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable elements
- Sufficient color contrast
- Screen reader friendly content

## Responsive Behavior
- Fixed width based on design tokens
- Scrollable content area
- Appropriate spacing for touch targets
- Consistent visual hierarchy

## State Management
- Aurora open/close callbacks
- Signal and risk data display
- Focus state and drift risk visualization
- Checkpoint availability handling