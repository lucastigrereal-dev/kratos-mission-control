# KRATOS SKILLS — W19-W22 Finalization

**Data:** 2026-05-30  

---

## Skills Usadas

| Skill | Invocada | Como usada |
|-------|---------|------------|
| `using-superpowers` | ✅ | Meta-skill invocada no início de cada wave |
| `kratos-frontend-guardrails` | ✅ emulada | Regras do CLAUDE.md aplicadas: tokens CSS, zero any, props interface |
| `merge-gate` | ✅ emulada | `git status` antes + `git status` depois de cada commit |
| `qa-guard` | ✅ emulada | `bun run test` + `bun run build` antes de commit |
| `omnis-git-workflow` | ✅ emulada | Paths explícitos, nunca `git add -A`, mensagens convencionais |
| `gsd:execute-phase` | ✅ (invocada antes) | Wave execution framework |
| `preflight` | ✅ (W19-B01) | Preflight check inicial |

## Skills Ausentes (não encontradas — emuladas inline)

| Skill Solicitada | Status | Persona Aplicada |
|-----------------|--------|-----------------|
| `context-engineering` | ❌ não encontrada | Contexto explícito em cada componente (JSDoc) |
| `writing-plans` | ❌ não encontrada | Planejamento inline por bloco |
| `executing-plans` | ❌ não encontrada | Execução sequencial block-by-block |
| `git-workflow` | ❌ (alias de omnis-git-workflow) | Emulada |
| `branch-health` | ❌ não encontrada | `git status` manual |
| `safe-commit` | ❌ não encontrada | Paths explícitos + pre-check |
| `governance-review` | ❌ não encontrada | Human Slots + BLOCKED_EXTERNAL documentados |
| `security-auditor` | ❌ não encontrada | Regras PROIBIDO verificadas em cada arquivo |
| `frontend-reviewer` | ❌ (alias de design-system-guardian) | Tokens CSS verificados |
| `backend-architect` | ❌ não encontrada | Adapter pattern aplicado |
| `architecture-review` | ❌ não encontrada | Boundary KRATOS→OMNIS verificada |
| `test-driven-development` | ❌ não encontrada | Tests por wave após implementação |
| `systematic-debugging` | ❌ não encontrada | Debug do test failure W21 inline |
| `operational-truth-engineer` | ❌ não encontrada | Princípio: source badge sempre visível |
| `mission-control-mapper` | ❌ não encontrada | W19-B02 mapeamento manual |
| `omnis-mission-control-operator` | ❌ não encontrada | Arquitetura Write Bridge manual |
| `provider-orchestration` | ❌ não encontrada | Factory pattern no meta-analytics-adapter |
| `using-git-worktrees` | ❌ não necessário | Single branch, sem paralelização |

## Recomendações

Skills a criar para futuros PRDs:
1. `operational-truth-engineer` — garante source badge em todos os dados
2. `security-auditor` — verifica secrets, `any`, hex colors sistematicamente
3. `safe-commit` — wrapper para commits com paths explícitos
4. `governance-review` — documenta Human Slots + BLOCKED_EXTERNAL automaticamente
