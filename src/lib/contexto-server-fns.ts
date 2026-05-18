import { createServerFn } from "@tanstack/react-start";
import {
  ContextSnapshotSchema,
  ContextoSnapshotDataSchema,
  type ContextSnapshot,
  type ContextoSnapshotData,
  type ContextoMode,
} from "../../api-contract/contexto.schema";
import { type SourceBadgeMeta } from "../../api-contract/source-badge.schema";
import { createApiError, type ApiError } from "../../api-contract/error-taxonomy";
import { getLatest, refresh } from "../../backend/contexto/store";

export const getContextSnapshot = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    if (typeof input === "object" && input !== null && "refresh" in input) {
      return input as { refresh?: boolean };
    }
    return {};
  })
  .handler(async ({ data }): Promise<{ data: ContextSnapshot | null; error: string | null }> => {
    try {
      const snapshot = data.refresh ? refresh() : getLatest();
      const parsed = ContextSnapshotSchema.safeParse(snapshot);
      if (!parsed.success) {
        return { data: null, error: parsed.error.message };
      }
      return { data: parsed.data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao obter snapshot de contexto" };
    }
  });

// ── /api/contexto/snapshot — high‑level mission snapshot ──

interface ContextoSnapshotEnvelope {
  data: ContextoSnapshotData | null;
  error: ApiError | null;
  meta: SourceBadgeMeta;
}

function inferMode(project: string, focusStatus: string): ContextoMode {
  if (!project || project === "—") return "unknown";
  if (focusStatus === "off_focus") return "standby";
  if (focusStatus === "on_focus") return "execution";
  return "unknown";
}

export const getContextoSnapshot = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    if (typeof input === "object" && input !== null && "refresh" in input) {
      return input as { refresh?: boolean };
    }
    return {};
  })
  .handler(async ({ data }): Promise<ContextoSnapshotEnvelope> => {
    const now = new Date().toISOString();
    const meta: SourceBadgeMeta = {
      source: "mock",
      origin: "local",
      stale: false,
      updated_at: now,
      errors: [],
    };

    try {
      const raw = data.refresh ? refresh() : getLatest();

      const snapshotData: ContextoSnapshotData = {
        current_context: raw.project ? `${raw.project} — ${raw.mission}` : "Sem contexto ativo",
        confidence: raw.confidence,
        mode: inferMode(raw.project, raw.focusStatus),
        next_action: raw.reasons[0] ?? "Definir próxima ação",
        origin: "local",
      };

      const parsed = ContextoSnapshotDataSchema.safeParse(snapshotData);
      if (!parsed.success) {
        meta.errors.push(parsed.error.message);
        meta.stale = true;
        return {
          data: null,
          error: createApiError("validation_error", "Dados de contexto inválidos", parsed.error.message),
          meta,
        };
      }

      return { data: parsed.data, error: null, meta };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao obter snapshot de contexto";
      meta.errors.push(message);
      meta.stale = true;
      return {
        data: null,
        error: createApiError("internal_error", message),
        meta,
      };
    }
  });
