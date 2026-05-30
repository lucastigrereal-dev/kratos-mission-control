# W19 OMNIS COCKPIT MAP

**Data:** 2026-05-30  
**Propósito:** Mapear todos os pontos relacionados à execução OMNIS antes de criar o Write Bridge  

---

## Componentes OMNIS (src/components/kratos/omnis/)

| Componente | Função | Read/Write |
|-----------|--------|------------|
| `OmnisExecutionCockpit.tsx` | Stats, active runs, history, skill launcher (disabled) | READ |
| `AppFactoryPanel.tsx` | 8 templates catalog, deploy locked (W28) | READ |
| `ActiveMissionsPanel.tsx` | Missões ativas em tempo real | READ |
| `HealthScoreCard.tsx` | Score de saúde do OMNIS | READ |
| `MissionRunsCard.tsx` | Histórico de runs | READ |
| `MissionGraphCard.tsx` | Grafo de dependências de missão | READ |
| `GuardrailAlertCard.tsx` | Alertas de guardrail | READ |
| `CostSummaryCard.tsx` | Resumo de custos por modelo | READ |
| `ModelCostDashboard.tsx` | Dashboard de custo por modelo | READ |
| `MissionEventLogCard.tsx` | Log de eventos de missão | READ |
| `ContentDraftsCard.tsx` | Rascunhos de conteúdo | READ |

## Hooks OMNIS

| Hook | queryKey | Fonte | Guard |
|------|----------|-------|-------|
| `useOmnisStatus()` | `["omnis","status"]` | `omnis-provider.ts` | READ-ONLY |
| `useOmnisHealth()` | `["omnis","health"]` | `omnis-provider.ts` | READ-ONLY |
| `useOmnisCrews()` | `["omnis","crews"]` | `omnis-provider.ts` | READ-ONLY |
| `useOmnisJobs(limit)` | `["omnis","jobs",limit]` | `omnis-provider.ts` | READ-ONLY |
| `useOmnisConfig()` | `["omnis","config"]` | `omnis-provider.ts` | READ-ONLY |
| `useOmnisReadOnlyGuard()` | — | hardcoded | Boundary enforcer |
| `useOmnisRuns(limit)` | `["omnis-runs",limit]` | `api/client` → `/omnis-runs/list` | READ-ONLY |
| `useOmnisHealthScore()` | — | — | READ-ONLY |

## Provider / Server Functions

| Arquivo | Exports | Writes? |
|---------|---------|---------|
| `src/lib/omnis-provider.ts` | `fetchOmnisStatus`, `fetchOmnisHealth`, `fetchOmnisCrews`, `fetchOmnisJobs`, `checkOmnisConfig` | ❌ NUNCA |
| `src/lib/omnis-server-fns.ts` | server functions para acima | ❌ NUNCA |

## Schemas

| Schema | Tipos | Write-relevant? |
|--------|-------|-----------------|
| `api-contract/omnis.schema.ts` | `OmnisStatus`, `OmnisCrew`, `OmnisJob` | READ |
| `api-contract/omnis-runs.schema.ts` | `MissionRun`, `MissionRunsEnvelope` | READ |

## Ponto de Inserção W19

```
OmnisLabScreen.tsx
  └── OmnisExecutionCockpit.tsx  ← Adicionar MissionCommandPanel aqui (nova seção abaixo)
  └── [NOVO] MissionCommandPanel.tsx  ← W19-B06
        └── HumanApprovalGate.tsx  ← W19-B07
```

## Gap Identificado

**NENHUM ponto de escrita existe no KRATOS atual.**  
O `useOmnisReadOnlyGuard()` hardcoda a boundary.  
W19 cria o contrato + adapter mock + gate, sem remover essa proteção.

## Source Badge State Atual

O sistema usa `source-badge.schema.ts` para indicar origem dos dados.  
W19 deve adicionar estado `"dry_run"` e `"human_gate_required"` ao vocabulário existente.

---

**MAP COMPLETO — Iniciar W19-B03**
