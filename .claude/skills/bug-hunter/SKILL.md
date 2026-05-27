---
id: bug-hunter
name: Bug Hunter
description: Debugging sistemático para o KRATOS — hipótese → evidência → fix mínimo. Nunca vai direto para solução sem entender a causa raiz.
tags: [debugging, bug, systematic, root-cause]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P0
anthropic_principle: root-cause-first — fix sem causa raiz é bug temporário, não solução
---

# SKILL: Bug Hunter

## Propósito
Encontrar e corrigir bugs do KRATOS com método científico: observar → hipótese → evidência → fix mínimo → verificar. Nunca pular etapas.

## Quando Usar
- Qualquer bug, erro ou comportamento inesperado
- Build falhando sem motivo óbvio
- Teste quebrado
- Comportamento visual errado
- SSE/dados não atualizando

## Inputs
- Sintoma observado (o que está acontecendo)
- Comportamento esperado
- Como reproduzir (passo a passo)
- Contexto: branch, últimas mudanças

## Processo

### Passo 1 — Observar sem tocar
```bash
git status --short                    # mudanças recentes
git log --oneline -5                  # commits que podem ter causado
bun run build 2>&1 | head -20        # erros de build
bun test 2>&1 | grep -E "FAIL|Error" # testes falhando
```
**REGRA:** Não mudar nada antes de entender a causa.

### Passo 2 — Classificar o bug
| Tipo | Sintoma | Onde buscar |
|---|---|---|
| TypeScript | Erro de build, tipo errado | `bun run build`, editor |
| Runtime | Erro no console, crash | DevTools console |
| Visual | Layout quebrado, cor errada | DevTools elements |
| Dados | Dado errado, não atualiza | Network tab, hook |
| SSE | Stream não conecta/atualiza | `useLiveStatus.ts`, `useLiveKratos.ts` |
| Rota | 404, loader falha | `src/routes/`, loader function |
| Build | Vite/Rollup error | `bun run build` output |

### Passo 3 — Formular hipótese
```
Hipótese 1: <causa provável mais simples>
Evidência para testar: <o que verificar>

Hipótese 2: <segunda causa possível>
Evidência para testar: <o que verificar>
```

### Passo 4 — Testar hipóteses
Verificar hipótese 1 antes de mudar qualquer coisa:
```bash
# Exemplo: bug de SSE duplicado
grep -rn "EventSource" src/ --include="*.ts" --include="*.tsx"
# Encontrou? → hooks duplicados → hipótese confirmada
```

### Passo 5 — Fix mínimo
- **Escopo mínimo**: toque apenas o arquivo causador
- **Zero refactor**: não "melhorar" código fora do bug
- **Zero novas features**: bug fix não é oportunidade de feature
- **Comentário de causa**: `// Fix: <causa raiz em uma linha>`

### Passo 6 — Verificação
```bash
bun run build    # build limpo
bun test         # todos os testes passando
# Reproduzir o bug → confirmar que foi corrigido
# Testar caminho adjacente → sem regressão
```

### Passo 7 — Relatório curto
```
BUG HUNT — <descrição>
Sintoma:     <o que estava acontecendo>
Causa raiz:  <o que causou>
Fix:         <arquivo:linha — o que foi mudado>
Verificado:  build PASS, tests PASS, bug reproduzido e corrigido
Risco:       nenhum / <componente que pode ter impacto>
```

## Armadilhas comuns no KRATOS

**SSE duplicado:** dois hooks abrindo `EventSource` para o mesmo endpoint
→ Buscar: `grep -rn "EventSource" src/`

**Árvore errada:** componente em `frontend/` não aparece em `src/`
→ Buscar: onde exatamente está o arquivo

**Token legado:** `var(--kratos-*)` não resolvido em dark mode
→ Buscar: `grep -rn "var(--kratos-" src/`

**routeTree.gen.ts:** rota não aparece porque arquivo editado manualmente
→ Fix: nunca editar, rodar `bun run dev` para regenerar

**project-state.json desatualizado:** branch errada sendo lida como estado
→ Fix: não confiar em cache de estado, sempre `git status`

## Anti-patterns
- Fix sem entender a causa raiz
- Refatorar código ao redor do bug
- "Funciona na minha máquina" sem evidência
- Fechar bug sem `bun run build` + `bun test` passando

## Saída Esperada
Causa raiz identificada, fix mínimo aplicado, build+tests passando, relatório de 5 linhas.
