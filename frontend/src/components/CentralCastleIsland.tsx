import { type ConnectionState } from "../hooks/useLiveKratos";

interface CentralCastleIslandProps {
  currentMission?: string;
  connectionState?: ConnectionState;
  onClick?: () => void;
}

function statusDot(state?: ConnectionState): string {
  if (state === "live") return "kr-dot kr-dot-live";
  if (state === "offline") return "kr-dot kr-dot-critical";
  return "kr-dot kr-dot-degraded";
}

export default function CentralCastleIsland({
  currentMission,
  connectionState,
  onClick,
}: CentralCastleIslandProps) {
  return (
    <button
      className="kr-castle"
      onClick={onClick}
      aria-label="Missão central"
      title="Missão central — clique para detalhes"
    >
      {/* Castle platform */}
      <div className="kr-castle-platform">
        {/* Left tower */}
        <div className="kr-castle-tower kr-castle-tower--left">
          <div className="kr-castle-roof kr-castle-roof--left" />
          <div className="kr-castle-window" />
        </div>

        {/* Center tower (tallest) */}
        <div className="kr-castle-tower kr-castle-tower--center">
          <div className="kr-castle-roof kr-castle-roof--center" />
          <div className="kr-castle-window kr-castle-window--center">
            <span className="kr-castle-shield">K</span>
          </div>
        </div>

        {/* Right tower */}
        <div className="kr-castle-tower kr-castle-tower--right">
          <div className="kr-castle-roof kr-castle-roof--right" />
          <div className="kr-castle-window" />
        </div>

        {/* Portal glow */}
        <div className="kr-castle-portal" />

        {/* Base */}
        <div className="kr-castle-base" />
      </div>

      {/* Banner below */}
      <div className="kr-castle-banner">
        <span className={statusDot(connectionState)} />
        <span className="kr-castle-banner-label">MISSÃO ATUAL</span>
        <span className="kr-castle-banner-text">
          {currentMission || "Indefinida"}
        </span>
      </div>
    </button>
  );
}
