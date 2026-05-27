# W11-B1 — Auditoria Post-Fogo W10
**Data:** 2026-05-27
**Branch:** main @ `29bf944`
**Escopo:** Mapeamento de P0/P1/P2 pós-merge W10. Nenhum fix aplicado nesta fase.

---

## Resumo Executivo

| Prioridade | Contagem | Status geral |
|---|---|---|
| 🔴 P0 (crítico, bloqueia prod) | **0** | — |
| 🟡 P1 (atenção, degradação UX) | **4** | Requer ação W11 |
| 🔵 P2 (melhoria, não urgente) | **5** | Backlog W12+ |

**Veredicto:** W10 entrou em produção sem P0. Sistema estável. W11 pode focar em saneamento sem urgência de hotfix.

---

## Categoria 1 — Deploy Logs (Vercel / Cloudflare)

**Status: ⚠️ P1 — Vercel CLI não mapeado corretamente**

- KRATOS usa **Cloudflare Workers** via `wrangler.jsonc` — deploy NÃO é Vercel
- `bunx vercel ls` falha com: `VERCEL_ORG_ID set but VERCEL_PROJECT_ID missing`
- Conclusão: `VERCEL_ORG_ID` no ambiente é herança de outro projeto — deve ser removido ou `VERCEL_PROJECT_ID` configurado para o projeto correto
- Cloudflare deploy logs: verificar via [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers → kratos-mission-control
- **Ação W11:** Limpar variável `VERCEL_ORG_ID` se não houver projeto Vercel; ou documentar qual build pipeline está ativo

---

## Categoria 2 — Browser Console Errors

**Status: ⚠️ P1 — Verificação manual pendente**

Não foi possível executar via CLI (sem browser headless configurado). Pontos de risco identificados estaticamente:

**Erros esperados (por design — não são bugs):**
- `[kratos:error]` e `[kratos:promise]` em `errorHandler.ts` — apenas em erros reais
- `console.error(error)` em `__root.tsx` e `server.ts` — tratadores de erro SSR

**Riscos de console em prod identificados:**
- 95 erros TypeScript pré-existentes (HUD, views mais antigas) podem gerar runtime warnings
- KratosContext importa `api-contract/source-badge.schema` e `api-contract/dashboard.schema` via path relativo `../../../api-contract/` → verificar se resolve correto em CF Workers

**Ação W11:** Abrir `/agora`, `/ilhas/marketing`, `/sistema`, `/omnis-lab` em DevTools e capturar erros vermelhos manualmente.

---

## Categoria 3 — Bundle Size Baseline

**Status: ✅ OK — dentro do target**

| Chunk | Raw | Gzip | Alvo |
|---|---|---|---|
| `index-Cq_T53iW.js` (main) | 661 KB | **204.9 KB** | <250 KB ✅ |
| `OmnisLabScreen-*.js` | 51 KB | 12.2 KB | lazy-loaded ✅ |
| `agora-*.js` | 22.6 KB | 6.1 KB | ✅ |
| `AgenciaScreen-*.js` | 17.4 KB | 5.0 KB | ✅ |
| `styles-*.css` | 107.8 KB | 18.9 KB | ✅ |

**Observação:** Main bundle (204.9 KB gzip) está 18% abaixo do target de 250 KB. Margem boa para W12 (Multi-Page Cockpit) sem acionar alerta.

**Risco P2:** `OmnisLabScreen` é o maior chunk de ilha (51 KB raw). Se ModelCostDashboard crescer mais em W11-B7+, pode valer quebrar em sub-chunks.

---

## Categoria 4 — Lighthouse (Performance/A11y/BP/SEO)

**Status: ⚠️ P1 — Verificação manual pendente**

`npx lighthouse` requer servidor rodando. Não executado via CLI nesta sessão.

**Pontos de risco identificados estaticamente:**
- `OmnisLabScreen` é a maior rota lazy-loaded — LCP pode ser alto se carregado eagerly
- Framer Motion 12.40 no bundle — verificar se `prefers-reduced-motion` está cobrindo todas as animações
- Sem `<meta description>` genérico por rota — SEO pode ser baixo (aceitável para app privado)
- `aria-hidden` usado corretamente nos ícones (lucide-react)

**Ação W11:** Rodar `bun run dev` + `npx lighthouse http://localhost:5173/agora --quiet` para cada rota principal.

---

## Categoria 5 — SSE Health

**Status: ⚠️ P1 — Arquitetura robusta mas não observada em produção**

**Arquitetura atual (pós-W10-B5 refactor):**
- Polling-based via `useSSEConnection()` — NÃO é EventSource persistente
- Polls `/live/events-status` a cada 10s via TanStack Server Function
- Dual path: `/v1/events/status` (primário) → `/events/status` (fallback)
- Timeout: 4s por probe
- On success: invalida `["services"]`, `["system","pulse"]`, `["missions-active"]`

**Riscos identificados:**
1. Se OMNIS latência > 4s → probe timeout → `isConnected: false` → 3 query keys ficam sem revalidação até próximo ciclo (10s)
2. Se OMNIS oscila muito → storm de invalidações a cada 10s
3. `fetchLiveEventsStatus` é server function (CF Workers) → adiciona ~10-30ms de overhead por call vs client-direct

**Ação W11:** Adicionar `trackSSEDisconnect()` (já existe em `kratosAnalytics.ts`) ao hook quando `isConnected` vai de `true` → `false`.

---

## Categoria 6 — TanStack Query Stale State

**Status: 🔵 P2 — Sem flash crítico, mas alguns hooks inconsistentes**

**Defaults globais** (`queryClient.ts`):
```
staleTime: 30s | gcTime: 5min | retry: 1 | refetchOnWindowFocus: false
```

**Hooks auditados:**

| Hook | staleTime | refetchInterval | Avaliação |
|---|---|---|---|
| `useServices` | 15s | 30s | ✅ agressivo, correto |
| `useLiveStatus` | 5s | 10s | ✅ mais agressivo, correto |
| `useMissions` | 20s | 30s | ✅ correto |
| `useContexto` | 15s | 30s | ✅ correto |
| `useSystemPulse` | 10s | 10s | ✅ agressivo |
| `useAuroraInsight` | 60s | 120s | ✅ correto (ciclos OMNIS) |
| `useAgenciaQueue` | 60s | ❌ sem refetchInterval | ⚠️ dados mkt podem ficar 60s stale sem SSE |
| `useOmnisHealthScore` | 60s | 120s | ✅ OK |
| `useGithub` | 120s | ❌ sem refetchInterval | ✅ aceitável (GitHub é lento) |
| `useAkasha` | 60s | ❌ sem refetchInterval | ✅ aceitável (memória é estável) |

**Risco:** `useAgenciaQueue` sem `refetchInterval` — se SSE cair, dados de marketing ficam 60s stale na `AgenciaScreen`. **Ação W11:** Adicionar `refetchInterval: 120_000` ao `useAgenciaQueue`.

**Stale flash:** O padrão React Query com `refetchOnWindowFocus: false` e SSR loaders evita a maioria dos flashes. Nenhum caso crítico identificado.

---

## Categoria 7 — Aurora Chat Timeouts

**Status: ✅ OK — Mockado por design (W11-B2 pending)**

- Aurora chat ainda usa dados mockados — KRATOS não chama LLMs (boundary intacta)
- `AuroraPanelContent.tsx:115` tem `// TODO: wire into mission execution when ready`
- `useAuroraInsight` consume `/live/aurora-insight` (backend KRATOS, não OMNIS diretamente)
- P95 de latência: não mensurável até W11-B2 (conexão real com OMNIS)

**Pendente W11-B2:** Quando OMNIS conectar real, medir latência de `/live/aurora-insight` com 5 prompts simples.

---

## Outros achados

### ✅ Zero problemas
- Zero `any` nos arquivos novos (W10 adicionou com tipagem forte)
- Zero hex hardcoded nos componentes (todos usam `var(--kr-*)`)
- Zero raw `fetch()` fora do `apiGet`/`apiPost`
- Console.error apenas em handlers de erro (sem debug leaks)
- 1 TODO em `AuroraPanelContent.tsx` (known, intencional)

### ⚠️ Atenção
- **95 erros TypeScript pré-existentes** em componentes mais antigos (HUD, views, shell)
  - Nenhum em código W10 novo
  - Maioria são type mismatches em props de ícones e `source-badge` schema
  - **W11-B3 alvo:** eliminar esses erros (parte do "Saneamento")

### 🔵 P2 — Variável de ambiente fantasma
- `VERCEL_ORG_ID` configurado sem `VERCEL_PROJECT_ID` → Vercel CLI falha
- Deploy real é Cloudflare Workers → variável Vercel é herança morta
- Ação: remover `VERCEL_ORG_ID` do ambiente local ou documentar

---

## Lista Priorizada

### 🟡 P1 (W11 — tratar antes do próximo deploy)
1. **[P1-A]** Verificar browser console errors manualmente em `/agora` e `/ilhas/marketing`
2. **[P1-B]** Executar Lighthouse em `/agora` (dev server) — obter baseline Performance score
3. **[P1-C]** Limpar `VERCEL_ORG_ID` do ambiente ou mapear projeto Vercel correto
4. **[P1-D]** Adicionar `trackSSEDisconnect()` em `useLiveStatus` quando `isConnected` cai

### 🔵 P2 (W12+ — não urgente)
1. **[P2-A]** Adicionar `refetchInterval: 120_000` ao `useAgenciaQueue`
2. **[P2-B]** Eliminar 95 erros TypeScript pré-existentes (W11-B3 saneamento)
3. **[P2-C]** Avaliar split de `OmnisLabScreen` em sub-chunks se crescer >80 KB raw
4. **[P2-D]** Medir latência Aurora quando OMNIS conectar (W11-B2)
5. **[P2-E]** Verificar `prefers-reduced-motion` cobertura nas animações Framer Motion

---

*Auditoria realizada via análise estática de código. Itens P1-A, P1-B e categoria SSE requerem observação em ambiente rodando.*
