import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServices } from "./useServices";
import { useOmnisStatus } from "./useOmnis";
import type { LiveState } from "@/components/kratos/base/LiveStatusIndicator";
import type { SystemPulse } from "@/components/kratos/agora/SystemPulseStrip";
import type { Severity } from "@/components/kratos/base/StatusDot";
import type { DataSource } from "../../api-contract/source-badge.schema";
import { fetchLiveEventsStatus } from "../lib/live-events-server-fns";

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

function useSSEConnection(): { isConnected: boolean } {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["omnis", "events-status"],
    queryFn: () => fetchLiveEventsStatus(),
    staleTime: 5_000,
    refetchInterval: 10_000,
    retry: false,
  });

  useEffect(() => {
    const connected = Boolean(query.data?.data?.connected && !query.data?.error);
    if (!connected) {
      return;
    }

    // Keep data fresh while the backend SSE health endpoint is reachable.
    qc.invalidateQueries({ queryKey: ["services"] });
    qc.invalidateQueries({ queryKey: ["system", "pulse"] });
    qc.invalidateQueries({ queryKey: ["missions-active"] });
  }, [qc, query.dataUpdatedAt, query.data?.data?.connected, query.data?.error]);

  return { isConnected: Boolean(query.data?.data?.connected && !query.data?.error) };
}

interface LiveStatus {
  liveState: LiveState;
  systems: SystemPulse[];
  lastUpdate: string;
  isLoading: boolean;
  isSSEConnected: boolean;
  sourceType: DataSource;
}

export function useLiveStatus(checkpointCount: number): LiveStatus {
  const { services, isLoading: krLoading, isError: krError } = useServices();
  const { data: omnis, isLoading: omLoading, isError: omError } = useOmnisStatus();
  const { isConnected } = useSSEConnection();

  const isError = krError || omError;
  const isLoading = krLoading || omLoading;

  const sourceType: DataSource = isError
    ? "error"
    : isConnected && !isLoading
      ? "live"
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
      sourceType,
    };
  }, [services, omnis, checkpointCount, isLoading, isConnected, sourceType]);
}
