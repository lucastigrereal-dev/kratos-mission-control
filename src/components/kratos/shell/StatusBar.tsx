import { StatusDot } from "../base/StatusDot";
import type { LiveState } from "../base/LiveStatusIndicator";

type Props = {
  liveState: LiveState;
  lastUpdate: string;
  buildTime: string;
};

const STATE_SEVERITY: Record<LiveState, "ok" | "warn" | "critical" | "info" | "muted"> = {
  live: "ok",
  degraded: "warn",
  reconnecting: "warn",
  cached: "info",
  fallback: "info",
  offline: "muted",
  loading: "muted",
  empty: "muted",
  error: "critical",
};

export function StatusBar({ liveState, lastUpdate, buildTime }: Props) {
  return (
    <footer
      className="flex items-center justify-between px-5 text-[10px] kratos-mono uppercase tracking-[0.15em]"
      style={{
        height: 30,
        background: "var(--kratos-surface-1)",
        borderTop: "1px solid var(--kratos-border)",
        color: "var(--kratos-text-muted)",
      }}
      aria-label="Barra de status"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex items-center gap-1.5">
          <StatusDot
            severity={STATE_SEVERITY[liveState]}
            size="xs"
            pulse={liveState === "live"}
          />
          <span style={{ color: "var(--kratos-text-secondary)" }}>{liveState}</span>
        </span>
        <span className="hidden sm:inline" aria-hidden>·</span>
        <span className="hidden sm:inline truncate">last · {lastUpdate}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:inline">build · {buildTime}</span>
        <span aria-hidden>·</span>
        <span>v0.1 sandbox</span>
      </div>
    </footer>
  );
}
