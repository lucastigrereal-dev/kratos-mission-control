# /corrigir-bug — Debug Sistemático KRATOS

Debugging com método: observar → hipótese → evidência → fix mínimo.

## Uso
```
/corrigir-bug <sintoma observado>
```

## Processo obrigatório (não pular etapas)

**Passo 1 — Observar sem mudar nada**
```bash
git log --oneline -5           # o que mudou recentemente?
bun run build 2>&1 | head -20  # build está passando?
bun test 2>&1 | grep FAIL      # teste falhando?
```

**Passo 2 — Classificar**
- TypeScript/build → erro de tipo ou import
- Runtime → erro no console do browser
- Visual → DevTools elements
- Dados/SSE → Network tab, hooks
- Rota → loader, routeTree.gen.ts

**Passo 3 — Hipótese**
```
Hipótese: <causa mais provável em uma linha>
Evidência a verificar: <o que checar para confirmar>
```

**Passo 4 — Confirmar sem mudar**
Verificar evidência antes de tocar qualquer arquivo.

**Passo 5 — Fix mínimo**
- Escopo: apenas o arquivo causador
- Sem refactor
- Sem nova feature
- Comentário: `// Fix: <causa raiz>`

**Passo 6 — Verificar**
```bash
bun run build   # limpo
bun test        # passando
# Reproduzir o bug → confirmado corrigido
```

## Armadilhas KRATOS
- SSE duplicado: `grep -rn "EventSource" src/`
- Árvore errada: está em `frontend/` mas não `src/`
- Token legado: `grep -rn "var(--kratos-" src/`
- routeTree.gen.ts editado manualmente

## Output
```
BUG: <descrição>
Causa raiz: <uma linha>
Fix: <arquivo:linha — mudança>
Verificado: build PASS + test PASS + bug corrigido
```
