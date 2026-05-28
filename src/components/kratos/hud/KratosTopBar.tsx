import { Clock, Shield, Zap, Activity, TrendingUp, Wifi, WifiOff, RefreshCw, Radio } from "lucide-react";
import { MetricBadge } from "@/components/kratos/ui-primitives/MetricBadge";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { cn } from "@/lib/utils";

type ConnectionState = "live" | "polling" | "reconnecting" | "fallback" | "offline";

interface KratosTopBarProps {
  connectionState?: ConnectionState;
}

interface HUDMetric {
  value: number | string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean; style?: React.CSSProperties }>;
  tone?: "positive" | "negative" | "neutral";
  delta?: number;
}

const CONNECTION_LABELS: Record<ConnectionState, string> = {
  live: "AO VIVO",
  polling: "SINCRONIZANDO",
  reconnecting: "RECONECTANDO",
  fallback: "MODO LOCAL",
  offline: "OFFLINE",
};

const CONNECTION_ICONS: Record<ConnectionState, React.ComponentType<{ className?: string; style?: React.CSSProperties; "aria-hidden"?: boolean }>> = {
  live: Radio,
  polling: RefreshCw,
  reconnecting: RefreshCw,
  fallback: Wifi,
  offline: WifiOff,
};

const CONNECTION_COLORS: Record<ConnectionState, string> = {
  live: "var(--kr-success)",
  polling: "var(--kr-warning)",
  reconnecting: "var(--kr-warning)",
  fallback: "var(--kr-azure)",
  offline: "var(--kr-danger)",
};

const hudMetrics: HUDMetric[] = [
  { value: "87%", label: "Energia", icon: Zap, tone: "positive", delta: 3 },
  { value: 47, label: "Nivel", icon: TrendingUp, tone: "neutral" },
  { value: "32.780", label: "XP", icon: Activity, tone: "positive", delta: 12 },
];

export function KratosTopBar({ connectionState = "live" }: KratosTopBarProps) {
  const StateIcon = CONNECTION_ICONS[connectionState];
  const connectionColor = CONNECTION_COLORS[connectionState];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-100 flex items-center h-16 px-6 gap-6"
      style={{
        background: "var(--kr-hud-bg)",
        borderBottom: `1px solid var(--kr-hud-border)`,
        backdropFilter: "blur(var(--kr-glass-blur))",
        WebkitBackdropFilter: "blur(var(--kr-glass-blur))",
      }}
    >
      {/* --- Left: Operator Welcome --- */}
      <div className="flex items-center gap-3 shrink-0 min-w-[200px]">
        <div
          className="flex items-center justify-center h-9 w-9 rounded-full text-lg shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--kr-azure), var(--kr-aurora))",
            boxShadow: "0 0 14px rgba(30, 144, 255, 0.3)",
          }}
          aria-hidden
        >
          🐯
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: "var(--kr-hud-text)" }}
          >
            Bom dia, Lucas
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[9px] uppercase tracking-[0.14em] font-semibold"
              style={{ color: "var(--kr-azure)" }}
            >
              KRATOS CONTROL
            </span>
            <span
              className="text-[8px] tracking-wider"
              style={{ color: "var(--kr-text-muted)" }}
            >
              |
            </span>
            <span
              className="text-[9px] tracking-wider"
              style={{ color: "var(--kr-text-secondary)" }}
            >
              Seu mundo. Sua missao. Seu legado.
            </span>
          </div>
        </div>
      </div>

      {/* --- Center: HUD Metrics --- */}
      <div className="flex items-center gap-3 flex-1 justify-center">
        {hudMetrics.map((metric) => (
          <MetricBadge
            key={metric.label}
            value={metric.value}
            label={metric.label}
            icon={metric.icon}
            tone={metric.tone}
            delta={metric.delta}
            className="min-w-[90px]"
          />
        ))}

        {/* Connection state pill */}
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
            connectionState === "reconnecting" && "animate-pulse",
          )}
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
          }}
          title={CONNECTION_LABELS[connectionState]}
        >
          <StateIcon
            className="h-3 w-3"
            style={{ color: connectionColor }}
            aria-hidden
          />
          <span
            className="text-[9px] uppercase tracking-[0.12em] font-semibold"
            style={{ color: connectionColor }}
          >
            {CONNECTION_LABELS[connectionState]}
          </span>
        </div>
      </div>

      {/* --- Right: Clock + Date + Shield --- */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col items-end leading-none">
          <span
            className="text-sm font-semibold kratos-num"
            style={{ color: "var(--kr-hud-text)" }}
          >
            09:42
          </span>
          <span
            className="text-[10px] tracking-wider"
            style={{ color: "var(--kr-text-muted)" }}
          >
            Terca, 21 de Maio
          </span>
        </div>

        <div
          className="flex items-center justify-center h-8 w-8 rounded-lg"
          style={{
            background: "var(--kr-glass-bg)",
            border: "1px solid var(--kr-glass-border)",
          }}
          title="KRATOS Shield — Secure"
        >
          <Shield
            className="h-4 w-4"
            style={{ color: "var(--kr-gold)" }}
            aria-hidden
          />
        </div>
      </div>
    </header>
  );
}
