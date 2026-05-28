import { useQuery } from "@tanstack/react-query";
import { getCheckpoints } from "@/lib/checkpoint-server-fns";
import { getProjects } from "@/lib/project-server-fns";
import { getAppointments } from "@/lib/appointment-server-fns";
import { getContextSnapshot } from "@/lib/contexto-server-fns";
import { getDashboardSnapshot } from "@/lib/dashboard-server-fns";
import type { DashboardSnapshotData } from "../../api-contract/dashboard.schema";
import type { SourceBadgeMeta } from "../../api-contract/source-badge.schema";

export interface DashboardSummary {
  checkpoints: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  projects: {
    total: number;
    active: number;
    paused: number;
    completed: number;
  };
  appointments: {
    today: number;
    overdue: number;
    total: number;
  };
  contexto: {
    focusStatus: string;
    drift: string;
    project: string;
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export type DashboardLoaderData = Omit<DashboardSummary, "isLoading" | "isError" | "error">;

export function useDashboard(): DashboardSummary {
  const cp = useQuery({
    queryKey: ["checkpoints"],
    queryFn: () => getCheckpoints({}),
    staleTime: 15_000,
  });

  const pr = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects({}),
    staleTime: 15_000,
  });

  const ap = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments({}),
    staleTime: 15_000,
  });

  const cx = useQuery({
    queryKey: ["contexto", "snapshot"],
    queryFn: () => getContextSnapshot({ data: { refresh: false } }),
    staleTime: 15_000,
  });

  const cpList = cp.data?.data ?? [];
  const prList = pr.data?.data ?? [];
  const apList = ap.data?.data ?? [];
  const snapshot = cx.data?.data ?? null;

  const today = new Date().toISOString().slice(0, 10);

  return {
    checkpoints: {
      total: cpList.length,
      pending: cpList.filter((c) => c.status === "pending").length,
      inProgress: cpList.filter((c) => c.status === "in_progress").length,
      completed: cpList.filter((c) => c.status === "completed").length,
    },
    projects: {
      total: prList.length,
      active: prList.filter((p) => p.status === "active").length,
      paused: prList.filter((p) => p.status === "paused").length,
      completed: prList.filter((p) => p.status === "completed").length,
    },
    appointments: {
      today: apList.filter((a) => a.data === today).length,
      overdue: apList.filter((a) => a.data < today && a.status !== "completed").length,
      total: apList.length,
    },
    contexto: snapshot
      ? {
          focusStatus: snapshot.focusStatus,
          drift: snapshot.drift,
          project: snapshot.project,
        }
      : null,
    isLoading: cp.isLoading || pr.isLoading || ap.isLoading || cx.isLoading,
    isError: cp.isError || pr.isError || ap.isError || cx.isError,
    error: cp.error ?? pr.error ?? ap.error ?? cx.error ?? null,
  };
}

// ── Aggregated dashboard snapshot (Sprint A getDashboardSnapshot) ──

export function useDashboardSnapshot() {
  const query = useQuery<{
    data: DashboardSnapshotData | null;
    error: { code: string; message: string; detail?: string } | null;
    meta: SourceBadgeMeta;
  }>({
    queryKey: ["dashboard", "snapshot"],
    queryFn: () => getDashboardSnapshot(),
    staleTime: 15_000,
  });

  return {
    data: query.data?.data ?? null,
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError || query.data?.error !== null,
    error: query.data?.error ?? null,
  };
}
