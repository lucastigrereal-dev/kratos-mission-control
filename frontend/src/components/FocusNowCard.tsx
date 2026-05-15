import { useApi } from "../hooks/useApi";
import LoadingSkeleton from "./LoadingSkeleton";

interface FocusData {
  mode?: string;
  focus_project?: string;
  focus_block_minutes?: number;
  do_not_do?: string[];
  timebox_minutes?: number;
}

const MODE_LABELS: Record<string, { label: string; icon: string; className: string }> = {
  execution: { label: "Execução", icon: ">>", className: "kr-chip kr-chip-healthy" },
  planning: { label: "Planejamento", icon: "O", className: "kr-chip kr-chip-info" },
  review: { label: "Review", icon: "R", className: "kr-chip kr-chip-degraded" },
  learning: { label: "Aprendizado", icon: "L", className: "kr-chip kr-chip-neutral" },
};

export default function FocusNowCard() {
  const { data, loading, error } = useApi<FocusData>("/mentor/focus");

  if (loading) return <LoadingSkeleton type="card" count={1} />;

  const modeInfo = MODE_LABELS[data?.mode ?? ""] ?? MODE_LABELS.execution;
  const timebox = data?.timebox_minutes ?? data?.focus_block_minutes ?? 90;

  return (
    <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", height: "100%" }}>
      <div className="kr-section-title">Foco Agora</div>

      {error && (
        <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-muted)", marginTop: 8 }}>
          Indisponível
        </div>
      )}

      {!error && (
        <>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className={modeInfo.className} style={{ fontSize: "var(--kr-text-sm)" }}>
              {modeInfo.icon} {modeInfo.label}
            </span>
            <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
              {timebox}min
            </span>
          </div>

          {data?.focus_project && (
            <div style={{ marginTop: 8, fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)" }}>
              {data.focus_project}
            </div>
          )}

          {data?.do_not_do && data.do_not_do.length > 0 && (
            <div style={{ marginTop: 12, borderTop: "1px solid var(--kr-glass-border)", paddingTop: 8 }}>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginBottom: 4 }}>
                NÃO fazer agora
              </div>
              {data.do_not_do.map((item, i) => (
                <div key={i} style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", padding: "2px 0" }}>
                  - {item}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
