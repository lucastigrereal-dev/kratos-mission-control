import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";

interface MissionLensContract {
  contract_version: string;
  source: string;
  collector_status: string;
  generated_at: string;
  stale_after_ms: number;
  data: {
    current_mission: Record<string, unknown>;
    next_action: Record<string, unknown>;
    do_not_do: Array<Record<string, unknown>>;
    risks: Array<Record<string, unknown>>;
    deadlines: Array<Record<string, unknown>>;
    checkpoint: Record<string, unknown>;
    system_pulse: Record<string, unknown>;
    mentor_summary: Record<string, unknown>;
    checkpoint_suggestion: Record<string, unknown>;
  };
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="kr-card" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <h6>{title}</h6>
      <div>{children}</div>
    </div>
  );
}

export default function MissionLensPage() {
  const { data, source, loading, error } = useApi<MissionLensContract>("/mission/lens");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <h2>Mission Lens</h2>
        <SourceBadge source={(source as SourceType) || "unknown"} />
      </div>

      {loading && <div className="kr-empty-state">Carregando...</div>}
      {error && <div className="kr-empty-state" style={{ color: "var(--kr-red-400)" }}>Erro: {error}</div>}

      {data?.data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Mentor summary banner */}
          {data.data.mentor_summary && (
            <div
              className="glass-panel"
              style={{
                padding: "1rem",
                borderColor:
                  (data.data.mentor_summary as Record<string, string>).tone === "critical"
                    ? "var(--kr-red-500)"
                    : "var(--kr-blue-500)",
              }}
            >
              <strong>
                {(data.data.mentor_summary as Record<string, string>).text || "Sistema estável"}
              </strong>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {/* Current Mission */}
            <Card title="MISSÃO ATUAL">
              <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)" }}>
                {(data.data.current_mission as Record<string, string>)?.title || "Indefinida"}
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                Projeto: {(data.data.current_mission as Record<string, string>)?.project || "?"}
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                Foco: {(data.data.current_mission as Record<string, string>)?.focus_state || "?"}
              </div>
            </Card>

            {/* Next Action */}
            <Card title="PRÓXIMA AÇÃO">
              <div style={{ fontSize: "var(--kr-text-sm)", fontWeight: 600 }}>
                {(data.data.next_action as Record<string, string>)?.title || "Definir"}
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                {(data.data.next_action as Record<string, string>)?.rationale || ""}
              </div>
            </Card>

            {/* System Pulse */}
            <Card title="PULSO DO SISTEMA">
              <div style={{ fontSize: "var(--kr-text-sm)" }}>
                {(data.data.system_pulse as Record<string, string>)?.live_status || "OK"}
              </div>
            </Card>

            {/* Do Not Do */}
            <Card title="NÃO FAZER">
              <ul style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-secondary)", paddingLeft: "1rem" }}>
                {(data.data.do_not_do as Array<Record<string, string>>)?.slice(0, 3).map((item, i) => (
                  <li key={i}>{item.title}</li>
                ))}
              </ul>
            </Card>

            {/* Risks */}
            <Card title="RISCOS">
              {data.data.risks && (data.data.risks as Array<Record<string, string>>).length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {(data.data.risks as Array<Record<string, string>>).slice(0, 3).map((r, i) => (
                    <div key={i} style={{ fontSize: "var(--kr-text-xs)" }}>
                      <span className="kr-dot kr-dot-critical" /> {r.title}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>Nenhum risco detectado</div>
              )}
            </Card>

            {/* Checkpoint */}
            <Card title="CHECKPOINT">
              <div style={{ fontSize: "var(--kr-text-sm)" }}>
                {(data.data.checkpoint as Record<string, unknown>)?.available
                  ? (data.data.checkpoint as Record<string, string>).label
                  : "Nenhum checkpoint"}
              </div>
            </Card>

            {/* Checkpoint Suggestion */}
            {data.data.checkpoint_suggestion && (
              <Card title="SUGESTÃO DE CHECKPOINT">
                <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)" }}>
                  {(data.data.checkpoint_suggestion as Record<string, unknown>)?.should_suggest
                    ? (data.data.checkpoint_suggestion as Record<string, string>).reason
                    : "Sem sugestões no momento"}
                </div>
              </Card>
            )}

            {/* Deadlines */}
            <Card title="PRAZOS">
              {data.data.deadlines && (data.data.deadlines as Array<Record<string, string>>).length > 0 ? (
                (data.data.deadlines as Array<Record<string, string>>).slice(0, 3).map((d, i) => (
                  <div key={i} style={{ fontSize: "var(--kr-text-xs)" }}>{d.title}</div>
                ))
              ) : (
                <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>Sem prazos urgentes</div>
              )}
            </Card>
          </div>

          <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", textAlign: "right" }}>
            v{data.contract_version} · {data.generated_at}
          </div>
        </div>
      )}
    </div>
  );
}
