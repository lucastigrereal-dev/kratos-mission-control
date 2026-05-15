import { useState } from "react";

interface Checkpoint {
  id: string;
  project_id: string;
  name: string;
  description: string;
  tags: string[];
  snapshot: Record<string, unknown>;
  created_at: string;
}

interface ResumeFromHereCardProps {
  checkpoint: Checkpoint;
  onResume: (cp: Checkpoint) => void;
  onClose: () => void;
}

export default function ResumeFromHereCard({ checkpoint, onResume, onClose }: ResumeFromHereCardProps) {
  const [resuming, setResuming] = useState(false);
  const [done, setDone] = useState(false);

  async function handleResume() {
    setResuming(true);
    try {
      await fetch("/api/continuity/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: checkpoint.project_id,
          project_name: checkpoint.project_id,
          last_action: `Retomado do checkpoint: ${checkpoint.name}`,
          next_step: checkpoint.description || "Continuar de onde parou",
          critical_files: [],
          focus_state: "execution",
        }),
      });
      onResume(checkpoint);
      setDone(true);
    } catch {
      // Silently fail — continuity is advisory
    } finally {
      setResuming(false);
    }
  }

  return (
    <div className="kr-glass-panel kr-glass-panel--strong" style={{
      padding: "var(--kr-space-section)",
      borderLeft: "3px solid var(--kr-gold-400)",
      marginTop: "var(--kr-space-section)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div className="kr-section-title">Retomar deste checkpoint</div>
          <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)", marginTop: 4 }}>
            {checkpoint.name}
          </div>
          {checkpoint.description && (
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 2 }}>
              {checkpoint.description}
            </div>
          )}
          <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginTop: 4 }}>
            Projeto: {checkpoint.project_id} · Criado: {checkpoint.created_at}
          </div>

          {checkpoint.snapshot && Object.keys(checkpoint.snapshot).length > 0 && (
            <div style={{ marginTop: 8, fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Snapshot:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {Object.entries(checkpoint.snapshot).map(([key, value]) => (
                  <span key={key} className="kr-chip kr-chip-neutral" style={{ fontSize: "var(--kr-text-xs)" }}>
                    {key}: {typeof value === "object" ? JSON.stringify(value).slice(0, 40) : String(value).slice(0, 40)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {!done ? (
            <button
              onClick={handleResume}
              disabled={resuming}
              className="kr-interactive"
              style={{
                padding: "8px 16px",
                borderRadius: "var(--kr-radius-sm)",
                border: "none",
                background: resuming ? "var(--kr-text-disabled)" : "var(--kr-gold-500)",
                color: "#000",
                fontSize: "var(--kr-text-sm)",
                fontWeight: 600,
                cursor: resuming ? "not-allowed" : "pointer",
              }}
            >
              {resuming ? "..." : "Retomar daqui"}
            </button>
          ) : (
            <div className="kr-chip kr-chip-healthy" style={{ textAlign: "center" }}>
              Contexto restaurado
            </div>
          )}
          <button
            onClick={onClose}
            className="kr-interactive"
            style={{
              padding: "4px 10px",
              borderRadius: "var(--kr-radius-sm)",
              border: "1px solid var(--kr-glass-border)",
              background: "var(--kr-glass-bg)",
              color: "var(--kr-text-secondary)",
              fontSize: "var(--kr-text-xs)",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
