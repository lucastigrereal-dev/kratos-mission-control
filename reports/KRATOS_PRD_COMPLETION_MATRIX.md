# KRATOS PRD COMPLETION MATRIX

**Data:** 2026-05-30  
**Versão:** v2.0  
**Branch:** main  
**HEAD:** 5f6e8b0 (W21)  

---

## DONE ✅ (funcional em modo local)

| Feature | Arquivo | Wave |
|---------|---------|------|
| Shell (AppShell, Topbar, Sidebar, StatusBar) | `src/components/kratos/shell/` | W10 |
| AuroraPanel + AuroraDrawer | `src/components/kratos/shell/AuroraPanel.tsx` | W10/W4.5 |
| 10 Islands (screens completas) | `src/components/kratos/islands/` | W12 |
| IslandDock wiring | `src/components/kratos/islands/shared/` | W12 |
| Akasha Semantic Search UI | `src/components/kratos/akasha/AkashaSearchPanel.tsx` | W13 |
| useAkashaSearch + useAkashaCollections | `src/hooks/useAkasha.ts` | W13 |
| InsightOfTheDay + daily topics | `src/components/kratos/islands/FilosofiaScreen.tsx` | W14 |
| PWA manifest + service worker | `public/manifest.webmanifest`, `public/sw.js` | W14 |
| OMNIS Execution Cockpit | `src/components/kratos/omnis/OmnisExecutionCockpit.tsx` | W15 |
| App Factory UI (8 templates) | `src/components/kratos/omnis/AppFactoryPanel.tsx` | W16 |
| UserProfileScreen + /perfil | `src/components/kratos/pro/UserProfileScreen.tsx` | W17 |
| Billing UI + Stripe placeholder | `src/components/kratos/pro/BillingScreen.tsx` | W18 |
| Multi-Page Cockpit (6 páginas) | `src/components/kratos/islands/AgenciaScreen.tsx` | W12 |
| PageCard, PerformanceCharts, PageSwitcher | `src/components/kratos/islands/marketing/` | W12 |
| OMNIS Write Bridge contract + mock adapter | `src/lib/omnis-write-bridge.ts` | W19 |
| HumanApprovalGate UI | `src/components/kratos/omnis/HumanApprovalGate.tsx` | W19 |
| MissionCommandPanel (dry-run) | `src/components/kratos/omnis/MissionCommandPanel.tsx` | W19 |
| Multi-Operator model (RBAC) | `src/lib/operator-session.ts` | W20 |
| MockModeAuditBanner | `src/components/kratos/pro/MockModeAuditBanner.tsx` | W20 |
| OperatorWorkspaceSelector | `src/components/kratos/pro/OperatorWorkspaceSelector.tsx` | W20 |
| Analytics Dashboard (6 páginas) | `src/components/kratos/analytics/AnalyticsDashboard.tsx` | W21 |
| Meta Analytics Adapter interface | `src/lib/meta-analytics-adapter.ts` | W21 |
| SAMPLE_PAGE_METRICS (dataset realista) | `api-contract/analytics.schema.ts` | W21 |
| 739 testes passando | `tests/stores/` | W0-W21 |

---

## MOCKED 🟡 (funcional, dados mock/sample)

| Feature | Status Mock | Desbloqueio |
|---------|------------|-------------|
| Akasha search | Hook funcional, backend no :5100 | Akasha backend running |
| OMNIS status/crews/jobs | Mock data via store | OMNIS backend running |
| GitHub status | Mock + real fallback | GitHub token configurado |
| Marketing metrics (6 páginas) | SAMPLE_DATA realista | OMNIS W24 API real |
| Cross-page analytics | Mock weekly series | OMNIS W25 API real |
| Analytics completo | SAMPLE_DATA | OAuth Meta configurado |
| OMNIS Write Bridge | DRY_RUN only | W28 + API key OMNIS |
| Operator session | Mock/local | W28 OAuth |
| Stripe Billing | Elements placeholder | VITE_STRIPE_PUBLISHABLE_KEY |

---

## SPEC_ONLY 📋 (contrato definido, sem implementação funcional)

| Feature | Arquivo | Notas |
|---------|---------|-------|
| LiveMetaAnalyticsAdapter | `src/lib/meta-analytics-adapter.ts` | Interface + stub, lança erro |
| OMNIS live execution | `api-contract/omnis-write-bridge.schema.ts` | `live_enabled: false` hardcoded |
| Real auth session | `api-contract/operator.schema.ts` | Schema completo, mock apenas |

---

## HUMAN_SLOT 🔴 (ação manual necessária do Lucas)

| Human Slot | Arquivo | Risco |
|-----------|---------|-------|
| META_APP_ID + META_APP_SECRET | `.env` local | Médio |
| META_ACCESS_TOKEN | `.env` local | Médio |
| VITE_STRIPE_PUBLISHABLE_KEY | `.env` local | Baixo |
| Stripe backend (omnis-server) | Backend externo | Médio |
| NOTION_TOKEN | `.env` local | Baixo |
| VITE_SENTRY_DSN | `.env` local | Baixo |
| Deploy Cloudflare | `wrangler deploy` | Alto — exige autorização |

---

## BLOCKED_EXTERNAL 🔒

| Item | Dependência | Quando |
|------|------------|--------|
| OMNIS write real | W28 + API key | Não planejado |
| OAuth Meta/Google | Conta configurada | Não planejado |
| Stripe real | Conta Stripe + backend | W28+ |
| Sentry | Conta Sentry | Quando pronto |
| Deploy produção | Autorização do Lucas | Quando pronto |
| execute:real permission | W28+ | Não planejado |

---

## Resumo

| Categoria | Quantidade |
|-----------|-----------|
| DONE | 23 features |
| MOCKED | 9 features |
| SPEC_ONLY | 3 features |
| HUMAN_SLOT | 7 items |
| BLOCKED_EXTERNAL | 6 items |
| **Tests passing** | **739** |
| **Build** | **✅ clean** |
