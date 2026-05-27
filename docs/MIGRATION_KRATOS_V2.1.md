# KRATOS — Migração Política de Modelos v2.0 → v2.1

**Data:** 2026-05-27
**Branch:** main
**Commit:** feat(routing): KRATOS reflete Política v2.1 Quality-First

---

## Contexto

O OMNIS adotou a Política de Roteamento v2.1 Quality-First, substituindo 4 modelos
ad-hoc por 6 nomes lógicos canônicos com bindings premium.

KRATOS é cockpit de visualização — NUNCA comanda modelos. Esta migração atualiza
apenas a camada de exibição (Cost Dashboard) e os contratos Zod para refletir
a nova política. A boundary "KRATOS lê, Aurora comanda" permanece intacta.

---

## Mudanças realizadas

### 1. `api-contract/models.schema.ts` — NOVO

Fonte da verdade dos 6 nomes lógicos no frontend:

```typescript
LogicalModelSchema = z.enum([
  "ollama-fast",    // glm-5.1:cloud
  "ollama-code",    // kimi-k2.6:cloud
  "ollama-build",   // minimax-m2.7:cloud
  "ollama-smart",   // deepseek-v4-pro:cloud
  "ollama-longctx", // minimax-m2.7:cloud
  "ollama-backup",  // qwen3.5:397b:cloud
])
```

Exporta também:
- `MODEL_DISPLAY_NAMES` — labels human-readable por nome lógico
- `MODEL_REAL_NAMES` — real model name (para tooltip/display only)
- `MODEL_TIER` — todos `"ollama"` em v2.1
- `POLICY_VIOLATION_PATTERNS` — padrões proibidos: opus, gpt-*, claude-3-*, gemini-*
- `isPolicyViolation(name)` — helper de verificação

### 2. `src/components/kratos/omnis/ModelCostDashboard.tsx` — ATUALIZADO

| Antes (v2.0) | Depois (v2.1) |
|---|---|
| 4 modelos ad-hoc | 6 nomes lógicos canônicos |
| deepseek-v4-pro, glm-5.1, kimi-k2.6, claude-sonnet | ollama-fast, ollama-code, ollama-build, ollama-smart, ollama-longctx, ollama-backup |
| Policy alert apenas para "opus" | Policy alert para opus/gpt-*/claude-3-*/gemini-* |
| Link Ollama-First v2.0 | Link Quality-First v2.1 |
| Labels hardcoded | Labels via MODEL_DISPLAY_NAMES |
| Sem real model hint | Real model name exibido como sub-label |

#### Distribuição de tokens mock (v2.1):

| Modelo lógico | Real model | Tokens (mock) | % | Custo |
|---|---|---|---|---|
| ollama-fast | glm-5.1:cloud | 186K | 40% | $0 |
| ollama-code | kimi-k2.6:cloud | 93K | 20% | $0 |
| ollama-build | minimax-m2.7:cloud | 70K | 15% | $0 |
| ollama-smart | deepseek-v4-pro:cloud | 70K | 15% | $0 |
| ollama-longctx | minimax-m2.7:cloud | 32.5K | 7% | $0 |
| ollama-backup | qwen3.5:397b:cloud | 14K | 3% | $0 |
| **Total** | | **465.5K** | **100%** | **$0** |

---

## Regras que permaneceram intactas

- ❌ NUNCA VITE_ secrets neste codebase
- ❌ NUNCA hardcode real model name em componente UI (usa `MODEL_DISPLAY_NAMES`)
- ❌ NUNCA chamar API de modelo direto do browser
- ✅ Boundary "KRATOS lê, Aurora comanda" — intacta
- ✅ 6 nomes lógicos refletidos nos schemas Zod

---

## Gates passados

- `bun run test` → **302 pass / 0 fail**
- `bun run build` → **✓ built in ~3.5s (zero erros Vite)**
- TypeScript: nenhum erro novo em `models.schema.ts` ou `ModelCostDashboard.tsx`

---

## Não alterado (escopo controlado)

- `api-contract/aurora.schema.ts` — campo `model: z.string()` mantido freeform (armazena real model name do OMNIS, não nome lógico)
- Nenhum teste modificado — zero model name nos testes existentes
- Nenhuma rota nova, nenhum hook novo, nenhum mock de MOCK_REGISTRY alterado
- `routeTree.gen.ts` — intocado (gerado automaticamente)

---

## Próximas fronteiras (não nesta migração)

- `/omnis/cost-breakdown` (OMNIS W22-B9) — quando disponível, substituirá `MOCK_MODEL_USAGE`
- `aurora.schema.ts` — poderá usar `LogicalModelSchema` quando OMNIS retornar nome lógico em vez de real model name

---

*Política canônica:* https://www.notion.so/36d22eba8f088199a2d6cf5a7e958cee
