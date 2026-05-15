import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";
import CheckpointTimeline from "../components/CheckpointTimeline";
import ResumeFromHereCard from "../components/ResumeFromHereCard";
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
  const { data, source, loading, error, refetch } = useApi<Checkpoint[]>("/checkpoints");
  const [selectedCp, setSelectedCp] = useState<Checkpoint | null>(null);
  const navigate = useNavigate();

  function handleResume(cp: Checkpoint) {
    navigate("/visao-geral");
  }

  return (
    <div style={{ padding: "var(--kr-space-page)" }}>
      <div className="kr-section-title-wrap">
        <div className="kr-section-title-header">
          <h2 style={{ margin: 0 }}>Checkpoints</h2>
          <SourceBadge source={(source as SourceType) || "unknown"} />
        </div>
        <p className="kr-section-title-sub">
          Linha do tempo de contexto — cada ponto e um lugar seguro para retomar
        </p>
        <div className="kr-section-title-divider" />
      </div>

      {loading && <LoadingSkeleton type="card" count={3} />}
      {error && !loading && <ErrorState title="Erro ao carregar checkpoints" description={error} onRetry={refetch} />}
      {data && data.length === 0 && !loading && (
        <EmptyState
          title="Nenhum checkpoint registrado"
          description="Salve seu primeiro checkpoint para poder retomar o contexto entre sessoes."
        />
      )}

      {data && data.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kr-space-section)" }}>
          {/* Count badge */}
          <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
            {data.length} checkpoint{data.length > 1 ? "s" : ""} registrado{data.length > 1 ? "s" : ""}
            {data.length > 0 && (
              <span style={{ marginLeft: 8 }}>
                · Mais recente: {data[0]?.name}
              </span>
            )}
          </div>

          {/* Timeline */}
          <CheckpointTimeline
            checkpoints={data}
            selectedId={selectedCp?.id}
            onSelect={setSelectedCp}
          />

          {/* Resume card */}
          {selectedCp && (
            <ResumeFromHereCard
              checkpoint={selectedCp}
              onResume={handleResume}
              onClose={() => setSelectedCp(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
