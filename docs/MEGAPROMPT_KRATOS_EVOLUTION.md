# ╔══════════════════════════════════════════════════════════════════╗
# ║  KRATOS MISSION CONTROL — MEGA PROMPT DE EVOLUÇÃO               ║
# ║  Claude Code · Plan Mode · Waves Paralelas + Sequenciais        ║
# ║  Empresa Tigre · Lucas Tigre · Maio 2026                        ║
# ╚══════════════════════════════════════════════════════════════════╝

## INSTRUÇÃO PARA O CLAUDE CODE — LEIA ANTES DE TUDO

Você vai executar a evolução completa do KRATOS Mission Control.
O KRATOS existe, tem 126 componentes TSX, 16 hooks, 9 rotas, 10 schemas Zod.
**NÃO reescreva o que existe. Evolua sobre o que existe.**

### Regra de modelo (economia de crédito):
- **Plan mode (este arquivo):** claude-opus-4-5 — raciocinar a arquitetura
- **Execução (código):** claude-sonnet-4-6 — implementar
- **Arquivos repetitivos/CRUD:** claude-haiku-4-5 — gerar boilerplate
- **NUNCA:** opus em execução de código — waste puro

### Filosofia de execução:
- Waves sequenciais quando cada wave depende da anterior
- Blocos dentro da wave em paralelo quando independentes
- Commit ao final de cada wave — NUNCA commitar trabalho pela metade
- Testes antes do commit — se falhou, não commitou
- Se travar em um bloco: skip + TODO comment + continua próximo bloco

---

## ESTADO ATUAL DO KRATOS (contexto para o Claude)

```
Stack: React 19 · TanStack Start · TanStack Router · TanStack Query
       Tailwind v4 · Radix UI · shadcn/ui · Zod · Vite 7 · Bun
Build: Client + SSR — ZERO erros hoje
Componentes: 126 TSX em src/components/kratos/
Hooks: 16 custom hooks
Rotas: 9 (/, /agora, /agenda, /checkpoints, /projetos, /contexto, /sistema, /ilhas/:id)
Schemas Zod: 10 contratos de API
Skills CODEX: 22 instaladas
Status dos dados: MOCK — nenhuma rota consome API real ainda
Aurora: componente existe, sem integração real com OMNIS
OMNIS backend: 10 waves fechadas em omnis-control (LangGraph rodando)
```

**Gap crítico:** cockpit bonito sem dados reais. A fábrica tem painel, mas o painel não mostra o que a fábrica faz.

---

## MAPA DE WAVES — VISÃO GERAL

```
WAVE 1: API Layer Foundation          [SEQUENCIAL — base de tudo]
WAVE 2: Dados Reais nas Rotas         [PARALELO — rotas independentes]
WAVE 3: Aurora Real-Time              [SEQUENCIAL — depende W1+W2]
WAVE 4: Marketing Dashboard           [PARALELO — novo setor]
WAVE 5: SSE + WebSocket Live          [SEQUENCIAL — depende W1]
WAVE 6: Performance + PWA             [PARALELO — otimização]
WAVE 7: OMNIS Integration Bridge      [SEQUENCIAL — depende W1-W5]
WAVE 8: Deploy + Observability        [SEQUENCIAL — fecha tudo]
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 1 — API LAYER FOUNDATION
## Objetivo: criar a camada de comunicação KRATOS ↔ OMNIS
## Dependência: nenhuma — pode começar agora
## Duração estimada: 2-3h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W1-B1: API Client Base (EXECUTAR PRIMEIRO)
```typescript
// Criar: src/lib/api/client.ts
// O cliente HTTP central do KRATOS — fala com omnis-server

export const API_BASE = import.meta.env.VITE_OMNIS_API_URL ?? 'http://localhost:8001'

export interface ApiResponse<T> {
  data: T
  status: 'ok' | 'error'
  timestamp: string
  source: 'live' | 'cache' | 'mock'
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>>
export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>>
// Implementar com: fetch + timeout 10s + retry 3x com backoff exponencial
// Error handling: throw ApiError com status code + message
// Headers: Content-Type: application/json + X-Client: kratos-mission-control
```

### W1-B2: QueryClient Config (PARALELO com B1)
```typescript
// Criar: src/lib/api/queryClient.ts
// TanStack Query configurado para dados OMNIS

// Configurações:
// staleTime: 30s para dados de missão
// staleTime: 5min para dados de projeto
// staleTime: 10s para dados de health/sistema
// gcTime: 10min
// retry: 3 com exponential backoff
// refetchOnWindowFocus: false (evita spam de requests)
// refetchInterval: configurável por query
```

### W1-B3: Zod Schemas para API OMNIS (PARALELO com B1+B2)
```typescript
// Criar: src/lib/api/schemas/omnis.ts
// Contratos de dados do omnis-control

// Schemas a criar:
// MissionSchema — id, title, status, priority, agents, cost, created_at
// CheckpointSchema — id, mission_id, title, status, timestamp
// AuroraStateSchema — fio_mental, active_mission, cost_session, health
// SystemHealthSchema — status, uptime, missions_today, tokens_used, cost_usd
// SprintSchema — semana, tarefas[], agentes[], prioridade
// LeadSchema — empresa, tipo, status, score, valor_estimado
// ContentPipelineSchema — titulo, status, formato, paginas[], data_publicacao
// MetricsPageSchema — pagina, semana, alcance, engajamento, novos_seguidores

// Todos os schemas: Zod v3 strict + export de TypeScript types
```

### W1-B4: API Hooks Base (SEQUENCIAL após B1+B2+B3)
```typescript
// Criar: src/lib/api/hooks/
// useOmnisMission.ts    — TanStack Query wrapper para missões
// useAuroraState.ts     — estado da Aurora (poll 10s)
// useSystemHealth.ts    — health check (poll 30s)
// useSprint.ts          — sprint semanal atual
// useCrmLeads.ts        — leads do Notion CRM
// useContentPipeline.ts — pipeline de conteúdo
// usePageMetrics.ts     — métricas das 6 páginas

// Cada hook: useQuery com schema validation + loading/error states
// Todos expõem: { data, isLoading, isError, refetch, source }
```

### W1-B5: Mock Interceptor (PARALELO com B4)
```typescript
// Criar: src/lib/api/mockInterceptor.ts
// Quando OMNIS offline: retorna mock data com source: 'mock'
// Permite desenvolver KRATOS sem backend rodando
// Toggle: VITE_USE_MOCKS=true no .env.local
// Mock data realista: timestamps reais, dados que fazem sentido visualmente
```

### W1 DONE CRITERIA:
```bash
# Rodar antes do commit:
bun run typecheck   # zero erros TypeScript
bun run test        # todos os testes passando
bun run build       # build sem erros

# Validar manualmente:
# 1. Com VITE_USE_MOCKS=true: dados aparecem no console sem API
# 2. Com OMNIS rodando: apiGet('/health') retorna { status: 'ok' }

git commit -m "feat(api): W1 — api layer foundation + query client + zod schemas"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 2 — DADOS REAIS NAS ROTAS
## Objetivo: substituir mocks por dados reais em todas as 9 rotas
## Dependência: W1 completa
## BLOCOS EM PARALELO — trabalhar todas as rotas simultaneamente
## Duração estimada: 3-4h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W2-B1: Rota /agora — PARALELO
```typescript
// Editar: src/routes/agora.tsx
// Trocar mock por: useOmnisMission() + useAuroraState()
// Componentes afetados: FocusCard, NextActionCard, CriticalAlertCard
// FocusCard recebe: missão ativa do OMNIS com status real
// NextActionCard recebe: próximo nó do grafo LangGraph
// CriticalAlertCard: missões bloqueadas com >2h sem atualização
// Loading state: LoadingSkeleton durante fetch
// Error state: ErrorState com retry button + timestamp do último dado
// Source badge: SourceBadgeIndicator (live/cache/mock)
```

### W2-B2: Rota /checkpoints — PARALELO
```typescript
// Editar: src/routes/checkpoints.tsx
// Trocar mock por: useCheckpoints() do omnis-control
// Checkpoints são: waves completadas + commits + milestones
// Filtros: por missão, por status (done/pending/failed)
// Timeline view: ordenado por timestamp desc
// Cada checkpoint: título + commit hash + wave + timestamp + status badge
```

### W2-B3: Rota /projetos — PARALELO
```typescript
// Editar: src/routes/projetos.tsx
// Trocar mock por: useProjetos() — Projetos Mestres do Notion
// Dados: Casa Segura, Família Tigre, De Fracasso em Fracasso, OMNIS, KRATOS
// Status badge: Ativo/Morno/Fantasia/Morto com cores
// Card de projeto: nome + status + próximo_passo + squad + prazo
// Filtro por squad: Squad Instagram / Squad Comercial / Squad Growth
```

### W2-B4: Rota /agenda — PARALELO
```typescript
// Editar: src/routes/agenda.tsx
// Trocar mock por: Google Calendar MCP + Sprint Semanal Notion
// Calendário semanal: reuniões + deadlines de sprint
// Integração: se tarefa Sprint tem prazo → aparece na agenda
// View modes: semana / dia
// Indicadores: P1 (vermelho) / P2 (amarelo) / P3 (cinza)
```

### W2-B5: Rota /contexto — PARALELO
```typescript
// Editar: src/routes/contexto.tsx
// Trocar mock por: useAuroraState() fio_mental + Akasha context
// Fio mental: exibe o JSON state.json da Aurora como readable context
// Sessão atual: tokens usados + custo estimado + tempo de sessão
// Memória recente: últimas 10 entradas do Akasha
// Status do grafo: nós ativos, nós bloqueados
```

### W2-B6: Rota /sistema — PARALELO
```typescript
// Editar: src/routes/sistema.tsx
// Trocar mock por: useSystemHealth() — health de todo o OMNIS
// Componentes: status de cada serviço (OMNIS API, Notion MCP, Slack, etc.)
// Métricas: uptime, missões hoje, tokens hoje, custo hoje
// Alertas: serviços degradados com timestamp
// Live: poll a cada 30s com LiveStatusIndicator
```

### W2-B7: Rota /ilhas/:islandId — PARALELO
```typescript
// Editar: src/routes/ilhas.$islandId.tsx
// Cada ilha = um domínio do OMNIS
// ilha 'marketing'  → dados do setor marketing (pipeline, CRM, métricas)
// ilha 'omnis'      → estado do grafo LangGraph
// ilha 'akasha'     → memória e contexto
// ilha 'kratos'     → este próprio sistema
// ilha 'aurora'     → histórico de conversas + comandos
// Lazy loading: cada ilha só carrega seus dados quando acessada
```

### W2 DONE CRITERIA:
```bash
bun run typecheck && bun run test && bun run build

# Validação manual em cada rota:
# 1. Com mock: dados aparecem sem API
# 2. Com OMNIS: dados reais chegam, SourceBadge mostra 'live'
# 3. Offline: ErrorState aparece com timestamp do cache

git commit -m "feat(routes): W2 — dados reais em todas as 9 rotas + loading/error states"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 3 — AURORA REAL-TIME
## Objetivo: Aurora funcionando como interface real do OMNIS
## Dependência: W1 + W2 completas
## SEQUENCIAL internamente
## Duração estimada: 4-5h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W3-B1: Aurora Chat Engine
```typescript
// Editar: src/components/kratos/aurora/AuroraChatPanel.tsx
// Trocar mock por: chamada real ao OMNIS via POST /aurora/chat
// Streaming: SSE ou polling de 500ms para resposta progressiva
// Histórico: últimas 20 mensagens no localStorage + sessão no Akasha
// Modelo usado: mostrar qual modelo respondeu (haiku/sonnet)
// Custo da mensagem: mostrar tokens + $USD estimado
// Typing indicator: animação de "Aurora está pensando..."
```

### W3-B2: Aurora Command Parser
```typescript
// Criar: src/lib/aurora/commandParser.ts
// Comandos que Aurora reconhece e executa diretamente no KRATOS:
// /missão <descrição>     → cria missão no OMNIS
// /sprint                 → mostra sprint atual
// /lead <mensagem>        → processa lead via SDR IA
// /conteúdo <tema> <page> → inicia produção de conteúdo
// /status                 → health check do sistema
// /métricas               → abre Performance das 6 Páginas
// Cada comando: parser + validação Zod + chamada API + feedback visual
```

### W3-B3: Aurora Orb State Machine
```typescript
// Editar: src/components/kratos/aurora/AuroraOrb.tsx
// Usar XState v5 para estados do orb:
// idle       → orb pulsando suave (azul)
// listening  → orb expandindo (verde)
// thinking   → orb girando (roxo)
// speaking   → orb pulsando rápido (branco)
// error      → orb vermelho
// offline    → orb cinza
// Transições: driven by Aurora state from useAuroraState()
```

### W3-B4: Aurora Fio Mental Visualizer
```typescript
// Criar: src/components/kratos/aurora/FioMentalPanel.tsx
// Exibe o estado interno da Aurora (aurora_fio_mental state.json)
// Campos: active_mission, foco_atual, contexto_relevante, proxima_acao
// Visual: timeline de pensamentos + missão ativa destacada
// Atualiza: a cada 10s ou quando Aurora responde
// Localização: AuroraPanel direito do KRATOS (já existe o slot)
```

### W3-B5: Aurora Voice Input (optional, não bloqueia)
```typescript
// Criar: src/components/kratos/aurora/AuroraVoiceInput.tsx
// Web Speech API para input de voz
// Fallback: texto se API não disponível
// Ativa: pressionar Espaço enquanto foco no AuroraChatPanel
// Visual: wave animation enquanto escuta
// TODO se API não suportada: mostra mensagem + input texto
```

### W3 DONE CRITERIA:
```bash
bun run typecheck && bun run test && bun run build

# Validação manual:
# 1. "Aurora, qual o status do OMNIS?" → resposta real em <3s
# 2. /sprint → exibe sprint atual do Notion
# 3. /missão "criar 5 posts para Casa Segura" → missão aparece no OMNIS
# 4. Orb muda estado corretamente (idle → thinking → speaking)
# 5. Fio Mental exibe estado real da última sessão

git commit -m "feat(aurora): W3 — aurora real-time: chat + commands + orb state + fio mental"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 4 — MARKETING DASHBOARD
## Objetivo: ilha 'marketing' com dados reais das 6 páginas
## Dependência: W1 + W2 completas (W3 pode estar em paralelo)
## BLOCOS EM PARALELO
## Duração estimada: 3-4h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W4-B1: Marketing Island Home
```typescript
// Criar: src/components/kratos/islands/MarketingIsland.tsx
// Overview do setor de marketing:
// — 6 cards de página (uma por página Instagram)
// — cada card: nome + seguidores + engajamento rate + trend (↑↓)
// — Sprint semanal ativo: tarefas + agentes + status
// — Pipeline resumo: quantos posts em cada status
// — Leads hoje: quantos chegaram + quantos qualificados
// Dados via: usePageMetrics() + useSprint() + useContentPipeline() + useCrmLeads()
```

### W4-B2: Pipeline Board (Kanban)
```typescript
// Criar: src/components/kratos/islands/marketing/PipelineBoard.tsx
// Kanban visual do Pipeline de Conteúdo:
// Colunas: Ideia | Em Produção | Revisão | Aprovado Lucas | Agendado | Publicado
// Cards: título + formato badge (Reel/Post/Carrossel) + página badge + data
// Arrastar: apenas visual (não conecta ao Notion ainda — W7)
// Filtros: por página, por formato, por agente
// Contadores por coluna: número de itens
```

### W4-B3: CRM Board
```typescript
// Criar: src/components/kratos/islands/marketing/CrmBoard.tsx
// Visão do CRM de Leads:
// Colunas: Novo | Qualificado | Proposta | Negociação | Fechado | Perdido
// Cards: empresa + tipo badge + score (1-10) + valor estimado + páginas
// Destaque: leads quentes (score >=7) com borda vermelha pulsante
// Métrica topo: total pipeline $ estimado
// Ação: click no card → modal com detalhes + histórico
```

### W4-B4: Performance Charts
```typescript
// Criar: src/components/kratos/islands/marketing/PerformanceCharts.tsx
// Gráficos de performance das 6 páginas:
// LineChart: engajamento rate por semana (últimas 8 semanas)
// BarChart: novos seguidores por página por semana
// PieChart: distribuição de formato (Reel vs Post vs Carrossel)
// Usar: recharts ou Victory (já na stack)
// Período: filtro 7d / 30d / 90d
// Top performer badge: página com melhor engajamento da semana
```

### W4 DONE CRITERIA:
```bash
bun run typecheck && bun run test && bun run build

# Validar: /ilhas/marketing mostra dados reais
# Pipeline board com cards reais do Notion
# CRM com leads reais
# Charts com dados das últimas 4 semanas

git commit -m "feat(islands): W4 — marketing island: pipeline board + crm + performance charts"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 5 — SSE + WEBSOCKET LIVE DATA
## Objetivo: dados em tempo real sem polling manual
## Dependência: W1 completa + omnis-server com SSE ativo
## SEQUENCIAL
## Duração estimada: 3h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W5-B1: SSE Client
```typescript
// Criar: src/lib/realtime/sseClient.ts
// Conecta ao endpoint: GET /events (omnis-server SSE)
// Eventos recebidos:
// 'mission:update'     → atualiza missão no TanStack Query cache
// 'aurora:response'    → exibe resposta da Aurora progressivamente
// 'health:alert'       → mostra alerta de sistema
// 'sprint:task:done'   → marca tarefa do sprint como concluída
// 'lead:new'           → notificação de novo lead (toast)
// Reconexão: automática com backoff se SSE cair
// LiveStatusIndicator: atualiza baseado no estado da conexão SSE
```

### W5-B2: Real-time Toast System
```typescript
// Criar: src/lib/realtime/toastManager.ts
// Notificações baseadas em eventos SSE:
// 🔥 Lead quente → toast vermelho 10s
// ✅ Missão concluída → toast verde 5s
// ⚠️  Sistema degradado → toast amarelo persist
// 📊 Métricas atualizadas → toast silencioso (só badge)
// Posição: top-right, max 3 simultâneos, fila os demais
```

### W5-B3: Optimistic Updates
```typescript
// Editar: hooks que fazem mutação (criar missão, atualizar lead, etc.)
// Implementar optimistic update pattern do TanStack Query:
// — ao criar missão: aparece instantaneamente no UI antes da API confirmar
// — ao marcar tarefa: muda status imediato + rollback se API falhar
// — ao aprovar conteúdo: muda Kanban card imediatamente
```

### W5 DONE CRITERIA:
```bash
# Teste manual:
# 1. Com OMNIS rodando: criar uma missão → KRATOS atualiza em <1s sem reload
# 2. SSE cai (mata o servidor): LiveStatusIndicator mostra 'degraded'
# 3. SSE reconecta: volta para 'live' automaticamente
# 4. Lead novo chega: toast aparece no KRATOS em <2s

git commit -m "feat(realtime): W5 — SSE client + toast system + optimistic updates"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 6 — PERFORMANCE + PWA
## Objetivo: KRATOS rápido, instalável e funcional offline
## Dependência: W1-W5 completas
## BLOCOS EM PARALELO
## Duração estimada: 2h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W6-B1: Code Splitting + Lazy Loading (PARALELO)
```typescript
// Lazy load todas as ilhas: import('./islands/MarketingIsland')
// Suspense boundaries em cada rota com LoadingSkeleton fallback
// Prefetch: ilhas /agora e /checkpoints (mais acessadas) no hover
// Target: bundle main < 200KB gzip
// Verificar: bun run build + analyze bundle (vite-bundle-visualizer)
```

### W6-B2: PWA Setup (PARALELO)
```typescript
// Instalar: vite-plugin-pwa
// Configurar: manifest.json (nome, ícones, cores KRATOS)
// Service Worker: cache das rotas estáticas
// Offline fallback: mostra última versão cached + OfflineState banner
// Install prompt: após 3 visitas, prompt suave de instalação
```

### W6-B3: Image + 3D Optimization (PARALELO)
```typescript
// Otimizar assets do mundo 3D (Three.js/R3F):
// — LOD para ilhas distantes
// — Suspense com fallback 2D para GPUs lentas
// — Reduzir shadow map resolution em mobile
// — Lazy load Three.js (>500KB) separado do bundle principal
```

### W6 DONE CRITERIA:
```bash
# Lighthouse score: Performance > 90, PWA > 90
# First Contentful Paint < 1.5s
# Install KRATOS como PWA e testar offline

git commit -m "perf(kratos): W6 — code splitting + PWA + 3D optimization"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 7 — OMNIS INTEGRATION BRIDGE (BIDIRECIONAL)
## Objetivo: KRATOS não só lê, mas COMANDA o OMNIS
## Dependência: W1-W6 completas
## SEQUENCIAL
## Duração estimada: 4h
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> ⚠️ **NOTA DE ARQUITETURA (adicionada após execução):**
> W7 foi implementada como **Read-Only** por decisão explícita do Lucas Tigre.
> Boundary: "KRATOS lê, Aurora comanda."
> MissionEventLogCard + /missions/{id}/events = entregue.
> W7-B1 através B4 (bidirecional) = BLOQUEADO.
> Toda ação de comando vai pela Aurora (⌘K), nunca por botões no KRATOS.

### W7-B1: Mission Creator from KRATOS
```typescript
// ⚠️ BLOQUEADO — ver nota de arquitetura acima
// Criar: src/components/kratos/missions/MissionCreator.tsx
// Modal para criar missão diretamente no KRATOS:
// — Título + descrição + prioridade + squad + deadline
// — Preview de custo estimado antes de enviar
// — Validação Zod antes de POST /missions
// — Feedback: missão criada → aparece em /agora em <2s (via SSE)
```

### W7-B2: Sprint Actions
```typescript
// ⚠️ BLOQUEADO — ver nota de arquitetura acima
// Editar: componentes de sprint em /agora e /ilhas/marketing
// Ações agora funcionais:
// — Marcar tarefa como concluída → PUT /sprint/tasks/:id
// — Mover tarefa para Bloqueado → nota obrigatória de bloqueio
// — Reordenar por drag (otimista) → PATCH /sprint/tasks/reorder
// — Adicionar nova tarefa ao sprint → POST /sprint/tasks
```

### W7-B3: Lead Actions from CRM Board
```typescript
// ⚠️ BLOQUEADO — ver nota de arquitetura acima
// Editar: CrmBoard.tsx (W4-B3)
// Ações agora funcionais:
// — Atualizar status do lead → PATCH /crm/leads/:id
// — Marcar mídia kit enviado → toggle checkbox
// — Agenda follow-up → cria evento no Google Calendar via MCP
// — Abrir email de proposta → abre Gmail com template preenchido
```

### W7-B4: Content Approval Flow
```typescript
// ⚠️ BLOQUEADO — ver nota de arquitetura acima
// Editar: PipelineBoard.tsx (W4-B2)
// Ações de aprovação:
// — Lucas clica "Aprovar" em card → PATCH /content/:id status=Aprovado Lucas
// — Lucas clica "Solicitar ajuste" → abre textarea + POST comentário
// — Card vai para "Agendado" → data selecionada + POST /content/:id/schedule
```

### W7 DONE CRITERIA:
```bash
# ✅ ENTREGUE (versão read-only):
# MissionEventLogCard — event timeline drill-down
# GET /missions/{id}/events backend endpoint
# MissionEventSchema + MissionEventLogSchema (api-contract/)
# useMissionEvents hook (staleTime 15s, refetchInterval 30s)
# OmnisLabScreen seção 3e — auto-seleciona missão running

git commit -m "feat(W7): MissionEventLogCard — event timeline read-only"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 8 — DEPLOY + OBSERVABILITY
## Objetivo: KRATOS em produção + monitorado
## Dependência: W1-W7 completas
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### W8-B1: Vercel Deploy (SEQUENCIAL)
```bash
# ⚠️ REQUER AUTORIZAÇÃO EXPLÍCITA DO LUCAS
# Nenhum agente, skill ou workflow pode executar wrangler deploy

# vercel.json configurado:
# — routes: SPA fallback + SSR routes
# — env vars: VITE_OMNIS_API_URL apontando para omnis-server
# — preview: branch feature/* → preview URL automática
# — production: merge em main → deploy automático

# Variáveis de ambiente Vercel:
# VITE_OMNIS_API_URL=https://omnis-api.empresa-tigre.com
# VITE_USE_MOCKS=false
```

### W8-B2: Error Tracking
```typescript
// ✅ ENTREGUE (sem Sentry SDK):
// src/lib/analytics/errorHandler.ts
// installGlobalErrorHandlers() — window.onerror + onunhandledrejection
// Ring buffer 20 erros para diagnóstico (getErrorLog())
// Encaminha para trackErrorBoundary() automaticamente
// SSR safe (typeof window guard)
```

### W8-B3: Analytics
```typescript
// ✅ ENTREGUE:
// src/lib/analytics/kratosAnalytics.ts
// 5 eventos: route_view, aurora_command, optimistic_create,
//            sse_disconnect, error_boundary
// Buffer em memória, flush a cada 10s ou pagehide
// VITE_ANALYTICS_ENDPOINT para forward a Plausible/PostHog
// Dev: console.debug apenas
// Wired: __root.tsx (route_view) + AuroraCommandPalette (aurora_command)
```

### W8 DONE CRITERIA:
```bash
# Quando W8-B1 autorizado:
git tag -a "kratos-v2.0" -m "KRATOS v2.0 — dados reais + aurora + marketing + deploy"
git push origin main --tags
```

---

## CHECKLIST FINAL DE TODAS AS WAVES

```
WAVE 1 — API Layer
  [x] B1 client        src/lib/api/client.ts
  [x] B2 queryClient   src/lib/api/queryClient.ts
  [x] B3 schemas       api-contract/ (missions, omnis, checkpoint, project, appointment...)
  [x] B4 hooks         16 hooks todos usando apiGet
  [x] B5 mock          VITE_USE_MOCKS=true, 8 endpoints, prefix matching

WAVE 2 — Dados Reais
  [x] B1 /agora        useMissionLens + useDriftDetection + useAppointments
  [x] B2 /checkpoints  useCheckpoints
  [x] B3 /projetos     useProjects
  [x] B4 /agenda       useAppointments + useCheckpointSuggestion
  [x] B5 /contexto     useContextSnapshot + useContextoMissionSnapshot
  [x] B6 /sistema      useOmnis* (status + crews + jobs + config)
  [x] B7 /ilhas        lazy load + 12 island screens com dados reais

WAVE 3 — Aurora Real-Time
  [x] B2 commands      AuroraCommandPalette ⌘K — 6 comandos com navegação
  [x] B3 orb           5 estados visuais: idle/live/thinking/degraded/offline
  [x] B4 fio mental    FioMentalPanel — missões running/paused read-only
  [-] B1 chat          backend só tem GET /aurora/insight (sem POST /chat)
  [-] B5 voice         opcional, fora de escopo

WAVE 4 — Marketing Dashboard
  [x] AgenciaScreen    limpa (-63% dead code), honest locked states
  [-] PipelineBoard    META_APP_ID/SECRET pendente
  [-] CrmBoard         crm-tigre-backend unhealthy

WAVE 5 — SSE Live
  [x] B1 SSE client    useLiveStatus — EventSource, reconexão automática
  [x] B2 toasts        useSSEToasts — guardrails + missões via sonner
  [x] B3 optimistic    onMutate/rollback em 6 mutations (checkpoint/project/appointment)

WAVE 6 — Performance + PWA
  [x] B1 code split    lazy islands em ilhas.$islandId.tsx
  [x] B2 PWA           manifest.webmanifest + meta tags (service worker N/A em CF Workers)
  [-] B3 3D            sem Three.js na stack atual

WAVE 7 — Integration Bridge
  [x] Read-only        MissionEventLogCard + /missions/{id}/events (backend)
  [x] Boundary doc     "KRATOS lê, Aurora comanda" preservado
  [-] Bidirecional     BLOQUEADO por decisão arquitetural

WAVE 8 — Deploy + Observability
  [x] B2 error handler installGlobalErrorHandlers() ring buffer 20 erros
  [x] B3 analytics     kratosAnalytics.ts — 5 eventos, buffer+flush, pronto p/ Plausible
  [-] B1 deploy        REQUER AUTORIZAÇÃO EXPLÍCITA DO LUCAS
```

---

## STATUS DA BRANCH

```
Branch: feature/fase14-integration
Commits: 11
Build: ✅ zero erros (client + SSR)
Tests: 270 pass (baseline pré-sprint: 268)
```

---

*KRATOS Evolution Mega Prompt v1.0 — Empresa Tigre · Lucas Tigre · Maio 2026*
*Modelo execução: claude-sonnet-4-6 | Modelo boilerplate: claude-haiku-4-5*
*NUNCA opus em execução de código — ROI zero*
*Última execução: 2026-05-27 | Branch: feature/fase14-integration*
