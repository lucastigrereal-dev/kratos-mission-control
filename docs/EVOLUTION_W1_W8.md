# KRATOS — Evolution W1→W8
**Gerado:** 2026-05-27

---

## Contexto de waves

O histórico do KRATOS tem **dois sistemas de numeração** que coexistem no git log:

- **Wave "clássicas" (Wave 01–30):** sprint funcional de ~2026-05-08 a 2026-05-17 — construção das 7 telas, design system, API layer, testes
- **Waves "fase 14" (W1–W8+):** sprint de integração OMNIS ativo em 2026-05-27 — wiring de dados reais, anti-teatro, SSE, PWA, analytics

Este documento foca nas **Waves W1–W8 da Fase 14** (commit 9c685b4 até 13ed93c), que representam a evolução mais recente e operacionalmente relevante.

---

## Linha do tempo — Waves W1–W8 (Fase 14, 2026-05-27)

| Wave | Hash | Descrição | Decisões-chave |
|---|---|---|---|
| W1 | 9c685b4 | API layer foundation — centralized client + queryClient + 10 hooks migrated | Cliente `apiGet()` centralizado; `useApi<T>()` como padrão único; eliminação de `fetch()` raw em componentes |
| W2 | 48b2a99 | WorldRightPanel agenda — real appointments from store, EmptyState honesto | Dados reais de compromissos no painel do mundo; EmptyState para zero appointments |
| W3 | 8adf4cd | Aurora command palette integrada — AuroraInputMock removido | `AuroraInputMock` removido (anti-teatro); `AuroraCommandPalette` conectada |
| W3+W5 | d786503 | AuroraOrb states + FioMental + optimistic updates | `FioMentalPanel` conectado ao `state.json` do OMNIS; optimistic updates em checkpoints |
| W4 | c913556 | AgenciaScreen — dead mock code removido, locked cards honestos | Política anti-teatro consolidada; cards com mock declarado explicitamente |
| W4+W5 | 4eefc25 | Anti-teatro confirmado — fio_mental+tom reais via state.json | `fio_mental` e `tom` lidos diretamente do `state.json` OMNIS, sem hardcode |
| W5 | b6d5362 | SSE live data + toast system | `useSSEToasts` + Sonner toasts para eventos críticos; boundary "KRATOS lê, Aurora comanda" formalizada |
| W6 | c0f8968 | PWA manifest + meta tags + chunk warning suprimido | Service Worker básico; manifest.json; chunks Vite otimizados |
| W6 | d260a8a | Code splitting + PWA offline banner + install prompt | `useOffline` + `OfflineBanner`; `usePWAInstall` com threshold 3 visitas; lazy loading de rotas |
| W7 | c07dbaa | MissionEventLogCard — event timeline read-only | Log de eventos de missão lido do OMNIS; **W7 bidirecional BLOQUEADO** — KRATOS nunca comanda OMNIS |
| W7+W8 | 99b82a6 | GuardrailAlertCard + CostSummaryCard — dado real do OMNIS | Alertas de guardrail e custo LLM lidos do OMNIS health endpoint |
| W8-B2/B3 | 13ed93c | Analytics + error handler | `kratosAnalytics.ts` + `errorHandler.ts`; tracking de route views; global error boundary |
| W1-B5 | c3f9f95 | Mock interceptor — VITE_USE_MOCKS para dev offline | Interceptor global de mocks via env var; desenvolvimento sem backend disponível |

---

## Contexto histórico — Sprint funcional (Wave 01–30, 2026-05-08→17)

| Período | Hash range | Marcos |
|---|---|---|
| Fundação (Wave 01–05) | ba20ba6→60a5881 | Template TanStack Start; 7 rotas base; design tokens `--kr-*`; shadcn/ui 47 componentes |
| Telas (Wave 06–15) | c8fb052→9cbc21a | Persistência SQLite; source badges; provider timeout/retry policy; contexto + dashboard snapshots |
| Sprint A (Wave 16–30) | 33cb2ed→0867a8e | API contracts; omnis/github read-only providers; snapshot hardening; CI com timeout+cache |
| Sprint B (Wave B01–B40) | 3dd0320→5378d81 | Hooks conectados; source badge metadata; GitHub config; OMNIS health hooks; regression suite |
| Sprint C | 9bc9378→a910e69 | Playwright e2e foundation; visual polish; release candidate audit |
| 3D World (kratos-3d) | 25609d7→bc2467e | PACK 1–10: mundo pseudo-3D; ilhas flutuantes; Aurora holográfica; 11 telas de ilha |
| Fase 14 prep | 3653cdc→e32e8a3 | 8 commands + 11 skills CODEX; HealthScoreCard; MissionRunsCard; ContentDraftsCard |

---

## Decisões de arquitetura permanentes

1. **Boundary "KRATOS lê, Aurora comanda"** — estabelecida em W5 (b6d5362)
   - KRATOS é cockpit de visualização. NUNCA envia comandos ao OMNIS, nunca escreve na Akasha.
   - `useSSEToasts` é read-only por definição. `MissionEventLogCard` é read-only por design.

2. **Anti-freeze rule** — estabelecida pós-W8 (5398015)
   - Todos os testes com `timeout: 30000` + `mock-fetch` global no suite
   - Testes de contrato não dependem de servidor externo

3. **Publer em vez de Meta Graph** — documentada em W6-W8 (08327bb)
   - Integração de redes sociais via Publer + ManyChat em vez da API Graph do Meta (OAuth pendente)

4. **W7 bidirecional BLOQUEADO** — decidida em W7 (c07dbaa)
   - `MissionEventLogCard` é somente leitura; capacidade de enviar comandos ao OMNIS foi explicitamente rejeitada nessa wave

5. **`src/` é a fonte de verdade, `frontend/` é legado** — decidida em Wave 3D (confirmada em Sprint B)
   - Toda nova funcionalidade vai em `src/`. `frontend/` não recebe novas features.

6. **`routeTree.gen.ts` é intocável** — regra #0 do CLAUDE.md
   - Gerado automaticamente pelo plugin Vite; edição manual corromperia roteamento

7. **Tokens `var(--kr-*)` como único vetor de cor** — enforçada via `token-enforcer.md` skill
   - Zero hex inline em componentes novos; migração de `--kratos-*` legado em andamento

8. **`useSafeQuery` como wrapper anti-freeze para queries externas** — adicionada pós-W8
   - Queries para OMNIS/GitHub/Akasha usam `timeoutMs` para não bloquear UI

---

## Métricas por wave (estado atual após W8)

| Wave | Componentes | Hooks | Testes (bun test) | Notas |
|---|---|---|---|---|
| Pré-W1 (base) | ~80 | ~15 | 41 (stores) | Fundação: checkpoints, projects, appointments stores |
| W1 | +0 componentes | +0 novos | 41 | API layer refactor — sem novos componentes |
| W2 | +1 (WorldRightPanel real data) | +0 | 41 | Dados reais agenda no mundo |
| W3 | +1 (AuroraCommandPalette) | +0 | 41 | Mock removido, paleta real |
| W4–W5 | +2 (FioMentalPanel, SSE) | +1 (useSSEToasts) | 61 | +20 testes GitHub/OMNIS stores |
| W6 | +3 (OfflineBanner, PWAInstall, chunks) | +2 (useOffline, usePWAInstall) | 61 | PWA + offline |
| W7 | +2 (MissionEventLogCard, GuardrailAlertCard) | +0 | 61 | Read-only OMNIS event log |
| W8 | +2 (CostSummaryCard, analytics) | +0 | 92 | +31 frontend (pré-existentes, jsdom) |
| **W8 final** | **146** | **27** | **92 total** (61 pass + 31 pré-existentes) | Estado atual |

---

## Fios soltos (identificados em W9-B2)

1. **Tokens duplicados `--kr-*` vs `--kratos-*`** — coexistem em `src/styles.css`; migração em andamento mas incompleta. Componentes legados em `ui-primitives/` e `hud/` ainda usam `--kratos-*`.

2. **`frontend/` não removida** — estrutura legada Vite standalone ainda presente no repo. Risco de confusão para novos agentes sobre qual `src/` usar.

3. **OAuth Meta pendente** — integração com Instagram Graph API bloqueada por `META_APP_ID`/`META_APP_SECRET` não configurados. Workaround atual: Publer (manual) + ManyChat. Sem data prevista para desbloqueio.
