import MissionBar from "./MissionBar";

interface KratosBottomDockProps {
  currentMission?: string;
  nextAction?: string;
  nextActionTitle?: string;
  activeSquads?: string[];
  onContinue?: () => void;
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

export default function KratosBottomDock({
  currentMission,
  nextAction,
  nextActionTitle,
  activeSquads = ["KRATOS", "AURORA"],
  onContinue,
}: KratosBottomDockProps) {
  return (
    <div className="kr-bottom-dock">
      <MissionBar
        currentMission={currentMission}
        nextAction={nextAction}
        nextActionTitle={nextActionTitle}
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
