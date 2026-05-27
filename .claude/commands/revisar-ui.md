# /revisar-ui — QA Visual KRATOS

Revisão visual antes de qualquer commit com mudanças de UI.

## Uso
```
/revisar-ui <componente ou rota>
```

## Checklist completo

### Tokens
- [ ] Zero hex inline (`style={{ color: '#...' }}`)
- [ ] Zero `var(--kratos-*)` legado — usar `var(--kr-*)`
- [ ] Zero cores Tailwind hardcoded sem token equivalente

### Estados
- [ ] Loading state implementado (não spinner genérico)
- [ ] Empty state com título e ação sugerida
- [ ] Error state com mensagem útil
- [ ] Offline/degraded state se dado de API

### Visual
- [ ] Dark mode verificado
- [ ] Mobile 375px sem quebra de layout
- [ ] 1 ação primária por bloco (máx. proeminência)
- [ ] Máximo 7±2 elementos de decisão visíveis
- [ ] Posições fixas (spatial memory — não reorganiza)

### Animações
- [ ] Duração ≤ 0.3s
- [ ] `prefers-reduced-motion` verificado
- [ ] Sem loops infinitos decorativos
- [ ] Framer Motion com propósito, não decoração

### Anti-Slop
- [ ] Sem gradiente decorativo
- [ ] Sem grid 3 colunas simétricas preguiçosas
- [ ] Sem ícone em círculo colorido genérico
- [ ] Hierarquia visual intencional

### Dados
- [ ] Source badge em componentes com dado de API
- [ ] Timestamp de atualização visível se dado pode ficar stale

## Output
```
VISUAL QA — <componente>
Tokens:    PASS/FAIL
Estados:   PASS/FAIL
Visual:    PASS/FAIL
Animações: PASS/FAIL
Anti-Slop: PASS/FAIL
────────
Verdict: APPROVED / FIX REQUIRED
Lista: <arquivo:linha → ação>
```
