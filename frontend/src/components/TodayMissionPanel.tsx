import { useApi } from "../hooks/useApi";
import LoadingSkeleton from "./LoadingSkeleton";

interface MissionData {
  current_project?: { id: string; name: string };
  current_mission?: { id: string; title: string };
  focus_state?: string;
}

export default function TodayMissionPanel() {
  const { data, loading, error } = useApi<MissionData>("/mission/current");

  if (loading) return <LoadingSkeleton type="card" count={1} />;

  const project = data?.current_project;
  const mission = data?.current_mission;
  const focusState = data?.focus_state ?? "unknown";

  const focusLabel: Record<string, string> = {
    on_focus: "Em foco",
    drifting: "Deriva",
    focus: "Focado",
    execution: "Execução",
    planning: "Planejamento",
  };

  return (
    <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", height: "100%" }}>
      <div className="kr-section-title">Missão Atual</div>

      {error && (
        <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-muted)" }}>
          Indisponível — {error}
        </div>
      )}

      {!error && (
        <>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginBottom: 2 }}>
              Projeto
            </div>
            <div style={{ fontWeight: 600, fontSize: "var(--kr-text-base)" }}>
              {project?.name ?? "Indefinido"}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginBottom: 2 }}>
              Missao
            </div>
            <div style={{ fontWeight: 500, fontSize: "var(--kr-text-base)", color: "var(--kr-text-secondary)" }}>
              {mission?.title ?? "Missão indefinida"}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className={`kr-dot ${focusState === "on_focus" || focusState === "focus" ? "kr-dot-live" : "kr-dot-degraded"}`}
            />
            <span style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)" }}>
              {focusLabel[focusState] ?? focusState}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
