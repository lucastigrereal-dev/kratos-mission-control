# W19 PREFLIGHT REPORT — KRATOS PRD Finalization

**Data:** 2026-05-30  
**Branch:** main  
**HEAD:** d2193b5 feat(W14): ksw-w14-autolearning  
**Modo:** LOCAL ONLY — sem conexões externas reais  

---

## Git Status

| Tipo | Arquivos |
|------|----------|
| Modified (não staged) | `frontend/package*.json`, `frontend/tsconfig.tsbuildinfo`, `src/routeTree.gen.ts` |
| Untracked (docs visuais) | ~45 arquivos em `docs/kratos-visual/` |
| Commits pendentes de push | 14 commits (bloqueado por segurança) |

## Scripts Disponíveis

| Script | Comando |
|--------|---------|
| dev | `vite dev` |
| build | `vite build` |
| test | `bun test tests/stores tests/contracts --timeout 30000` |
| typecheck | `tsc --noEmit` |
| lint | `eslint .` |
| deploy | `wrangler deploy` (PROIBIDO sem autorização) |

## Estado de Saúde (W11-W18)

- ✅ Tests: 611 pass / 0 fail
- ✅ Build: client + SSR limpo
- ✅ Tag: `kratos-v2.0-main` → d2193b5

## OMNIS Architecture (existente)

### Hooks
- `src/hooks/useOmnis.ts` — status, health, crews, jobs (READ-ONLY)
- `src/hooks/useOmnisRuns.ts` — mission runs
- `src/hooks/useOmnisHealthScore.ts` — health score

### Components (omnis/)
- `OmnisExecutionCockpit.tsx` — stats + active runs + history + launcher
- `AppFactoryPanel.tsx` — 8 templates catalog
- `ActiveMissionsPanel.tsx`, `HealthScoreCard.tsx`, `MissionRunsCard.tsx`
- `MissionGraphCard.tsx`, `GuardrailAlertCard.tsx`, `CostSummaryCard.tsx`
- `ModelCostDashboard.tsx`, `MissionEventLogCard.tsx`, `ContentDraftsCard.tsx`

### Provider
- `src/lib/omnis-provider.ts` — READ-ONLY, nunca executa comandos
- `src/lib/omnis-server-fns.ts` — server functions

### Schemas
- `api-contract/omnis.schema.ts` — OmnisStatus, OmnisCrew, OmnisJob
- `api-contract/omnis-runs.schema.ts` — MissionRun

## Boundary Crítica (W19)

```
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS age.
Akasha lembra.
Codex/Claude constrói.
Lucas decide.
```

W19 cria o contrato de escrita **dry-run apenas**.  
Nenhuma chamada real ao OMNIS backend será feita.  
Toda execução real requer Human Approval Gate explícito.

## Skills Mapeadas

| Skill Solicitada | Status | Ação |
|-----------------|--------|------|
| using-superpowers | ✅ Ativa | Invocada |
| kratos-frontend-guardrails | ✅ Disponível | Emulada via CLAUDE.md |
| merge-gate | ✅ Disponível | Aplicada antes de commits |
| qa-guard | ✅ Disponível | Gates de build/test |
| omnis-git-workflow | ✅ Disponível | Git workflow seguro |
| context-engineering | ⚠️ Não encontrada | Persona aplicada inline |
| operational-truth-engineer | ⚠️ Não encontrada | Princípio: sem fingir live |
| mission-control-mapper | ⚠️ Não encontrada | Mapeamento manual |
| omnis-mission-control-operator | ⚠️ Não encontrada | Arquitetura aplicada |

Missing skills registradas em: `reports/KRATOS_SKILLS_USED_AND_MISSING_W19_FINAL.md`

---

**PREFLIGHT: CLEARED — Iniciar W19-B02**
