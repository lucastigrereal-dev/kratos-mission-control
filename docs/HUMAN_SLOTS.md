# HUMAN SLOTS — O que Lucas precisa configurar

**Data:** 2026-05-30 | Gerado por W22  
**Regra:** Nenhum agente executa estes passos. São ações manuais de Lucas.  

---

## Ordem Recomendada (por ROI)

### 🔴 Alta Prioridade (ROI imediato)

#### 1. OAuth Meta — Analytics Real das 6 Páginas

**Por que:** Desbloqueia métricas reais, engajamento real, crescimento real  
**Risco:** Médio — não afeta produção atual  
**Onde:** Meta for Developers (developers.facebook.com)

```
Passos:
1. Criar App em developers.facebook.com
2. Adicionar produto: Instagram Graph API
3. Obter: META_APP_ID + META_APP_SECRET
4. Gerar access token para as 6 páginas
5. Adicionar ao .env local:
   META_APP_ID=xxx
   META_APP_SECRET=xxx
   META_ACCESS_TOKEN=xxx
6. Implementar LiveMetaAnalyticsAdapter (src/lib/meta-analytics-adapter.ts)
```

**Arquivo que aguarda:** `src/lib/meta-analytics-adapter.ts` → `LiveMetaAnalyticsAdapter`  
**Critério de desbloqueio:** `META_APP_ID` e `META_APP_SECRET` presentes + adapter implementado

---

#### 2. Deploy Cloudflare — Ir para Produção

**Por que:** KRATOS disponível em qualquer dispositivo  
**Risco:** Alto — afeta produção  
**Autorização necessária:** Verbal de Lucas

```
Comando (após autorização):
  bunx wrangler deploy

Pré-requisitos:
  - bun run build limpo ✅ (já ok)
  - 739 testes passando ✅ (já ok)
  - wrangler.jsonc configurado ✅
  - Variáveis de ambiente no Cloudflare Dashboard
```

**Critério de desbloqueio:** Lucas diz "pode deployar" explicitamente

---

### 🟡 Média Prioridade

#### 3. Stripe — Billing Real

**Por que:** Monetizar upgrades Pro (R$97/mês)  
**Risco:** Médio — requer backend também  
**Onde:** dashboard.stripe.com

```
Passos:
1. Criar conta Stripe
2. Obter Publishable Key (modo teste primeiro)
3. Adicionar ao .env:
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
4. Implementar endpoint no omnis-server (POST /billing/upgrade)
5. Ligar Stripe Elements em BillingScreen.tsx
```

**Arquivo que aguarda:** `src/components/kratos/pro/BillingScreen.tsx`  
**Critério de desbloqueio:** Conta Stripe criada + VITE_STRIPE_PUBLISHABLE_KEY configurado

---

### 🟢 Baixa Prioridade

#### 4. Sentry — Monitoramento de Erros

**Por que:** Capturar erros em produção automaticamente  
**Risco:** Baixo  
**Onde:** sentry.io

```
Passos:
1. Criar projeto no Sentry
2. Obter DSN
3. Adicionar ao .env:
   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**Arquivo que aguarda:** `src/lib/sentry.ts`  
**Critério de desbloqueio:** Projeto Sentry criado

---

#### 5. Notion — Sincronização

**Por que:** KRATOS lê tarefas/projetos do Notion  
**Risco:** Baixo  
**Onde:** notion.so/my-integrations

```
Passos:
1. Criar integração interna no Notion
2. Obter NOTION_TOKEN
3. Adicionar ao .env:
   NOTION_TOKEN=secret_xxx
```

**Critério de desbloqueio:** Integration criada no Notion

---

## Tabela Resumo

| Slot | Prioridade | Risco | Tempo Estimado |
|------|-----------|-------|----------------|
| OAuth Meta | 🔴 Alta | Médio | 2-4h |
| Deploy Cloudflare | 🔴 Alta | Alto | 30min |
| Stripe | 🟡 Média | Médio | 3-6h |
| Sentry | 🟢 Baixa | Baixo | 15min |
| Notion | 🟢 Baixa | Baixo | 15min |

---

## Slots NUNCA para Agentes

Os seguintes itens **nunca** devem ser executados por agente sem autorização explícita:

- `wrangler deploy`
- Qualquer commit com `git add -A`
- Modificação de `.env` real
- Exposição de secrets em logs ou código
- `META_APP_SECRET` ou `STRIPE_SECRET_KEY` no bundle frontend
