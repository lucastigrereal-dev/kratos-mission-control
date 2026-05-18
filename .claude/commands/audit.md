# /audit — Full Project Audit

Executa build + testes + lint e reporta resultado consolidado.

## Execution Steps

1. `bun run build` — client + SSR build
2. `bun run test` — unit tests (stores, contracts)
3. `bun run lint` — (se disponível) verificar erros novos
4. `git status --short` — working tree cleanliness
5. `git branch --show-current` — confirm branch

## Output Format

```
KRATOS AUDIT — <timestamp>
Branch: <branch>
Build:  PASS/FAIL (<time>s)
Tests:  <N> pass / <M> fail / <K> files
Lint:   PASS/FAIL
Status: CLEAN/DIRTY
Verdict: READY / BLOCKED
```

## Blocked If

- Build tem erros
- Testes falham
- Working tree tem arquivos modificados não rastreados (exceto `.claude/worktrees/`)

## Notes

- Não faz commit, push, ou deploy
- Não altera código
- Read-only audit
