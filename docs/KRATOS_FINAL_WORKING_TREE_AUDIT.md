# KRATOS Final Working Tree Audit

**Data:** 2026-05-18
**Branch:** main

## Arquivos Modificados (16)

| Arquivo | Linhas | Sprint | Motivo |
|---|---|---|---|
| `backend/app/main.py` | +9 | P3 | API adjustments |
| `src/components/kratos/aurora/AuroraChatDock.tsx` | +90 | P3+P4 | Quick commands, context states, loading feedback |
| `src/components/kratos/aurora/AuroraPanelContent.tsx` | +3 | P3 | Real data hooks |
| `src/components/kratos/base/ZombieBadge.tsx` | +24 | P3 | onRetryConnection, source badges |
| `src/components/kratos/hud/CurrentMissionBar.tsx` | +19 | P3 | sourceType prop |
| `src/components/kratos/shell/DriftIndicator.tsx` | +18 | P3 | sourceType prop |
| `src/components/kratos/shell/NextActionBlock.tsx` | +9 | P3 | mission lens data |
| `src/components/kratos/views/AgoraView.tsx` | +26 | P3 | DriftIndicator integration |
| `src/components/kratos/views/DashboardView.tsx` | +3 | P3 | lens wiring |
| `src/components/kratos/views/SistemaView.tsx` | +13 | P3 | SourceBadge |
| `src/components/kratos/world/CentralCastleMission.tsx` | +14 | P1 | driftRisk prop |
| `src/components/kratos/world/KratosContext.tsx` | +28 | P3+P4 | createCheckpoint, lensLastUpdatedAt, dashboardRefetch |
| `src/components/kratos/world/KratosWorldPage.tsx` | +140 | P1-P4 | Master cockpit wiring |
| `src/components/kratos/world/StatusBarDock.tsx` | +49 | P2 | Checkpoint save button |
| `src/components/kratos/world/WorldCharacterMarker.tsx` | +18 | P1 | hasCheckpoint prop |
| `src/hooks/useMissionLens.ts` | +4 | P3 | lastUpdatedAt |

## Arquivos Não Commitados (untracked)

- `.e2e_output.txt` — temp, ignorar
- `.wrangler-dry/` — temp, ignorar
- `backend/app/routes/operational_truth.py` — feature separada
- `backend/app/services/operational_truth_service.py` — feature separada
- `backend/tests/test_operational_truth.py` — feature separada
- `docs/KRATOS_*.md` — relatórios do sprint
- `scripts/*.py` — ferramentas separadas

## Verificação de Segurança

- Nenhum `routeTree.gen.ts` editado manualmente
- Nenhum `.env`, secret, node_modules ou dist modificado
- Nenhum arquivo de build no working tree
- `backend/app/main.py` — verificado, mudanças de API legítimas

## Decisão

**COMMIT** — Todos os 16 arquivos modificados são esperados do sprint P1-P4.
Untracked files permanecem fora do commit.
