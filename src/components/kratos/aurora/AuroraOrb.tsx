import { cn } from "@/lib/utils";

// ── Orb state types ────────────────────────────────────────────────────────
// idle      → calm slow spin, muted (backend cache / no fresh signal)
// live      → active glow, cyan (SSE connected + data fresh)
// thinking  → fast purple spin (loading / waiting)
// degraded  → amber warning, slow pulse (backend degraded)
// offline   → grey, minimal animation (no connection)

export type OrbState = "idle" | "live" | "thinking" | "degraded" | "offline";

interface AuroraOrbProps {
  /** Semantic state — controls color + animation */
  state?: OrbState;
  /** @deprecated — use `state` prop instead */
  active?: boolean;
  /** @deprecated — use `state` prop instead */
  pulse?: boolean;
  className?: string;
}

// ── Per-state visual config ────────────────────────────────────────────────

const STATE_CFG: Record<
  OrbState,
  {
    ringTop: string;
    ringRight: string;
    coreGradient: string;
    glow: string;
    opacity: number;
    spinDuration: string;
    hasPulseRing: boolean;
    pulseRingColor: string;
    float: string | undefined;
  }
> = {
  live: {
    ringTop: "var(--kr-accent-cyan)",
    ringRight: "var(--kratos-ghost)",
    coreGradient:
      "radial-gradient(circle at 30% 30%, #ffffff 0%, var(--kratos-ghost) 40%, transparent 80%)",
    glow:
      "0 0 20px color-mix(in oklab, var(--kr-accent-cyan) 45%, transparent), 0 0 5px color-mix(in oklab, var(--kratos-ghost) 60%, transparent)",
    opacity: 1,
    spinDuration: "3s",
    hasPulseRing: true,
    pulseRingColor: "color-mix(in oklab, var(--kr-accent-cyan) 30%, transparent)",
    float: "kratos-float-medium 3s ease-in-out infinite",
  },
  idle: {
    ringTop: "var(--kratos-ghost)",
    ringRight: "rgba(255,255,255,0.15)",
    coreGradient:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55) 0%, var(--kratos-ghost) 50%, transparent 85%)",
    glow: "0 0 12px color-mix(in oklab, var(--kratos-ghost) 22%, transparent)",
    opacity: 0.8,
    spinDuration: "6s",
    hasPulseRing: false,
    pulseRingColor: "",
    float: "kratos-float-medium 4s ease-in-out infinite",
  },
  thinking: {
    ringTop: "#A78BFA",
    ringRight: "#7C3AED",
    coreGradient:
      "radial-gradient(circle at 30% 30%, #DDD6FE 0%, #7C3AED 50%, transparent 90%)",
    glow: "0 0 22px rgba(124,58,237,0.55), 0 0 8px rgba(167,139,250,0.5)",
    opacity: 1,
    spinDuration: "1.2s",
    hasPulseRing: true,
    pulseRingColor: "rgba(139,92,246,0.35)",
    float: undefined,
  },
  degraded: {
    ringTop: "var(--kratos-warn)",
    ringRight: "color-mix(in oklab, var(--kratos-warn) 30%, transparent)",
    coreGradient:
      "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--kratos-warn) 60%, white) 0%, var(--kratos-warn) 55%, transparent 90%)",
    glow: "0 0 16px color-mix(in oklab, var(--kratos-warn) 35%, transparent)",
    opacity: 0.9,
    spinDuration: "5s",
    hasPulseRing: true,
    pulseRingColor: "color-mix(in oklab, var(--kratos-warn) 25%, transparent)",
    float: undefined,
  },
  offline: {
    ringTop: "var(--kratos-text-muted)",
    ringRight: "rgba(255,255,255,0.08)",
    coreGradient:
      "radial-gradient(circle at 30% 30%, var(--kratos-text-muted) 0%, var(--kratos-surface-4) 60%, transparent 100%)",
    glow: "none",
    opacity: 0.35,
    spinDuration: "10s",
    hasPulseRing: false,
    pulseRingColor: "",
    float: undefined,
  },
};

// ── Backward-compat: resolve legacy active/pulse to OrbState ──────────────

function resolveState(
  state: OrbState | undefined,
  active: boolean | undefined,
  pulse: boolean | undefined,
): OrbState {
  if (state !== undefined) return state;
  if (active === false) return "offline";
  if (pulse) return "live";
  if (active) return "idle";
  return "idle";
}

// ── Component ──────────────────────────────────────────────────────────────

export function AuroraOrb({
  state,
  active,
  pulse,
  className,
}: AuroraOrbProps) {
  const orbState = resolveState(state, active, pulse);
  const cfg = STATE_CFG[orbState];

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: 48, height: 48, animation: cfg.float }}
      aria-label={`Aurora · ${orbState}`}
    >
      {/* Rotating ring */}
      <div
        className="animate-spin absolute inset-0 rounded-full"
        style={{
          animationDuration: cfg.spinDuration,
          border: "2px solid transparent",
          borderTopColor: cfg.ringTop,
          borderRightColor: cfg.ringRight,
        }}
        aria-hidden
      />

      {/* Orb core */}
      <div
        className="rounded-full transition-all duration-700"
        style={{
          width: 36,
          height: 36,
          background: cfg.coreGradient,
          boxShadow: cfg.glow,
          opacity: cfg.opacity,
        }}
      />

      {/* Pulse ring — live / thinking / degraded only */}
      {cfg.hasPulseRing && (
        <div
          className="absolute inset-0 rounded-full kratos-pulse"
          style={{
            border: "1.5px solid",
            borderColor: cfg.pulseRingColor,
            boxShadow: `0 0 10px ${cfg.pulseRingColor}`,
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
