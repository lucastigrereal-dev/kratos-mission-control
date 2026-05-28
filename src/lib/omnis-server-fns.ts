import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { OmnisStatusSchema, type OmnisStatus, type OmnisCrew, type OmnisJob } from "../../api-contract/omnis.schema";
import { getOmnisStatus, getOmnisServiceHealth, getOmnisCrewStatus, getOmnisRecentJobs } from "../../backend/omnis/store";

type Envelope<T> = { data: T | null; error: string | null };

const OMNIS_PYTHON_URL = "http://localhost:5100";

type PythonStatusData = {
  test_count?: number;
  state_updated_at?: string;
  workflows_available?: number;
  active_mission_title?: string | null;
  last_run_id?: string | null;
  last_run_status?: string | null;
};

async function fetchOmnisPythonStatus(): Promise<{
  test_count?: number;
  atualizadoEm?: string;
  workflows_registered?: number;
  active_mission_title?: string | null;
  last_run_id?: string | null;
  last_run_status?: string | null;
}> {
  const res = await fetch(`${OMNIS_PYTHON_URL}/omnis/status`);
  if (!res.ok) throw new Error(`OMNIS Python backend ${res.status}`);
  const json = await res.json() as { data?: PythonStatusData };
  const d = json?.data;
  return {
    test_count: typeof d?.test_count === "number" ? d.test_count : undefined,
    atualizadoEm: d?.state_updated_at ?? undefined,
    workflows_registered: typeof d?.workflows_available === "number" ? d.workflows_available : undefined,
    active_mission_title: d?.active_mission_title ?? undefined,
    last_run_id: d?.last_run_id ?? undefined,
    last_run_status: d?.last_run_status ?? undefined,
  };
}

export const fetchOmnisStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<OmnisStatus>> => {
    try {
      const mock = getOmnisStatus();
      let live: {
        test_count?: number;
        atualizadoEm?: string;
        workflows_registered?: number;
        active_mission_title?: string | null;
        last_run_id?: string | null;
        last_run_status?: string | null;
      } = {};
      try {
        live = await fetchOmnisPythonStatus();
      } catch {
        // Python backend unavailable — mock fallback serves data
      }
      const merged = {
        ...mock,
        ...(live.test_count != null ? { test_count: live.test_count } : {}),
        ...(live.atualizadoEm ? { atualizadoEm: live.atualizadoEm } : {}),
        ...(live.workflows_registered != null ? { workflows_registered: live.workflows_registered } : {}),
        ...(live.active_mission_title != null ? { active_mission_title: live.active_mission_title } : {}),
        ...(live.last_run_id != null ? { last_run_id: live.last_run_id } : {}),
        ...(live.last_run_status != null ? { last_run_status: live.last_run_status } : {}),
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
