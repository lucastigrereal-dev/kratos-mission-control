import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMissionLens,
  type MissionLensData,
} from "@/hooks/useMissionLens";
import {
  useDriftDetection,
  type DriftStatus,
} from "@/hooks/useDriftDetection";
import {
  useDashboard,
  useDashboardSnapshot,
  type DashboardLoaderData,
} from "@/hooks/useDashboard";
import { useSystemPulse, type SystemPulseData } from "@/hooks/useSystemPulse";
import {
  useCheckpoints,
  useCreateCheckpoint,
  usePausedCheckpoints,
  useResumeCheckpoint,
  type PausedCheckpoint,
} from "@/hooks/useCheckpoints";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import type { LiveState } from "@/components/kratos/base/LiveStatusIndicator";
import type { DataSource } from "../../../api-contract/source-badge.schema";
import type { SourceBadgeMeta } from "../../../api-contract/source-badge.schema";

/* --------------------------------------------------*\
 * KratosContext — Single source of truth for all
 * live data hooks. Prevents duplicate API calls
 * across the 3D world component tree.
\* --------------------------------------------------*/

interface KratosContextValue {
  /** MissionLens data */
  lens: MissionLensData | null;
  lensLoading: boolean;
  lensSourceType: DataSource;
  lensLastUpdatedAt: string | null;
  lensRefetch: () => void;
  dashboardRefetch: () => void;

  /** Drift detection */
  driftStatus: DriftStatus;

  /** Dashboard aggregate stats */
  dashboard: Omit<DashboardLoaderData, "contexto"> & {
    contexto: {
      focusStatus: string;
      drift: string;
      project: string;
    } | null;
    isLoading: boolean;
  };

  /** Dashboard snapshot (meta badges) */
  dashboardSnapshot: {
    data: import("../../../api-contract/dashboard.schema").DashboardSnapshotData | null;
    meta: SourceBadgeMeta | null;
    isLoading: boolean;
    isError: boolean;
    error: { code: string; message: string; detail?: string } | null;
  };

  /** System pulse (health, CPU, RAM, alerts) */
  systemPulse: SystemPulseData | null;
  systemHealth: string;
  systemSourceType: DataSource;

  /** Checkpoints */
  checkpoints: ReturnType<typeof useCheckpoints>;
  pausedCheckpoints: PausedCheckpoint[] | undefined;
  checkpointsLoading: boolean;
  resumeCheckpoint: ReturnType<typeof useResumeCheckpoint>;
  createCheckpoint: ReturnType<typeof useCreateCheckpoint>;

  /** Live status (connection state, SSE, services) */
  liveStatus: {
    liveState: LiveState;
    isSSEConnected: boolean;
    sourceType: DataSource;
  };

  /** Derived: checkpoint progress for mission */
  checkpointProgress: number;
  activeCheckpointCount: number;
}

const KratosCtx = createContext<KratosContextValue | null>(null);

/* --------------------------------------------------*\
 * Provider component
\* --------------------------------------------------*/

interface KratosContextProviderProps {
  children: ReactNode;
  /** Optional SSR preloaded dashboard data */
  ssrDashboard?: DashboardLoaderData;
}

export function KratosContextProvider({
  children,
  ssrDashboard,
}: KratosContextProviderProps) {
  // ── Hooks ────────────────────────
  const qc = useQueryClient();
  const {
    lens,
    isLoading: lensLoading,
    sourceType: lensSourceType,
    lastUpdatedAt: lensLastUpdatedAt,
    refetch: lensRefetch,
  } = useMissionLens();
  const dashboardRefetch = useCallback(
    () => qc.invalidateQueries({ queryKey: ["dashboard"] }),
    [qc],
  );

  const driftStatus = useDriftDetection();

  const d = useDashboard();
  const snap = useDashboardSnapshot();

  const { pulse: systemPulse, health: systemHealth, sourceType: systemSourceType } =
    useSystemPulse();

  const checkpoints = useCheckpoints();
  const createCheckpoint = useCreateCheckpoint();
  const { data: pausedCheckpoints, isLoading: checkpointsLoading } =
    usePausedCheckpoints();
  const resumeCheckpoint = useResumeCheckpoint();

  // Derive checkpoint count for liveStatus
  const checkpointCount = checkpoints.data?.length ?? 0;
  const liveStatus = useLiveStatus(checkpointCount);

  // ── Derived values ──────────────
  const checkpointProgress = useMemo(() => {
    const list = checkpoints.data;
    if (!list || list.length === 0) return 0;
    const completed = list.filter((c) => c.status === "completed").length;
    return Math.round((completed / list.length) * 100);
  }, [checkpoints.data]);

  const activeCheckpointCount = useMemo(() => {
    const list = checkpoints.data;
    if (!list) return 0;
    return list.filter(
      (c) => c.status === "pending" || c.status === "in_progress",
    ).length;
  }, [checkpoints.data]);

  // ── Context value ───────────────
  const ctxValue = useMemo<KratosContextValue>(
    () => ({
      lens,
      lensLoading,
      lensSourceType,
      lensLastUpdatedAt,
      lensRefetch,
      dashboardRefetch,
      driftStatus,
      dashboard: d,
      dashboardSnapshot: snap,
      systemPulse,
      systemHealth,
      systemSourceType,
      checkpoints,
      pausedCheckpoints,
      checkpointsLoading,
      resumeCheckpoint,
      createCheckpoint,
      liveStatus,
      checkpointProgress,
      activeCheckpointCount,
    }),
    [
      lens,
      lensLoading,
      lensSourceType,
      lensLastUpdatedAt,
      lensRefetch,
      dashboardRefetch,
      driftStatus,
      d,
      snap,
      systemPulse,
      systemHealth,
      systemSourceType,
      checkpoints,
      pausedCheckpoints,
      checkpointsLoading,
      resumeCheckpoint,
      createCheckpoint,
      liveStatus,
      checkpointProgress,
      activeCheckpointCount,
    ],
  );

  return <KratosCtx.Provider value={ctxValue}>{children}</KratosCtx.Provider>;
}

/* --------------------------------------------------*\
 * Consumer hook
\* --------------------------------------------------*/

export function useKratosContext(): KratosContextValue {
  const ctx = useContext(KratosCtx);
  if (!ctx) {
    throw new Error(
      "useKratosContext must be used within <KratosContextProvider>",
    );
  }
  return ctx;
}
