import { useApi } from "../hooks/useApi";
import useCheckpointSuggestion from "../hooks/useCheckpointSuggestion";
import SourceBadge, { type SourceType } from "../components/SourceBadge";
import CheckpointSuggestionBanner from "../components/CheckpointSuggestionBanner";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { ErrorState } from "../components/ui";

interface ContextData {
  current_app: string;
  current_title: string;
  current_url: string;
  project_guess: string;
  mission_guess: string;
  reason_guess: string;
  confidence: number;
  focus_project_today: string;
  on_focus: boolean;
  drift_minutes: number;
  context_switches_today: number;
  source: string;
  collector_status: string;
  drift: {
    state: string;
    severity: string;
    minutes_out_of_focus: number;
    reason: string;
    current_app: string;
    current_title: string;
    inferred_project: string;
    expected_project: string;
    recovery_action: Record<string, string> | null;
  };
  checkpoint_suggestion: {
    should_suggest: boolean;
    severity: string;
    reason: string;
    suggested_checkpoint: Record<string, unknown> | null;
  };
}

export default function ContextoPage() {
  const { data, source, loading, error } = useApi<ContextData>("/context/current");
  const {
    createCheckpoint,
    loading: cpLoading,
    error: cpError,
    success: cpSuccess,
    clearSuccess: cpClearSuccess,
  } = useCheckpointSuggestion();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <h2>Contexto Atual</h2>
        <SourceBadge source={(source as SourceType) || "unknown"} />
      </div>

      {loading && <LoadingSkeleton type="card" count={3} />}
      {error && <ErrorState title="Erro ao carregar contexto" description={error} />}

      {data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Drift status */}
          <div className="kr-card" style={{
            borderColor: data.on_focus ? "var(--kr-green-500)" :
              data.drift.severity === "high" ? "var(--kr-red-500)" :
              "var(--kr-yellow-500)"
          }}>
            <h6>ESTADO DE FOCO</h6>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span className={data.on_focus ? "kr-dot kr-dot-healthy" : "kr-dot kr-dot-critical"} />
              <span style={{ fontWeight: 600 }}>
                {data.drift.state === "on_focus" ? "No foco" :
                 data.drift.state === "off_focus" ? `Fora do foco (${data.drift.minutes_out_of_focus}min)` :
                 data.drift.state === "related" ? "Contexto relacionado" : "Desconhecido"}
              </span>
            </div>
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 4 }}>
              {data.drift.reason}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {/* Current window */}
            <div className="kr-card">
              <h6>JANELA ATIVA</h6>
              <div style={{ fontSize: "var(--kr-text-sm)" }}>{data.current_app || "?"}</div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 2 }}>
                {data.current_title || "Sem título"}
              </div>
            </div>

            {/* Project guess */}
            <div className="kr-card">
              <h6>PROJETO INFERIDO</h6>
              <div style={{ fontSize: "var(--kr-text-sm)" }}>
                {data.project_guess || data.drift.inferred_project || "Indeterminado"}
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                Confiança: {((data.confidence || 0) * 100).toFixed(0)}%
              </div>
            </div>

            {/* Expected project */}
            <div className="kr-card">
              <h6>PROJETO ESPERADO</h6>
              <div style={{ fontSize: "var(--kr-text-sm)" }}>
                {data.focus_project_today || data.drift.expected_project || "Nenhum"}
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                Switches hoje: {data.context_switches_today}
              </div>
            </div>

            {/* Recovery action */}
            {data.drift.recovery_action && (
              <div className="kr-card" style={{ borderColor: "var(--kr-orange-500)" }}>
                <h6>AÇÃO DE RECUPERAÇÃO</h6>
                <div style={{ fontSize: "var(--kr-text-sm)" }}>
                  {data.drift.recovery_action.title}
                </div>
              </div>
            )}

            {/* Checkpoint suggestion banner */}
            <CheckpointSuggestionBanner
              suggestion={data.checkpoint_suggestion}
              loading={cpLoading}
              error={cpError}
              success={cpSuccess}
              onCreate={() => {
                const sc = data.checkpoint_suggestion?.suggested_checkpoint;
                createCheckpoint({
                  project: (sc as Record<string, string>)?.project || data.project_guess,
                  where_i_stopped: (sc as Record<string, string>)?.where_i_stopped || data.current_title,
                  next_action: (sc as Record<string, string>)?.next_action || "",
                  mission_guess: data.mission_guess,
                  confidence: (sc as Record<string, number>)?.confidence ?? data.confidence,
                });
              }}
              onDismissSuccess={cpClearSuccess}
            />

            {/* Source info */}
            <div className="kr-card">
              <h6>FONTE</h6>
              <div style={{ fontSize: "var(--kr-text-sm)" }}>
                {data.source} ({data.collector_status})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
