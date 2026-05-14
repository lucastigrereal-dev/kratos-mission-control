interface AuroraSignal {
  text: string;
  tone: "critical" | "warning" | "info" | "neutral";
}

interface AuroraPanelProps {
  signals: AuroraSignal[];
  focusState?: string;
  driftRisk?: "low" | "medium" | "high";
}

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
  signals,
  focusState,
  driftRisk = "low",
}: AuroraPanelProps) {
  return (
    <div className="kr-aurora-panel">
      <div className="kr-section-title">AURORA · Inteligência</div>

      {/* Holographic orb */}
      <div className="kr-aurora-orb">
        <div className="kr-aurora-orb-inner" />
        <div className="kr-aurora-orb-rings" />
      </div>

      {focusState && (
        <div className="kr-aurora-focus">
          <span className="kr-dot kr-dot-live" />
          <span>{focusState}</span>
          {driftRisk !== "low" && (
            <span
              className="kr-chip"
              style={{
                color: driftRisk === "high" ? "var(--kr-arena-coral)" : "var(--kr-gold-400)",
                background:
                  driftRisk === "high"
                    ? "color-mix(in srgb, var(--kr-arena-coral) 12%, transparent)"
                    : "color-mix(in srgb, var(--kr-gold-400) 12%, transparent)",
                fontSize: "var(--kr-text-xs)",
                marginLeft: "auto",
              }}
            >
              {DRIFT_LABELS[driftRisk]}
            </span>
          )}
        </div>
      )}

      <div className="kr-aurora-signals">
        {signals.length === 0 && (
          <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
            Nenhum sinal ativo
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
              <span style={{ fontSize: "var(--kr-text-xs)" }}>{signal.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
