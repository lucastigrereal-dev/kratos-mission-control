import { ReactNode, useMemo, createContext, useContext } from "react";
import KratosVisualShell from "./KratosVisualShell";
import KratosTopHud from "./KratosTopHud";
import KratosSidebar from "./KratosSidebar";
import KratosRightRail from "./KratosRightRail";
import KratosBottomDock from "./KratosBottomDock";
import { useLiveKratos } from "../hooks/useLiveKratos";
import { useApi } from "../hooks/useApi";

interface KratosContextValue {
  currentMission?: string;
  connectionState?: string;
}
export const KratosContext = createContext<KratosContextValue>({});
export function useKratosContext() {
  return useContext(KratosContext);
}

interface MissionLensBrief {
  data?: {
    current_mission?: Record<string, unknown>;
    next_action?: Record<string, unknown>;
    risks?: Array<Record<string, string>>;
    checkpoint?: Record<string, unknown>;
    mentor_summary?: Record<string, unknown>;
    checkpoint_suggestion?: Record<string, unknown>;
  };
}

interface ContextBrief {
  data?: {
    drift_state?: string;
    drift_risk?: "low" | "medium" | "high";
    current_focus?: string;
  };
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
  project_id?: string;
}

export default function Layout({ children }: { children: ReactNode }) {
  const { connectionState } = useLiveKratos();
  const { data: missionData } = useApi<MissionLensBrief>("/mission/lens");
  const { data: contextData } = useApi<ContextBrief>("/context/current");
  const { data: tasksData } = useApi<Task[]>("/tasks");

  const { progress, taskCount } = useMemo(() => {
    if (!tasksData || !Array.isArray(tasksData) || tasksData.length === 0) {
      return { progress: 0, taskCount: undefined };
    }
    const done = tasksData.filter((t) => t.status === "done").length;
    const total = tasksData.length;
    return {
      progress: total > 0 ? (done / total) * 100 : 0,
      taskCount: { done, total },
    };
  }, [tasksData]);

  const signals = useMemo(() => {
    const s: Array<{ text: string; tone: "critical" | "warning" | "info" | "neutral" }> = [];
    const summary = missionData?.data?.mentor_summary as Record<string, string> | undefined;
    if (summary) {
      s.push({
        text: summary.text || "Sistema estável",
        tone: (summary.tone as "critical" | "warning" | "info" | "neutral") || "neutral",
      });
    }
    const suggestion = missionData?.data?.checkpoint_suggestion as Record<string, unknown> | undefined;
    if (suggestion?.should_suggest) {
      s.push({
        text: (suggestion as Record<string, string>).reason || "Checkpoint sugerido",
        tone: "warning",
      });
    }
    return s;
  }, [missionData]);

  const risks = useMemo(() => {
    const raw = missionData?.data?.risks || [];
    return raw.map((r) => ({
      title: r.title || String(r),
      severity: (r.severity as "low" | "medium" | "high") || "medium",
    }));
  }, [missionData]);

  const currentMission = (missionData?.data?.current_mission as Record<string, string>)?.title;
  const nextActionTitle = (missionData?.data?.next_action as Record<string, string>)?.title;
  const nextActionRationale = (missionData?.data?.next_action as Record<string, string>)?.rationale;
  const checkpointAvailable = !!(missionData?.data?.checkpoint as Record<string, unknown>)?.available;
  const checkpointLabel = (missionData?.data?.checkpoint as Record<string, string>)?.label;
  const focusState = (contextData?.data as Record<string, string>)?.current_focus;
  const driftRisk = (contextData?.data as Record<string, string>)?.drift_risk as "low" | "medium" | "high" | undefined;

  return (
    <div data-connection={connectionState} style={{ position: "relative" }}>
      {connectionState === "offline" && (
        <div className="kr-offline-overlay">
          <span className="kr-dot kr-dot-critical" />
          Backend offline — tentando reconectar...
        </div>
      )}
      {connectionState === "reconnecting" && (
        <div className="kr-offline-overlay" style={{ background: "color-mix(in srgb, var(--kr-yellow-500) 12%, transparent)", color: "var(--kr-yellow-400)" }}>
          <span className="kr-dot kr-dot-degraded" />
          Reconectando ao backend...
        </div>
      )}
      {(connectionState === "polling" || connectionState === "fallback") && (
        <div className="kr-offline-overlay" style={{ background: "color-mix(in srgb, var(--kr-orange-500) 10%, transparent)", color: "var(--kr-orange-400)" }}>
          <span className="kr-dot kr-dot-degraded" />
          Dados em cache — conexão degradada
        </div>
      )}
      <KratosVisualShell
        topHud={<KratosTopHud connectionState={connectionState} />}
        sidebar={<KratosSidebar />}
        rightRail={
          <KratosRightRail
            signals={signals}
            focusState={focusState}
            driftRisk={driftRisk}
            risks={risks}
            checkpointAvailable={checkpointAvailable}
            checkpointLabel={checkpointLabel}
          />
        }
        bottomDock={
          <KratosBottomDock
            currentMission={currentMission}
            nextAction={nextActionRationale}
            nextActionTitle={nextActionTitle}
            activeSquads={["KRATOS", "AURORA"]}
            progress={progress}
            taskCount={taskCount}
            onContinue={() => {
              if (nextActionTitle) {
                window.location.assign("/tarefas");
              }
            }}
          />
        }
      >
        <KratosContext.Provider value={{ currentMission, connectionState }}>
          {children}
        </KratosContext.Provider>
      </KratosVisualShell>
    </div>
  );
}
