/**
 * KRATOS API Client — fonte canônica para chamadas HTTP ao backend Python.
 * Todos os hooks que falam com localhost:5100 devem importar daqui.
 *
 * READ-ONLY boundary: KRATOS lê status do OMNIS — NUNCA comanda.
 * apiPost existe apenas para APIs internas do KRATOS, não para o OMNIS.
 */

export const API_BASE: string =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

export const DEFAULT_TIMEOUT_MS = 5_000;

export interface FetchResult {
  ok: boolean;
  /** HTTP status code, 0 em caso de timeout/rede */
  status: number;
  /** JSON parsed response, null em caso de erro */
  raw: unknown;
}

/**
 * GET request ao backend Python do KRATOS.
 * Retorna `{ ok, status, raw }` — o caller faz o parse Zod.
 * Nunca lança exceção — requests com falha retornam `{ ok: false, raw: null }`.
 */
export async function apiGet(
  path: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<FetchResult> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, status: res.status, raw: null };
    const raw: unknown = await res.json();
    return { ok: true, status: res.status, raw };
  } catch {
    return { ok: false, status: 0, raw: null };
  }
}

/**
 * POST request — para endpoints de mutação futuros.
 * ATENÇÃO: não usar para endpoints OMNIS. KRATOS não comanda OMNIS.
 */
export async function apiPost<B = unknown>(
  path: string,
  body: B,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<FetchResult> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, status: res.status, raw: null };
    const raw: unknown = await res.json();
    return { ok: true, status: res.status, raw };
  } catch {
    return { ok: false, status: 0, raw: null };
  }
}
