interface Checkpoint {
  id: string;
  project_id: string;
  name: string;
  description: string;
  tags: string[];
  snapshot: Record<string, unknown>;
  created_at: string;
}

interface CheckpointTimelineProps {
  checkpoints: Checkpoint[];
  selectedId?: string;
  onSelect: (cp: Checkpoint) => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
      + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function CheckpointTimeline({ checkpoints, selectedId, onSelect }: CheckpointTimelineProps) {
  if (checkpoints.length === 0) return null;

  return (
    <div style={{
      position: "relative",
      paddingLeft: 24,
      borderLeft: "2px solid var(--kr-glass-border)",
      marginLeft: 8,
    }}>
      {checkpoints.map((cp, i) => {
        const isSelected = cp.id === selectedId;
        const isLatest = i === 0;
        return (
          <div
            key={cp.id}
            onClick={() => onSelect(cp)}
            className="kr-interactive"
            style={{
              position: "relative",
              marginBottom: i < checkpoints.length - 1 ? "var(--kr-space-hud)" : 0,
              padding: "var(--kr-space-hud) var(--kr-space-section)",
              borderRadius: "var(--kr-radius-md)",
              background: isSelected
                ? "var(--kr-purple-900)"
                : "var(--kr-glass-bg)",
              border: isSelected
                ? "1px solid var(--kr-purple-500)"
                : "1px solid var(--kr-glass-border)",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: "absolute",
              left: -30,
              top: 12,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: isLatest ? "var(--kr-purple-500)" : "var(--kr-text-muted)",
              boxShadow: isLatest ? "0 0 8px var(--kr-purple-500)" : "none",
              border: "2px solid var(--kr-world-bg)",
            }} />

            {/* Content */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "var(--kr-text-sm)" }}>
                  {cp.name}
                </div>
                {cp.description && (
                  <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 2 }}>
                    {cp.description}
                  </div>
                )}
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", flexShrink: 0 }}>
                {formatDate(cp.created_at)}
              </div>
            </div>

            {/* Tags */}
            {cp.tags && cp.tags.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                {cp.tags.map((tag, ti) => (
                  <span key={ti} className="kr-chip kr-chip-info" style={{ fontSize: "var(--kr-text-xs)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Project badge */}
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 4 }}>
              {cp.project_id}
            </div>
          </div>
        );
      })}
    </div>
  );
}
