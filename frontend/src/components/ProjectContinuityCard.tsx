import { useApi } from "../hooks/useApi";
import LoadingSkeleton from "./LoadingSkeleton";

interface ContinuityState {
  has_previous_session: boolean;
  project_id?: string;
  project_name?: string;
  last_action?: string;
  next_step?: string;
  branch?: string;
  critical_files?: string[];
  focus_state?: string;
  last_active_at?: string;
  session_count?: number;
  message?: string;
}

export default function ProjectContinuityCard() {
  const { data: resp, loading, error } = useApi<{ source: string; data: ContinuityState }>("/continuity/state");

  if (loading) return <LoadingSkeleton type="card" count={1} />;

  const state = resp?.data;
  if (error || !state || !state.has_previous_session) return null;

  return (
    <div className="kr-glass-panel kr-glass-panel--strong" style={{
      padding: "var(--kr-space-section)",
      borderLeft: "3px solid var(--kr-purple-500)",
      marginBottom: "var(--kr-space-section)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "1rem" }}>...</span>
            <span style={{ fontWeight: 600, fontSize: "var(--kr-text-sm)" }}>Retomar sessão anterior</span>
            <span className="kr-chip kr-chip-info" style={{ fontSize: "var(--kr-text-xs)" }}>
              sessão {state.session_count ?? 1}
            </span>
          </div>
          <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)", lineHeight: 1.4 }}>
            {state.message}
          </div>

          <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap", fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
            {state.project_name && (
              <span>Projeto: <strong style={{ color: "var(--kr-text-secondary)" }}>{state.project_name}</strong></span>
            )}
            {state.branch && (
              <span>Branch: <strong style={{ color: "var(--kr-text-secondary)" }}>{state.branch}</strong></span>
            )}
            {state.focus_state && (
              <span>Foco: <strong style={{ color: "var(--kr-text-secondary)" }}>{state.focus_state}</strong></span>
            )}
          </div>

          {state.next_step && (
            <div style={{
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: "var(--kr-radius-sm)",
              background: "var(--kr-purple-900)",
              fontSize: "var(--kr-text-sm)",
              color: "var(--kr-purple-200)",
            }}>
              Próximo passo: {state.next_step}
            </div>
          )}

          {state.critical_files && state.critical_files.length > 0 && (
            <div style={{ marginTop: 6, fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
              Arquivos críticos: {state.critical_files.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
