# KRATOS Screen Specs — Spec de Cada Tela

> **Para MANUS:** Spec completa de cada tela: rota, componentes obrigatórios, fontes de dados, critérios de aceite.

---

## 1. Home — KratosWorldPage (`/`)

### Rota
- Arquivo: `src/routes/index.tsx`
- Componente: `KratosWorldPage`

### Layout
Mundo 3D CSS completo com HUD glass overlay. NÃO usa AppShell (renderiza direto sem shell wrapper).

### Componentes Obrigatórios
| Componente | Arquivo | Ordem |
|---|---|---|
| OceanBackdrop | `world/OceanBackdrop.tsx` | z-0 |
| SkyLayer | `world/SkyLayer.tsx` | z-10 |
| CloudLayer | `world/CloudLayer.tsx` | z-20 |
| BridgeSystem | `world/BridgeSystem.tsx` | z-30 |
| FloatingIsland (×10) | `world/FloatingIsland.tsx` | z-40 |
| CentralCastleMission | `world/CentralCastleMission.tsx` | z-50 |
| IslandLabel (×10) | `world/IslandLabel.tsx` | z-60 |
| WorldCharacterMarker | `world/WorldCharacterMarker.tsx` | z-75 |
| Topbar | `shell/Topbar.tsx` | z-100 |
| Sidebar | `shell/Sidebar.tsx` | z-100 |
| AuroraPanelV2 | `aurora/AuroraPanelV2.tsx` | z-100 |
| AuroraChatDock | `aurora/AuroraChatDock.tsx` | z-100 |
| DriftIndicator | `shell/DriftIndicator.tsx` | z-85 (condicional) |
| CurrentMissionBar | `hud/CurrentMissionBar.tsx` | z-89 |
| StatusBarDock | `world/StatusBarDock.tsx` | z-90 |

### Fontes de Dados
- `useMissionLens()` — missão atual, mentor signals, alertas
- `useDriftDetection()` — drift_risk, focus_state
- `useDashboard()` — dados agregados
- `useCheckpoints()` — checkpoints ativos, paused
- `useLiveStatus()` — conexão live/offline
- `KratosContext` — provider central (evita chamadas duplicadas)

### Critérios de Aceite
- [ ] Mundo 3D renderiza sem erro de hydration
- [ ] 10 ilhas flutuantes visíveis com animação float
- [ ] Castelo central pulsando com missão ativa
- [ ] AuroraChatDock funcional com quick commands (/retomar, /salvar, /foco)
- [ ] DriftIndicator aparece quando drift_risk = high
- [ ] CurrentMissionBar mostra missão ativa com progresso
- [ ] StatusBarDock fixo no bottom
- [ ] Sidebar navega para todas as 6 rotas visíveis
- [ ] Mobile: sidebar colapsa, aurora panel fecha
- [ ] Dark mode verificado
- [ ] Zero erros no console

---

## 2. Agora (`/agora`)

### Rota
- Arquivo: `src/routes/agora.tsx`
- Componente: `AgoraView`

### Componentes Obrigatórios
| Componente | Arquivo |
|---|---|
| SectionHeader | `base/SectionHeader.tsx` |
| FocusCard | `agora/FocusCard.tsx` |
| NextActionCard | `agora/NextActionCard.tsx` |
| CriticalAlertCard | `agora/CriticalAlertCard.tsx` |
| DeadlineCard | `agora/DeadlineCard.tsx` |
| CheckpointCard | `agora/CheckpointCard.tsx` |
| AuroraShortcutCard | `agora/AuroraShortcutCard.tsx` |
| SystemPulseStrip | `agora/SystemPulseStrip.tsx` |
| MiniAgenda | `agora/MiniAgenda.tsx` |
| DriftIndicator | `shell/DriftIndicator.tsx` |
| ZombieBadge | `base/ZombieBadge.tsx` |
| SourceBadgeIndicator | `base/SourceBadgeIndicator.tsx` |

### Fontes de Dados
- `useMissionLens()` — next_best_action, context, mentor_signals
- `useCheckpoints()` — CRUD checkpoints (findInProgress, findBlocked, findNearestDeadline)
- `useCreateCheckpoint()` — criar checkpoint
- `useUpdateCheckpoint()` — atualizar checkpoint
- `useAppointments()` — compromissos do dia
- `useLiveStatus()` — live/offline
- `useDriftDetection()` — drift risk

### Estados
- Loading: `<LoadingState lines={8} />`
- Error: `<ErrorState title="Erro ao carregar Agora" onRetry={refetch} />`
- Empty: `<EmptyState title="Nenhum foco definido" description="Use /foco no Aurora para definir" />`

### Critérios de Aceite
- [ ] FocusCard mostra missão atual ou foco do dia
- [ ] NextActionCard mostra próxima ação concreta (não abstrata)
- [ ] CriticalAlertCard visível só quando há alertas críticos
- [ ] DeadlineCard com contagem regressiva e urgência (calm/soon/urgent)
- [ ] CheckpointCard com botão de retomar/salvar
- [ ] MiniAgenda mostra timeline do dia com horários
- [ ] SystemPulseStrip mostra saúde dos serviços
- [ ] DriftIndicator condicional
- [ ] ZombieBadge quando offline
- [ ] SourceBadge em dados mock/fallback
- [ ] Estados loading/error/empty implementados

---

## 3. Agenda (`/agenda`)

### Rota
- Arquivo: `src/routes/agenda.tsx`
- Componente: `AgendaView`

### Componentes Obrigatórios
| Componente | Arquivo |
|---|---|
| TodayExecutionPanel | `agenda/TodayExecutionPanel.tsx` |
| OverduePanel | `agenda/OverduePanel.tsx` |
| DeadlineRadar | `agenda/DeadlineRadar.tsx` |
| DoNotDoPanel | `agenda/DoNotDoPanel.tsx` |
| FinishLinePanel | `agenda/FinishLinePanel.tsx` |
| WeekDetailList | `agenda/WeekDetailList.tsx` |

### Fontes de Dados
- `useAppointments()` — compromissos
- `useCheckpoints()` — deadlines

### Critérios de Aceite
- [ ] Hoje visível com linha do tempo
- [ ] Itens atrasados em destaque (vermelho)
- [ ] Radar de prazos próximos (24h, 48h, 7d)
- [ ] Lista "Não Fazer Hoje"
- [ ] Visão da semana
- [ ] Estados loading/error/empty

---

## 4. Checkpoints (`/checkpoints`)

### Rota
- Arquivo: `src/routes/checkpoints.tsx`
- Componente: `CheckpointsView`

### Componentes Obrigatórios
| Componente | Arquivo |
|---|---|
| CheckpointTimeline | `checkpoints/CheckpointTimeline.tsx` |
| CheckpointItemCard | `checkpoints/CheckpointItemCard.tsx` |
| CheckpointResume | `checkpoints/CheckpointResume.tsx` |
| CheckpointSummaryCard | `checkpoints/CheckpointSummaryCard.tsx` |
| CheckpointFilterBar | `checkpoints/CheckpointFilterBar.tsx` |
| ResumeFromHereCard | `checkpoints/ResumeFromHereCard.tsx` |

### Fontes de Dados
- `useCheckpoints()` — lista completa
- `useCreateCheckpoint()` — criar
- `useUpdateCheckpoint()` — atualizar status
- `usePausedCheckpoints()` — checkpoints pausados
- `useResumeCheckpoint()` — retomar

### Critérios de Aceite
- [ ] Timeline vertical com status visual (done/in_progress/paused/blocked)
- [ ] Filtro por status e projeto
- [ ] Card de retomada do último checkpoint pausado
- [ ] Sumário de progresso (X/Y completos)
- [ ] CRUD funcional: criar, editar status, retomar
- [ ] Botão "Salvar Checkpoint" funcional
- [ ] Estados loading/error/empty

---

## 5. Projetos (`/projetos`)

### Rota
- Arquivo: `src/routes/projetos.tsx`
- Componente: `ProjetosView`

### Componentes Obrigatórios
| Componente | Arquivo |
|---|---|
| ProjectCard | `projetos/ProjectCard.tsx` |
| ProjectFilterBar | `projetos/ProjectFilterBar.tsx` |

### Fontes de Dados
- `useProjects()` — lista de projetos

### Critérios de Aceite
- [ ] Cards de projeto com nome, status, progresso
- [ ] Filtro por status (ativo/pausado/concluído)
- [ ] Progresso visual (barra ou ring)
- [ ] Estados loading/error/empty

---

## 6. Contexto (`/contexto`)

### Rota
- Arquivo: `src/routes/contexto.tsx`
- Componente: `ContextoView`

### Componentes Obrigatórios
| Componente | Arquivo |
|---|---|
| CurrentContextHero | `contexto/CurrentContextHero.tsx` |
| FocusDriftCard | `contexto/FocusDriftCard.tsx` |
| ActiveWindowCard | `contexto/ActiveWindowCard.tsx` |
| BrowserContextList | `contexto/BrowserContextList.tsx` |
| ContextReasonCard | `contexto/ContextReasonCard.tsx` |
| ContextActionStrip | `contexto/ContextActionStrip.tsx` |

### Fontes de Dados
- `useContexto()` — contexto atual
- `useDriftDetection()` — drift risk
- `useMissionLens()` — context data

### Critérios de Aceite
- [ ] Contexto atual visível com projeto e foco
- [ ] Drift detection com alerta visual
- [ ] Janela ativa (se disponível)
- [ ] Ações de contexto (mudar foco, reportar)
- [ ] Estados loading/error/empty

---

## 7. Sistema (`/sistema`)

### Rota
- Arquivo: `src/routes/sistema.tsx`
- Componente: `SistemaView`

### Componentes Obrigatórios
| Componente | Arquivo |
|---|---|
| SectionHeader | `base/SectionHeader.tsx` |
| StatusCard | `base/StatusCard.tsx` |
| LiveStatusIndicator | `base/LiveStatusIndicator.tsx` |
| ServiceHealthCard | `sistema/ServiceHealthCard.tsx` |
| OmnisServiceStatusCard | `sistema/OmnisServiceStatusCard.tsx` |
| OmnisCrewCard | `sistema/OmnisCrewCard.tsx` |
| OmnisJobItem | `sistema/OmnisJobItem.tsx` |
| SourceBadgeIndicator | `base/SourceBadgeIndicator.tsx` |

### Fontes de Dados
- `useServices()` — saúde dos serviços
- `useWorkerHealth()` — health do worker
- `useOmnisStatus()` — status OMNIS
- `useOmnisCrews()` — crews ativas
- `useOmnisJobs()` — jobs recentes (limit 5)
- `useOmnisConfig()` — configurado?
- `useGithubConfig()` — configurado?

### Estados (9 estados de LiveStatus)
live → degraded → reconnecting → cached → fallback → offline → loading → empty → error

### Critérios de Aceite
- [ ] LiveStatusIndicator com estado atual
- [ ] ServiceHealthCard para cada serviço
- [ ] OmnisServiceStatusCard (ou placeholder honesto se bloqueado)
- [ ] OmnisCrewCard com crews ativas
- [ ] OmnisJobItem com últimos 5 jobs
- [ ] SourceBadge em todos os dados
- [ ] Alerta quando OMNIS ou GitHub não configurados
- [ ] Estados loading/error/empty

---

## 8. Ilhas Dinâmicas (`/ilhas/$islandId`)

### Rota
- Arquivo: `src/routes/ilhas.$islandId.tsx`
- Carregamento: `React.lazy` + `Suspense`

### Ilhas Registradas

| islandId | Screen Component | Tema |
|---|---|---|
| `omnis-lab` | `OmnisLabScreen` | indigo (#7C3AED) |
| `agencia` | `AgenciaScreen` | orange (#F97316) |
| `akasha` | `AkashaScreen` | emerald (#059669) |
| `nimbus` | `NimbusScreen` | sky (#0EA5E9) |
| `arena` | `ArenaScreen` | rose (#E11D48) |
| `vila` | `VilaScreen` | green (#16A34A) |
| `forja` | `ForjaScreen` | red (#DC2626) |
| `observatorio` | `ObservatorioScreen` | indigo (#4F46E5) |
| `filosofia` | `FilosofiaScreen` | amber (#D97706) |
| `tesouro` | `TesouroScreen` | gold (#CA8A04) |

### Template Base (toda ilha segue)
```tsx
interface NomeScreenProps {
  isLoading?: boolean;
  error?: { message: string } | null;
  isEmpty?: boolean;
}

export function NomeScreen({ isLoading, error, isEmpty }: NomeScreenProps) {
  if (isLoading) return <LoadingState lines={5} />;
  if (error) return <ErrorState title="..." onRetry={() => {}} />;
  if (isEmpty) return <EmptyState title="..." />;

  return (
    <IslandPageFrame theme="...">
      <IslandPageHeader title="..." description="..." icon="..." onBack={...} />
      {/* Conteúdo específico da ilha */}
    </IslandPageFrame>
  );
}
```

### Critérios de Aceite (todas as ilhas)
- [ ] IslandPageFrame com top border na cor do tema
- [ ] IslandPageHeader com back button funcional
- [ ] Tema de cor correto (ver tabela acima)
- [ ] Estados loading/error/empty implementados
- [ ] Zero hex inline (tokens CSS via `var(--kr-island-*)`)
- [ ] Conteúdo específico da ilha renderizado

---

## 9. Regras Gerais para Todas as Telas

### Ordem de Estados (sempre)
```
1. isLoading === true  → LoadingState
2. error !== null      → ErrorState com onRetry
3. isEmpty === true    → EmptyState com descrição
4. Dados prontos       → Conteúdo real
```

### Source Badge (sempre)
Toda tela que consome API deve mostrar `SourceBadgeIndicator` com o source type:
- `"live"` — API real respondeu
- `"cache"` — dados cacheados
- `"mock"` — dados mock (dev)
- `"error"` — API falhou

### Neuro-UX (TDAH-first)
- Máximo 7±2 elementos de decisão visíveis
- 1 ação primária por tela
- Posições fixas (sem reordenação)
- Zero popups sem trigger explícito
- Cores vibrantes só para alertas críticos

### Responsividade
- Mobile 375px: verificar todas as telas
- Sidebar colapsa em mobile
- Cards empilham verticalmente
- Touch targets ≥ 44px
