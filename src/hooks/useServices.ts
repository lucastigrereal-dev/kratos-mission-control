import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getServicesHealth } from "@/lib/service-server-fns";
import { getWorkerHealth } from "@/lib/health-server-fns";
import type { Service } from "../../api-contract/service.schema";

export function useServices() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => getServicesHealth(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return {
    services: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["services"] }),
  };
}

// ── Worker-level health (Sprint A getWorkerHealth) ──

export interface WorkerHealthData {
  status: "ok" | "degraded" | "error";
  service: string;
  version: string;
  checks: { services: { total: number; healthy: number; degraded: number } };
  updated_at: string;
}

export function useWorkerHealth() {
  const qc = useQueryClient();

  const query = useQuery<{ data: WorkerHealthData | null; error: { code: string; message: string } | null }>({
    queryKey: ["worker", "health"],
    queryFn: () => getWorkerHealth(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return {
    health: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError || query.data?.error !== null,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["worker", "health"] }),
  };
}
