import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServices } from "./useServices";
import { useOmnisStatus } from "./useOmnis";
import type { LiveState } from "@/components/kratos/base/LiveStatusIndicator";
import type { SystemPulse } from "@/components/kratos/agora/SystemPulseStrip";
import type { Severity } from "@/components/kratos/base/StatusDot";
import type { DataSource } from "../../api-contract/source-badge.schema";
import { fetchLiveEventsStatus } from "../lib/live-events-server-fns";
import {
  trackSSEConnect,
  trackSSEDisconnect,
  trackSSEReconnect,
} from "../lib/analytics/kratosAnalytics";

// ── SSE polling backoff constants ────────────────────────────────────────────
const SSE_POLL_NORMAL_MS   = 10_000;  // healthy: poll every 10s
const SSE_POLL_BACKOFF_MS  = [15_000, 30_000, 60_000, 120_000] as const; // per-tier backoff
const SSE_MAX_FAIL_ACTIVE  = 4;       // failures before entering maintenance mode
const SSE_POLL_DEAD_MS     = 120_000; // maintenance mode: poll every 2 min
const SSE_WATCHDOG_MS      = 35_000;  // watchdog: force refetch if silent this long when connected

function serviceHealthToSeverity(status: string): Severity {
  if (status === "healthy" || status === "up" || status === "ok" || status === "live") return "ok";
  if (status === "degraded") return "warn";
  if (status === "down" || status === "failed" || status === "offline") return "critical";
  return "muted";
}

function deriveLiveState(krOk: number, krWarn: number, krCrit: number, omOk: number, omWarn: number, omCrit: number): LiveState {
  const totalWarn = krWarn + omWarn;
  const totalCrit = krCrit + omCrit;
  if (totalCrit > 0) return "degraded";
  if (totalWarn > 0) return "degraded";
  if (krOk > 0 || omOk > 0) return "live";
  return "offline";
}

/**
 * SSE connection monitor with:
 *  • Exponential backoff (10s → 15 → 30 → 60 → 120s maintenance)
 *  • Dead-state cap after SSE_MAX_FAIL_ACTIVE consecutive failures
 *  • Heartbeat watchdog: force-refetch if connected but silent > SSE_WATCHDOG_MS
 */
function useSSEConnection(): { isConnected: boolean; isDeadState: boolean } {
  const qc = useQueryClient();

  // ── Backoff state ──────────────────────────────────────────────────────────
  const [failCount, setFailCount] = useState(0);
  const isDead = failCount > SSE_MAX_FAIL_ACTIVE;

  const refetchInterval = isDead
    ? SSE_POLL_DEAD_MS
    : failCount === 0
      ? SSE_POLL_NORMAL_MS
      : (SSE_POLL_BACKOFF_MS[Math.min(failCount - 1, SSE_POLL_BACKOFF_MS.length - 1)] ?? SSE_POLL_DEAD_MS);

  const query = useQuery({
    queryKey: ["omnis", "events-status"],
    queryFn: () => fetchLiveEventsStatus(),
    staleTime: 5_000,
    refetchInterval,
    retry: false,
  });

  // ── Telemetria SSE: rastreia transições connected↔disconnected ────────────
  const prevConnectedRef = useRef<boolean | undefined>(undefined);

  const connected = Boolean(query.data?.data?.connected && !query.data?.error);
  const hasData = query.data !== undefined;

  useEffect(() => {
    if (!hasData) return;

    const prev = prevConnectedRef.current;

    if (prev === undefined && connected) {
      // 1ª conexão bem-sucedida da sessão
      setFailCount(0);
      trackSSEConnect();
    } else if (prev === true && !connected) {
      // Transição connected → disconnected — increment backoff
      setFailCount((n) => n + 1);
      trackSSEDisconnect("poll_failure", failCount + 1);
    } else if (prev === false && connected) {
      // Recuperou conexão — reset backoff
      trackSSEReconnect(failCount);
      setFailCount(0);
    } else if (prev === undefined && !connected) {
      // 1ª tentativa falhou — start backoff
      setFailCount((n) => n + 1);
    }

    prevConnectedRef.current = connected;
  }, [connected, hasData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Heartbeat watchdog ─────────────────────────────────────────────────────
  // If connected but no data refresh in SSE_WATCHDOG_MS, force a refetch.
  const forceRefetch = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["omnis", "events-status"] });
  }, [qc]);

  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!connected) {
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      return;
    }

    // Record heartbeat on every successful connected fetch
    lastUpdateRef.current = Date.now();

    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      const silent = Date.now() - lastUpdateRef.current;
      if (silent >= SSE_WATCHDOG_MS) {
        forceRefetch();
      }
    }, SSE_WATCHDOG_MS);

    return () => {
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, [connected, query.dataUpdatedAt, forceRefetch]);

  // ── Cascade invalidations when connected ──────────────────────────────────
  useEffect(() => {
    if (!connected) return;
    qc.invalidateQueries({ queryKey: ["services"] });
    qc.invalidateQueries({ queryKey: ["system", "pulse"] });
    qc.invalidateQueries({ queryKey: ["missions-active"] });
  }, [qc, query.dataUpdatedAt, connected]);

  return { isConnected: connected, isDeadState: isDead };
}

interface LiveStatus {
  liveState: LiveState;
  systems: SystemPulse[];
  lastUpdate: string;
  isLoading: boolean;
  isSSEConnected: boolean;
  isSSEDeadState: boolean;
  sourceType: DataSource;
}

export function useLiveStatus(checkpointCount: number): LiveStatus {
  const { services, isLoading: krLoading, isError: krError } = useServices();
  const { data: omnis, isLoading: omLoading, isError: omError } = useOmnisStatus();
  const { isConnected, isDeadState } = useSSEConnection();

  const isError = krError || omError;
  const isLoading = krLoading || omLoading;

  const sourceType: DataSource = isError
    ? "error"
    : isConnected && !isLoading
      ? "live"
      : isDeadState
        ? "stale"
        : "cache";

  return useMemo(() => {
    const systems: SystemPulse[] = [];

    // KRATOS services
    let krOk = 0, krWarn = 0, krCrit = 0;
    for (const s of services) {
      const sev = serviceHealthToSeverity(s.health);
      if (sev === "ok") krOk++;
      else if (sev === "warn") krWarn++;
      else if (sev === "critical") krCrit++;
      systems.push({
        name: s.nome.toUpperCase(),
        severity: sev,
        hint: s.url,
      });
    }

    // OMNIS services
    let omOk = 0, omWarn = 0, omCrit = 0;
    if (omnis) {
      for (const svc of omnis.servicos) {
        const sev = serviceHealthToSeverity(svc.status);
        if (sev === "ok") omOk++;
        else if (sev === "warn") omWarn++;
        else if (sev === "critical") omCrit++;
        systems.push({
          name: svc.nome.toUpperCase().replace(/-/g, " "),
          severity: sev,
          hint: svc.porta ? `:${svc.porta}` : undefined,
        });
      }
    }

    // Checkpoints
    systems.push({
      name: "CHECKPOINTS",
      severity: checkpointCount > 0 ? "ok" : "muted",
      hint: checkpointCount > 0 ? `${checkpointCount} ativos` : "vazio",
    });

    const liveState = deriveLiveState(krOk, krWarn, krCrit, omOk, omWarn, omCrit);
    const lastUpdate = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    return {
      liveState,
      systems,
      lastUpdate,
      isLoading,
      isSSEConnected: isConnected,
      isSSEDeadState: isDeadState,
      sourceType,
    };
  }, [services, omnis, checkpointCount, isLoading, isConnected, isDeadState, sourceType]);
}
