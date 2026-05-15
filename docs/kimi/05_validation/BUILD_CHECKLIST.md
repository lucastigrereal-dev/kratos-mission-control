# Checklist de Build

Antes de commitar qualquer microfase do frontend, execute esta lista:

1. **Verificar dependências** — Certifique‑se de que nenhuma nova dependência foi instalada sem justificativa.
2. **Rodar build** — Execute `npm run build` no diretório `frontend` e corrija qualquer erro de compilação.
3. **Testes backend** — Execute `python -m pytest -q` no diretório `backend` para garantir que a API não foi impactada.
4. **Smoke tests** — Chame `/health`, `/live/snapshot`, `/mission/lens`, `/context/current`, `/tasks` e `/projects` para verificar que o backend está íntegro.
5. **git diff** — Revise `git diff --cached --name-only` e confirme que não há arquivos inesperados (backend, .env, banco, `node_modules`, `dist`).
6. **CI** — Caso exista, rode qualquer script de integração contínua configurado para a aplicação.