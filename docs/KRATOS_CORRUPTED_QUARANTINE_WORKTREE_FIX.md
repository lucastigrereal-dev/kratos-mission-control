# KRATOS — Correção de quarentena corrompida bloqueando worktrees

## Problema

`git worktree add` falhou no Windows com:

- `Filename too long`
- `fatal: Could not reset index file to revision 'HEAD'`

A causa foi a existência de arquivos de quarentena dentro de `.claude/` com nomes corrompidos e longos demais.

## Decisão

Remover esses arquivos do índice do Git usando `git rm --cached -f`, preservando a segurança do projeto e impedindo que novos worktrees tentem recriar esses nomes inválidos.

## Segurança

- Nenhum arquivo de produto foi alterado.
- Nenhum secret foi lido.
- Nenhum deploy foi feito.
- O objetivo é apenas desbloquear `git worktree add`.

## Próximo passo

Commitar a remoção do índice e recriar as worktrees paralelas.
