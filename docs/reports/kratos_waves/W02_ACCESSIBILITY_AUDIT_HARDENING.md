# W02 — Accessibility Audit Hardening

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE

---

## Objetivo

Hardening de acessibilidade além dos 3 gaps críticos fechados na W01.
Foco: navegação por teclado, bypass de blocos e cobertura de focus rings.

---

## Mudanças

### 1. `src/components/kratos/shell/AppShell.tsx` — Skip-to-main-content link

Adicionado link "Pular para conteúdo principal" como primeiro elemento focável da página:
- Visível apenas em focus (classe `sr-only` + `focus:not-sr-only`)
- Posicionado fixo no topo esquerdo com z-index alto
- Estilizado com token `--kratos-accent` para consistência visual
- Target: `<main id="kratos-main-content">` (id adicionado ao elemento main)

WCAG 2.4.1 — Bypass Blocks: atendido.

### 2. `src/components/kratos/mentor/MentorRecommendationCard.tsx` — Focus ring

Adicionado `kratos-focus-ring` ao botão de ação primária do mentor.
Era o único botão interativo da codebase sem focus ring visível.

---

## Auditoria de cobertura

| Categoria | Status |
|---|---|
| Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) | Completo |
| ARIA labels em shell components | Completo |
| `aria-live` / `aria-busy` em loading states | Completo |
| `aria-hidden` em elementos decorativos | Completo |
| Focus rings em botões interativos | 100% (1 gap fechado) |
| Skip-to-main-content | FEITO |
| Heading hierarchy (sem `<h1>`) | Aceitável — ARIA landmarks compensam |
| `<img>` alt text | N/A — sem `<img>` tags |
| Form labels | shadcn/ui cobre |

---

## Dívida de acessibilidade documentada

| Item | Severidade | Bloqueador |
|---|---|---|
| Sem `<h1>` nas páginas — só `<h2>` | Baixa | ARIA landmarks suprem |
| Sem testes automatizados de a11y (axe-core) | Média | Fora do escopo atual |
| Keyboard navigation test (Tab completo) | Média | Endereçado na W03 |
| Color contrast audit automatizado | Baixa | Design dark-only com tokens validados |

---

## Arquivos modificados

- `src/components/kratos/shell/AppShell.tsx` (+14 linhas, skip link + id)
- `src/components/kratos/mentor/MentorRecommendationCard.tsx` (+1 classe)
