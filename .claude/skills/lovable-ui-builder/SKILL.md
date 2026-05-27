---
id: lovable-ui-builder
name: Lovable UI Builder
description: Constrói UI premium para o KRATOS que supera Lovable/v0 — intenção visual real, hierarquia clara, Framer Motion estratégico, neuro-UX e zero AI-slop.
tags: [ui, frontend, design, premium, neuro-ux, framer-motion]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P0
anthropic_principle: be-specific — componente com hierarquia intencional, não output genérico de IA
---

# SKILL: Lovable UI Builder

## Propósito
Produzir componentes e telas com qualidade visual que supera Lovable, v0 e output genérico de IA. UI que parece feita por designer + dev sênior com intenção.

## Quando Usar
- Qualquer componente novo em `src/components/kratos/<dominio>/`
- Refinar componente com problema visual
- Nova tela/rota completa
- Quando precisar de animação com Framer Motion

## Inputs
- Nome e propósito do componente
- Dados que exibe (tipos TypeScript)
- Contexto visual (onde aparece, hierarquia na tela)

## Processo

### Passo 1 — Intenção visual antes do código
Definir ANTES de escrever:
- **O que o olho vê primeiro?** (elemento mais proeminente)
- **1 ação primária** — botão, CTA ou informação central
- **Densidade** — quantas informações sem poluir
- **Tom** — urgente? calmo? crítico? informativo?

### Passo 2 — Anti-Slop Checklist (reprovar se qualquer um aparecer)
```
[ ] Gradiente decorativo sem propósito?
[ ] Grid 3 colunas simétricas preguiçosas?
[ ] Ícone em círculo colorido genérico?
[ ] Card title + description + button sem hierarquia?
[ ] Tipografia plana, mesmo tamanho em tudo?
[ ] Cor de destaque em 5+ elementos na tela?
[ ] Empty state só com texto genérico?
[ ] Loading = spinner básico sem forma?
[ ] Botão sem onClick handler?
[ ] style={{ color: '#...' }} no código?
```

### Passo 3 — Stack visual obrigatória
```tsx
// Tokens KRATOS — var(--kr-*) SEMPRE
className="bg-[var(--kr-glass-bg)] border-[var(--kr-border-subtle)]"
className="text-[var(--kr-text-primary)]"

// Framer Motion para transições que importam
import { motion, AnimatePresence } from 'framer-motion'

// Uso estratégico — não em tudo
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: 'easeOut' }}
>

// prefers-reduced-motion sempre
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
transition={{ duration: prefersReduced ? 0 : 0.25 }}
```

### Passo 4 — Estrutura obrigatória
```tsx
interface <Name>Props {
  // props explícitas — zero any
}

export function <Name>({ ... }: <Name>Props) {
  // 1. Loading
  if (isLoading) return <LoadingState label="<contexto>" />

  // 2. Error
  if (error) return <ErrorState message={error.message} />

  // 3. Empty
  if (!data?.length) return (
    <EmptyState
      title="<título específico>"
      description="<ação que o usuário pode fazer>"
    />
  )

  // 4. Main — hierarquia visual intencional
  return (...)
}
```

### Passo 5 — Neuro-UX Rules
- Máximo 7±2 elementos de decisão visíveis (Lei de Miller)
- 1 ação primária destacada com `ring-2 ring-[var(--kr-color-mission)]`
- Posições fixas — spatial memory, nunca reorganiza sozinho
- Animações: duração ≤ 0.3s, `ease: 'easeOut'`, sem loops infinitos
- Alertas críticos: apenas vermelho/âmbar — nunca para decoração
- Dark mode: testar sempre (KRATOS é dark-first/dark-only)

### Passo 6 — Framer Motion — quando usar
| Usar | Não usar |
|---|---|
| Entrada de painéis contextuais | Background animations decorativas |
| Aurora orb → drawer | Cards em lista estática |
| Island overlay entrance | Loading spinners |
| Dock items em hover | Texto animado |
| Notificações/nudges | Gradientes em loop |

### Passo 7 — Gate final
```bash
bun run build   # zero erros
bun run lint    # zero erros novos
# Visual: dark mode + mobile 375px + prefers-reduced-motion
```

## Critérios de Qualidade (Anthropic: output específico, não genérico)
- Hierarquia visual intencional — não simétrica por padrão
- Zero hex inline — `var(--kr-*)` apenas
- 3 estados implementados: loading, empty, error
- Framer Motion usado com propósito, não decoração
- Dark mode funcional (KRATOS é dark-only)

## Anti-patterns PROIBIDOS
- `bg-gradient-to-r from-blue-500 to-purple-500`
- `style={{ color: '#3b82f6' }}`
- `any` em tipos de props
- Componente sem export nomeado
- `motion.div` em tudo sem critério
- Animação sem `prefers-reduced-motion`
- Working em `frontend/` — sempre `src/`

## Saída Esperada
Componente `.tsx` em `src/components/kratos/<dominio>/`: tipos explícitos, 3 estados, tokens CSS, Framer Motion estratégico, dark mode, zero anti-slop.
