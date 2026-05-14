import { useEffect, useState } from "react";

interface SuggestedCheckpoint {
  project?: string;
  where_i_stopped?: string;
  next_action?: string;
  mission_guess?: string;
  confidence?: number;
}

interface CheckpointSuggestion {
  should_suggest?: boolean;
  severity?: string;
  reason?: string;
  suggested_checkpoint?: SuggestedCheckpoint | null;
}

interface CheckpointSuggestionBannerProps {
  suggestion: CheckpointSuggestion;
  loading: boolean;
  error: string | null;
  success: boolean;
  onCreate: () => void;
  onDismissSuccess: () => void;
}

export default function CheckpointSuggestionBanner({
  suggestion,
  loading,
  error,
  success,
  onCreate,
  onDismissSuccess,
}: CheckpointSuggestionBannerProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onDismissSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onDismissSuccess]);

  if (!suggestion.should_suggest && !showSuccess) return null;

  if (showSuccess) {
    return (
      <div
        className="kr-card"
        style={{
          borderColor: "var(--kr-green-500)",
          background: "color-mix(in srgb, var(--kr-green-500) 6%, var(--kr-bg-card))",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          className="kr-dot kr-dot-healthy"
          style={{ width: 8, height: 8 }}
        />
        <span style={{ fontSize: "var(--kr-text-sm)", fontWeight: 600, color: "var(--kr-green-400)" }}>
          Checkpoint salvo com sucesso
        </span>
      </div>
    );
  }

  const suggested = suggestion.suggested_checkpoint;

  return (
    <div
      className="kr-checkpoint-banner"
      style={{
        background: "color-mix(in srgb, var(--kr-aurora-500) 8%, var(--kr-bg-card))",
        border: "1px solid",
        borderColor: error
          ? "var(--kr-red-500)"
          : "color-mix(in srgb, var(--kr-aurora-500) 30%, transparent)",
        borderRadius: "var(--kr-radius-lg)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderLeft: "3px solid var(--kr-aurora-500)",
        transition: "border-color var(--kr-duration-fast) var(--kr-ease-smooth)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          className="kr-dot"
          style={{
            background: "var(--kr-aurora-400)",
            boxShadow: "0 0 6px var(--kr-aurora-400)",
            width: 7,
            height: 7,
          }}
        />
        <span
          style={{
            fontSize: "var(--kr-text-sm)",
            fontWeight: 700,
            color: "var(--kr-aurora-300)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Sugestão Aurora
        </span>
        {suggestion.severity && (
          <span
            className="kr-chip"
            style={{
              color: suggestion.severity === "high" ? "var(--kr-red-400)" : "var(--kr-yellow-400)",
              background:
                suggestion.severity === "high"
                  ? "rgba(239, 68, 68, 0.12)"
                  : "rgba(234, 179, 8, 0.12)",
              fontSize: "var(--kr-text-xs)",
            }}
          >
            {suggestion.severity === "high" ? "Urgente" : "Recomendado"}
          </span>
        )}
      </div>

      <p style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)", lineHeight: 1.5, margin: 0 }}>
        {suggestion.reason}
      </p>

      {suggested && (
        <div
          style={{
            fontSize: "var(--kr-text-xs)",
            color: "var(--kr-text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            padding: "8px 10px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "var(--kr-radius-sm)",
          }}
        >
          {suggested.where_i_stopped && (
            <div>
              <span style={{ fontWeight: 600 }}>Onde parei:</span>{" "}
              {suggested.where_i_stopped}
            </div>
          )}
          {suggested.next_action && (
            <div>
              <span style={{ fontWeight: 600 }}>Próximo passo:</span>{" "}
              {suggested.next_action}
            </div>
          )}
          {suggested.project && (
            <div>
              <span style={{ fontWeight: 600 }}>Projeto:</span>{" "}
              {suggested.project}
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-red-400)" }}>
          Erro: {error}
        </div>
      )}

      <button
        onClick={onCreate}
        disabled={loading}
        className="kr-checkpoint-btn"
        style={{
          alignSelf: "flex-start",
          padding: "6px 16px",
          border: "none",
          borderRadius: "var(--kr-radius-md)",
          background: loading
            ? "var(--kr-bg-tertiary)"
            : "linear-gradient(135deg, var(--kr-aurora-500) 0%, var(--kr-aurora-600) 100%)",
          color: loading ? "var(--kr-text-muted)" : "#fff",
          fontSize: "var(--kr-text-sm)",
          fontWeight: 600,
          fontFamily: "var(--kr-font-sans)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "opacity var(--kr-duration-fast) var(--kr-ease-smooth)",
        }}
      >
        {loading ? "Salvando..." : "Criar checkpoint"}
      </button>
    </div>
  );
}
