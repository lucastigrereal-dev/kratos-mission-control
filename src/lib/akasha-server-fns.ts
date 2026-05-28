import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import {
  AkashaSearchResponseSchema,
  AkashaCollectionsResponseSchema,
  type AkashaSearchResponse,
  type AkashaCollectionsResponse,
} from "../../api-contract/akasha.schema";

const KRATOS_PYTHON_URL = "http://localhost:5100";

export type AkashaStatusData = {
  vault_status: "healthy" | "degraded" | "offline";
  postgres: boolean;
  bridge_status: string;
  source_badge: "confirmed" | "partial" | "offline";
  timestamp: string | null;
  container_name: string | null;
};

type Envelope<T> = { data: T | null; error: string | null };

export const fetchAkashaStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<AkashaStatusData>> => {
    try {
      const [statusRes, healthRes] = await Promise.allSettled([
        fetch(`${KRATOS_PYTHON_URL}/akasha/status`, { signal: AbortSignal.timeout(4000) }),
        fetch(`${KRATOS_PYTHON_URL}/akasha/health`, { signal: AbortSignal.timeout(4000) }),
      ]);

      const rawStatus =
        statusRes.status === "fulfilled" && statusRes.value.ok
          ? ((await statusRes.value.json()) as { data?: Record<string, unknown> }).data ?? null
          : null;

      const rawHealth =
        healthRes.status === "fulfilled" && healthRes.value.ok
          ? ((await healthRes.value.json()) as Record<string, unknown>)
          : null;

      const status = (rawStatus?.status as string | undefined) ?? (rawHealth?.akasha_status as string | undefined) ?? "unknown";
      const vaultStatus: AkashaStatusData["vault_status"] =
        status === "healthy" ? "healthy" : status === "degraded" ? "degraded" : "offline";

      return {
        data: {
          vault_status: vaultStatus,
          postgres: (rawStatus?.postgres_responding as boolean | undefined) ?? (rawHealth?.postgres as boolean | undefined) ?? false,
          bridge_status: (rawHealth?.bridge_status as string | undefined) ?? "unknown",
          source_badge: ((rawStatus?.source_badge ?? rawHealth?.source_badge) as AkashaStatusData["source_badge"] | undefined) ?? "offline",
          timestamp: (rawHealth?.timestamp as string | undefined) ?? null,
          container_name: (rawStatus?.container as Record<string, unknown> | undefined)?.name as string | null ?? null,
        },
        error: null,
      };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao conectar Akasha" };
    }
  },
);

// ── Search ──────────────────────────────────────────────────────────────────

export const searchAkasha = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    query: z.string().min(1).max(500),
    limit: z.number().int().min(1).max(20).default(5),
    collection: z.string().optional(),
  }))
  .handler(async ({ data }): Promise<Envelope<AkashaSearchResponse>> => {
    try {
      const res = await fetch(`${KRATOS_PYTHON_URL}/akasha/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: data.query, limit: data.limit, collection: data.collection }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Akasha search ${res.status}`);
      const raw: unknown = await res.json();
      const parsed = AkashaSearchResponseSchema.safeParse(raw);
      if (!parsed.success) {
        // Fallback: tolerate alternate shape { data: { results: [] } }
        const wrapped = (raw as { data?: unknown })?.data;
        const parsed2 = AkashaSearchResponseSchema.safeParse(wrapped);
        if (!parsed2.success) throw new Error("Formato de resposta Akasha inesperado");
        return { data: parsed2.data, error: null };
      }
      return { data: parsed.data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha na busca Akasha" };
    }
  });

// ── Collections ──────────────────────────────────────────────────────────────

export const fetchAkashaCollections = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<AkashaCollectionsResponse>> => {
    try {
      const res = await fetch(`${KRATOS_PYTHON_URL}/akasha/collections`, {
        signal: AbortSignal.timeout(5_000),
      });
      if (!res.ok) throw new Error(`Akasha collections ${res.status}`);
      const raw: unknown = await res.json();
      const parsed = AkashaCollectionsResponseSchema.safeParse(raw);
      if (!parsed.success) {
        const wrapped = (raw as { data?: unknown })?.data;
        const parsed2 = AkashaCollectionsResponseSchema.safeParse(wrapped);
        if (!parsed2.success) throw new Error("Formato de coleções inesperado");
        return { data: parsed2.data, error: null };
      }
      return { data: parsed.data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao listar coleções" };
    }
  },
);
