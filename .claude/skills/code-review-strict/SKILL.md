---
id: code-review-strict
name: Code Review Strict
description: Revisão rigorosa de código para o KRATOS — verifica TypeScript, arquitetura, design system, performance e segurança antes de qualquer commit.
tags: [code-review, quality, typescript, architecture]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P1
anthropic_principle: verify-output — revisar antes de entregar, encontrar problemas cedo é mais barato
---

# SKILL: Code Review Strict

## Propósito
Ser o gate de qualidade técnica antes do commit. Encontra bugs, violações de arquitetura e problemas de design antes de chegarem ao main.

## Quando Usar
- Antes de qualquer commit com mudanças significativas
- Lucas pedir "revisa o código"
- Após implementar feature com múltiplos arquivos
- Antes de merge para main

## Inputs
- Arquivos modificados (ou `git diff`)
- Contexto da mudança

## Processo

### Passo 1 — TypeScript Audit
```
[ ] Zero any? (grep -rn ": any" src/ --include="*.tsx")
[ ] Props com interface (não type)?
[ ] Named exports (não default)?
[ ] Tipos explícitos em funções públicas?
[ ] Zod validando entrada de API?
[ ] Schemas em api-contract/ (não inline)?
```

### Passo 2 — Arquitetura Audit
```
[ ] Dados de rota no loader (não useEffect)?
[ ] useApi<T>() em vez de fetch() raw?
[ ] Sem Redux/Zustand/stores globais novos?
[ ] Componentes em src/components/kratos/<dominio>/?
[ ] NUNCA em frontend/ (árvore errada)?
[ ] routeTree.gen.ts intocado?
[ ] Sem process.env no servidor (usar c.env)?
[ ] Componentes protegidos não alterados sem autorização?
```

### Passo 3 — Design System Audit
```
[ ] Zero hex inline?
[ ] var(--kr-*) em vez de var(--kratos-*) legado?
[ ] Dark mode funcional?
[ ] Mobile 375px verificado?
[ ] Loading/Empty/Error states presentes?
[ ] Source badge onde necessário?
[ ] prefers-reduced-motion respeitado?
[ ] Framer Motion com duração ≤ 0.3s?
```

### Passo 4 — Performance Audit
```
[ ] Sem re-renders desnecessários (useMemo/useCallback onde óbvio)?
[ ] Imagens com lazy loading?
[ ] Bundle size: sem import de lib enorme sem necessidade?
[ ] TanStack Query com staleTime razoável?
[ ] SSE/EventSource: sem duplicação de listeners?
[ ] Animações desligam com prefers-reduced-motion?
```

### Passo 5 — Segurança Básica
```
[ ] Sem secrets hardcoded?
[ ] Inputs validados com Zod na boundary?
[ ] Sem eval() ou dangerouslySetInnerHTML sem sanitização?
[ ] Sem URLs construídas com concatenação de input do usuário?
[ ] c.env usado no servidor (não process.env)?
```

### Passo 6 — Relatório
```
CODE REVIEW — <arquivo(s)>
TypeScript:   PASS / FAIL (<N> issues)
Arquitetura:  PASS / FAIL (<issues>)
Design:       PASS / FAIL (<issues>)
Performance:  PASS / WARN (<issues>)
Segurança:    PASS / FAIL (<issues>)
────────
Verdict: APPROVED / CHANGES REQUIRED
Issues:
  BLOCKER: <arquivo:linha> — <problema + fix>
  WARNING: <arquivo:linha> — <problema + sugestão>
```

**BLOCKER** = não pode commitar até corrigir
**WARNING** = deve corrigir mas não bloqueia

## Critérios para APPROVED
- Zero BLOCKERs
- WARNINGs documentados e aceitos
- Build passando
- Tests passando

## Anti-patterns que o Review bloqueia
- `any` em código novo — usar tipo específico
- `useEffect` para fetch de dados de rota — usar loader
- Componente em `frontend/` — mover para `src/`
- `var(--kratos-*)` — migrar para `var(--kr-*)`
- Botão sem `onClick` — implementar ou remover

## Saída Esperada
Relatório com verdict, BLOCKERs e WARNINGs com arquivo:linha e ação específica.
