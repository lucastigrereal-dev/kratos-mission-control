import { createServerFn } from "@tanstack/react-start";

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
