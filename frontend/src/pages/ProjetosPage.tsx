import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  phase: string;
  priority: string;
  repo_path: string;
  next_action: string;
  deadline: string;
  risk_level: string;
  outputs_count: number;
  created_at: string;
  updated_at: string;
}

function statusColor(status: string) {
  switch (status) {
    case "active": return "kr-chip-healthy";
    case "dirty": return "kr-chip-degraded";
    case "error": return "kr-chip-critical";
    default: return "kr-chip-neutral";
  }
}

export default function ProjetosPage() {
  const { data, source, loading, error } = useApi<Project[]>("/projects");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <h2>Projetos</h2>
        <SourceBadge source={(source as SourceType) || "unknown"} />
      </div>

      {loading && <div className="kr-empty-state">Carregando...</div>}
      {error && <div className="kr-empty-state" style={{ color: "var(--kr-red-400)" }}>Erro: {error}</div>}
      {data && data.length === 0 && <div className="kr-empty-state">Nenhum projeto encontrado</div>}

      {data && data.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {data.map((p) => (
            <div key={p.id} className="kr-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ flex: 1 }}>{p.name}</h3>
                <span className={`kr-chip ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              {p.description && (
                <p style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)" }}>
                  {p.description}
                </p>
              )}
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span>Tipo: {p.type}</span>
                {p.phase && <span>Fase: {p.phase}</span>}
                {p.priority && <span className={`kr-chip ${p.priority === "high" ? "kr-chip-critical" : p.priority === "medium" ? "kr-chip-degraded" : "kr-chip-neutral"}`}>{p.priority}</span>}
                {p.risk_level && <span>Risco: {p.risk_level}</span>}
                {p.outputs_count > 0 && <span>Outputs: {p.outputs_count}</span>}
              </div>
              {p.next_action && (
                <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-blue-400)" }}>
                  Próxima: {p.next_action}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
