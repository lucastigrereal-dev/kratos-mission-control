import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { EmptyState, ErrorState } from "../components/ui";

interface Checkpoint {
  id: string;
  project_id: string;
  name: string;
  description: string;
  tags: string[];
  snapshot: Record<string, unknown>;
  created_at: string;
}

export default function CheckpointsPage() {
  const { data, source, loading, error } = useApi<Checkpoint[]>("/checkpoints");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <h2>Checkpoints</h2>
        <SourceBadge source={(source as SourceType) || "unknown"} />
      </div>

      {loading && <LoadingSkeleton type="card" count={3} />}
      {error && <ErrorState title="Erro ao carregar checkpoints" description={error} />}
      {data && data.length === 0 && <EmptyState title="Nenhum checkpoint registrado" description="Salve seu primeiro checkpoint para restaurar contexto." />}

      {data && data.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map((cp) => (
            <div key={cp.id} className="kr-card" style={{ display: "flex", gap: 12 }}>
              <div style={{
                width: 2,
                flexShrink: 0,
                background: "var(--kr-purple-500)",
                borderRadius: 1,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{cp.name}</span>
                  <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                    {cp.project_id}
                  </span>
                </div>
                {cp.description && (
                  <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)", marginTop: 2 }}>
                    {cp.description}
                  </div>
                )}
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {cp.tags?.map((tag, i) => (
                    <span key={i} className="kr-chip kr-chip-info">{tag}</span>
                  ))}
                </div>
                <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 4 }}>
                  {cp.created_at}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
