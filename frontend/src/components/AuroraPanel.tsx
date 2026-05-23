interface AuroraSignal {
  text: string;
  tone: "critical" | "warning" | "info" | "neutral";
  action?: string;
}

interface AuroraPanelProps {
  signals: AuroraSignal[];
  focusState?: string;
  driftRisk?: "low" | "medium" | "high";
  nextAction?: string;
  missionSummary?: string;
  blocker?: string;
  recommendation?: string;
  doNotDo?: string;
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
  signals,
  focusState,
  driftRisk = "low",
  nextAction,
  missionSummary,
  blocker,
  recommendation,
  doNotDo,
}: AuroraPanelProps) {
  return (
    <div className="kr-aurora-panel">
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
            Sinais limpos. Nada requer atenção agora.
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
