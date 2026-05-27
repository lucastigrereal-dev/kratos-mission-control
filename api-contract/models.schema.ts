/**
 * api-contract/models.schema.ts
 * Política Oficial de Roteamento de Modelos v2.1 — Quality-First
 *
 * Fonte da verdade: https://www.notion.so/36d22eba8f088199a2d6cf5a7e958cee
 * Benchmarks:       https://www.notion.so/36d22eba8f08815b9b29c5de05d032fb
 *
 * REGRAS INVIOLÁVEIS:
 * - KRATOS NÃO chama modelos — boundary "KRATOS lê, Aurora comanda"
 * - NUNCA hardcode real model name em componente UI — usar LogicalModel
 * - NUNCA secret com prefixo VITE_ neste arquivo
 * - Cost Dashboard alerta visual se opus/gpt-* aparecer (deve ser 0%)
 * - Cost Dashboard alerta amarelo se fallback-* aparecer (desativado sem key)
 */

import { z } from "zod";

// ── 6 premium + 2 fallback desativados — Política v2.1 ───────────────────
// fallback-cheap/premium existem no schema para validação de dados históricos,
// mas NUNCA devem aparecer em produção (ANTHROPIC_API_KEY não configurada).
export const LogicalModelSchema = z.enum([
  "ollama-fast",      // glm-5.1:cloud         — operação volume, 6 agentes
  "ollama-code",      // kimi-k2.6:cloud        — Aurora + SDR + Claude Code
  "ollama-build",     // minimax-m2.7:cloud     — App Factory + builds reais (NOVO v2.1)
  "ollama-smart",     // deepseek-v4-pro:cloud  — arquitetura + análise
  "ollama-longctx",   // minimax-m2.7:cloud     — A Caixa, RAG 1M ctx (NOVO v2.1)
  "ollama-backup",    // qwen3.5:397b:cloud     — backup premium
  "fallback-cheap",   // DESATIVADO — sem ANTHROPIC_API_KEY (era Claude Haiku)
  "fallback-premium", // DESATIVADO — sem ANTHROPIC_API_KEY (era Claude Sonnet)
]);

export type LogicalModel = z.infer<typeof LogicalModelSchema>;

// ── Labels human-readable para o Cost Dashboard ───────────────────────────
// Apenas para display — não usar para routing ou chamadas de API
export const MODEL_DISPLAY_NAMES: Record<LogicalModel, string> = {
  "ollama-fast":      "GLM-5.1 (volume)",
  "ollama-code":      "Kimi K2.6 (Aurora)",
  "ollama-build":     "MiniMax M2.7 (builds)",
  "ollama-smart":     "DeepSeek V4 Pro (análise)",
  "ollama-longctx":   "MiniMax M2.7 (1M ctx)",
  "ollama-backup":    "Qwen3.5 (backup)",
  "fallback-cheap":   "Claude Haiku (desativado)",
  "fallback-premium": "Claude Sonnet (desativado)",
};

// ── Modelo real mapeado (display only — NUNCA usar para routing no frontend) ─
export const MODEL_REAL_NAMES: Record<LogicalModel, string> = {
  "ollama-fast":      "glm-5.1:cloud",
  "ollama-code":      "kimi-k2.6:cloud",
  "ollama-build":     "minimax-m2.7:cloud",
  "ollama-smart":     "deepseek-v4-pro:cloud",
  "ollama-longctx":   "minimax-m2.7:cloud",
  "ollama-backup":    "qwen3.5:397b:cloud",
  "fallback-cheap":   "claude-haiku-4-5",
  "fallback-premium": "claude-sonnet-4-5",
};

// ── Tier para o Cost Dashboard ────────────────────────────────────────────
// premium  → modelos Ollama ativos (custo $0, política OK)
// disabled → fallback Anthropic desativados (alerta amarelo se aparecer)
export const MODEL_TIER: Record<LogicalModel, "premium" | "disabled"> = {
  "ollama-fast":      "premium",
  "ollama-code":      "premium",
  "ollama-build":     "premium",
  "ollama-smart":     "premium",
  "ollama-longctx":   "premium",
  "ollama-backup":    "premium",
  "fallback-cheap":   "disabled",
  "fallback-premium": "disabled",
};

// ── Padrões que indicam violação crítica da política (alerta 🔴) ──────────
// Se qualquer nome de modelo no Cost Dashboard bater nesses padrões,
// alerta PROIBIDO. Deve ser 0% em produção.
export const POLICY_VIOLATION_PATTERNS: readonly string[] = [
  "opus",
  "gpt-",
  "claude-3-",
  "gemini-ultra",
  "gemini-pro",
];

/** Verifica se um nome viola a política Ollama-First v2.1 (alerta 🔴) */
export function isPolicyViolation(modelName: string): boolean {
  const lower = modelName.toLowerCase();
  return POLICY_VIOLATION_PATTERNS.some((p) => lower.includes(p));
}

/** Verifica se um nome lógico é fallback desativado (alerta 🟡) */
export function isFallbackDisabled(logicalName: string): boolean {
  return logicalName === "fallback-cheap" || logicalName === "fallback-premium";
}
