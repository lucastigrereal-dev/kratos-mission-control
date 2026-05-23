# KRATOS P1-A — Token Cleanup + Glass Consistency Report

**Date:** 2026-05-14 | **Microfase:** P1-A | **Status:** CONCLUÍDA

---

## 1. Resumo da Microfase

Substituição de `rgba()` hardcoded por `color-mix(in srgb, ...)` usando tokens CSS existentes. Duas classes de violação corrigidas: estilos de tom no AuroraPanel e backgrounds de chips no design system.

**Zero tokens novos. Zero alterações de lógica. Zero backend tocado.**

---

## 2. Arquivos Alterados (2)

| Arquivo | Violações | Correção |
|---------|-----------|----------|
| `frontend/src/components/AuroraPanel.tsx` | 5 rgba() em TONE_STYLES + drift chip | `color-mix(in srgb, var(--kr-*) X%, transparent)` |
| `frontend/src/index.css` | 6 rgba() em `.kr-chip-*` classes | `color-mix(in srgb, var(--kr-*) X%, transparent)` |

---

## 3. Arquivos Protegidos e NÃO Tocados (11 de 13)

| Arquivo | Status |
|---------|--------|
| `src/components/CheckpointSuggestionBanner.tsx` | LIMPO — criado com tokens na 1.0B |
| `src/components/KratosTopHud.tsx` | LIMPO — usa classes e tokens |
| `src/components/KratosRightRail.tsx` | LIMPO — usa classes |
| `src/components/KratosBottomDock.tsx` | LIMPO — usa tokens SQUAD_* |
| `src/components/MissionBar.tsx` | LIMPO — auditado na 1.0B |
| `src/components/SourceBadge.tsx` | LIMPO — 100% tokens |
| `src/pages/MissionLensPage.tsx` | LIMPO — usa classes e tokens |
| `src/pages/ContextoPage.tsx` | LIMPO — auditado na 1.0B |
| `src/pages/TarefasPage.tsx` | LIMPO — usa classes |
| `src/pages/ProjetosPage.tsx` | LIMPO — usa classes e tokens |
| `src/pages/SistemaPage.tsx` | LIMPO — cores usam `var(--kr-red-400)` |

---

## 4. Alterações por Arquivo

### AuroraPanel.tsx

| Linha | Antes | Depois |
|-------|-------|--------|
| 15 | `"rgba(244, 63, 94, 0.08)"` | `"color-mix(in srgb, var(--kr-arena-coral) 8%, transparent)"` |
| 20 | `"rgba(250, 204, 21, 0.08)"` | `"color-mix(in srgb, var(--kr-gold-400) 8%, transparent)"` |
| 25 | `"rgba(96, 165, 250, 0.08)"` | `"color-mix(in srgb, var(--kr-azure-400) 8%, transparent)"` |
| 67 | `"rgba(244, 63, 94, 0.12)"` | `"color-mix(in srgb, var(--kr-arena-coral) 12%, transparent)"` |
| 68 | `"rgba(250, 204, 21, 0.12)"` | `"color-mix(in srgb, var(--kr-gold-400) 12%, transparent)"` |

### index.css

| Classe | Antes | Depois |
|-------|-------|--------|
| `.kr-chip-healthy` | `rgba(34, 197, 94, 0.12)` | `color-mix(in srgb, var(--kr-status-healthy) 12%, transparent)` |
| `.kr-chip-degraded` | `rgba(234, 179, 8, 0.12)` | `color-mix(in srgb, var(--kr-status-degraded) 12%, transparent)` |
| `.kr-chip-critical` | `rgba(239, 68, 68, 0.12)` | `color-mix(in srgb, var(--kr-status-critical) 12%, transparent)` |
| `.kr-chip-offline` | `rgba(94, 94, 120, 0.15)` | `color-mix(in srgb, var(--kr-status-offline) 15%, transparent)` |
| `.kr-chip-info` | `rgba(59, 130, 246, 0.12)` | `color-mix(in srgb, var(--kr-color-info) 12%, transparent)` |
| `.kr-chip-neutral` | `rgba(157, 157, 181, 0.1)` | `color-mix(in srgb, var(--kr-color-neutral) 10%, transparent)` |

---

## 5. Tokens Usados (todos existentes)

| Token | Onde foi usado |
|-------|---------------|
| `--kr-arena-coral` | AuroraPanel: bg critical, drift chip high |
| `--kr-gold-400` | AuroraPanel: bg warning, drift chip medium |
| `--kr-azure-400` | AuroraPanel: bg info |
| `--kr-status-healthy` | index.css: `.kr-chip-healthy` |
| `--kr-status-degraded` | index.css: `.kr-chip-degraded` |
| `--kr-status-critical` | index.css: `.kr-chip-critical` |
| `--kr-status-offline` | index.css: `.kr-chip-offline` |
| `--kr-color-info` | index.css: `.kr-chip-info` |
| `--kr-color-neutral` | index.css: `.kr-chip-neutral` |

---

## 6. Tokens Novos Solicitados

**NENHUM.** Todas as correções usaram tokens já existentes via `color-mix()`.

---

## 7. Validações Executadas

| Comando | Resultado |
|---------|-----------|
| `npm run build` (tsc + vite) | 61 modules, 0 errors, 605ms |
| `git diff HEAD -- backend/` | Vazio — backend intacto |

| Comando não disponível | Motivo |
|------------------------|--------|
| `npm test` | Sem testes no frontend |
| `npx playwright test` | Playwright não instalado |

---

## 8. Erros / Warnings

**Nenhum.** TypeScript 0 erros, build 0 warnings.

---

## 9. Riscos Restantes

| Risco | Severidade | Descrição |
|-------|-----------|-----------|
| rgba() residual em index.css | 🟢 BAIXO | ~50 rgba() em gradientes, sombras, scrollbar, mundo 3D, castelo. São parte do design system e requerem tokens novos. Deferido para P1-B. |
| Scrollbar com rgba fixo | 🟢 BAIXO | `rgba(255, 255, 255, 0.1)` — browsers têm suporte limitado a `color-mix()` em scrollbar |
| Acessibilidade com cores fixas | 🟢 BAIXO | `#ccc`, `#999`, `#fff` em high-contrast e skip-link. Valores intencionais para garantia de contraste |
| SistemaPage com fetch raw | 🟡 MÉDIO | Não usa `useApi` hook. Fora do escopo P1-A. Deferido para refactor futuro |

---

## 10. Recomendação da Próxima Microfase

**P1-B — CSS Token Completion.** Tokenizar os ~50 rgba/hex restantes em index.css:

- Criar tokens de sombra (`--kr-shadow-*`) para substituir `rgba(0,0,0,0.X)` repetidos
- Criar tokens de glow (`--kr-glow-*`) para `rgba(X, X, X, 0.X)` em efeitos visuais
- Criar tokens de gradiente para ilhas, castelo, aurora orb
- Scrollbar e high-contrast: manter como estão (limitações de browser)

**Após P1-B:** P2 — UI Primitives (refatorar componentes em `src/components/ui/`, `src/components/world/`, `src/components/shell/`).

---

*Documento gerado ao final da microfase P1-A. Nenhum commit feito.*
