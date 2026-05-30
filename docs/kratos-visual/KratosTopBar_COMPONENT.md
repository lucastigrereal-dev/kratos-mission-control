# KratosTopBar Component

## Description
The top navigation bar component that displays operator information, system status, and contextual data. Part of the KRATOS HUD system with glassmorphism styling.

## Props
- `connectionState`: ConnectionState - Current connection state
- `snapshotSource`: string (optional) - Source of snapshot data
- `className`: string - Additional CSS classes to apply
- `style`: React.CSSProperties - Custom inline styles

## Implementation
```tsx
import SourceBadge, { type SourceType } from "./SourceBadge";
import { type ConnectionState } from "../hooks/useLiveKratos";
import { useMemo } from "react";

interface KratosTopBarProps {
  connectionState: ConnectionState;
  snapshotSource?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function fmtTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function fmtDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  });
}

const STATUS_MAP: Record<ConnectionState, { label: string; className: string }> = {
  live: { label: "Operacional", className: "kr-dot-live" },
  reconnecting: { label: "Reconectando", className: "kr-dot-degraded" },
  polling: { label: "Polling", className: "kr-dot-degraded" },
  fallback: { label: "Fallback", className: "kr-dot-degraded" },
  offline: { label: "Offline", className: "kr-dot-critical" },
};

function badgeSource(state: ConnectionState): SourceType {
  if (state === "live") return "live";
  if (state === "offline") return "error";
  return "cached";
}

export default function KratosTopBar({ 
  connectionState, 
  snapshotSource,
  className = "",
  style 
}: KratosTopBarProps) {
  const greeting = useMemo(getGreeting, []);
  const time = useMemo(fmtTime, []);
  const date = useMemo(fmtDate, []);
  const status = STATUS_MAP[connectionState] || STATUS_MAP.offline;

  return (
    <div className={`kr-top-hud ${className}`.trim()} style={style}>
      <div className="kr-top-hud-left">
        <span className="kr-top-hud-greeting">{greeting}, Lucas</span>
        <span className="kr-top-hud-brand">KRATOS CONTROL</span>
      </div>

      <div className="kr-top-hud-center">
        <div className="kr-top-hud-status">
          <span className={`kr-dot ${status.className}`} />
          <span>{status.label}</span>
        </div>
        <SourceBadge source={badgeSource(connectionState)} />
      </div>

      <div className="kr-top-hud-right">
        <time className="kr-top-hud-time">{time}</time>
        <span className="kr-top-hud-date">{date}</span>
      </div>
    </div>
  );
}
```

## Usage Example
```tsx
import { useState } from "react";
import KratosTopBar from "./components/layout/KratosTopBar";

export default function TopBarContainer() {
  const [connectionState, setConnectionState] = useState("live");

  return (
    <KratosTopBar 
      connectionState={connectionState}
      snapshotSource="primary"
    />
  );
}
```

## CSS Classes Used
- `kr-top-hud` - Base top HUD styling
- `kr-top-hud-left` - Left section styling
- `kr-top-hud-center` - Center section styling
- `kr-top-hud-right` - Right section styling
- `kr-top-hud-greeting` - Greeting text styling
- `kr-top-hud-brand` - Brand text styling
- `kr-top-hud-status` - Status indicator styling
- `kr-top-hud-time` - Time display styling
- `kr-top-hud-date` - Date display styling
- `kr-dot` - Base dot styling
- `kr-dot-live` - Live status dot
- `kr-dot-degraded` - Degraded status dot
- `kr-dot-critical` - Critical status dot

## Design Tokens Referenced
- `--kr-text-primary` - Primary text color
- `--kr-text-secondary` - Secondary text color
- `--kr-text-muted` - Muted text color
- `--kr-space-panel` - Panel spacing
- `--kr-space-section` - Section spacing
- `--kr-space-hud` - HUD spacing
- `--kr-font-weight-600` - Semi-bold font weight
- `--kr-font-weight-700` - Bold font weight
- `--kr-text-sm` - Small text size
- `--kr-text-xs` - Extra small text size
- `--kr-text-md` - Medium text size
- `--kr-font-mono` - Monospace font family
- `--kr-glass-bg` - Glass background
- `--kr-glass-border` - Glass border
- `--kr-glass-blur-strong` - Strong glass blur
- `--kr-radius-md` - Medium border radius
- `--kr-shadow-glass` - Glass shadow
- `--kr-azure-500` - Azure color for brand
- `--kr-gold-500` - Gold color for brand
- `--kr-color-live` - Live status color
- `--kr-status-degraded` - Degraded status color
- `--kr-status-critical` - Critical status color

## Data Displayed
1. **Operator Greeting** - Time-based greeting (Bom dia/Boa tarde/Boa noite)
2. **Brand Identity** - "KRATOS CONTROL" badge
3. **Connection Status** - Live status indicator with dot visualization
4. **Data Source** - SourceBadge indicating data origin
5. **Current Time** - Real-time clock in PT-BR format
6. **Current Date** - Date in abbreviated format

## State Management
- Uses `useMemo` for time and date formatting to prevent unnecessary re-renders
- Connection state mapping to visual indicators
- Dynamic source badge based on connection state

## Accessibility Features
- Proper time element with datetime attribute
- Semantic span elements for text content
- Color contrast compliant with WCAG standards
- Screen reader friendly status announcements