# EXTERNAL DEPENDENCIES REGISTER

**KRATOS v2.0 — W22 Final**  
**Data:** 2026-05-30  

---

## Meta (Instagram)

| Item | Status | Risco | Arquivo de Referência |
|------|--------|-------|----------------------|
| META_APP_ID | ❌ não configurado | Médio | `api-contract/analytics.schema.ts` |
| META_APP_SECRET | ❌ não configurado | Alto | `api-contract/analytics.schema.ts` |
| META_ACCESS_TOKEN | ❌ não configurado | Alto | `api-contract/analytics.schema.ts` |
| Meta Graph API | ❌ não chamado | Alto | `src/lib/meta-analytics-adapter.ts` |
| Instagram Insights | ❌ bloqueado | Alto | `src/lib/meta-analytics-adapter.ts` |

**Impacto:** Analytics com dados reais das 6 páginas  
**Workaround atual:** SAMPLE_DATA (dataset realista)  
**Contato:** Meta for Developers → criar App → configurar variáveis

---

## WhatsApp

| Item | Status | Risco |
|------|--------|-------|
| WhatsApp Business API | ❌ não implementado | Alto |
| WABA_TOKEN | ❌ não configurado | Alto |

**Impacto:** Envio de notificações/alertas via WhatsApp  
**Workaround atual:** Nenhum — não era pré-requisito  
**Nota:** Não faz parte do PRD KRATOS

---

## Stripe

| Item | Status | Risco | Arquivo |
|------|--------|-------|---------|
| VITE_STRIPE_PUBLISHABLE_KEY | ❌ não configurado | Baixo | `src/components/kratos/pro/BillingScreen.tsx` |
| STRIPE_SECRET_KEY | ❌ nunca no frontend | Alto | Fica em omnis-server |
| Stripe Elements | 🟡 placeholder UI | Baixo | `BillingScreen.tsx` |
| Backend Stripe (omnis-server) | ❌ não implementado | Médio | W18 pendente |

**Impacto:** Upgrade de Personal para Pro (R$97/mês)  
**Workaround atual:** Pricing cards visíveis, Elements disabled  
**Nota:** STRIPE_SECRET_KEY fica SEMPRE server-side (omnis-server)

---

## Sentry

| Item | Status | Risco | Arquivo |
|------|--------|-------|---------|
| VITE_SENTRY_DSN | ❌ não configurado | Baixo | `src/lib/sentry.ts` |

**Impacto:** Monitoramento de erros em produção  
**Workaround atual:** `error-capture.ts` local sem envio  
**Quando configurar:** Após criar projeto no Sentry

---

## Deploy (Cloudflare Workers)

| Item | Status | Risco | Arquivo |
|------|--------|-------|---------|
| `wrangler deploy` | 🔒 BLOQUEADO | Crítico | `wrangler.jsonc` |

**Regra:** NÃO EXECUTAR sem autorização explícita do Lucas  
**Workaround atual:** `bun run dev` local  
**Contato:** Lucas dá autorização verbal

---

## OMNIS Live API

| Item | Status | Risco | Arquivo |
|------|--------|-------|---------|
| OMNIS backend (localhost:5100) | 🟡 parcial | Médio | `src/lib/omnis-provider.ts` |
| GET /marketing/pages/:slug | ❌ não implementado | Médio | `src/hooks/usePageMetrics.ts` |
| GET /marketing/analytics/cross-pages | ❌ não implementado | Médio | `src/hooks/useCrossPageAnalytics.ts` |
| POST /api/execute (write bridge) | ❌ bloqueado W19 | Alto | `src/lib/omnis-write-bridge.ts` |

**Workaround atual:** Mock fallback em todos os hooks

---

## Akasha Live API

| Item | Status | Risco |
|------|--------|-------|
| pgvector :5432 | 🟡 funcional quando rodando | Baixo |
| POST /akasha/search | 🟡 funcional quando :5100 up | Baixo |
| GET /akasha/collections | 🟡 funcional quando :5100 up | Baixo |

**Nota:** Akasha é a dependência mais estável — tem mock robusto como fallback
