# /status — Project Status Snapshot

Mostra o estado atual do projeto de forma consolidada.

## Execution Steps

1. `git status --short` — working tree
2. `git branch --show-current` — branch atual
3. `git log --oneline -5` — últimos commits
4. Ler `.claude/state/project-state.json` — estado registrado
5. Verificar worktrees ativos: `git worktree list`

## Output Format

```
KRATOS STATUS — <timestamp>
Branch:    <branch>
Last Commit: <hash> <message>
Phase:     <current phase from state.json>
Worktrees: <N> active
Status:    CLEAN / DIRTY (<untracked files>)
Build:     <last build result>
Tests:     <last test result>
Next:      <next_action from state.json>
```

## Notes

- Read-only
- Atualiza `.claude/state/project-state.json` com timestamp desta verificação
- Se state.json está desatualizado vs git log, flag "STATE STALE" no output
