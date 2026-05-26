---
id: design-system-guardian
name: Design System Guardian
description: Audita e protege o design system do KRATOS — detecta drift de tokens, AI-slop, inconsistências visuais e violações antes do commit.
tags: [design-system, tokens, audit, consistency, anti-slop]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P0
anthropic_principle: verify-before-commit — auditar output antes de entregar, não depois
---

# SKILL: Design System Guardian

## Propósito
Ser o revisor visual que bloqueia drift de design antes de chegar ao commit. Atua como gate de qualidade visual.

## Quando Usar
- Após criar/modificar qualquer componente visual
- Antes de commit com mudanças de UI
- Quando Lucas pedir "revisa o design"
- Antes de qualquer demo ou screenshot

## Inputs
- Arquivo(s) modificado(s) ou componente a auditar
- Diff do git (opcional, melhora precisão)

## Processo

### Passo 1 — Token Audit
```bash
# Hex inline PROIBIDO
grep -rn "style={{" src/components/kratos/ --include="*.tsx" | grep "color\|background"
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/kratos/ --include="*.tsx"

# Família correta: --kr-* (não --kratos-* legado)
grep -rn "var(--kratos-" src/components/kratos/ --include="*.tsx"

# Tailwind colors hardcoded (suspeito)
grep -rn "text-blue-\|bg-red-\|text-gray-500" src/components/kratos/ --include="*.tsx"
```

Tokens corretos:
- Cores: `var(--kr-color-*)`, `var(--background)`, `var(--foreground)`
- Glass: `var(--kr-glass-bg)`, `.kr-glass`, `.kr-glass-strong`
- Animação: duração ≤ 0.3s, `ease: 'easeOut'`

### Passo 2 — Anti-Slop Audit
```
[ ] Gradiente decorativo (from-X to-Y sem propósito)?
[ ] Grid 3 colunas simétricas preguiçosas?
[ ] Ícone em círculo colorido sem função?
[ ] Card title + description + button clone?
[ ] Tipografia plana, sem contraste de hierarquia?
[ ] Cor de destaque em > 3 elementos na tela?
[ ] Empty state só com <p>Sem dados</p>?
[ ] Loading = <Spinner /> sem contexto de forma?
[ ] Botão sem onClick handler?
[ ] Framer Motion em elemento que não precisa de animação?
```

### Passo 3 — Neuro-UX Audit
```
[ ] > 7 elementos de decisão visíveis?
[ ] Posições de elementos mudam entre renders?
[ ] Popup sem trigger explícito do usuário?
[ ] Animação > 0.3s ou loop infinito?
[ ] prefers-reduced-motion não verificado?
[ ] Mobile 375px verificado?
[ ] Dark mode verificado?
[ ] Alerta crítico em cor decorativa?
```

### Passo 4 — Source Badge Audit
Componentes que exibem dado de API DEVEM ter source badge:
```tsx
// Obrigatório quando source pode ser mock/cached/offline
<SourceBadge source={data.source} />
// source: 'live' | 'cached' | 'mock' | 'offline' | 'fallback'
```

### Passo 5 — Relatório
```
DESIGN AUDIT — <componente>
Tokens:       PASS / FAIL (<N> violações)
Anti-Slop:    PASS / FAIL (<problemas>)
Neuro-UX:     PASS / FAIL (<problemas>)
Source Badge: PASS / MISSING
────────
Verdict: APPROVED / NEEDS REVISION
Fix list:
  1. <arquivo:linha> — <ação específica>
  2. ...
```

## Critérios de Qualidade
- Zero hex inline após auditoria
- Zero `var(--kratos-*)` legado
- Zero elementos decorativos sem propósito
- Source badge em todo dado de API
- Dark mode funcional (dark-only no KRATOS)

## Anti-patterns que o Guardian bloqueia
- `style={{ color: '#...' }}` → token
- `var(--kratos-*)` → migrar para `var(--kr-*)`
- `<div>Sem dados</div>` → `<EmptyState />`
- Botão sem `onClick` → remover ou implementar
- `motion.div` em grid estático → remover

## Saída Esperada
Relatório com: status por categoria, lista `arquivo:linha → ação`, verdict final.
