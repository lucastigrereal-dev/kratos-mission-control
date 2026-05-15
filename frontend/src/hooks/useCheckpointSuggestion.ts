import { useState, useCallback } from "react";

const API_BASE = "http://127.0.0.1:5100";

interface CheckpointSuggestionPayload {
  project?: string;
  where_i_stopped?: string;
  next_action?: string;
  mission_guess?: string;
  confidence?: number;
}

interface UseCheckpointSuggestionResult {
  createCheckpoint: (suggestion: CheckpointSuggestionPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearSuccess: () => void;
}

export default function useCheckpointSuggestion(): UseCheckpointSuggestionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const clearSuccess = useCallback(() => setSuccess(false), []);

  const createCheckpoint = useCallback(
    async (suggestion: CheckpointSuggestionPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const res = await fetch(`${API_BASE}/context/checkpoint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: suggestion.project || "",
            mission_guess: suggestion.mission_guess || "",
            where_i_stopped: suggestion.where_i_stopped || "",
            next_action: suggestion.next_action || "",
            confidence: suggestion.confidence ?? 0,
            context_payload: {},
            tags: ["microfase-1.0b"],
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        setSuccess(true);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao criar checkpoint");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createCheckpoint, loading, error, success, clearSuccess };
}
