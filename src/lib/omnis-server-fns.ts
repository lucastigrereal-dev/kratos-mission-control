import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { OmnisStatusSchema, type OmnisStatus, type OmnisCrew, type OmnisJob } from "../../api-contract/omnis.schema";
import { getOmnisStatus, getOmnisServiceHealth, getOmnisCrewStatus, getOmnisRecentJobs } from "../../backend/omnis/store";

type Envelope<T> = { data: T | null; error: string | null };

const OMNIS_PYTHON_URL = "http://localhost:5100";

async function fetchOmnisPythonStatus(): Promise<{ test_count?: number; atualizadoEm?: string }> {
  const res = await fetch(`${OMNIS_PYTHON_URL}/omnis/status`);
  if (!res.ok) throw new Error(`OMNIS Python backend ${res.status}`);
  const json = await res.json() as { data?: { test_count?: number; state_updated_at?: string } };
  return {
    test_count: typeof json?.data?.test_count === "number" ? json.data.test_count : undefined,
    atualizadoEm: json?.data?.state_updated_at ?? undefined,
  };
}

export const fetchOmnisStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<OmnisStatus>> => {
    try {
      const mock = getOmnisStatus();
      let live: { test_count?: number; atualizadoEm?: string } = {};
      try {
        live = await fetchOmnisPythonStatus();
      } catch {
        // Python backend unavailable — mock fallback serves data
      }
      const merged = {
        ...mock,
        ...(live.test_count != null ? { test_count: live.test_count } : {}),
        ...(live.atualizadoEm ? { atualizadoEm: live.atualizadoEm } : {}),
      };
      const parsed = OmnisStatusSchema.safeParse(merged);
      if (!parsed.success) {
        return { data: null, error: parsed.error.message };
      }
      return { data: parsed.data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar status do OMNIS" };
    }
  },
);

export const fetchOmnisHealth = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<{ healthy: number; degraded: number; down: number }>> => {
    try {
      return { data: getOmnisServiceHealth(), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar saúde do OMNIS" };
    }
  },
);

export const fetchOmnisCrews = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<OmnisCrew[]>> => {
    try {
      return { data: getOmnisCrewStatus(), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar crews do OMNIS" };
    }
  },
);

export const fetchOmnisJobs = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      limit: z.number().int().min(1).max(20).optional().default(5),
    }),
  )
  .handler(
    async ({ data }: { data: { limit?: number } }): Promise<Envelope<OmnisJob[]>> => {
      try {
        return { data: getOmnisRecentJobs(data.limit ?? 5), error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar jobs do OMNIS" };
      }
    },
  );
