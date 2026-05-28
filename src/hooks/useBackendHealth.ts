/**
 * useBackendHealth — W0-B3
 * Watchdog que faz poll direto em http://localhost:5100/health a cada 30s.
 * Marca "offline" após 2 falhas consecutivas de rede.
 * Expõe retry() para force-check manual.
 *
 * Tecnologia: TanStack Query (padrão do projeto) + useState para falhas consecutivas.
 * Sem Zustand — propagação via TanStack Query cache compartilhado.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// ── Constantes ────────────────────────────────────────────────────────────────

const BACKEND_HEALTH_URL = "http://localhost:5100/health";
const POLL_INTERVAL_MS   = 30_000;  // poll a cada 30s
const OFFLINE_THRESHOLD  = 2;       // falhas consecutivas de rede → "offline"
const FETCH_TIMEOUT_MS   = 5_000;   // timeout por tentativa

// ── Tipos públicos ────────────────────────────────────────────────────────────

export type BackendStatus = "live" | "degraded" | "offline" | "unknown";

export interface BackendHealthState {
  /** Estado derivado do backend Python. */
  status: BackendStatus;
  /** Última vez que o backend respondeu com sucesso. */
  lastSeen: Date | null;
  /** Força uma re-verificação imediata. */
  retry: () => void;
}

// ── Fetch interno ─────────────────────────────────────────────────────────────

interface PingOk   { reachable: true;  degraded: boolean }
interface PingFail { reachable: false }
type PingResult = PingOk | PingFail;

async function pingBackend(): Promise<PingResult> {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(BACKEND_HEALTH_URL, { signal: ctrl.signal });

    if (!res.ok) {
      // HTTP error mas servidor respondeu → backend up, serviços degradados
      return { reachable: true, degraded: true };
    }

    const json = await res.json() as Record<string, unknown>;
    const apiStatus = String(
      (json["collector_status"] as string | undefined) ??
      ((json["data"] as Record<string, unknown> | undefined)?.["status"]) ??
      "unknown",
    );

    return { reachable: true, degraded: apiStatus !== "ok" };
  } catch {
    // Erro de rede ou abort (timeout) → backend não alcançável
    return { reachable: false };
  } finally {
    clearTimeout(timer);
  }
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function useBackendHealth(): BackendHealthState {
  const qc = useQueryClient();

  const [consecutiveFails, setConsecutiveFails] = useState(0);
  const [lastSeen, setLastSeen]                 = useState<Date | null>(null);

  // Ref para evitar double-trigger do efeito quando dataUpdatedAt não muda
  const prevTickRef = useRef<number>(0);

  const query = useQuery({
    queryKey:          ["backend", "health"],
    queryFn:           pingBackend,
    refetchInterval:   POLL_INTERVAL_MS,
    retry:             false,
    staleTime:         25_000,
    refetchOnWindowFocus: false,
  });

  // ── Rastrear falhas consecutivas e lastSeen ───────────────────────────────
  useEffect(() => {
    const tick = query.dataUpdatedAt || query.errorUpdatedAt;
    if (tick === 0 || tick === prevTickRef.current) return;
    prevTickRef.current = tick;

    if (query.isSuccess && query.data) {
      if (query.data.reachable) {
        setConsecutiveFails(0);
        setLastSeen(new Date());
      } else {
        // Fetch bem-sucedido mas backend não alcançável (catch retornou { reachable: false })
        // Não deve acontecer aqui — isSuccess + !reachable só se queryFn resolver sem throw
        setConsecutiveFails((n) => n + 1);
      }
    } else if (query.isError) {
      setConsecutiveFails((n) => n + 1);
    }
  }, [
    query.dataUpdatedAt,
    query.errorUpdatedAt,
    query.isSuccess,
    query.isError,
    query.data,
  ]);

  // ── Retry manual ──────────────────────────────────────────────────────────
  const retry = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["backend", "health"] });
  }, [qc]);

  // ── Derivar status ────────────────────────────────────────────────────────
  let status: BackendStatus = "unknown";

  if (query.isPending && consecutiveFails === 0) {
    // Primeira verificação ainda não retornou
    status = "unknown";
  } else if (query.isSuccess && query.data?.reachable) {
    status = query.data.degraded ? "degraded" : "live";
  } else if (consecutiveFails >= OFFLINE_THRESHOLD) {
    status = "offline";
  } else if (consecutiveFails > 0 || query.isError) {
    // 1ª falha — ainda não confirmado offline
    status = "degraded";
  }

  return { status, lastSeen, retry };
}
