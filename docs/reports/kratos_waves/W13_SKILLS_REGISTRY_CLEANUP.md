# W13 — Skills Registry Cleanup

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE (sem alterações)

---

## Objetivo

Revisar e documentar o estado atual do registry de skills e agents
em `.claude/`.

---

## Agents (5)

| Agent | Arquivo | Status |
|---|---|---|
| kratos-architect | `.claude/agents/kratos-architect.md` | Ativo — planejamento pré-implementação |
| kratos-ui-builder | `.claude/agents/kratos-ui-builder.md` | Ativo — construção de UI |
| kratos-api-builder | `.claude/agents/kratos-api-builder.md` | Ativo — endpoints Hono |
| kratos-data-layer | `.claude/agents/kratos-data-layer.md` | Ativo — schemas, hooks, mock data |
| kratos-qa-guard | `.claude/agents/kratos-qa-guard.md` | Ativo — revisão pré-commit |

## Skills (11)

| Skill | Arquivo | Tier | Status |
|---|---|---|---|
| akasha-vault-builder | `akasha-vault-builder.md` | — | Ativo |
| api-contract-sync | `api-contract-sync.md` | — | Ativo |
| glass-panel-builder | `glass-panel-builder.md` | — | Ativo |
| hud-assembler | `hud-assembler.md` | — | Ativo |
| island-composer | `island-composer.md` | — | Ativo |
| kimi-to-code | `kimi-to-code.md` | — | Ativo |
| motion-guardian | `motion-guardian.md` | — | Ativo |
| neuro-ux-checker | `neuro-ux-checker.md` | — | Ativo |
| omnis-lab-builder | `omnis-lab-builder.md` | — | Ativo |
| token-enforcer | `token-enforcer.md` | strategy | Ativo |
| visual-qa-kimi | `visual-qa-kimi.md` | — | Ativo |

---

## Issues

| Issue | Severidade |
|---|---|
| `token-enforcer.md` referencia `styles/kratos-tokens.css` e `index.css` — não existem (path real: `src/styles.css`) | Baixa |

Sem skills órfãs, sem agents duplicados, sem referências a componentes inexistentes.

---

## Decisão

Manter todos os 5 agents e 11 skills como ativos. Nenhum stale/obsoleto.
