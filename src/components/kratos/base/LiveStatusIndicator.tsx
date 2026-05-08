import { StatusDot, type Severity } from "./StatusDot";

export type LiveState =
  | "live"
  | "degraded"
  | "reconnecting"
  | "cached"
  | "fallback"
  | "offline"
  | "loading"
  | "empty"
  | "error";

type Meta = { label: string; severity: Severity; pulse?: boolean; blink?: boolean };

const STATE_META: Record<LiveState, Meta> = {
  live:         { label: "LIVE",         severity: "ok",       pulse: true },
  degraded:     { label: "DEGRADED",     severity: "warn" },
  reconnecting: { label: "RECONNECTING", severity: "warn",     blink: true },
  cached:       { label: "CACHED",       severity: "info" },
  fallback:     { label: "FALLBACK",     severity: "info",     blink: true },
  offline:      { label: "OFFLINE",      severity: "muted" },
  loading:      { label: "LOADING",      severity: "muted",    blink: true },
  empty:        { label: "EMPTY",        severity: "muted" },
  error:        { label: "ERROR",        severity: "critical" },
};

type Props = { state: LiveState; lastUpdate?: string };

export function LiveStatusIndicator({ state, lastUpdate }: Props) {
  const meta = STATE_META[state];
  return (
    <div
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5"
      style={{
        background: "var(--kratos-surface-2)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <StatusDot
        severity={meta.severity}
        pulse={meta.pulse}
        blink={meta.blink}
        size="sm"
      />
      <span
        className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {meta.label}
      </span>
      {lastUpdate && (
        <span
          className="text-[10px] kratos-mono"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          · {lastUpdate}
        </span>
      )}
    </div>
  );
}
