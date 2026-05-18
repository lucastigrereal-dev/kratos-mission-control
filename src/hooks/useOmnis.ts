import { useQuery } from "@tanstack/react-query";
import { fetchOmnisStatus, fetchOmnisHealth, fetchOmnisCrews, fetchOmnisJobs } from "@/lib/omnis-server-fns";
import { checkOmnisConfig } from "@/lib/omnis-provider";
import type { OmnisStatus, OmnisCrew, OmnisJob } from "../../api-contract/omnis.schema";

export function useOmnisStatus() {
  return useQuery<OmnisStatus | null, Error>({
    queryKey: ["omnis", "status"],
    queryFn: async () => {
      const result = await fetchOmnisStatus();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
  });
}

export function useOmnisHealth() {
  return useQuery<{ healthy: number; degraded: number; down: number } | null, Error>({
    queryKey: ["omnis", "health"],
    queryFn: async () => {
      const result = await fetchOmnisHealth();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
  });
}

export function useOmnisCrews() {
  return useQuery<OmnisCrew[] | null, Error>({
    queryKey: ["omnis", "crews"],
    queryFn: async () => {
      const result = await fetchOmnisCrews();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
  });
}

export function useOmnisJobs(limit = 5) {
  return useQuery<OmnisJob[] | null, Error>({
    queryKey: ["omnis", "jobs", limit],
    queryFn: async () => {
      const result = await fetchOmnisJobs({ data: { limit } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
  });
}

// ── OMNIS config detection + read-only boundary (Sprint A) ──
// KRATOS reads OMNIS status, NEVER executes jobs or sends commands.

export function useOmnisConfig() {
  return useQuery({
    queryKey: ["omnis", "config"],
    queryFn: () => checkOmnisConfig(),
    staleTime: 120_000,
  });
}

export function useOmnisReadOnlyGuard() {
  return {
    readOnly: true as const,
    boundary: "KRATOS observes OMNIS — never executes jobs, never sends commands.",
    source: "Sprint A omnis-provider.ts",
  };
}
