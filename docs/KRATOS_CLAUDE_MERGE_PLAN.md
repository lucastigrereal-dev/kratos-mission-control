# KRATOS CLAUDE.md Merge Plan

**Data:** 2026-05-16
**Origem:** CLAUDE.md do pacote (`kratos-claude-pack.zip`)
**Destino:** `CLAUDE.md` na raiz de `kratos-mission-control`
**Status:** NÃO COPIAR DIRETO. Fazer merge manual.

---

## 1. O que o Pacote Acerta (aproveitar estrutura)

O CLAUDE.md do pacote está bem escrito e cobre:

- Stack declarada corretamente ✅
- 7 rotas mapeadas com propósito ✅
- Arquitetura de diretórios documentada ✅
- Regras de ouro (routeTree.gen.ts nunca editar) ✅
- Definition of Done ✅
- Convenções claras (TypeScript, componentes, rotas, API) ✅

**Seções que podem ser copiadas quase integralmente:**
- "Missão do Produto" (adaptar)
- "Convenções de Código" (adicionar contexto real)
- "Regras de Ouro" (adicionar regras específicas do projeto)
- "Critério de Pronto" (adicionar verificações visuais)

---

## 2. O que o Pacote NÃO Sabe (contexto real do projeto)

### 2.1 Mundo 3D de Ilhas (ausente no pacote)
O projeto tem um sistema visual completo que o pacote ignora:
```
src/components/kratos/shell/   — Topbar, Sidebar, StatusBar, AuroraPanel, AppShell
src/components/kratos/icons/   — KratosLogo
src/components/kratos/views/   — AgendaView, AgoraView, CheckpointsView, ContextoView, PlaceholderRoute
```
Estes componentes NÃO seguem o template simples do pacote. São componentes ricos com:
- Glass panels (glassmorphism)
- CSS tokens customizados (`var(--kr-*)`)
- Sistema de ilhas (KratosWorldMap, FloatingIsland — mencionados nas skills existentes)

### 2.2 Design System KRATOS (ausente no pacote)
O pacote menciona Tailwind v4 genérico. O projeto real tem:
- `src/styles.css` — 11.025 bytes de tokens customizados
- Tokens: `--kr-glass-*`, `--kr-space-*`, `--kr-text-*`, `--kr-bg-*`, `--kr-island-*`, `--kr-duration-*`, `--kr-ease-*`, `--kr-earth-*`, `--kr-castle-*`
- Sistema de cores semânticas: `--kr-color-aurora`, `--kr-color-energy`, `--kr-color-xp`, `--kr-color-mission`
- Classes utilitárias: `.glass-panel`, `.kr-card`, `.kr-chip`

### 2.3 Neuro-UX TDAH (ausente no pacote)
O projeto tem princípios de UX específicos para TDAH que o pacote não conhece:
- Máximo 7±2 elementos de decisão por tela
- Próxima ação é o elemento mais proeminente
- Posição fixa de componentes (spatial memory)
- 4 tiers de foco (Ambient, Nudge, Block, Restore)
- Animações controladas, sem loops infinitos
- `prefers-reduced-motion` obrigatório

### 2.4 Componentes Reais (muito além do template)
O pacote propõe um template simples de componente. A realidade:

| Domínio | Componentes reais |
|---|---|
| `agenda/` | DeadlineRadar, DoNotDoPanel, FinishLinePanel, OverduePanel, TodayExecutionPanel, WeekDetailList |
| `agora/` | AuroraShortcutCard, CheckpointCard, CriticalAlertCard, DeadlineCard, FocusCard, MiniAgenda, NextActionCard, SystemPulseStrip |
| `aurora/` | AuroraInputMock, AuroraMessagePreview, AuroraPanelContent, AuroraQuickActions |
| `base/` | AlertBadge, EmptyState, ErrorState, LiveStatusIndicator, LoadingState, SectionHeader, StatusCard, StatusDot, SystemCard |
| `checkpoints/` | CheckpointFilterBar, CheckpointItemCard, CheckpointSummaryCard, CheckpointTimeline, ResumeFromHereCard |
| `contexto/` | ActiveWindowCard, BrowserContextList, ContextActionStrip, ContextReasonCard, CurrentContextHero, FocusDriftCard |
| `mentor/` | ExecutionScoreCard, MentorRecommendationCard, RiskProjectCard |

**Total: ~40 componentes já implementados.**

### 2.5 Duas Estruturas de Frontend
O projeto tem DUAS estruturas:
1. `src/` — TanStack Start (routes, server.ts, start.ts, router.tsx)
2. `frontend/` — Outro setup Vite com seu próprio `package.json`, `vite.config.ts`, `vitest.config.ts`

O pacote assume uma única estrutura em `src/`.

### 2.6 Skills Existentes (10 skills vivas)
O pacote não referencia nenhuma das 10 skills do projeto:
- `akasha-vault-builder` (placeholder)
- `glass-panel-builder` (core, ativo)
- `hud-assembler` (core, ativo, 6 protected components)
- `island-composer` (core, ativo, 6 protected components)
- `kimi-to-code` (core, ativo, 5 protected endpoints)
- `motion-guardian` (analytics, ativo)
- `neuro-ux-checker` (analytics, ativo)
- `omnis-lab-builder` (placeholder)
- `token-enforcer` (strategy, ativo)
- `visual-qa-kimi` (analytics, ativo)

---

## 3. Plano de Merge — O que Entra Onde

### 3.1 Seção: Missão do Produto
**Manter do pacote:** estrutura de tabela com rotas e propósitos
**Adicionar do contexto real:**
- Menção ao mundo 3D de ilhas como metáfora visual
- Design system próprio (KRATOS tokens)
- Princípios neuro-UX TDAH
- Relação com Akasha (memória) e Omnis (execução)

### 3.2 Seção: Arquitetura do Projeto
**Manter do pacote:** estrutura base de diretórios
**Corrigir com realidade:**
- `src/components/kratos/` tem 12 subpastas, não é flat
- `src/components/ui/` tem 47 componentes shadcn/ui
- `frontend/` existe como estrutura separada
- Listar skills existentes em `.claude/skills/`
- Listar agentes em `.claude/agents/`

### 3.3 Seção: Convenções de Código (adicionar)
**Adicionar subseções que o pacote não tem:**

```markdown
### Design System
- CSS custom properties obrigatórios: `var(--kr-*)` para cores, espaçamento, tipografia
- Nunca `style={{ color: "#..." }}` — usar tokens
- Glass panels via classe `.glass-panel` ou tokens `var(--kr-glass-*)`
- Animações com `var(--kr-duration-*)` e `var(--kr-ease-*)`
- `prefers-reduced-motion: reduce` desliga TODA animação

### Neuro-UX (TDAH-first)
- Máximo 7±2 elementos de decisão por tela
- 1 ação primária por tela — a mais proeminente visualmente
- Posições fixas (spatial memory) — componentes não reordenam
- Zero popups sem trigger explícito do usuário
- Loading, Empty, Error states obrigatórios em toda tela
- Fallback visual quando backend offline

### Componentes Protegidos
NUNCA recriar estes componentes sem autorização explícita:
- KratosVisualShell.tsx, KratosWorldMap.tsx
- Layout.tsx (orquestrador de dados)
- FloatingIsland.tsx, CentralCastleIsland.tsx
- src/styles.css (tokens)
- src/routeTree.gen.ts (auto-gerado)
```

### 3.4 Seção: Regras de Ouro (expandir)
**Manter do pacote:** regras 1-8
**Adicionar:**
```
9. Usar useApi<T>() para fetch — nunca fetch() raw com useEffect
10. Tokens CSS sempre — cores hex inline são bloqueadas
11. Protected components e endpoints são read-only
12. Backend offline não quebra frontend — sempre ter fallback
13. Animações desligam com prefers-reduced-motion
14. Mobile 375px e dark mode verificados antes de commit
```

### 3.5 Seção: Definition of Done (expandir)
**Manter checklist do pacote.**
**Adicionar verificações visuais:**
```
- [ ] Nenhum style={{ color: "#..." }} no diff
- [ ] Glass panels renderizando correto
- [ ] SourceBadge indica fonte real dos dados
- [ ] prefers-reduced-motion testado
- [ ] Console do navegador sem erros
```

### 3.6 Seção: Paralelização (condicionar)
**Manter estrutura do pacote**, mas adicionar aviso:
```
⚠️ Worktrees só após:
1. Auditoria aprovada
2. Lint/build 100% limpos
3. Abrir NO MÁXIMO 2 por vez (não 5)

Ordem segura: data-layer → api-routes → ui-pages
Auth e Deploy exigem autorização explícita.
```

### 3.7 NOVA Seção: Contexto de Produto (TDAH)
**Adicionar seção inexistente no pacote:**
```markdown
## Contexto de Produto (TDAH)
- Lucas tem TDAH — foco visual claro, sem ruído
- Cada tela: UMA ação primária óbvia
- Checkpoints visuais > dados brutos
- Tom da UI: operacional, focado, sem frescura
- Referência: Linear + Vercel Dashboard
- Mundo 3D de ilhas = metáfora de territórios de controle
```

### 3.8 NOVA Seção: Integrações
```markdown
## Integrações Externas
| Sistema | Propósito | Status |
|---|---|---|
| Akasha | Memória vetorial (pgvector) | Backend existe, UI placeholder |
| Omnis | Execução de skills/crews | Backend existe, UI placeholder |
| GitHub | Status de repositórios | Planejado |
```

---

## 4. Tabela de Decisão Final

| Item | Ação | Risco |
|---|---|---|
| Stack, rotas, arquitetura base | Copiar do pacote, adaptar | Baixo |
| Convenções de TypeScript | Copiar do pacote | Baixo |
| Convenções de Rotas | Copiar do pacote | Baixo |
| Convenções de Estado/Dados | Copiar do pacote | Baixo |
| Design System | Escrever do zero (projeto real) | — |
| Neuro-UX TDAH | Escrever do zero (projeto real) | — |
| Protected Components | Escrever do zero (projeto real) | — |
| DoD | Merge: pacote + verificações visuais | Baixo |
| Paralelização | Pacote com ressalvas de segurança | Médio |
| Integrações | Escrever do zero (projeto real) | — |
| Skills existentes | Listar as 10 skills atuais | Baixo |
| Agentes | Listar os 5 agentes novos | Baixo |

---

## 5. Próximo Passo

1. Lucas aprova este merge plan
2. Claude Code escreve o `CLAUDE.md` final na raiz do projeto
3. Commit com mensagem: `docs(kratos): merge CLAUDE.md from audited pack with real project context`
