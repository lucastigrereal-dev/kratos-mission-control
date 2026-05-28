# HANDOFF W15–W18 — KRATOS Mission Control

**Data:** 2026-05-28
**Branch:** main
**Milestone tag:** `kratos-v2.0-main`

---

## Waves entregues

### W15 — OMNIS Live Execution Cockpit
**Tag:** `kratos-w15-omnis-cockpit`
**Commit:** `c23e082`

Componentes:
- `src/components/kratos/omnis/OmnisExecutionCockpit.tsx` ← novo
- `src/components/kratos/islands/OmnisLabScreen.tsx` ← wired

Features:
- Stats em 4 tiles: taxa de sucesso, duração média, sucesso/total, erros hoje
- Active runs com pulse animation (live)
- Histórico de execução (últimos 8 runs excluindo ativos)
- Skill Launcher: 5 quick skills pré-definidas (disabled, badge W28)
- Dados reais via `useOmnisRuns(20)` + `useOmnisJobs(5)`

---

### W16 — App Factory UI
**Tag:** `kratos-w16-app-factory`
**Commit:** `bcf589a`

Componentes:
- `src/components/kratos/omnis/AppFactoryPanel.tsx` ← novo
- `src/components/kratos/islands/OmnisLabScreen.tsx` ← wired

Features:
- 8 templates: conteúdo (3), CRM (2), analytics (2), operações (2)
- Filter tabs com contagem dinâmica por categoria
- TemplateCard: status badge (estável/beta/rascunho), skill chips, complexidade, deploy locked (W28)
- "Meus Apps" empty state aguardando W28

---

### W17 — KRATOS Pro Foundation
**Tag:** `kratos-w17-pro-foundation`
**Commit:** `13ccd74`

Componentes:
- `src/components/kratos/pro/UserProfileScreen.tsx` ← novo
- `src/routes/perfil.tsx` ← nova rota
- `src/lib/kratos-routes.ts` ← +1 rota `/perfil` (section: sistema)

Features:
- Operator card: Lucas Tigre, @lucastigrereal, 2.32M followers
- 6 perfis Instagram com seguidores e nicho
- Tiers: Personal (atual) vs Pro (locked, upgrade W18)
- System connections: Akasha, OMNIS, GitHub, OAuth Meta, Notion
- Onboarding checklist: 7/10 etapas concluídas + barra de progresso

Testes atualizados:
- `tests/contracts/kratos-routes.test.ts` → 8 rotas, 7 visíveis, 2 sistema
- `tests/stores/lib-utils-coverage.test.ts` → idem + `/perfil` no contains

---

### W18 — Billing UI
**Tag:** `kratos-w18-billing`
**Commit:** `b0189e3`

Componentes:
- `src/components/kratos/pro/BillingScreen.tsx` ← novo
- `src/components/kratos/pro/UserProfileScreen.tsx` ← wired

Features:
- Pricing cards: Personal (grátis) vs Pro (R$ 97/mês)
- Stripe Elements UI scaffold (card, expiry, CVC — todos disabled)
- Badges: SSL 256-bit, PCI DSS, Stripe v3
- Invoice history empty state
- **Zero secret keys no frontend** — awaits `VITE_STRIPE_PUBLISHABLE_KEY` + W18 backend (omnis-server)

---

## Gates (todos passaram)

| Gate | W15 | W16 | W17 | W18 |
|------|-----|-----|-----|-----|
| `bun run build` | ✅ | ✅ | ✅ | ✅ |
| `bun run test` (302 pass) | ✅ | ✅ | ✅ | ✅ |
| Zero secret keys | ✅ | ✅ | ✅ | ✅ |
| Sem `any` no código novo | ✅ | ✅ | ✅ | ✅ |

---

## Pendências manuais (ação do Lucas)

| Item | Prioridade | Descrição |
|------|-----------|-----------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Média | Configurar no `.env` quando conta Stripe for criada |
| W18 backend | Média | Endpoint Stripe no omnis-server para processar upgrades |
| OAuth Meta | Alta | `META_APP_ID` + `META_APP_SECRET` — desbloqueiam analytics real |
| `NOTION_TOKEN` | Baixa | Sincronização com Notion planejada |
| `VITE_SENTRY_DSN` | Baixa | Configurar após criar projeto no Sentry |
| Lighthouse baseline | Baixa | Rodar no browser para W11-B8 |
| `git push --follow-tags` | Feito | Todos os tags empurrados |

---

## Arquitetura após W18

```
KRATOS v2.0
├── Shell (W10–W11): AppShell, Topbar, Sidebar, StatusBar, AuroraPanel
├── Ilhas (W12): 10 screens completas + IslandDock wiring
├── Akasha (W13): semantic search UI + useAkashaSearch
├── Auto-Learning (W14): InsightOfTheDay + PWA SW
├── OMNIS Cockpit (W15): ExecutionCockpit + stats/history/launcher
├── App Factory (W16): template catalog 8 templates
├── Perfil (W17): UserProfileScreen + /perfil route + onboarding
└── Billing (W18): BillingScreen + Stripe Elements placeholder
```

---

## Boundary crítica (imutável)

```
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS age.
Akasha lembra.
Codex/Claude constrói.
Lucas decide.
```

KRATOS é **read-only** em relação ao OMNIS.
Mutations = apenas via Aurora command ou W28 App Factory deploy.
`STRIPE_SECRET_KEY` fica server-side (omnis-server) — **nunca** no bundle.

---

## Próximas waves (não planejadas ainda)

- **W19+**: OMNIS write bridge (contrato KRATOS ↔ OMNIS para deploy real)
- **W20+**: Multi-operador (SaaS — requer W17 Pro + W18 Billing completos)
- **W21+**: Analytics integrado (requer OAuth Meta)
