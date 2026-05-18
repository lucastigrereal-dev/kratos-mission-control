# /preflight — Pre-Commit Checklist

Executa todos os gates obrigatórios antes de um commit.

## Execution Steps

1. `bun run build` — deve passar limpo
2. `bun run test` — todos os testes passam
3. `git diff --stat` — revisar arquivos modificados
4. `git diff --cached --stat` — revisar arquivos staged (se houver)
5. Verificar regras qualitativas:
   - Zero `any` no diff
   - Nenhum `style={{ color: "#..." }}` no diff
   - Nenhum `console.log` no código staged
   - Nenhuma edição em `src/routeTree.gen.ts`
   - Nenhuma edição em componentes protegidos

## Output Format

```
KRATOS PREFLIGHT — <timestamp>
Build:   PASS/FAIL
Tests:   PASS/FAIL
Diff:    <N> files changed
Staged:  <M> files staged
Quality: PASS/FLAGGED
────────
Verdict: CLEARED FOR COMMIT / BLOCKED
```

## Blocked If

- Qualquer gate falha
- Componente protegido foi alterado sem autorização
- `console.log` ou hex color ou `any` encontrado no diff

## Notes

- Não faz o commit automaticamente
- Apenas valida e reporta
- Se passar, sugere mensagem de commit no padrão conventional commits
