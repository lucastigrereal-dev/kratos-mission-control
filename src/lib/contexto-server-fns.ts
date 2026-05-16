import { createServerFn } from "@tanstack/react-start";
import { ContextSnapshotSchema, type ContextSnapshot } from "../../api-contract/contexto.schema";
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
