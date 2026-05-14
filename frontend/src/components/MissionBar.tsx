interface MissionBarProps {
  currentMission?: string;
  nextAction?: string;
  nextActionTitle?: string;
}

export default function MissionBar({
  currentMission,
  nextAction,
  nextActionTitle,
}: MissionBarProps) {
  return (
    <div className="kr-mission-bar">
      <div className="kr-mission-bar-item">
        <span className="kr-mission-bar-label">Missão atual</span>
        <span className="kr-mission-bar-value">
          {currentMission || "Indefinida"}
        </span>
      </div>

      <div className="kr-mission-bar-divider" />

      <div className="kr-mission-bar-item kr-mission-bar-item--action">
        <span className="kr-mission-bar-label">Próxima ação</span>
        <span className="kr-mission-bar-value kr-mission-bar-value--action">
          {nextActionTitle || nextAction || "Definir próximo passo"}
        </span>
      </div>

      <div className="kr-mission-progress">
        <div className="kr-mission-progress-bar" />
      </div>
    </div>
  );
}
