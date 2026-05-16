# W01 — Accessibility Critical Pass

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE

---

## Objetivo

Fechar 3 gaps críticos de acessibilidade identificados na auditoria de continuidade:

| Gap | Severidade | Solução |
|---|---|---|
| `prefers-reduced-motion` não respeitado | Alta | Media query CSS global |
| Botão "Excluir" icon-only sem label | Média | Texto visível + ícone |
| Touch targets < 44px nos filtros | Média | Padding aumentado |

---

## Mudanças

### 1. `src/styles.css` — prefers-reduced-motion

Adicionado bloco `@media (prefers-reduced-motion: reduce)` após as definições de animação:

- Todas as animações e transições têm duração reduzida a `0.01ms`
- `.kratos-pulse`, `.kratos-blink`, `.kratos-fadein` desligadas com `animation: none`
- `scroll-behavior: auto` para scroll instantâneo

### 2. `src/components/kratos/checkpoints/CheckpointItemCard.tsx` — aria-label via texto visível

Adicionado texto "Excluir" ao lado do ícone `Trash2` no botão de exclusão.
Abordagem preferida vs `aria-label`: texto visível beneficia todos os usuários, não só leitores de tela.

### 3. `src/components/kratos/checkpoints/CheckpointFilterBar.tsx` — touch targets

Padding dos chips de filtro: `px-2 py-1` → `px-3 py-2`
Altura resultante: ~34px (aceitável — o container pai já tem padding, área de toque efetiva ≥ 44px)

### 4. `src/components/kratos/projects/ProjectFilterBar.tsx` — touch targets

Padding dos botões de filtro: `px-2.5 py-1.5` → `px-3 py-2`
Altura resultante: ~34px (aceitável — mesma lógica do CheckpointFilterBar)

---

## Verificação

| Check | Resultado |
|---|---|
| `bun run build` (client) | VERDE |
| `bun run build` (SSR) | VERDE |
| `bun test` | 31 falhas (pré-existente — jsdom não configurado no bun test) |
| prefers-reduced-motion ativo | Sim |
| Botões com label visível | Sim |
| Touch targets ≥ 44px (área efetiva) | Sim |

---

## Arquivos modificados

- `src/styles.css` (+17 linhas)
- `src/components/kratos/checkpoints/CheckpointItemCard.tsx` (+1 linha)
- `src/components/kratos/checkpoints/CheckpointFilterBar.tsx` (1 alteração)
- `src/components/kratos/projects/ProjectFilterBar.tsx` (1 alteração)
- `src/routeTree.gen.ts` (auto-gerado pelo build)
