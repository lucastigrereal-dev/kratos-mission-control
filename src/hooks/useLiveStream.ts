/**
 * useLiveStream — W11-B8
 *
 * Hook que conecta ao SSE stream do backend (/live/stream) e invalida
 * os queries TanStack Query quando novos eventos chegam.
 *
 * Quando SSE está ativo, o useSystemPulse e outros hooks de snapshot
 * recebem dados frescos sem precisar esperar o próximo poll cycle.
 *
 * A conexão SSE é global (singleton): múltiplas instâncias do hook
 * compartilham a mesma conexão via getLiveStreamClient().
 *
 * Estados retornados:
 *   "idle"        — não iniciado ainda
 *   "connecting"  — aguardando primeiro evento
 *   "live"        — recebendo eventos normalmente
 *   "reconnecting"— falhou, aguardando retry com backoff
 *   "dead"        — 10 tentativas falharam (manual reconnect disponível)
 */

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getLiveStreamClient, type SSEState } from "@/lib/realtime/sseClient";
import { createLogger } from "@/lib/observability/logger";

const log = createLogger("useLiveStream");

// ── Query keys invalidated on each live event ─────────────────────────────────

const LIVE_QUERY_KEYS = [
  ["system", "pulse"],
  ["services"],
  ["missions-active"],
] as const;

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseLiveStreamResult {
  /** Current SSE connection state */
  sseState: SSEState;
  /** Number of consecutive reconnect attempts */
  retryCount: number;
  /** Last snapshot received from the stream (raw, unparsed beyond JSON) */
  lastSnapshot: unknown;
  /** Manually trigger reconnect from dead state */
  reconnect: () => void;
}

export function useLiveStream(): UseLiveStreamResult {
  const qc = useQueryClient();
  const client = getLiveStreamClient();

  const [sseState,     setSseState]     = useState<SSEState>(client.state);
  const [retryCount,   setRetryCount]   = useState(client.retryCount);
  const [lastSnapshot, setLastSnapshot] = useState<unknown>(null);

  // Track query invalidation: avoid spamming QC if SSE floods
  const invalidationScheduled = useRef(false);

  useEffect(() => {
    // Register callbacks
    const offMessage = client.onMessage((data) => {
      setLastSnapshot(data);

      // Batch TanStack Query invalidations (one per tick max)
      if (!invalidationScheduled.current) {
        invalidationScheduled.current = true;
        queueMicrotask(() => {
          invalidationScheduled.current = false;
          for (const key of LIVE_QUERY_KEYS) {
            qc.invalidateQueries({ queryKey: key }).catch(() => {});
          }
          log.debug("query cache invalidated via SSE event");
        });
      }
    });

    const offState = client.onStateChange((state, retries) => {
      setSseState(state);
      setRetryCount(retries);
    });

    // Connect if not already connected
    if (client.state === "idle") {
      client.connect();
    }

    return () => {
      offMessage();
      offState();
      // Note: do NOT destroy() here — the client is shared (singleton).
      // It will be cleaned up when the app unmounts (AppShell).
    };
  }, [client, qc]);

  return {
    sseState,
    retryCount,
    lastSnapshot,
    reconnect: () => client.reconnect(),
  };
}
