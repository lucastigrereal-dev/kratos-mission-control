# KRATOS W10 — Mobile 375px + Dark Mode Audit
## Auto-Run Report · 2026-05-16

**Status: VERDE** ✅
**Wave:** W10 — Mobile 375px + dark mode audit
**Build:** Client + SSR limpos, zero erros

---

## Blocos Executados

| # | Bloco | Status |
|---|---|---|
| 01 | Listar todas as rotas (7) | ✅ |
| 02 | Auditar classes críticas de grid | ✅ |
| 03 | Auditar overflow horizontal | ✅ |
| 04 | Auditar dark mode / contraste | ✅ |
| 05 | Corrigir DashboardView grid-cols-2 → grid-cols-1 no mobile | ✅ |
| 06 | Garantir ação primária visível em cada rota | ✅ |
| 07 | Build | ✅ |
| 08 | Relatório | ✅ |
| 09 | Commit | ✅ |
| 10 | Recomendar | ✅ |

---

## Auditoria Positiva

| Item | Status |
|---|---|
| Zero `style={{ color: "#..." }}` | ✅ |
| Zero hardcoded white/light backgrounds | ✅ |
| Dark mode via CSS variables (dark-only) | ✅ |
| Todos grids começam em `grid-cols-1` no mobile | ✅ |
| SectionHeader visível em todas as rotas | ✅ |
| Ação primária visível em cada rota | ✅ |
| Sem fixed widths > 300px | ✅ |

---

## Correções

| Arquivo | Issue | Correção |
|---|---|---|
| `DashboardView.tsx:117` | `grid-cols-2` no mobile (stats ficam apertados a 375px) | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |

---

## Riscos Identificados

| Risco | Severidade | Nota |
|---|---|---|
| Double padding (AppShell `px-6` + view `px-6`) | Média | 327px de conteúdo a 375px. AppShell é protegido — não corrigido. Views futuras podem omitir padding próprio. |
| Sidebar 232px expandida empurra conteúdo | Baixa | Padrão em apps desktop. Colapsar sidebar resolve no mobile. |
| Sem testes visuais reais | Baixa | Auditoria é estática. Recomenda-se rodar Playwright a 375px. |

---

## Recomendação

W11 (Persistência local avançada) deve ser precedida por uma auditoria de continuidade para garantir alinhamento com o estado real do projeto.
