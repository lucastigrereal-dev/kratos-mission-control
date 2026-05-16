import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { OmnisStatusSchema, type OmnisStatus, type OmnisCrew, type OmnisJob } from "../../api-contract/omnis.schema";
import { getOmnisStatus, getOmnisServiceHealth, getOmnisCrewStatus, getOmnisRecentJobs } from "../../backend/omnis/store";

type Envelope<T> = { data: T | null; error: string | null };

export const fetchOmnisStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<OmnisStatus>> => {
    try {
      const raw = getOmnisStatus();
      const parsed = OmnisStatusSchema.safeParse(raw);
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
