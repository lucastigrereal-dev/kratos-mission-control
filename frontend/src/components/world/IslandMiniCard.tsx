export type IslandStatus = "active" | "at-risk" | "waiting" | "done";

interface IslandMiniCardProps {
  title: string;
  subtitle?: string;
  status?: IslandStatus;
  progress?: number;
  selected?: boolean;
  onClick?: () => void;
}

const STATUS_DOT: Record<IslandStatus, string> = {
  active: "kr-dot-live",
  "at-risk": "kr-dot-degraded",
  waiting: "kr-dot-offline",
  done: "kr-dot-healthy",
};

export default function IslandMiniCard({ title, subtitle, status = "active", progress, selected = false, onClick }: IslandMiniCardProps) {
  return (
    <button
      className={`kr-island-mini-card${selected ? " kr-island-mini-card--selected" : ""}`}
      onClick={onClick}
      type="button"
      aria-pressed={selected}
    >
      <span className={STATUS_DOT[status]} />
      <div className="kr-island-mini-card-body">
        <span className="kr-island-mini-card-title">{title}</span>
        {subtitle && <span className="kr-island-mini-card-sub">{subtitle}</span>}
      </div>
      {progress !== undefined && (
        <span className="kr-island-mini-card-progress">{Math.round(progress)}%</span>
      )}
    </button>
  );
}
