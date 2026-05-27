/**
 * api-contract/models.schema.ts
 * Política Oficial de Roteamento de Modelos v2.1 — Quality-First
 *
 * Fonte da verdade: https://www.notion.so/36d22eba8f088199a2d6cf5a7e958cee
 *
 * REGRAS INVIOLÁVEIS:
 * - KRATOS NÃO chama modelos — boundary "KRATOS lê, Aurora comanda"
 * - NUNCA hardcode real model name em componente UI — usar LogicalModel
 * - NUNCA secret com prefixo VITE_ neste arquivo
 * - Cost Dashboard alerta visual se opus/gpt-* aparecer (deve ser 0%)
 */

import { z } from "zod";

// ── 6 nomes lógicos canônicos — Política v2.1 ────────────────────────────
export const LogicalModelSchema = z.enum([
  "ollama-fast",    // GLM-5.1:cloud    — operação volume, 6 agentes
  "ollama-code",    // Kimi-K2.6:cloud  — Aurora + SDR + Claude Code
  "ollama-build",   // MiniMax-M2.7:cloud — App Factory + builds reais
  "ollama-smart",   // DeepSeek-V4 Pro:cloud — arquitetura + análise
  "ollama-longctx", // MiniMax-M2.7:cloud — A Caixa, RAG 1M ctx
  "ollama-backup",  // Qwen3.5:397B:cloud — backup premium
]);

export type LogicalModel = z.infer<typeof LogicalModelSchema>;

// ── Labels human-readable para o Cost Dashboard ───────────────────────────
// Apenas para display — não usar para routing ou chamadas de API
export const MODEL_DISPLAY_NAMES: Record<LogicalModel, string> = {
  "ollama-fast":    "GLM-5.1 · Fast",
  "ollama-code":    "Kimi-K2.6 · Code",
  "ollama-build":   "MiniMax-M2.7 · Build",
  "ollama-smart":   "DeepSeek-V4 Pro · Smart",
  "ollama-longctx": "MiniMax-M2.7 · LongCtx",
  "ollama-backup":  "Qwen3.5:397B · Backup",
};

// ── Modelo real mapeado (display only — NUNCA usar para routing no frontend) ─
export const MODEL_REAL_NAMES: Record<LogicalModel, string> = {
  "ollama-fast":    "glm-5.1:cloud",
  "ollama-code":    "kimi-k2.6:cloud",
  "ollama-build":   "minimax-m2.7:cloud",
  "ollama-smart":   "deepseek-v4-pro:cloud",
  "ollama-longctx": "minimax-m2.7:cloud",
  "ollama-backup":  "qwen3.5:397b:cloud",
};

// ── Tier para o Cost Dashboard (todos Ollama em v2.1) ─────────────────────
export const MODEL_TIER: Record<LogicalModel, "ollama"> = {
  "ollama-fast":    "ollama",
  "ollama-code":    "ollama",
  "ollama-build":   "ollama",
  "ollama-smart":   "ollama",
  "ollama-longctx": "ollama",
  "ollama-backup":  "ollama",
};

// ── Padrões que indicam violação da política Ollama-First ─────────────────
// Se qualquer nome de modelo no Cost Dashboard bater nesses padrões,
// o dashboard deve exibir alerta visual. Deve ser 0% em produção.
export const POLICY_VIOLATION_PATTERNS: readonly string[] = [
  "opus",
  "gpt-",
  "claude-3-",
  "gemini-ultra",
  "gemini-pro",
];

/** Verifica se um nome viola a política Ollama-First v2.1 */
export function isPolicyViolation(modelName: string): boolean {
  const lower = modelName.toLowerCase();
  return POLICY_VIOLATION_PATTERNS.some((p) => lower.includes(p));
}
