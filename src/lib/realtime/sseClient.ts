/**
 * KRATOS SSE Client — W11-B8
 *
 * EventSource wrapper com backoff exponencial, watchdog de heartbeat,
 * dead-state após falhas consecutivas, e cleanup automático.
 *
 * Conecta-se a /live/stream (Python backend) e emite callbacks com
 * cada snapshot recebido.
 *
 * Backoff:  1s → 2s → 4s → 8s → 16s → 30s (cap)
 * Max retries: 10 → dead state (manual retry via .reconnect())
 * Heartbeat watchdog: reconecta se silencioso > 60s enquanto conectado
 *
 * Uso:
 *   const client = new SSEClient("/live/stream");
 *   client.onMessage((data) => { ... });
 *   client.onStateChange((state) => { ... });
 *   client.connect();
 *   // cleanup:
 *   client.destroy();
 */

import { createLogger } from "@/lib/observability/logger";

const log = createLogger("sseClient");

// ── Types ─────────────────────────────────────────────────────────────────────

export type SSEState =
  | "idle"          // not yet connected
  | "connecting"    // EventSource opened, waiting for first message
  | "live"          // receiving events normally
  | "reconnecting"  // error occurred, waiting before retry
  | "dead";         // max retries exceeded — needs manual reconnect

export interface SSEClientOptions {
  /** Base URL prefix (default: window.VITE_API_BASE_URL or localhost:5100) */
  baseUrl?: string;
  /** Max consecutive failures before entering dead state (default: 10) */
  maxRetries?: number;
  /** Heartbeat watchdog timeout in ms (default: 60000) */
  heartbeatMs?: number;
  /** Whether to use withCredentials on EventSource (default: false) */
  withCredentials?: boolean;
}

type MessageCallback = (data: unknown) => void;
type StateCallback   = (state: SSEState, retryCount: number) => void;

// ── Backoff schedule ──────────────────────────────────────────────────────────

const BACKOFF_MS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000] as const;

function getBackoffMs(attempt: number): number {
  const idx = Math.min(attempt, BACKOFF_MS.length - 1);
  return BACKOFF_MS[idx]!;
}

// ── SSEClient class ───────────────────────────────────────────────────────────

export class SSEClient {
  private readonly path: string;
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly heartbeatMs: number;
  private readonly withCredentials: boolean;

  private _state: SSEState = "idle";
  private _retryCount = 0;
  private _lastEventId: string | null = null;

  private _es: EventSource | null = null;
  private _retryTimer: ReturnType<typeof setTimeout> | null = null;
  private _watchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private _destroyed = false;

  private _messageCallbacks: Set<MessageCallback> = new Set();
  private _stateCallbacks:   Set<StateCallback>   = new Set();

  constructor(path: string, options: SSEClientOptions = {}) {
    this.path = path;
    this.baseUrl = options.baseUrl
      ?? (typeof window !== "undefined"
          ? (import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:5100")
          : "http://localhost:5100");
    this.maxRetries   = options.maxRetries   ?? 10;
    this.heartbeatMs  = options.heartbeatMs  ?? 60_000;
    this.withCredentials = options.withCredentials ?? false;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  get state():      SSEState { return this._state; }
  get retryCount(): number   { return this._retryCount; }

  onMessage(cb: MessageCallback): () => void {
    this._messageCallbacks.add(cb);
    return () => this._messageCallbacks.delete(cb);
  }

  onStateChange(cb: StateCallback): () => void {
    this._stateCallbacks.add(cb);
    return () => this._stateCallbacks.delete(cb);
  }

  connect(): void {
    if (this._destroyed) return;
    if (typeof window === "undefined") return; // SSR guard
    if (typeof EventSource === "undefined") return; // old browser guard

    this._clearTimers();
    this._open();
  }

  /** Manual reconnect from dead state. Resets retry counter. */
  reconnect(): void {
    if (this._destroyed) return;
    this._retryCount = 0;
    this._setState("connecting");
    this.connect();
    log.info("manual reconnect triggered");
  }

  destroy(): void {
    this._destroyed = true;
    this._clearTimers();
    this._closeES();
    this._messageCallbacks.clear();
    this._stateCallbacks.clear();
    log.debug("destroyed");
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private _setState(next: SSEState): void {
    if (this._state === next) return;
    this._state = next;
    log.debug("state →", { state: next, retries: this._retryCount });
    for (const cb of this._stateCallbacks) {
      try { cb(next, this._retryCount); } catch { /* ignore */ }
    }
  }

  private _open(): void {
    this._closeES();

    // Build URL — append Last-Event-ID as query param if we have one
    // (EventSource Last-Event-ID header is set automatically by the browser
    //  when reconnecting, but our backend may not support it yet — add it
    //  as query param as a safe fallback)
    let url = `${this.baseUrl}${this.path}`;
    if (this._lastEventId) {
      url += `?lastEventId=${encodeURIComponent(this._lastEventId)}`;
    }

    log.debug("opening EventSource", { url, retry: this._retryCount });

    this._setState("connecting");

    const es = new EventSource(url, { withCredentials: this.withCredentials });
    this._es = es;

    es.onopen = () => {
      log.info("connected", { url });
      this._retryCount = 0;
      this._setState("live");
      this._startWatchdog();
    };

    es.onmessage = (evt: MessageEvent) => {
      // Record last event ID for resumption
      if (evt.lastEventId) this._lastEventId = evt.lastEventId;

      // Reset watchdog on every message
      this._startWatchdog();

      // Parse and emit
      try {
        const parsed: unknown = typeof evt.data === "string"
          ? JSON.parse(evt.data)
          : evt.data;
        for (const cb of this._messageCallbacks) {
          try { cb(parsed); } catch { /* ignore */ }
        }
      } catch (parseErr) {
        log.warn("failed to parse SSE message", { raw: String(evt.data).slice(0, 100) });
      }
    };

    es.onerror = () => {
      log.warn("EventSource error", { retryCount: this._retryCount });
      this._closeES();
      this._scheduleRetry();
    };
  }

  private _closeES(): void {
    if (this._es) {
      this._es.onopen    = null;
      this._es.onmessage = null;
      this._es.onerror   = null;
      this._es.close();
      this._es = null;
    }
  }

  private _scheduleRetry(): void {
    if (this._destroyed) return;

    this._retryCount++;

    if (this._retryCount > this.maxRetries) {
      this._setState("dead");
      log.warn("SSE dead state — max retries exceeded", { maxRetries: this.maxRetries });
      return;
    }

    const delay = getBackoffMs(this._retryCount - 1);
    this._setState("reconnecting");
    log.info("scheduling reconnect", { attempt: this._retryCount, delayMs: delay });

    this._retryTimer = setTimeout(() => {
      if (!this._destroyed) this._open();
    }, delay);
  }

  private _startWatchdog(): void {
    this._clearWatchdog();
    this._watchdogTimer = setTimeout(() => {
      log.warn("heartbeat watchdog fired — no events for too long, reconnecting", {
        heartbeatMs: this.heartbeatMs,
      });
      this._closeES();
      this._scheduleRetry();
    }, this.heartbeatMs);
  }

  private _clearWatchdog(): void {
    if (this._watchdogTimer) {
      clearTimeout(this._watchdogTimer);
      this._watchdogTimer = null;
    }
  }

  private _clearTimers(): void {
    if (this._retryTimer) {
      clearTimeout(this._retryTimer);
      this._retryTimer = null;
    }
    this._clearWatchdog();
  }
}

// ── Singleton factory for /live/stream ────────────────────────────────────────

let _globalClient: SSEClient | null = null;

/**
 * Retorna o cliente SSE global para /live/stream.
 * Cria na primeira chamada; reutiliza nas seguintes.
 * Chame destroy() apenas no unmount global (root component).
 */
export function getLiveStreamClient(): SSEClient {
  if (!_globalClient) {
    _globalClient = new SSEClient("/live/stream", { heartbeatMs: 60_000, maxRetries: 10 });
  }
  return _globalClient;
}
