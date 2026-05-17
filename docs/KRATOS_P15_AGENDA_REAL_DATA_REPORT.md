# KRATOS P15 — Agenda Real Data Hardening

**Data:** 2026-05-16  
**Wave:** 15 — `agenda-real-data-hardening`  
**Status:** IMPLEMENTADO SEM COMMIT — gate de build bloqueado por `spawn EPERM`

---

## 1. Read-only scan

Arquivos lidos:

- `CLAUDE.md`
- `docs/KRATOS_CONTINUITY_AUDIT_REPORT.md`
- `docs/KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md`
- `docs/KRATOS_DOCS_INDEX.md`
- `docs/KRATOS_PLACEHOLDER_AUDIT.md`
- `docs/README.md`
- `src/components/kratos/views/AgoraView.tsx`
- `src/components/kratos/views/AgendaView.tsx`
- `src/hooks/useAppointments.ts`
- `api-contract/appointment.schema.ts`
- componentes de mentor/agenda usados pela tela

Confirmação:

- Diretório: `C:\Users\lucas\kratos-mission-control`
- Branch: `main`
- Projeto confirmado como KRATOS Mission Control.
- Nenhum `Supreme 210`, `G14 App Factory` ou `app_factory` encontrado.

---

## 2. Scope lock

Escopo efetivo:

- `src/components/kratos/views/AgendaView.tsx`
- `docs/KRATOS_P15_AGENDA_REAL_DATA_REPORT.md`

Fora do escopo:

- Backend
- Contratos Zod
- `routeTree.gen.ts`
- OMNIS/Akasha runtime
- Persistência nova

---

## 3. Contract check

Contrato validado:

- `api-contract/appointment.schema.ts`
- `useAppointments()` fornece `Appointment[]` com `data`, `horario`, `tipo`, `status`, `projetoId`.

Conclusão:

- Dados operacionais da agenda podem ser derivados de appointments reais.
- Dados AI-derived de mentor não possuem contrato dedicado. Portanto, não foi criado backend nem schema novo.

---

## 4. Implementação mínima

Removido:

- `MENTOR_MOCK.recommendation`
- `MENTOR_MOCK.score`
- `MENTOR_MOCK.risk`
- `MENTOR_MOCK.finishline`
- `MENTOR_MOCK.donotdo`

Substituído por derivação local a partir de dados reais:

- `deriveRecommendation(today, overdue, radar)`
- `deriveScore(appointments, today, overdue, radar)`
- `deriveFinishLine(appointments)`
- `deriveDoNotDo(today, overdue)`
- fallback de risco baseado em `useCheckpointSuggestion()` ou compromissos atrasados

Também foi corrigida a ordem de chamada de `useCheckpointSuggestion()` para ficar antes dos returns condicionais da view.

---

## 5. Acessibilidade/UX check

Sem mudança estrutural de layout.

Impacto UX:

- Cards de mentor agora refletem estado real da agenda/checkpoints.
- Quando não há risco real, `RiskProjectCard` exibe estado seguro de nenhum risco.
- Não foram adicionados botões decorativos.

---

## 6. Testes focados

Comando:

```bash
bun test tests/stores/appointment-store.test.ts
```

Resultado:

- 14 pass
- 0 fail

Observação:

- O runner também exibiu `EPERM` para leitura em `C:\Users\lucas\` e `C:\Users\lucas\tsconfig.json`, mas retornou sucesso para o arquivo de teste focado.

---

## 7. Build/typecheck

Comando:

```bash
bunx tsc --noEmit --pretty false
```

Resultado:

- `AgendaView.tsx` sem erros após correção.
- Persistem erros pré-existentes em `CheckpointsView.tsx`, `ContextoView.tsx`, `ProjetosView.tsx`, hooks server-fn e tipos de `bun:test`.

Comando:

```bash
bun run build
```

Resultado:

- Falhou antes de compilar a aplicação:
- `Error: spawn EPERM` ao Vite carregar `vite.config.ts` via esbuild.

Comando:

```bash
bun run lint
```

Resultado:

- Falhou por ambiente/permissão:
- `EPERM: operation not permitted, scandir '.pytest_cache'`

---

## 8. Smoke/visual

Não executado.

Motivo:

- Gate de build bloqueado por `spawn EPERM`.
- Não foi iniciado servidor dev.

---

## 9. Relatório da wave

Este arquivo é o relatório da Wave 15.

Resumo:

- AgendaView deixou de usar mocks AI-derived.
- Nenhum contrato/backend novo foi inventado.
- A substituição ficou limitada a dados reais já disponíveis por `useAppointments()` e `useCheckpointSuggestion()`.

---

## 10. Commit seletivo

Commit não executado.

Motivo:

- Regra do usuário: commit somente com build/testes verdes.
- `bun run build` falhou por `spawn EPERM`.

Arquivos alterados nesta wave:

- `src/components/kratos/views/AgendaView.tsx`
- `docs/KRATOS_P15_AGENDA_REAL_DATA_REPORT.md`

---

## Riscos restantes

1. Gate de build local bloqueado por `spawn EPERM` no Vite/esbuild.
2. Lint local bloqueado por `EPERM` em `.pytest_cache`.
3. Typecheck completo ainda aponta erros fora do escopo da Wave 15.
4. Working tree inicial já estava sujo antes da wave, incluindo docs, `AgoraView.tsx`, `DashboardView.tsx`, `styles.css` e dois arquivos não rastreados com encoding corrompido.

---

## Próximo passo recomendado

Resolver o bloqueio local de permissões (`spawn EPERM` e `.pytest_cache`) e rodar novamente:

```bash
bun run build
bun run lint
bun test
```

Se os gates passarem, fazer commit seletivo apenas dos arquivos da Wave 15.
