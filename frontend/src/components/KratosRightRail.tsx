import AuroraPanel from "./AuroraPanel";

interface RiskItem {
  title: string;
  severity: "low" | "medium" | "high";
}

interface KratosRightRailProps {
  signals: Array<{ text: string; tone: "critical" | "warning" | "info" | "neutral" }>;
  focusState?: string;
  driftRisk?: "low" | "medium" | "high";
  risks?: RiskItem[];
  checkpointAvailable?: boolean;
  checkpointLabel?: string;
}

export default function KratosRightRail({
  signals,
  focusState,
  driftRisk,
  risks = [],
  checkpointAvailable = false,
  checkpointLabel,
}: KratosRightRailProps) {
  return (
    <div className="kr-right-rail">
      <AuroraPanel signals={signals} focusState={focusState} driftRisk={driftRisk} />

      {risks.length > 0 && (
        <div className="kr-right-rail-section">
          <div className="kr-section-title">RISCOS</div>
          <div className="kr-right-rail-risks">
            {risks.slice(0, 3).map((r, i) => (
              <div key={i} className="kr-right-rail-risk">
                <span
                  className={`kr-dot ${r.severity === "high" ? "kr-dot-critical" : r.severity === "medium" ? "kr-dot-degraded" : "kr-dot-offline"}`}
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
