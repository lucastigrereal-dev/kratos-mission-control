# KRATOS Mission Control — Handoff Document
**Data:** 2026-05-27 | **Branch:** `feature/fase14-integration`
**Stack:** React 19 · TanStack Start · Tailwind v4 · FastAPI · Cloudflare Workers
**Estado geral:** Build ✅ zero erros | Deploy staging ✅ Vercel (VITE_USE_MOCKS=true)

---

## FIO 1 — Aurora Chat aguarda `/aurora/chat` do omnis-server

**O que está faltando:**
O backend `backend/app/routes/aurora.py` tem apenas `GET /aurora/insight`.
Não existe `POST /aurora/chat` para enviar mensagens ao OMNIS e receber resposta.

**Bloqueio:** W3-B1 (Aurora Chat Engine) não pode ser implementado sem este endpoint.

**O que já existe no frontend:**
- `AuroraCommandPalette.tsx` (⌘K) — 6 comandos com navegação ✅
- `AuroraPanelContent.tsx` — painel lateral de insights ✅
- `AuroraOrb.tsx` — 5 estados visuais (idle/live/thinking/degraded/offline) ✅
- `FioMentalPanel.tsx` — missões running/paused read-only ✅

**O que falta:**
```python
# backend/app/routes/aurora.py — adicionar:
@router.post("/chat")
async def aurora_chat(body: AuroraChatRequest):
    # body: { message: str, context: dict }
    # resposta: { reply: str, sources: list, cost_usd: float }
    # Integrar com OMNIS crew de resposta / LangGraph
    ...
```

**Ação para desbloquear:**
1. OMNIS implementar skill de chat/resposta em omnis-control
2. Backend expor `POST /aurora/chat`
3. Implementar `AuroraChatInput.tsx` + `useAuroraChat.ts` no KRATOS

---

## FIO 2 — W4 Performance Charts aguarda PUBLER_API_KEY

**O que está faltando:**
`AgenciaScreen.tsx` tem `MetricsLockedCard` com estado honesto —
exibe "bloqueado: PUBLER_API_KEY não configurada".

**Fonte de dados decidida:** Publer API → `GET /marketing/metrics` (backend)
**NÃO é Meta Graph API** (decisão arquitetural — Meta OAuth removido do roadmap).

**Backend stub existente:** `backend/app/routes/metrics.py` — só retorna `[]`.

**O que precisa ser feito:**
```python
# 1. Configurar no omnis-server (não KRATOS):
#    PUBLER_API_KEY=pk_... (server-side, nunca VITE_)

# 2. Implementar backend/app/routes/metrics.py:
@router.get("/marketing/metrics")
async def marketing_metrics(weeks: int = 4):
    # Chama Publer API (GET /v1/posts?status=published)
    # Agrega: alcance, engajamento, novos seguidores
    # Retorna: { data: MetricsPage[], source: "live"|"cache" }
    ...

# 3. Adicionar hook no KRATOS:
#    src/hooks/useMarketingMetrics.ts
#    useQuery({ queryKey: ['marketing-metrics'] })

# 4. Atualizar AgenciaScreen.tsx:
#    Trocar MetricsLockedCard → PerformanceChartsCard real
```

**ManyChat (CRM Leads):**
- Webhook: `POST /crm/leads/webhook` (ManyChat → backend)
- `crm-tigre-backend` precisa estar healthy (container está unhealthy atualmente)
- MANYCHAT_WEBHOOK_SECRET — server-side

---

## FIO 3 — Deploy em staging com mocks (sem omnis-server em produção)

**Estado atual:**
Deploy configurado para Vercel com `VITE_USE_MOCKS=true`.
Todos os dados são mock client-side — frontend funciona 100% sem backend.

**Arquivos de deploy:**
```
vercel.json                  — configuração Vercel (Edge Runtime, rewrites, cache)
vite.vercel.config.ts        — build sem @cloudflare/vite-plugin
api/index.ts                 — Vercel Edge Function adapter
```

**Scripts:**
```bash
bun run build:vercel         # VITE_USE_MOCKS=true vite build --config vite.vercel.config.ts
vercel --prod                # Deploy (requer vercel CLI + auth)
```

**Variáveis de ambiente no Vercel Dashboard:**
| Variável | Valor staging | Notas |
|---|---|---|
| `VITE_USE_MOCKS` | `true` | Trocar para `false` quando omnis-server estiver em prod |
| `VITE_API_BASE_URL` | `https://omnis-api.empresa-tigre.com` | URL futura do omnis-server |
| `VITE_ANALYTICS_ENDPOINT` | `` (vazio) | Preencher com URL do Plausible quando tiver |

**VITE_ Security Audit (✅ PASSOU):**
- `VITE_USE_MOCKS` — boolean toggle, zero risco
- `VITE_API_BASE_URL` — URL pública por design
- `VITE_ANALYTICS_ENDPOINT` — URL do Plausible/PostHog
- **NENHUMA API key, token ou secret usa prefixo VITE_**
- Todos os secrets ficam server-side (Python): PUBLER_API_KEY, MANYCHAT_WEBHOOK_SECRET, NOTION_TOKEN, ANTHROPIC_API_KEY

**Para ativar dados reais quando omnis-server subir (W14 OMNIS):**
1. Vercel Dashboard → Environment Variables
2. Trocar `VITE_USE_MOCKS` de `true` para `false`
3. Redeploy (trigger via push ou dashboard)

---

## Resumo executivo

| Fio | Bloqueio | Próxima ação |
|---|---|---|
| Aurora Chat | Sem `POST /aurora/chat` no omnis-server | OMNIS implementar skill de chat |
| W4 Charts | Sem `PUBLER_API_KEY` + backend stub | Configurar Publer + implementar `/marketing/metrics` |
| Staging mocks | omnis-server não está em produção | Quando W14 OMNIS sair: `VITE_USE_MOCKS=false` + redeploy |

**CF Workers deploy (produção final):**
- Configurado via `wrangler.jsonc` (já existente)
- Requer autorização explícita do Lucas (`wrangler deploy`)
- Usar após omnis-server estar healthy em produção

---

*KRATOS HANDOFF v1.0 — 2026-05-27*
