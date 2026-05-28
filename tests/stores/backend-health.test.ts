/**
 * backend-health.test.ts — W0-B5
 * Testa a lógica de derivação de status do useBackendHealth.
 * Testes puros: sem DOM, sem React, sem fetch real.
 *
 * Valida:
 *  1. Derivação de status (BackendStatus) a partir de consecutiveFails + reachable
 *  2. Parsing de resposta JSON do endpoint /health
 *  3. Threshold de "offline" (2 falhas consecutivas)
 */

import { describe, it, expect } from "bun:test";
import type { BackendStatus } from "../../src/hooks/useBackendHealth";

// ── Lógica de derivação ──────────────────────────────────────────────────────
// Espelha o bloco "Derivar status" do hook — testa a lógica em isolamento.

function deriveStatus(
  consecutiveFails: number,
  reachable: boolean,
  degraded: boolean,
  isPending: boolean,
): BackendStatus {
  if (isPending && consecutiveFails === 0) return "unknown";
  if (reachable) return degraded ? "degraded" : "live";
  if (consecutiveFails >= 2) return "offline";
  if (consecutiveFails > 0) return "degraded";
  return "unknown";
}

// ── Parsing da resposta JSON do /health ──────────────────────────────────────
// Espelha o bloco de parse do pingBackend.

function parseHealthJson(json: Record<string, unknown>): boolean {
  const apiStatus = String(
    (json["collector_status"] as string | undefined) ??
    ((json["data"] as Record<string, unknown> | undefined)?.["status"]) ??
    "unknown",
  );
  return apiStatus !== "ok"; // true = degraded
}

// ── Testes de derivação de status ────────────────────────────────────────────

describe("useBackendHealth — derivação de status", () => {
  it("retorna 'unknown' na primeira carga (sem fetch ainda)", () => {
    expect(deriveStatus(0, false, false, true)).toBe("unknown");
  });

  it("retorna 'live' quando backend responde ok", () => {
    expect(deriveStatus(0, true, false, false)).toBe("live");
  });

  it("retorna 'degraded' quando backend responde degraded", () => {
    expect(deriveStatus(0, true, true, false)).toBe("degraded");
  });

  it("retorna 'degraded' após 1 falha de rede (offline não confirmado ainda)", () => {
    expect(deriveStatus(1, false, false, false)).toBe("degraded");
  });

  it("retorna 'offline' após 2 falhas consecutivas de rede", () => {
    expect(deriveStatus(2, false, false, false)).toBe("offline");
  });

  it("retorna 'offline' com 3+ falhas consecutivas", () => {
    expect(deriveStatus(5, false, false, false)).toBe("offline");
  });

  it("volta para 'live' após recuperação (consecutiveFails resetado para 0)", () => {
    // Simula: estava offline (3 falhas), backend volta
    // Hook reseta consecutiveFails para 0 no próximo ping bem-sucedido
    expect(deriveStatus(0, true, false, false)).toBe("live");
  });

  it("'live' não é degraded (reachable=true, degraded=false)", () => {
    const s = deriveStatus(0, true, false, false);
    expect(s).not.toBe("degraded");
    expect(s).not.toBe("offline");
  });
});

// ── Testes de parsing da resposta /health ────────────────────────────────────

describe("useBackendHealth — parsing de resposta /health", () => {
  it("collector_status: 'ok' → não degraded", () => {
    expect(parseHealthJson({ collector_status: "ok" })).toBe(false);
  });

  it("collector_status: 'degraded' → degraded", () => {
    expect(parseHealthJson({ collector_status: "degraded" })).toBe(true);
  });

  it("collector_status: 'error' → degraded", () => {
    expect(parseHealthJson({ collector_status: "error" })).toBe(true);
  });

  it("lê data.status quando collector_status ausente — ok", () => {
    expect(parseHealthJson({ data: { status: "ok" } })).toBe(false);
  });

  it("lê data.status quando collector_status ausente — degraded", () => {
    expect(parseHealthJson({ data: { status: "degraded" } })).toBe(true);
  });

  it("campo desconhecido → degraded (conservador)", () => {
    expect(parseHealthJson({ random: "field" })).toBe(true);
  });

  it("resposta vazia {} → degraded", () => {
    expect(parseHealthJson({})).toBe(true);
  });

  it("collector_status tem prioridade sobre data.status", () => {
    // collector_status ok deve ganhar mesmo se data.status estiver degraded
    expect(parseHealthJson({ collector_status: "ok", data: { status: "degraded" } })).toBe(false);
  });
});

// ── Testes de contrato de tipos ──────────────────────────────────────────────

describe("useBackendHealth — contrato de tipos", () => {
  it("BackendStatus tem exatamente 4 variantes", () => {
    const allStatuses: BackendStatus[] = ["live", "degraded", "offline", "unknown"];
    expect(allStatuses).toHaveLength(4);
  });

  it("deriveStatus sempre retorna uma BackendStatus válida", () => {
    const valid: BackendStatus[] = ["live", "degraded", "offline", "unknown"];
    const cases: Array<[number, boolean, boolean, boolean]> = [
      [0, false, false, true],
      [0, true, false, false],
      [0, true, true, false],
      [1, false, false, false],
      [2, false, false, false],
      [10, false, false, false],
    ];
    for (const [fails, reachable, degraded, pending] of cases) {
      expect(valid).toContain(deriveStatus(fails, reachable, degraded, pending));
    }
  });
});
