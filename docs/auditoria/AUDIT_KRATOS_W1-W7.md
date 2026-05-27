# AUDITORIA KRATOS WAVE W1-W7 — Pre-Merge
**Data:** 2026-05-27 03:12:00 -03:00 | **Auditor:** Codex  
**Veredito:** ❌ REPROVADO

## Resumo executivo
A auditoria W1→W7 foi executada com evidência real (comandos rodados localmente), incluindo gates de build/test e varredura de boundary/secrets P0.  
Não encontrei violação P0 da boundary "KRATOS lê, Aurora comanda" em componentes de UI, nem exposição de secrets sensíveis via `VITE_` (incluindo `PUBLER_API_KEY` e `MANYCHAT_API_KEY`).  
Porém, o estado atual não está pronto para merge: `bun run typecheck`/`bun run test` não resolvem scripts no ambiente atual, há falha de type safety em `tsc --noEmit` (94 erros), e o cenário de 15 falhas e2e Playwright permanece.

## Checklist por dimensão
| Dimensão | Status | Detalhe |
|---|---|---|
| Build + TypeScript | ❌ | `bun run typecheck` falha (script não encontrado no runtime atual) e `npx tsc --noEmit` retorna 94 erros |
| Boundary (lê/comanda) | ✅ | Busca em `src/components` sem `useMutation/apiPost/apiPut/apiPatch/apiDelete` |
| Testes passam | ⚠️ | `bun test tests/stores tests/contracts` = 270/270 pass; e2e Playwright com histórico de 15 falhas |
| Zod validação | ⚠️ | Contratos existem, mas validação strict não está uniforme em todos os fluxos W1-W7 |
| Data fetching | ✅ | Camada baseada em hooks/query (sem fetch manual espalhado na UI auditada) |
| Performance/bundle | ⚠️ | Build passa; chunk principal: 660.53 kB raw / 205.38 kB gzip |
| SSE real-time | ✅ | Estrutura de SSE/reconexão presente e funcional no escopo auditado |
| Secrets/env | ✅ | Sem `VITE_*` sensível em uso cliente; `.env` e `.env.*` ignorados no git |
| Aderência ao spec | ⚠️ | W1-W7 majoritariamente entregues, com W7 seguindo boundary read-only |

## 🔴 P0 (bloqueiam — corrigir AGORA)
1. **Nenhum P0 de boundary/secrets encontrado nesta auditoria.**

## 🟡 P1 (corrigir antes da próxima wave)
1. Gate de comando inconsistente: `bun run typecheck` e `bun run test` não resolvem scripts neste ambiente de execução.
2. `npx tsc --noEmit` com 94 erros impede afirmar type safety da branch.
3. E2E permanece com 15 falhas no histórico (`.e2e_output.txt`) e reexecução atual via Playwright foi bloqueada por `EPERM` em `test-results/.last-run.json`.
4. Evidência histórica conflitante: `git log -- tests/e2e` mostra commit `9c37638` com relato de **42/45 pass**; portanto, não foi possível comprovar que as 15 falhas atuais sejam “pré-existentes” sem reexecução limpa.

## 🟢 P2 (melhorias)
1. Fixar script explícito `typecheck` no `package.json` e alinhar runner usado no CI/local.
2. Normalizar baseline e2e com armazenamento de resultados sem lock de arquivo em Windows.

## Evidência (comandos executados)
1. `bun run typecheck` → `error: Script not found "typecheck"`
2. `bun run test` → `error: Script not found "test"`
3. `bun run build` → **PASS** (client + SSR)
4. `bun test tests/stores tests/contracts` → **270 pass / 0 fail**
5. `npx tsc --noEmit` → **94 erros TS**
6. `rg -n "useMutation\\(|apiPost\\(|apiPut\\(|apiPatch\\(|apiDelete\\(" src/components` → sem ocorrência
7. `rg -n "VITE_[A-Z0-9_]+" src backend docs` + leitura de `.env.local` / `.env.local.example` → sem `VITE_PUBLER_API_KEY` e sem `VITE_MANYCHAT_API_KEY`
8. `npx playwright test --reporter=line` → bloqueado por `EPERM` (arquivo `.last-run.json`)
9. `Get-Content .e2e_output.txt` → registra **15 failed / 3 skipped / 28 passed**
10. `git log --oneline -20 -- tests/e2e` → inclui `9c37638 fix(kratos): stabilize e2e — 42/45 pass, 0 fail, 3 skip justified`

## Confirmação sobre os 15 testes falhos (Playwright + jsdom)
- **Playwright:** há evidência local de 15 falhas em `.e2e_output.txt`.  
- **Revalidação em tempo real:** tentativa de nova execução foi bloqueada por `EPERM` no arquivo de resultado do Playwright (ambiente).  
- **Pré-existente vs regressão:** com o estado atual, **não foi possível confirmar como “pré-existente”** com segurança; há sinal histórico de baseline melhor no passado (`9c37638`), sugerindo possível regressão em algum ponto posterior.  
- **jsdom/contracts:** subset atual (`tests/stores` + `tests/contracts`) está verde (270/270), sem falha jsdom no recorte auditado.

## Veredito final
- [ ] PODE seguir para próxima wave
- [x] PRECISA corrigir P0 antes
- [x] **NÃO PODE MERGEAR em `main` neste estado**, por gate técnico (type safety/consistência de execução) ainda não fechado.
