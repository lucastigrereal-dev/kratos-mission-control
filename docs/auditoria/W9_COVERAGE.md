# W9 — Test Coverage Analysis
**Data:** 2026-05-27
**Branch:** feature/fase14-integration

## Suite anterior (pré-W9)
- 270 testes / 25 arquivos / ~175ms

## Arquivos sem cobertura (src/hooks/ e src/lib/)

### src/lib/ — status de cobertura
| Arquivo | Status | Justificativa |
|---|---|---|
| `src/lib/utils.ts` | **Sem testes** → coberto (W9) | cn() e timeAgo() são funções puras críticas |
| `src/lib/resolve-with-fallback.ts` | **Sem testes** → coberto (W9) | Usado em toda camada de fetch com fallback |
| `src/lib/data-sources.ts` | **Sem testes** → coberto (W9) | Mapa canônico de endpoints — contrato fundamental |
| `src/lib/kratos-routes.ts` | **Sem testes** → coberto (W9) | KRATOS_ROUTES e getRouteBreadcrumb() são navegação core |
| `src/lib/error-capture.ts` | **Sem testes** → coberto (W9) | consumeLastCapturedError() — boundary de erro do Worker |
| `src/lib/api/client.ts` | Sem testes diretos | apiGet/apiPost cobertos indiretamente via store tests |
| `src/lib/api/queryClient.ts` | Sem testes | Config pura do TanStack Query — sem lógica própria |
| `src/lib/checkpoint-server-fns.ts` | Sem testes diretos | Coberto via checkpoint-store.test.ts |
| `src/lib/project-server-fns.ts` | Sem testes diretos | Coberto via project-store.test.ts |
| `src/lib/appointment-server-fns.ts` | Sem testes diretos | Coberto via appointment-store.test.ts |
| `src/lib/github-server-fns.ts` | Sem testes diretos | Coberto via github-store.test.ts |
| `src/lib/omnis-server-fns.ts` | Sem testes diretos | Coberto via omnis-store.test.ts |
| `src/lib/health-server-fns.ts` | Sem testes diretos | Coberto via health-utils.test.ts |
| `src/lib/dashboard-server-fns.ts` | Sem testes diretos | Coberto via dashboard-snapshot.test.ts |
| `src/lib/contexto-server-fns.ts` | Sem testes diretos | Coberto via contexto-snapshot.test.ts |
| `src/lib/akasha-server-fns.ts` | Sem testes | Provider Akasha — integração externa, sem lógica pura |
| `src/lib/service-server-fns.ts` | Sem testes diretos | Coberto via services-health.test.ts |
| `src/lib/github-provider.ts` | Sem testes diretos | Coberto via github-provider.test.ts |
| `src/lib/omnis-provider.ts` | Sem testes diretos | Coberto via omnis-provider.test.ts |
| `src/lib/error-page.ts` | Sem testes | Utilitário SSR de página de erro — sem lógica de negócio |

### src/hooks/ — status de cobertura
| Arquivo | Status | Justificativa |
|---|---|---|
| `useMissionLens.ts` | Sem testes React | Zod schema coberto indiretamente; hook precisa jsdom para React Query |
| `useLiveStatus.ts` | Sem testes React | Funções puras `serviceHealthToSeverity` e `deriveLiveState` são lógica testável (candidatas W10) |
| `useDriftDetection.ts` | Sem testes React | Estado interno com timer — lógica de derivação de DriftState é pura |
| `useCheckpoints.ts` | Sem testes diretos | Coberto via checkpoint-store.test.ts |
| `useProjects.ts` | Sem testes diretos | Coberto via project-store.test.ts |
| `useAppointments.ts` | Sem testes diretos | Coberto via appointment-store.test.ts |
| `useGithub.ts` | Sem testes diretos | Coberto via github-store.test.ts |
| `useOmnis.ts` | Sem testes diretos | Coberto via omnis-store.test.ts |
| `useServices.ts` | Sem testes diretos | Coberto via services-health.test.ts |
| `useOffline.ts` | Sem testes | Hook de navegador puro — sem lógica de negócio |
| `usePWAInstall.ts` | Sem testes | Hook de navegador puro — sem lógica de negócio |
| `useGlobalShortcuts.ts` | Sem testes | Event listeners DOM — requer jsdom |
| `useSSEToasts.ts` | Sem testes | Depende de EventSource e DOM |

## Novos testes adicionados (W9)

| Arquivo | Testes | Descrição |
|---|---|---|
| `tests/stores/lib-utils-coverage.test.ts` | 32 | cn(), timeAgo(), resolveWithFallback(), timeoutPromise(), DATA_SOURCES_MAP, KRATOS_ROUTES, VISIBLE_ROUTES, getRouteBreadcrumb(), consumeLastCapturedError() |

### Detalhamento por módulo
| Módulo | Testes | Categorias |
|---|---|---|
| `utils.cn()` | 5 | merge, dedup Tailwind, falsy, empty, object notation |
| `utils.timeAgo()` | 4 | agora, minutos, horas, dias |
| `resolve-with-fallback.timeoutPromise()` | 2 | rejeição com msg padrão, rejeição com msg custom |
| `resolve-with-fallback.resolveWithFallback()` | 4 | sucesso, rejeição, timeout, undefined fallback |
| `data-sources.DATA_SOURCES_MAP` | 4 | chaves presentes, estrutura válida, endpoint mission_lens, fallback mission_lens |
| `kratos-routes.KRATOS_ROUTES` | 4 | count=7, root não visível, shape válida, sections válidas |
| `kratos-routes.VISIBLE_ROUTES` | 3 | root excluído, count=6, paths esperados |
| `kratos-routes.getRouteBreadcrumb()` | 4 | /agora, /checkpoints, /sistema, rota desconhecida |
| `error-capture.consumeLastCapturedError()` | 2 | sem erro capturado, idempotente |

## Resultado final
**302 passes / 0 fails / ~520ms**
26 arquivos de teste — incremento de +32 testes (+11.8%) vs baseline W9.
