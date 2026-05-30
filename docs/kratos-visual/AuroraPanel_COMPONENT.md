# AuroraPanel Component

## Description
The Aurora AI panel component that displays AI-generated insights, recommendations, and system monitoring. Features a holographic orb visualization and structured decision guidance.

## Props
- `signals`: Array of signal objects - Aurora signals to display
- `focusState`: string - Current focus state
- `driftRisk`: "low" | "medium" | "high" - Risk level of focus drift
- `nextAction`: string - Next recommended action
- `missionSummary`: string - Current mission summary
- `blocker`: string - Current blocker information
- `recommendation`: string - AI recommendation
- `doNotDo`: string - Things to avoid
- `onOpenAurora`: () => void - Callback when Aurora is opened
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import { ReactNode } from "react";

interface AuroraSignal {
  text: string;
  tone: "critical" | "warning" | "info" | "neutral";
  action?: string;
}

interface AuroraPanelProps {
  signals?: AuroraSignal[];
  focusState?: string;
  driftRisk?: "low" | "medium" | "high";
  nextAction?: string;
  missionSummary?: string;
  blocker?: string;
  recommendation?: string;
  doNotDo?: string;
  onOpenAurora?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const DECISION_STYLES = {
  blocker: {
    label: "BLOQUEIO",
    icon: "⊘",
    className: "kr-aurora-decision kr-aurora-decision--blocker",
  },
  recommendation: {
    label: "RECOMENDAÇÃO",
    icon: "◈",
    className: "kr-aurora-decision kr-aurora-decision--recommendation",
  },
  doNotDo: {
    label: "NÃO FAZER AGORA",
    icon: "⏸",
    className: "kr-aurora-decision kr-aurora-decision--donotdo",
  },
};

const TONE_STYLES: Record<string, { border: string; bg: string; dot: string }> = {
  critical: {
    border: "var(--kr-arena-coral)",
    bg: "color-mix(in srgb, var(--kr-arena-coral) 8%, transparent)",
    dot: "kr-dot kr-dot-critical",
  },
  warning: {
    border: "var(--kr-gold-400)",
    bg: "color-mix(in srgb, var(--kr-gold-400) 8%, transparent)",
    dot: "kr-dot kr-dot-degraded",
  },
  info: {
    border: "var(--kr-azure-400)",
    bg: "color-mix(in srgb, var(--kr-azure-400) 8%, transparent)",
    dot: "kr-dot kr-dot-live",
  },
  neutral: {
    border: "var(--kr-glass-border)",
    bg: "transparent",
    dot: "kr-dot kr-dot-offline",
  },
};

const DRIFT_LABELS: Record<string, string> = {
  low: "Foco estável",
  medium: "Atenção flutuante",
  high: "Risco de dispersão",
};

export default function AuroraPanel({
  signals = [],
  focusState,
  driftRisk = "low",
  nextAction,
  missionSummary,
  blocker,
  recommendation,
  doNotDo,
  onOpenAurora,
  className = "",
  style,
}: AuroraPanelProps) {
  return (
    <div className={`kr-aurora-panel ${className}`.trim()} style={style}>
      <div className="kr-section-title">AURORA · Sentinel</div>

      {/* Mission summary — what matters now */}
      {missionSummary && (
        <div className="kr-aurora-mission-summary">
          <span className="kr-aurora-mission-summary-icon">◈</span>
          <span className="kr-aurora-mission-summary-text">{missionSummary}</span>
        </div>
      )}

      {/* Holographic orb — presence indicator */}
      <div className="kr-aurora-orb">
        <div className="kr-aurora-orb-inner" />
        <div className="kr-aurora-orb-ring--outer" />
        <div className="kr-aurora-orb-ring--inner" />
      </div>

      {/* Decision cards — blocker, recommendation, do-not-do */}
      {(blocker || recommendation || doNotDo) && (
        <div className="kr-aurora-decisions">
          {blocker && (
            <div className={DECISION_STYLES.blocker.className}>
              <span className="kr-aurora-decision-icon">{DECISION_STYLES.blocker.icon}</span>
              <div className="kr-aurora-decision-body">
                <span className="kr-aurora-decision-label">{DECISION_STYLES.blocker.label}</span>
                <span className="kr-aurora-decision-text">{blocker}</span>
              </div>
            </div>
          )}
          {recommendation && (
            <div className={DECISION_STYLES.recommendation.className}>
              <span className="kr-aurora-decision-icon">{DECISION_STYLES.recommendation.icon}</span>
              <div className="kr-aurora-decision-body">
                <span className="kr-aurora-decision-label">{DECISION_STYLES.recommendation.label}</span>
                <span className="kr-aurora-decision-text">{recommendation}</span>
              </div>
            </div>
          )}
          {doNotDo && (
            <div className={DECISION_STYLES.doNotDo.className}>
              <span className="kr-aurora-decision-icon">{DECISION_STYLES.doNotDo.icon}</span>
              <div className="kr-aurora-decision-body">
                <span className="kr-aurora-decision-label">{DECISION_STYLES.doNotDo.label}</span>
                <span className="kr-aurora-decision-text">{doNotDo}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Next action — impossible to ignore */}
      {nextAction && (
        <div className="kr-aurora-next-action">
          <div className="kr-aurora-next-action-label">PRÓXIMA AÇÃO</div>
          <div className="kr-aurora-next-action-text">{nextAction}</div>
        </div>
      )}

      {focusState && (
        <div className="kr-aurora-focus">
          <span className="kr-aurora-focus-pulse" />
          <span className="kr-aurora-focus-label">{focusState}</span>
          {driftRisk !== "low" && (
            <span className={`kr-aurora-drift kr-aurora-drift--${driftRisk}`}>
              {DRIFT_LABELS[driftRisk]}
            </span>
          )}
        </div>
      )}

      <div className="kr-aurora-signals">
        {signals.length === 0 && (
          <div className="kr-aurora-signals-empty">
            <span className="kr-aurora-signals-empty-icon" />
            <span>Sinais limpos. Nada requer atenção agora.</span>
          </div>
        )}
        {signals.map((signal, i) => {
          const s = TONE_STYLES[signal.tone] || TONE_STYLES.neutral;
          return (
            <div
              key={i}
              className="kr-aurora-signal"
              style={{ borderLeftColor: s.border, background: s.bg }}
            >
              <span className={s.dot} />
              <span style={{ fontSize: "var(--kr-text-xs)", flex: 1 }}>{signal.text}</span>
              {signal.action && (
                <span className="kr-aurora-signal-action">{signal.action}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Usage Example
```tsx
import { useState } from "react";
import AuroraPanel from "./components/layout/AuroraPanel";

export default function AuroraExample() {
  const [isAuroraOpen, setAuroraOpen] = useState(false);

  const signals = [
    { text: "Nova mensagem do time de vendas", tone: "info", action: "Ver" },
    { text: "Deadline de projeto se aproxima", tone: "warning" },
    { text: "Sistema OMNIS atualizado", tone: "neutral" }
  ];

  return (
    <AuroraPanel
      signals={signals}
      focusState="Desenvolvimento OMNIS"
      driftRisk="low"
      nextAction="Revisar documentação do agente"
      missionSummary="Implementar novo agente de análise de dados"
      blocker="Aguardando acesso ao dataset"
      recommendation="Priorizar tarefas de baixa dependência"
      doNotDo="Não iniciar novas features sem aprovação"
      onOpenAurora={() => setAuroraOpen(true)}
    />
  );
}
```

## CSS Classes Used
- `kr-aurora-panel` - Base panel styling
- `kr-aurora-orb` - Holographic orb container
- `kr-aurora-orb-inner` - Inner orb element
- `kr-aurora-orb-ring--outer` - Outer ring animation
- `kr-aurora-orb-ring--inner` - Inner ring animation
- `kr-aurora-decisions` - Decision cards container
- `kr-aurora-decision` - Base decision card
- `kr-aurora-decision--blocker` - Blocker decision styling
- `kr-aurora-decision--recommendation` - Recommendation styling
- `kr-aurora-decision--donotdo` - Do-not-do styling
- `kr-aurora-decision-icon` - Decision icon styling
- `kr-aurora-decision-body` - Decision content container
- `kr-aurora-decision-label` - Decision label styling
- `kr-aurora-decision-text` - Decision text styling
- `kr-aurora-next-action` - Next action container
- `kr-aurora-next-action-label` - Next action label
- `kr-aurora-next-action-text` - Next action text
- `kr-aurora-focus` - Focus state container
- `kr-aurora-focus-pulse` - Focus pulse indicator
- `kr-aurora-focus-label` - Focus label text
- `kr-aurora-drift` - Drift risk indicator
- `kr-aurora-drift--medium` - Medium drift styling
- `kr-aurora-drift--high` - High drift styling
- `kr-aurora-signals` - Signals container
- `kr-aurora-signals-empty` - Empty signals state
- `kr-aurora-signals-empty-icon` - Empty state icon
- `kr-aurora-signal` - Individual signal item
- `kr-aurora-signal-action` - Signal action button
- `kr-aurora-mission-summary` - Mission summary container
- `kr-aurora-mission-summary-icon` - Mission summary icon
- `kr-aurora-mission-summary-text` - Mission summary text

## Design Tokens Referenced
- `--kr-aurora-400` - Aurora purple color
- `--kr-aurora-500` - Darker aurora purple
- `--kr-aurora-600` - Darkest aurora purple
- `--kr-arena-coral` - Arena coral for critical
- `--kr-gold-400` - Gold for warnings
- `--kr-azure-400` - Azure for info
- `--kr-purple-300` - Light purple for orb
- `--kr-purple-400` - Purple for orb
- `--kr-purple-600` - Dark purple for orb
- `--kr-glass-bg` - Glass background
- `--kr-glass-bg-strong` - Strong glass background
- `--kr-glass-border` - Glass border
- `--kr-glass-border-strong` - Strong glass border
- `--kr-radius-md` - Medium border radius
- `--kr-radius-full` - Full border radius
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-text-muted` - Muted text color
- `--kr-text-xs` - Extra small text size
- `--kr-text-sm` - Small text size
- `--kr-font-weight-500` - Medium font weight
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-font-weight-700` - Bold font weight
- `--kr-space-section` - Section spacing
- `--kr-space-hud` - HUD spacing

## Content Sections
1. **Mission Summary** - Current mission context and overview
2. **Holographic Orb** - Aurora presence indicator with animations
3. **Decision Cards** - Structured AI guidance:
   - Blockers (critical issues)
   - Recommendations (suggested actions)
   - Do-Not-Do (things to avoid)
4. **Next Action** - Primary recommended next step
5. **Focus State** - Current focus with drift risk assessment
6. **Signals** - Real-time system and task notifications

## Visual Elements
- **Holographic Orb** - Animated presence indicator with floating rings
- **Decision Cards** - Color-coded guidance with clear categorization
- **Focus Pulse** - Animated indicator for current focus state
- **Drift Indicators** - Risk level visualization for focus stability
- **Signal List** - Curated list of important notifications

## Animation System
- Orb floating animation
- Ring rotation animations
- Pulse animations for focus state
- Smooth transitions between states
- Reduced motion support

## Accessibility Features
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable elements
- Sufficient color contrast
- Screen reader friendly content
- Focus management for interactive elements

## Responsive Behavior
- Flexible width based on container
- Appropriate spacing for content hierarchy
- Text wrapping for long content
- Consistent visual hierarchy across sizes

## State Management
- Signal display and filtering
- Focus state and drift risk visualization
- Decision card visibility based on content
- Empty state handling for signals
- Action callback propagation