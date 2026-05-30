# BottomDock Component

## Description
The bottom dock component that displays mission status, current focus, and active squads. Provides quick access to continuation actions and system status information.

## Props
- `onOpenNimbus`: () => void - Callback when Nimbus is opened
- `currentMission`: string - Current mission name
- `nextAction`: string - Next action description
- `nextActionTitle`: string - Next action title
- `activeSquads`: string[] - Array of active squad names
- `onContinue`: () => void - Callback for continue action
- `progress`: number - Mission progress percentage
- `taskCount`: { done: number; total: number } - Task completion count
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import MissionBar from "./MissionBar";
import { ReactNode } from "react";

interface BottomDockProps {
  onOpenNimbus?: () => void;
  currentMission?: string;
  nextAction?: string;
  nextActionTitle?: string;
  activeSquads?: string[];
  onContinue?: () => void;
  progress?: number;
  taskCount?: { done: number; total: number };
  className?: string;
  style?: React.CSSProperties;
}

const SQUAD_COLORS: Record<string, string> = {
  KRATOS: "var(--kr-azure-500)",
  OMNIS: "var(--kr-aurora-500)",
  AURORA: "var(--kr-aurora-400)",
  CODEX: "var(--kr-ocean-cyan)",
  AKASHA: "var(--kr-ocean-teal)",
};

const SQUAD_BG: Record<string, string> = {
  KRATOS: "var(--kr-squad-kratos-bg)",
  OMNIS: "var(--kr-squad-omnis-bg)",
  AURORA: "var(--kr-squad-aurora-bg)",
  CODEX: "var(--kr-squad-codex-bg)",
  AKASHA: "var(--kr-squad-akasha-bg)",
};

export default function BottomDock({
  onOpenNimbus,
  currentMission,
  nextAction,
  nextActionTitle,
  activeSquads = ["KRATOS", "AURORA"],
  onContinue,
  progress,
  taskCount,
  className = "",
  style,
}: BottomDockProps) {
  return (
    <div className={`kr-bottom-dock ${className}`.trim()} style={style}>
      <MissionBar
        currentMission={currentMission}
        nextAction={nextAction}
        nextActionTitle={nextActionTitle}
        progress={progress}
        taskCount={taskCount}
      />

      <div className="kr-bottom-dock-right">
        {activeSquads.length > 0 && (
          <div className="kr-bottom-dock-squads">
            {activeSquads.map((squad) => (
              <span
                key={squad}
                className="kr-chip"
                style={{
                  color: SQUAD_COLORS[squad] || "var(--kr-text-secondary)",
                  background: SQUAD_BG[squad] || "transparent",
                }}
              >
                {squad}
              </span>
            ))}
          </div>
        )}

        {onContinue && (
          <button className="kr-continue-btn" onClick={onContinue}>
            Continuar →
          </button>
        )}
      </div>
    </div>
  );
}
```

## Usage Example
```tsx
import { useState } from "react";
import BottomDock from "./components/layout/BottomDock";

export default function BottomDockContainer() {
  const [isNimbusOpen, setNimbusOpen] = useState(false);

  return (
    <BottomDock
      onOpenNimbus={() => setNimbusOpen(true)}
      currentMission="Expansão do Sistema OMNIS"
      nextAction="Implementar novo agente de análise"
      nextActionTitle="Desenvolver agente IA"
      activeSquads={["KRATOS", "OMNIS", "AURORA"]}
      onContinue={() => console.log("Continue mission")}
      progress={75}
      taskCount={{ done: 12, total: 16 }}
    />
  );
}
```

## CSS Classes Used
- `kr-bottom-dock` - Base bottom dock styling
- `kr-bottom-dock-right` - Right section of dock
- `kr-bottom-dock-squads` - Squad chips container
- `kr-continue-btn` - Continue button styling
- `kr-chip` - Base chip styling

## Design Tokens Referenced
- `--kr-shell-bottomdock-height` - Bottom dock height
- `--kr-space-panel` - Panel spacing
- `--kr-space-hud` - HUD spacing
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-text-muted` - Muted text color
- `--kr-text-sm` - Small text size
- `--kr-text-xs` - Extra small text size
- `--kr-font-weight-500` - Medium font weight
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-font-weight-700` - Bold font weight
- `--kr-radius-md` - Medium border radius
- `--kr-bg-dock-solid` - Solid background for dock
- `--kr-glass-blur-strong` - Strong glass blur
- `--kr-azure-500` - Azure color for KRATOS squad
- `--kr-aurora-500` - Aurora color for OMNIS squad
- `--kr-aurora-400` - Light aurora color for AURORA squad
- `--kr-ocean-cyan` - Ocean cyan for CODEX squad
- `--kr-ocean-teal` - Ocean teal for AKASHA squad
- `--kr-gold-500` - Gold color for continue button
- `--kr-gold-600` - Darker gold for button hover
- `--kr-duration-fast` - Fast transition duration
- `--kr-ease-smooth` - Smooth easing function

## Content Sections
1. **Mission Bar** - Current mission and next action display
2. **Squad Indicators** - Active squads with color coding
3. **Continue Button** - Primary action to continue work

## Mission Bar Integration
- Current mission display
- Next action visualization
- Progress tracking with progress bar
- Task completion counter

## Squad System
- Color-coded squad identification
- Thematic background colors
- Support for all 5 canonical squads:
  - KRATOS (blue)
  - OMNIS (purple)
  - AURORA (light purple)
  - CODEX (cyan)
  - AKASHA (teal)

## Action System
- Continue button with directional indicator
- Nimbus open callback for additional actions
- Visual emphasis on primary continuation path

## Accessibility Features
- Semantic HTML structure
- Proper button labeling
- Keyboard navigable elements
- Sufficient color contrast
- Screen reader friendly content

## Responsive Behavior
- Fixed height based on design tokens
- Flexible width to fill container
- Appropriate spacing for touch targets
- Text truncation for long content

## State Management
- Nimbus open callbacks
- Continue action handling
- Progress percentage display
- Task count visualization
- Active squad tracking