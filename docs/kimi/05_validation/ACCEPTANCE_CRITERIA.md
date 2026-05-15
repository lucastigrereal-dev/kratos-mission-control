# Critérios de Aceitação

Para aceitar uma microfase como concluída, os seguintes critérios devem ser satisfeitos:

1. **Escopo cumprido** — Todos os objetivos descritos no prompt de microfase foram implementados e validados.
2. **Regra de Ouro** — Nenhum backend foi tocado; `useLiveKratos`, SSE (`/live/stream`, `/live/snapshot`) e `/mission/lens` permanecem intactos.
3. **Sem duplicações** — Não foram criados componentes que já existiam.  Quando necessário, os componentes foram adaptados.
4. **Build e Testes** — O comando `npm run build` passa sem erros e `python -m pytest -q` retorna todos os testes aprovados.
5. **Checklist Visual** — Todos os itens obrigatórios do `VISUAL_QA_CHECKLIST.md` estão marcados como OK ou Ajuste leve (nenhum bloqueante).
6. **Commit Limpo** — O commit inclui apenas arquivos permitidos (frontend, docs, estilos).  O staged diff não contém `node_modules`, `.env`, banco de dados ou código de backend.
7. **Registro Atualizado** — `KIMI_ADOPTION_LOG.md` foi atualizado com as decisões e trechos utilizados, e `KIMI_NEXT_MICROPHASE.md` aponta para a próxima microfase.
8. **Riscos Documentados** — Qualquer divergência ou risco residual foi documentado no relatório final.

Se algum critério não for atendido, a microfase deve retornar para ajustes antes do commit final.