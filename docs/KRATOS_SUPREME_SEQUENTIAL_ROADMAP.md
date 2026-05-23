# KRATOS SUPREME — Roadmap Sequencial Oficial

**Versão:** 1.0 | **Criado:** 2026-05-15 | **Branch base:** `feature/kratos-kimi-supreme-zips-5waves`
**Status:** P0 concluído, P1 pendente de autorização

---

## Princípios

1. **Uma fase por vez** — nunca executar duas fases na mesma sessão sem autorização explícita.
2. **Commit pequeno** — cada fase gera no máximo 1 commit atômico com mensagem conventional commits.
3. **Sem alteração fora do escopo** — se a fase é de docs, não mexe em código.
4. **Backend e frontend não são mexidos sem fase específica** — cada um tem seu momento.
5. **Kimi é referência, não fonte automática de verdade** — ZIPs e código Kimi passam por adoption gate antes de tocar o frontend.
6. **OMNIS é integrado via bridge, não misturado no código sem contrato** — `omnis_collector.py` é a única interface.
7. **Aprovação antes de ação externa** — push, merge, deploy, delete exigem confirmação humana.
8. **Teste antes de merge** — nenhuma fase avança com testes quebrando.
9. **Relatório antes de próxima fase** — cada fase gera um relatório de conclusão.
10. **Rollback documentado** — toda fase tem instrução de desfazer.

## Fluxo de Execução

```
P0 → P1 → P1.5 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9 → P10 → P11 → P12 → P13 → P14
```

## Como Operar com Claude Code

1. Abrir sempre na raiz do KRATOS (`C:/Users/lucas/kratos-mission-control`)
2. Confirmar branch: `git branch --show-current`
3. Confirmar status: `git status --short`
4. Executar UMA fase conforme o prompt executor
5. Gerar relatório da fase
6. Commit pequeno (1 por fase)
7. Parar
8. Aguardar autorização humana para próxima fase

## Como Usar Kimi

1. Inventariar antes de tocar
2. Extrair apenas em `references/kimi/extracted/` (pasta isolada)
3. Mapear para componentes existentes (KratosVisualShell, WorldMap, etc.)
4. Classificar: ADOPT_NOW | ADAPT_LATER | REFERENCE_ONLY | REJECT | DUPLICATE
5. Adotar em microfases com approval gate
6. Testar visual ANTES e DEPOIS
7. Nunca sobrescrever `frontend/src/` diretamente com arquivo Kimi

## Condições para Avançar de Fase

A próxima fase só pode começar se:
- Relatório da fase anterior existir em `docs/`
- `git status --short` estiver limpo ou com justificativa documentada
- Todos os critérios de aceite da fase anterior estiverem CHECK
- Não houver arquivo ambíguo ou não rastreado sem explicação
- Usuário autorizar EXPLICITAMENTE com "AUTORIZO PX" ou similar

---

# FASES

---

## P0 — BASELINE LOCK

### 1. Nome
P0 — Baseline Lock

### 2. Objetivo
Travar o estado atual do repositório como baseline confiável antes de qualquer alteração. Gerar o roadmap oficial e commitar documentação pendente.

### 3. Por que vem primeiro
Sem baseline, qualquer alteração futura não tem ponto de comparação. O roadmap dita todas as fases seguintes. Esta fase é puramente documental — risco zero para código.

### 4. Arquivos permitidos
- `docs/KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md` (criar)
- `docs/KRATOS_P0_BASELINE_LOCK_REPORT.md` (criar)
- `docs/KRATOS_RECOVERY_AFTER_REBOOT_FINAL_REPORT.md` (modificar, já pendente)
- `docs/KRATOS_SUPREME_5WAVES_VISUAL_VALIDATION_REPORT.md` (adicionar, já pendente)

### 5. Arquivos proibidos
- `backend/**` — tudo
- `frontend/**` — tudo
- `src/**` — tudo
- `package.json` — ambos (raiz e frontend)
- `api-contract/**`
- `.env`
- `.git/config`
- Stash

### 6. Comandos seguros
```bash
git rev-parse --show-toplevel
git branch --show-current
git log -1 --oneline
git log --oneline -10
git status --short
git add docs/KRATOS_*.md docs/KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md
git commit -m "docs(kratos): baseline lock + supreme sequential roadmap"
git log --oneline -5
```

### 7. Comandos proibidos
- `git push`
- `git merge`
- `git rebase`
- `git reset --hard`
- `git clean`
- `rm` / `del`
- `npm install` / `pip install`
- `docker compose`

### 8. Entregáveis
- `docs/KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md` ← este arquivo
- `docs/KRATOS_P0_BASELINE_LOCK_REPORT.md`

### 9. Critérios de aceite
- [ ] Branch confirmada: `feature/kratos-kimi-supreme-zips-5waves`
- [ ] HEAD confirmado
- [ ] Working tree: apenas docs pendentes
- [ ] Roadmap criado com 15 fases (P0-P14)
- [ ] P0 report criado
- [ ] Commit de baseline executado (hash registrado)
- [ ] `git status --short` limpo após commit

### 10. Testes obrigatórios
Nenhum. Fase puramente documental.

### 11. Risco
**ZERO.** Nenhum código é alterado.

### 12. Rollback
```bash
git reset --soft HEAD~1  # desfaz o commit, mantém arquivos
```

### 13. Checklist de execução
- [x] Confirmar raiz
- [x] Confirmar branch
- [x] Confirmar HEAD
- [x] Confirmar status
- [x] Verificar pendências (só docs)
- [x] Criar roadmap
- [x] Criar P0 report
- [x] Commitar docs
- [x] Verificar status final

### 14. Prompt executor da fase
> "Executar P0 — Baseline Lock conforme docs/KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md. Confirmar estado, commitar apenas docs pendentes, gerar P0 report, parar."

### 15. Condição para P1
- P0 report existe
- Commit de baseline registrado
- `git status --short` limpo
- Usuário digitar "AUTORIZO P1"

---

## P1 — MERGE-READINESS FINAL

### 1. Nome
P1 — Merge-readiness Final

### 2. Objetivo
Decidir se a branch `feature/kratos-kimi-supreme-zips-5waves` está pronta para se tornar a base oficial de desenvolvimento ou se deve ser consolidada com `feature/kratos-1-visual-shell`.

### 3. Por que vem depois de P0
Com a baseline travada, o próximo passo natural é decidir o destino da branch atual. Não faz sentido executar outras fases se a base ainda está indefinida.

### 4. Arquivos permitidos
- `docs/KRATOS_P1_MERGE_READINESS_FINAL.md` (criar)
- `docs/KRATOS_BRANCH_DECISION_MATRIX.md` (criar)
- Leitura de todos os docs e código existentes

### 5. Arquivos proibidos
- `backend/**` (ler ok, escrever NÃO)
- `frontend/**` (ler ok, escrever NÃO)
- `package.json`
- Stash

### 6. Comandos seguros
```bash
git log --oneline --graph --all
git branch -a
git stash list
git diff main...HEAD --stat
git diff feature/kratos-1-visual-shell...HEAD --stat
```

### 7. Comandos proibidos
- `git push`, `git merge`, `git rebase`
- `git reset --hard`, `git clean`

### 8. Entregáveis
- `docs/KRATOS_P1_MERGE_READINESS_FINAL.md`
- `docs/KRATOS_BRANCH_DECISION_MATRIX.md`

### 9. Critérios de aceite
- [ ] Todos os gates documentados (WE7, WE8, WE9, WE10) lidos
- [ ] Diffs entre branches calculados
- [ ] Stash analisado (sem aplicar)
- [ ] Decisão documentada: MERGE_READY | MERGE_READY_WITH_NOTES | NOT_READY
- [ ] Próximo passo concreto definido

### 10. Testes obrigatórios
- Rodar `pytest tests/ -q` no backend (esperado: 139/140, falha Docker ok)

### 11. Risco
**BAIXO.** Análise apenas. Nenhuma alteração em código.

### 12. Rollback
N/A — fase de análise, sem alterações.

### 13. Checklist de execução
- [ ] Ler relatórios de gates (WE7-WE10)
- [ ] Calcular diff entre branches
- [ ] Rodar backend tests
- [ ] Analisar stash
- [ ] Emitir veredito
- [ ] Gerar P1 report
- [ ] Gerar branch decision matrix

### 14. Prompt executor da fase
> "Executar P1 — Merge-readiness Final. Analisar gates WE7-WE10, diff entre branches, status backend, stash. Emitir veredito MERGE_READY/NOT_READY. Gerar P1 report e decision matrix. Não executar merge."

### 15. Condição para P1.5
- P1 report concluído
- Decisão de branch registrada
- Usuário digitar "AUTORIZO P1.5"

---

## P1.5 — KIMI ZIP ADOPTION GATE

### 1. Nome
P1.5 — Kimi ZIP Adoption Gate

### 2. Objetivo
Criar o gate oficial de adoção dos materiais Kimi. Inventariar todos os ZIPs, classificar componentes, definir regras de adoção. Kimi é referência, não autoridade.

### 3. Por que vem depois de P1
Com a base definida, o próximo risco é contaminação do frontend por material Kimi não filtrado. O adoption gate isola esse risco antes de qualquer fase que mexa em frontend (P3, P5, P6+).

### 4. Arquivos permitidos
- `docs/kimi/09_adoption_gate/*` (criar/editar)
- `references/kimi/extracted/*` (criar, se necessário)
- `docs/KRATOS_P1_5_KIMI_ZIP_ADOPTION_GATE_REPORT.md` (criar)

### 5. Arquivos proibidos
- `frontend/src/**` — NÃO extrair ZIP aqui
- `backend/**` — NÃO extrair ZIP aqui
- `package.json` — NÃO copiar do Kimi
- CSS global — NÃO importar do Kimi

### 6. Comandos seguros
```bash
ls -la docs/kimi/
ls -la docs/kimi/00_inbox_original/
# leitura de arquivos Kimi, sem execução
```

### 7. Comandos proibidos
- `unzip` em `frontend/src/`
- `cp -r` de Kimi para frontend
- `npm install` de dependências Kimi
- Qualquer alteração em código existente

### 8. Entregáveis
- `docs/kimi/09_adoption_gate/KIMI_ZIP_INVENTORY.md`
- `docs/kimi/09_adoption_gate/KIMI_COMPONENT_TO_KRATOS_MAP.md`
- `docs/kimi/09_adoption_gate/KIMI_ADOPTION_RULES.md`
- `docs/KRATOS_P1_5_KIMI_ZIP_ADOPTION_GATE_REPORT.md`

### 9. Critérios de aceite
- [ ] Todos os ZIPs/materiais Kimi inventariados
- [ ] Cada componente classificado (ADOPT_NOW/ADAPT_LATER/REFERENCE_ONLY/REJECT/DUPLICATE/UNKNOWN)
- [ ] Mapa Kimi→KRATOS preenchido para 18 componentes atuais
- [ ] Regras de adoção documentadas
- [ ] Nenhum arquivo fora de `docs/kimi/` ou `references/kimi/`

### 10. Testes obrigatórios
Nenhum. Fase de inventário.

### 11. Risco
**BAIXO.** Apenas documentação e classificação. Zero alteração em código.

### 12. Rollback
Remover arquivos criados em `docs/kimi/09_adoption_gate/` se necessário.

### 13. Checklist de execução
- [ ] Mapear estrutura docs/kimi/
- [ ] Inventariar 00_inbox_original/
- [ ] Classificar cada item
- [ ] Mapear para componentes KRATOS atuais
- [ ] Definir regras de adoção
- [ ] Gerar P1.5 report

### 14. Prompt executor da fase
> "Executar P1.5 — Kimi ZIP Adoption Gate. Inventariar docs/kimi/, classificar todos os componentes, criar mapa Kimi→KRATOS, definir regras de adoção. NÃO extrair nada para frontend/src/. Gerar P1.5 report."

### 15. Condição para P2
- Inventário completo
- Classification map pronto
- Adoption rules documentadas
- Usuário digitar "AUTORIZO P2"

---

## P2 — API CONTRACT V1

### 1. Nome
P2 — API Contract V1

### 2. Objetivo
Preencher `api-contract/` com o contrato formal entre backend e frontend. Documentar todos os 27 endpoints com schema, consumer, fallback e erros esperados.

### 3. Por que vem depois de P1.5
Com o Kimi isolado, o contrato API é o próximo fundamento. Frontend e backend precisam de um contrato claro antes de qualquer alteração em qualquer um dos lados.

### 4. Arquivos permitidos
- `api-contract/KRATOS_API_CONTRACT_V1.md` (criar)
- `api-contract/live.snapshot.schema.json` (criar)
- `api-contract/live.stream.schema.md` (criar)
- `api-contract/collector-envelope.schema.json` (criar)
- `docs/KRATOS_P2_API_CONTRACT_REPORT.md` (criar)

### 5. Arquivos proibidos
- `backend/**` — não alterar
- `frontend/**` — não alterar
- `package.json` — não alterar

### 6. Comandos seguros
```bash
ls -la api-contract/
# leitura de backend/app/routers/*.py para documentar
```

### 7. Comandos proibidos
- Nenhuma alteração em código

### 8. Entregáveis
- `api-contract/KRATOS_API_CONTRACT_V1.md` — endpoints principais documentados
- `api-contract/live.snapshot.schema.json`
- `api-contract/live.stream.schema.md`
- `api-contract/collector-envelope.schema.json`
- `docs/KRATOS_P2_API_CONTRACT_REPORT.md`

### 9. Critérios de aceite
- [ ] 14+ endpoints documentados com método, objetivo, consumer, schema, fallback, erro, teste
- [ ] Schemas JSON válidos
- [ ] Envelope padrão documentado
- [ ] Collector status model documentado

### 10. Testes obrigatórios
Nenhum. Documentação apenas.

### 11. Risco
**ZERO.** Apenas documentação.

### 12. Rollback
Remover arquivos criados em `api-contract/`.

### 13. Checklist de execução
- [ ] Documentar /health
- [ ] Documentar /live/snapshot + /live/stream
- [ ] Documentar /mission, /context, /checkpoints
- [ ] Documentar /omnis, /system, /git, /docker
- [ ] Documentar /tasks, /projects, /alerts
- [ ] Documentar /mentor, /outputs
- [ ] Criar schemas JSON
- [ ] Gerar P2 report

### 14. Prompt executor da fase
> "Executar P2 — API Contract V1. Documentar endpoints principais em api-contract/. Gerar schemas JSON para live e collector envelope. Não alterar backend nem frontend. Gerar P2 report."

### 15. Condição para P3
- Contrato documentado
- Schemas criados
- Usuário digitar "AUTORIZO P3"

---

## P3 — FRONTEND TESTS MÍNIMOS

### 1. Nome
P3 — Frontend Tests Mínimos

### 2. Objetivo
Adicionar Vitest + React Testing Library ao frontend. Criar testes para hooks e componentes críticos sem alterar comportamento visual.

### 3. Por que vem depois de P2
Com o contrato API documentado, os testes de frontend podem usar os schemas como referência. Testes são pré-requisito para qualquer refatoração de CSS (P5) ou novas features (P6+).

### 4. Arquivos permitidos
- `frontend/vitest.config.ts` (criar)
- `frontend/src/test/setup.ts` (criar)
- `frontend/src/**/*.test.ts` / `*.test.tsx` (criar)
- `docs/KRATOS_P3_FRONTEND_TESTS_REPORT.md` (criar)

### 5. Arquivos proibidos
- `frontend/src/index.css` — não alterar
- `frontend/src/styles/kratos-tokens.css` — não alterar
- `backend/**` — não alterar
- Componentes existentes — não alterar lógica, apenas testar

### 6. Comandos seguros
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
npx vitest run
```

### 7. Comandos proibidos
- `npm install` de pacotes não relacionados a teste
- Alteração de `package.json` além de devDependencies de teste

### 8. Entregáveis
- `frontend/vitest.config.ts`
- `frontend/src/test/setup.ts`
- Testes para: `useApi`, `useLiveKratos`, `useCheckpointSuggestion`, `SourceBadge`, `LoadingSkeleton`, `ErrorState`, `EmptyState`
- `docs/KRATOS_P3_FRONTEND_TESTS_REPORT.md`

### 9. Critérios de aceite
- [ ] Vitest configurado e rodando
- [ ] 3 hooks com pelo menos 2 testes cada
- [ ] 3 componentes UI com smoke test
- [ ] `npx vitest run` passa sem erros
- [ ] Visual inalterado (build de verificação)

### 10. Testes obrigatórios
Os próprios testes criados são a validação.

### 11. Risco
**BAIXO.** Apenas adição de devDependencies e arquivos de teste. Código existente intocado.

### 12. Rollback
```bash
cd frontend
npm uninstall vitest @testing-library/react @testing-library/jest-dom jsdom
rm vitest.config.ts
rm -rf src/test/
rm src/**/*.test.*
```

### 13. Checklist de execução
- [ ] Instalar Vitest + RTL
- [ ] Configurar vitest.config.ts
- [ ] Criar setup de teste
- [ ] Testar useApi
- [ ] Testar useLiveKratos
- [ ] Testar useCheckpointSuggestion
- [ ] Testar SourceBadge, LoadingSkeleton, ErrorState, EmptyState
- [ ] Rodar suíte completa
- [ ] Gerar P3 report

### 14. Prompt executor da fase
> "Executar P3 — Frontend Tests Mínimos. Instalar Vitest + React Testing Library. Criar testes para 3 hooks e 3 componentes UI. Não alterar CSS nem lógica de componentes. Gerar P3 report."

### 15. Condição para P4
- Todos os testes passam
- Build não quebrou
- Usuário digitar "AUTORIZO P4"

---

## P4 — REACT VERSION DECISION

### 1. Nome
P4 — React Version Decision

### 2. Objetivo
Resolver ou documentar o conflito: raiz do projeto usa React 19 (TanStack Start/Lovable), frontend usa React 18. Decidir se isola, unifica ou documenta como known issue.

### 3. Por que vem depois de P3
Com testes no frontend, é seguro diagnosticar o impacto de versão. Se a decisão for migrar para React 19, os testes garantem que nada quebrou.

### 4. Arquivos permitidos
- `docs/KRATOS_P4_REACT_VERSION_DECISION.md` (criar)
- Leitura de todos os `package.json`, lock files, `node_modules/`

### 5. Arquivos proibidos
- `package.json` — não alterar sem aprovação explícita
- `frontend/package.json` — não alterar sem aprovação explícita
- Código fonte — não alterar

### 6. Comandos seguros
```bash
cat package.json | grep react
cat frontend/package.json | grep react
ls node_modules/react/package.json 2>/dev/null
ls frontend/node_modules/react/package.json 2>/dev/null
```

### 7. Comandos proibidos
- `npm install` / `npm update` — sem aprovação
- Alteração de dependências

### 8. Entregáveis
- `docs/KRATOS_P4_REACT_VERSION_DECISION.md`

### 9. Critérios de aceite
- [ ] Mapeamento completo: quais package.json usam qual React
- [ ] Verificado se `src/` raiz é ativo ou legado
- [ ] Decisão documentada: ISOLATE | UNIFY_V18 | UNIFY_V19 | DOCUMENT_AS_IS
- [ ] Plano de ação definido (se aplicável)

### 10. Testes obrigatórios
- `cd frontend && npx vitest run` (se P3 concluído)
- `cd backend && pytest tests/ -q`

### 11. Risco
**BAIXO.** Diagnóstico apenas. Nenhuma alteração.

### 12. Rollback
N/A — análise apenas.

### 13. Checklist de execução
- [ ] Mapear versões React no projeto
- [ ] Verificar se src/ é ativo
- [ ] Analisar lock files
- [ ] Rodar testes existentes
- [ ] Emitir decisão documentada
- [ ] Gerar P4 report

### 14. Prompt executor da fase
> "Executar P4 — React Version Decision. Diagnosticar conflito React 19 (raiz) vs React 18 (frontend). Emitir decisão documentada. Não alterar dependências sem aprovação. Gerar P4 report."

### 15. Condição para P5
- Decisão documentada
- Se requer ação, aguardar aprovação
- Usuário digitar "AUTORIZO P5"

---

## P5 — CSS SPLIT SEGURO COM REFERÊNCIA KIMI

### 1. Nome
P5 — CSS Split Seguro com Referência Kimi

### 2. Objetivo
Dividir `frontend/src/index.css` (2,935 linhas) em múltiplos arquivos por domínio. Usar Kimi apenas como referência de organização, não como fonte de regras CSS.

### 3. Por que vem depois de P4
Com testes (P3) e versão React decidida (P4), o terreno está seguro para uma refatoração de CSS. O adoption gate (P1.5) já classificou o que do Kimi pode ser referência.

### 4. Arquivos permitidos
- `frontend/src/styles/tokens.css` (mover de index.css)
- `frontend/src/styles/world.css` (extrair de index.css)
- `frontend/src/styles/shell.css` (extrair de index.css)
- `frontend/src/styles/components.css` (extrair de index.css)
- `frontend/src/styles/motion.css` (extrair de index.css)
- `frontend/src/styles/responsive.css` (extrair de index.css)
- `frontend/src/index.css` (reduzir para imports)
- `docs/KRATOS_P5_CSS_SPLIT_REPORT.md` (criar)

### 5. Arquivos proibidos
- `backend/**`
- `frontend/src/**/*.tsx` — não alterar componentes
- Kimi CSS global — não importar inteiro

### 6. Comandos seguros
```bash
cd frontend
npm run build  # verificar antes e depois
```

### 7. Comandos proibidos
- Não renomear classes CSS
- Não alterar valores de regras
- Não importar arquivos Kimi diretamente

### 8. Entregáveis
- 6 arquivos CSS splitados por domínio
- `frontend/src/index.css` reduzido a imports
- `docs/KRATOS_P5_CSS_SPLIT_REPORT.md`

### 9. Critérios de aceite
- [ ] CSS dividido em 6 domínios
- [ ] `index.css` só contém `@import`
- [ ] Build passa (`npm run build`)
- [ ] Testes passam (`npx vitest run`)
- [ ] Visual idêntico (comparar screenshots)
- [ ] Nenhuma classe renomeada

### 10. Testes obrigatórios
- `npx vitest run`
- `npm run build`
- Inspeção visual (antes/depois)

### 11. Risco
**MÉDIO.** Refatoração de CSS pode quebrar visual se imports não forem preservados corretamente. Sempre validar com build + screenshot.

### 12. Rollback
```bash
git checkout -- frontend/src/index.css
rm frontend/src/styles/tokens.css world.css shell.css components.css motion.css responsive.css
```

### 13. Checklist de execução
- [ ] Build antes (baseline)
- [ ] Screenshot antes
- [ ] Extrair tokens
- [ ] Extrair world
- [ ] Extrair shell
- [ ] Extrair components
- [ ] Extrair motion
- [ ] Extrair responsive
- [ ] Atualizar index.css com @import
- [ ] Build depois
- [ ] Screenshot depois
- [ ] Comparar
- [ ] Rodar testes
- [ ] Gerar P5 report

### 14. Prompt executor da fase
> "Executar P5 — CSS Split Seguro. Dividir index.css (2,935 linhas) em 6 domínios sem renomear classes nem alterar valores. Build + testes devem passar. Screenshot antes/depois. Gerar P5 report."

### 15. Condição para P6
- Build passa
- Visual idêntico
- Usuário digitar "AUTORIZO P6"

---

## P6 — OMNIS PAGE OPERACIONAL

### 1. Nome
P6 — OMNIS Page Operacional

### 2. Objetivo
Transformar `OmnisPage.tsx` em um painel operacional real da bridge OMNIS. Deve mostrar status, fonte (HTTP/fallback), último health, outputs recentes e riscos.

### 3. Por que vem depois de P5
Com CSS organizado e testes no frontend, adicionar funcionalidade a uma página existente é seguro. OMNIS é a única integração externa ativa — ter visibilidade dela é crítico.

### 4. Arquivos permitidos
- `frontend/src/pages/OmnisPage.tsx` (modificar)
- `frontend/src/components/OmnisStatusCard.tsx` (criar, se necessário)
- `frontend/src/components/OmnisOutputList.tsx` (criar, se necessário)
- `docs/KRATOS_P6_OMNIS_PAGE_REPORT.md` (criar)

### 5. Arquivos proibidos
- `backend/app/collectors/omnis_collector.py` — não alterar coletor
- `backend/app/routers/omnis.py` — não alterar rota
- Outras páginas — não alterar

### 6. Comandos seguros
```bash
cd frontend && npm run build
cd backend && pytest tests/test_omnis_collector.py -v
```

### 7. Comandos proibidos
- Não alterar backend
- Não alterar bridge

### 8. Entregáveis
- `frontend/src/pages/OmnisPage.tsx` atualizada
- Componentes auxiliares (se criados)
- `docs/KRATOS_P6_OMNIS_PAGE_REPORT.md`

### 9. Critérios de aceite
- [ ] Mostra OMNIS status (online/offline/degraded)
- [ ] Mostra fonte atual (HTTP ou filesystem fallback)
- [ ] Mostra último health check timestamp
- [ ] Mostra outputs recentes
- [ ] Aviso visível quando offline
- [ ] Build passa
- [ ] Testes passam

### 10. Testes obrigatórios
- `test_omnis_collector.py` (12/12)
- `npx vitest run` (frontend)
- `npm run build`

### 11. Risco
**BAIXO.** Modificação de uma página existente. Backend intocado.

### 12. Rollback
```bash
git checkout -- frontend/src/pages/OmnisPage.tsx
rm frontend/src/components/OmnisStatusCard.tsx OmnisOutputList.tsx  # se criados
```

### 13. Checklist de execução
- [ ] Analisar OmnisPage atual
- [ ] Planejar layout do painel
- [ ] Implementar status card
- [ ] Implementar output list
- [ ] Conectar com /omnis endpoint
- [ ] Build + testes
- [ ] Gerar P6 report

### 14. Prompt executor da fase
> "Executar P6 — OMNIS Page Operacional. Transformar OmnisPage em painel da bridge. Mostrar status, fonte, health, outputs. Não alterar backend. Gerar P6 report."

### 15. Condição para P7
- OmnisPage funcional
- Build + testes passam
- Usuário digitar "AUTORIZO P7"

---

## P7 — APPROVAL COCKPIT V1

### 1. Nome
P7 — Approval Cockpit V1

### 2. Objetivo
Criar um cockpit de aprovação local para ações operacionais (aprovar/rejeitar/adiar/pedir contexto). Sistema de fila de decisões sem execução automática de ações perigosas.

### 3. Por que vem depois de P6
OMNIS page trouxe visibilidade operacional. O approval cockpit adiciona capacidade de decisão. Juntos formam o ciclo "ver → decidir" da operação.

### 4. Arquivos permitidos
- `backend/app/routers/approvals.py` (criar)
- `backend/app/services/approval_service.py` (criar)
- `frontend/src/pages/ApprovalsPage.tsx` (criar)
- `frontend/src/components/ApprovalCard.tsx` (criar)
- `docs/KRATOS_P7_APPROVAL_COCKPIT_REPORT.md` (criar)

### 5. Arquivos proibidos
- Rotas/services existentes — não alterar
- Páginas existentes — não alterar

### 6. Comandos seguros
```bash
cd backend && pytest tests/ -q
cd frontend && npm run build
```

### 7. Comandos proibidos
- Commit automático
- Push
- Docker
- Delete
- Publish
- Ações externas

### 8. Entregáveis
- `backend/app/routers/approvals.py`
- `backend/app/services/approval_service.py`
- `frontend/src/pages/ApprovalsPage.tsx`
- `frontend/src/components/ApprovalCard.tsx`
- `docs/KRATOS_P7_APPROVAL_COCKPIT_REPORT.md`

### 9. Critérios de aceite
- [ ] CRUD de itens de aprovação
- [ ] Ações: approve, reject, defer, request_context
- [ ] Nenhuma ação externa executada automaticamente
- [ ] Testes backend passam
- [ ] Build frontend passa

### 10. Testes obrigatórios
- Adicionar `test_approvals.py` (mínimo 5 testes)
- `npx vitest run` para ApprovalCard

### 11. Risco
**MÉDIO.** Adiciona nova rota e service no backend. Isolado, sem acoplamento com sistemas existentes.

### 12. Rollback
```bash
rm backend/app/routers/approvals.py
rm backend/app/services/approval_service.py
rm backend/tests/test_approvals.py
rm frontend/src/pages/ApprovalsPage.tsx
rm frontend/src/components/ApprovalCard.tsx
```

### 13. Checklist de execução
- [ ] Criar approval_service.py
- [ ] Criar approvals router
- [ ] Registrar router no main.py
- [ ] Criar testes backend
- [ ] Criar ApprovalCard
- [ ] Criar ApprovalsPage
- [ ] Build + testes
- [ ] Gerar P7 report

### 14. Prompt executor da fase
> "Executar P7 — Approval Cockpit V1. Criar sistema de aprovação local (approve/reject/defer/request_context). Nova rota + service no backend, nova página + componente no frontend. Nenhuma ação externa automática. Gerar P7 report."

### 15. Condição para P8
- CRUD de aprovações funcional
- Build + testes passam
- Usuário digitar "AUTORIZO P8"

---

## P8 — MISSION CONTROL HOME V1

### 1. Nome
P8 — Mission Control Home V1

### 2. Objetivo
Transformar `VisaoGeralPage` na tela principal de orientação: "Onde estou?", "Missão atual?", "Próximo passo?", "O que está travado?", "Qual prioridade hoje?"

### 3. Por que vem depois de P7
Com OMNIS visível (P6) e capacidade de decisão (P7), a home page unifica tudo em uma visão de comando. É a camada de apresentação que consolida as fases anteriores.

### 4. Arquivos permitidos
- `frontend/src/pages/VisaoGeralPage.tsx` (modificar)
- `frontend/src/components/TodayMissionPanel.tsx` (criar)
- `frontend/src/components/NextBestActionCard.tsx` (criar)
- `frontend/src/components/BlockedItemsCard.tsx` (criar)
- `frontend/src/components/FocusNowCard.tsx` (criar)
- `docs/KRATOS_P8_MISSION_CONTROL_HOME_REPORT.md` (criar)

### 5. Arquivos proibidos
- Backend — não alterar (usa endpoints existentes)
- Outras páginas

### 6. Comandos seguros
```bash
cd frontend && npm run build && npx vitest run
```

### 7. Comandos proibidos
- Não alterar backend

### 8. Entregáveis
- `VisaoGeralPage.tsx` revisada
- 4 novos componentes
- `docs/KRATOS_P8_MISSION_CONTROL_HOME_REPORT.md`

### 9. Critérios de aceite
- [ ] 7 perguntas respondidas na home
- [ ] Componentes puxam dados de endpoints existentes
- [ ] Build passa
- [ ] Testes passam

### 10. Testes obrigatórios
- Smoke tests para os 4 novos componentes
- `npm run build`

### 11. Risco
**BAIXO.** Apenas frontend, usando endpoints existentes.

### 12. Rollback
```bash
git checkout -- frontend/src/pages/VisaoGeralPage.tsx
rm frontend/src/components/TodayMissionPanel.tsx NextBestActionCard.tsx BlockedItemsCard.tsx FocusNowCard.tsx
```

### 13. Checklist de execução
- [ ] Analisar VisaoGeralPage atual
- [ ] Criar TodayMissionPanel
- [ ] Criar NextBestActionCard
- [ ] Criar BlockedItemsCard
- [ ] Criar FocusNowCard
- [ ] Integrar na VisaoGeralPage
- [ ] Build + testes
- [ ] Gerar P8 report

### 14. Prompt executor da fase
> "Executar P8 — Mission Control Home V1. Transformar VisaoGeralPage em tela de comando respondendo 7 perguntas-chave. 4 novos componentes. Não alterar backend. Gerar P8 report."

### 15. Condição para P9
- Home page funcional
- Build + testes passam
- Usuário digitar "AUTORIZO P9"

---

## P9 — AURORA FULL-SCREEN MODE

### 1. Nome
P9 — Aurora Full-Screen Mode

### 2. Objetivo
Criar modo de conversa em tela cheia com Aurora. UI/UX e captura de comando. Sem IA real obrigatória — o backend decide o que responder.

### 3. Por que vem depois de P8
Com a home page unificando a visão operacional, Aurora full-screen oferece modo foco para análise profunda. Complementa, não substitui, a home.

### 4. Arquivos permitidos
- `frontend/src/pages/AuroraPage.tsx` (criar/modificar)
- `frontend/src/components/AuroraFullScreenPanel.tsx` (criar)
- `frontend/src/components/AuroraCommandInput.tsx` (criar)
- `docs/KRATOS_P9_AURORA_FULLSCREEN_REPORT.md` (criar)

### 5. Arquivos proibidos
- Backend — não alterar
- AuroraPanel existente — não quebrar

### 6. Comandos seguros
```bash
cd frontend && npm run build
```

### 7. Comandos proibidos
- Não integrar com IA externa sem aprovação

### 8. Entregáveis
- `AuroraPage.tsx`
- `AuroraFullScreenPanel.tsx`
- `AuroraCommandInput.tsx`
- `docs/KRATOS_P9_AURORA_FULLSCREEN_REPORT.md`

### 9. Critérios de aceite
- [ ] Modo full-screen funcional (F11 ou botão)
- [ ] Input de comando com histórico local
- [ ] Respostas renderizadas em卡片
- [ ] Botão para voltar à visão normal
- [ ] Build passa

### 10. Testes obrigatórios
- Smoke test para AuroraFullScreenPanel
- `npm run build`

### 11. Risco
**BAIXO.** Apenas frontend, sem IA real obrigatória.

### 12. Rollback
```bash
rm frontend/src/pages/AuroraPage.tsx
rm frontend/src/components/AuroraFullScreenPanel.tsx AuroraCommandInput.tsx
```

### 13. Checklist de execução
- [ ] Criar AuroraFullScreenPanel
- [ ] Criar AuroraCommandInput
- [ ] Criar/atualizar AuroraPage
- [ ] Integrar sem quebrar AuroraPanel existente
- [ ] Build + testes
- [ ] Gerar P9 report

### 14. Prompt executor da fase
> "Executar P9 — Aurora Full-Screen Mode. Criar modo tela cheia para Aurora com input de comando. Sem IA real obrigatória. Não quebrar AuroraPanel existente. Gerar P9 report."

### 15. Condição para P10
- Modo full-screen funcional
- AuroraPanel existente intacto
- Usuário digitar "AUTORIZO P10"

---

## P10 — CONTEXT MEMORY / PROJECT CONTINUITY

### 1. Nome
P10 — Context Memory / Project Continuity

### 2. Objetivo
Criar sistema de continuidade de projeto para evitar perda de contexto entre sessões. Rastrear projeto atual, última ação, próximo passo, arquivos importantes, risco de confusão.

### 3. Por que vem depois de P9
Com todas as telas principais implementadas, o risco de perda de contexto entre elas é real. Este sistema amarra todas as fases anteriores com persistência de sessão.

### 4. Arquivos permitidos
- `backend/app/routers/continuity.py` (criar, se necessário)
- `backend/app/services/continuity_service.py` (criar, se necessário)
- `frontend/src/components/ProjectContinuityCard.tsx` (criar)
- `docs/KRATOS_P10_CONTEXT_MEMORY_REPORT.md` (criar)

### 5. Arquivos proibidos
- Rotas/services existentes — não acoplar indevidamente

### 6. Comandos seguros
```bash
cd backend && pytest tests/ -q
cd frontend && npm run build
```

### 7. Comandos proibidos
- Não persistir dados sensíveis

### 8. Entregáveis
- Sistema de continuidade (backend + frontend)
- `docs/KRATOS_P10_CONTEXT_MEMORY_REPORT.md`

### 9. Critérios de aceite
- [ ] Rastreia: projeto atual, última ação, próximo passo, branch, arquivos críticos
- [ ] Retomada recomendada ao abrir KRATOS
- [ ] Build + testes passam

### 10. Testes obrigatórios
- Testes para continuity service
- Smoke test para ProjectContinuityCard

### 11. Risco
**BAIXO.** Sistema isolado, sem acoplamento com lógica crítica.

### 12. Rollback
Remover arquivos criados.

### 13. Checklist de execução
- [ ] Criar continuity_service
- [ ] Criar continuity router
- [ ] Criar ProjectContinuityCard
- [ ] Integrar na home ou sidebar
- [ ] Build + testes
- [ ] Gerar P10 report

### 14. Prompt executor da fase
> "Executar P10 — Context Memory. Criar sistema de continuidade de projeto. Rastrear estado entre sessões. Integrar na interface. Gerar P10 report."

### 15. Condição para P11
- Sistema de continuidade funcional
- Usuário digitar "AUTORIZO P11"

---

## P11 — TIMELINE E CHECKPOINTS INTELIGENTES

### 1. Nome
P11 — Timeline e Checkpoints Inteligentes

### 2. Objetivo
Transformar checkpoints em pontos reais de retomada com timeline visual. Cada checkpoint deve permitir "retomar daqui".

### 3. Por que vem depois de P10
Com o sistema de continuidade (P10) rastreando o estado atual, os checkpoints ganham contexto para se tornarem pontos de retomada reais.

### 4. Arquivos permitidos
- `frontend/src/pages/CheckpointsPage.tsx` (modificar)
- `frontend/src/components/CheckpointTimeline.tsx` (criar)
- `frontend/src/components/ResumeFromHereCard.tsx` (criar)
- `docs/KRATOS_P11_CHECKPOINTS_TIMELINE_REPORT.md` (criar)

### 5. Arquivos proibidos
- Backend checkpoints — pode estender, não quebrar

### 6. Comandos seguros
```bash
cd frontend && npm run build && npx vitest run
```

### 7. Comandos proibidos
- Não quebrar checkpoint existente

### 8. Entregáveis
- `CheckpointsPage.tsx` atualizada
- `CheckpointTimeline.tsx`
- `ResumeFromHereCard.tsx`
- `docs/KRATOS_P11_CHECKPOINTS_TIMELINE_REPORT.md`

### 9. Critérios de aceite
- [ ] Timeline visual de checkpoints
- [ ] Botão "Retomar daqui" funcional
- [ ] Integração com continuity (P10)
- [ ] Build + testes passam

### 10. Testes obrigatórios
- Smoke tests para novos componentes
- `npm run build`

### 11. Risco
**BAIXO.** Extensão de feature existente.

### 12. Rollback
Reverter CheckpointsPage e remover novos componentes.

### 13. Checklist de execução
- [ ] Analisar CheckpointsPage atual
- [ ] Criar CheckpointTimeline
- [ ] Criar ResumeFromHereCard
- [ ] Atualizar CheckpointsPage
- [ ] Build + testes
- [ ] Gerar P11 report

### 14. Prompt executor da fase
> "Executar P11 — Timeline e Checkpoints Inteligentes. Adicionar timeline visual e retomada por checkpoint. Integrar com continuity (P10). Gerar P11 report."

### 15. Condição para P12
- Timeline funcional
- Retomada por checkpoint funcional
- Usuário digitar "AUTORIZO P12"

---

## P12 — DOCS ARCHIVE E KNOWLEDGE CLEANUP

### 1. Nome
P12 — Docs Archive e Knowledge Cleanup

### 2. Objetivo
Organizar os 54+ documentos em `docs/`. Mover waves concluídas para archive. Criar índice navegável. Não apagar nada.

### 3. Por que vem depois de P11
Com todas as features implementadas (P0-P11), a documentação pode ser reorganizada com segurança. O índice documenta o estado final do projeto.

### 4. Arquivos permitidos
- `docs/archive/**` (criar, mover para cá)
- `docs/README.md` (criar)
- `docs/KRATOS_DOCS_INDEX.md` (criar)
- `docs/KRATOS_P12_DOCS_CLEANUP_REPORT.md` (criar)

### 5. Arquivos proibidos
- Não apagar nenhum arquivo
- Não alterar código

### 6. Comandos seguros
```bash
git mv docs/ARQUIVO.md docs/archive/ARQUIVO.md
```

### 7. Comandos proibidos
- `rm`, `del` — nunca
- `git rm` sem `--cached`

### 8. Entregáveis
- `docs/archive/` com waves A-D
- `docs/README.md`
- `docs/KRATOS_DOCS_INDEX.md`
- `docs/KRATOS_P12_DOCS_CLEANUP_REPORT.md`

### 9. Critérios de aceite
- [ ] Waves A-D movidas para archive/
- [ ] Índice criado com links para todos os docs
- [ ] Nenhum arquivo apagado
- [ ] `git status` mostra apenas renames

### 10. Testes obrigatórios
Nenhum. Organização de arquivos.

### 11. Risco
**BAIXO.** Apenas `git mv`. Links quebrados são o principal risco.

### 12. Rollback
```bash
git reset --hard HEAD~1  # ou git mv reverso
```

### 13. Checklist de execução
- [ ] Mapear docs por wave/status
- [ ] Criar archive/
- [ ] Mover waves concluídas
- [ ] Criar README.md
- [ ] Criar DOCS_INDEX.md
- [ ] Verificar links
- [ ] Gerar P12 report

### 14. Prompt executor da fase
> "Executar P12 — Docs Archive. Organizar docs/, mover waves antigas para archive/, criar índice. Não apagar nada. Gerar P12 report."

### 15. Condição para P13
- Docs organizados
- Índice criado
- Usuário digitar "AUTORIZO P13"

---

## P13 — STASH AUDIT

### 1. Nome
P13 — Stash Audit

### 2. Objetivo
Auditar o stash `stash@{0}: WIP on feature/kratos-kimi-visual-wave-2`. Decidir destino: descartar, aplicar em branch separada, exportar patch ou manter.

### 3. Por que vem depois de P12
Com docs organizados e todas as features implementadas, é seguro avaliar se o stash contém algo relevante ou se é ruído.

### 4. Arquivos permitidos
- `docs/KRATOS_P13_STASH_AUDIT_REPORT.md` (criar)
- Patch file (se exportado): `docs/KRATOS_STASH_0.patch`

### 5. Arquivos proibidos
- Não aplicar stash sem aprovação
- Não alterar working tree

### 6. Comandos seguros
```bash
git stash list
git stash show --stat stash@{0}
git stash show -p stash@{0}
```

### 7. Comandos proibidos
- `git stash apply` — sem aprovação
- `git stash pop` — sem aprovação
- `git stash drop` — sem aprovação
- `git stash branch` — sem aprovação

### 8. Entregáveis
- `docs/KRATOS_P13_STASH_AUDIT_REPORT.md`
- Opcional: patch file

### 9. Critérios de aceite
- [ ] Stash inspecionado (`show --stat` e `show -p`)
- [ ] Classificação: DISCARD | APPLY_ON_SEPARATE_BRANCH | EXPORT_PATCH | KEEP
- [ ] Decisão documentada com justificativa

### 10. Testes obrigatórios
Nenhum.

### 11. Risco
**BAIXO.** Inspeção apenas. Nenhuma alteração sem aprovação.

### 12. Rollback
N/A — sem alterações.

### 13. Checklist de execução
- [ ] Listar stashes
- [ ] Mostrar stat do stash
- [ ] Mostrar diff do stash
- [ ] Analisar relevância
- [ ] Emitir classificação
- [ ] Gerar P13 report

### 14. Prompt executor da fase
> "Executar P13 — Stash Audit. Inspecionar stash@{0}, classificar destino. Não aplicar sem aprovação. Gerar P13 report."

### 15. Condição para P14
- Stash auditado e classificado
- Usuário digitar "AUTORIZO P14"

---

## P14 — HARDENING FINAL E RELEASE CANDIDATE

### 1. Nome
P14 — Hardening Final e Release Candidate

### 2. Objetivo
Preparar o KRATOS Supreme como release candidate. Checklist completo de backend, frontend, docs, git e riscos.

### 3. Por que é a última fase
Todas as features implementadas, docs organizados, stash auditado. Resta apenas o checklist final de qualidade antes de considerar o ciclo completo.

### 4. Arquivos permitidos
- `docs/KRATOS_SUPREME_RELEASE_CANDIDATE_REPORT.md` (criar)
- Qualquer ajuste menor identificado no checklist

### 5. Arquivos proibidos
- Novas features
- Refatorações grandes

### 6. Comandos seguros
```bash
cd backend && pytest tests/ -q
cd frontend && npm run build && npx vitest run
git status --short
git log --oneline -20
```

### 7. Comandos proibidos
- `git push`
- `git merge`
- Novas dependências

### 8. Entregáveis
- `docs/KRATOS_SUPREME_RELEASE_CANDIDATE_REPORT.md`

### 9. Critérios de aceite
- [ ] Backend: todos os testes passam (exceto Docker offline)
- [ ] Frontend: build + testes passam
- [ ] Git: working tree limpo
- [ ] Docs: índice atualizado
- [ ] Riscos: todos documentados e mitigados
- [ ] RC checklist: todos os itens CHECK

### 10. Testes obrigatórios
- Backend: `pytest tests/ -q`
- Frontend: `npm run build && npx vitest run`
- Bridge: `pytest tests/test_omnis_collector.py -v`

### 11. Risco
**ZERO.** Checklist e verificação. Nenhuma feature nova.

### 12. Rollback
N/A — verificação apenas.

### 13. Checklist de execução
- [ ] Rodar backend tests
- [ ] Rodar frontend build
- [ ] Rodar frontend tests
- [ ] Verificar git status
- [ ] Preencher checklist de backend
- [ ] Preencher checklist de frontend
- [ ] Preencher checklist de docs
- [ ] Preencher checklist de git
- [ ] Preencher checklist de riscos
- [ ] Gerar RC report

### 14. Prompt executor da fase
> "Executar P14 — Hardening Final. Rodar todos os testes, preencher checklists, gerar release candidate report. Sem novas features. Gerar P14 report."

### 15. Condição para encerramento
- RC report completo
- Todos os checklists passam
- Projeto pronto para decisão de merge/deploy

---

## Resumo de Dependências

```
P0 ──► P1 ──► P1.5 ──► P2 ──► P3 ──► P4 ──► P5 ──► P6
                                                       │
                                                       ▼
                                                      P7 ──► P8 ──► P9 ──► P10
                                                                             │
                                                                             ▼
                                                     P14 ◄── P13 ◄── P12 ◄── P11
```

## Matriz de Risco

| Fase | Risco | Altera Backend | Altera Frontend | Altera CSS |
|---|---|---|---|---|
| P0 | ZERO | NÃO | NÃO | NÃO |
| P1 | BAIXO | NÃO | NÃO | NÃO |
| P1.5 | BAIXO | NÃO | NÃO | NÃO |
| P2 | ZERO | NÃO | NÃO | NÃO |
| P3 | BAIXO | NÃO | SIM (testes) | NÃO |
| P4 | BAIXO | NÃO | NÃO | NÃO |
| P5 | MÉDIO | NÃO | NÃO | SIM (split) |
| P6 | BAIXO | NÃO | SIM (1 página) | NÃO |
| P7 | MÉDIO | SIM (nova rota) | SIM (nova página) | NÃO |
| P8 | BAIXO | NÃO | SIM (home) | NÃO |
| P9 | BAIXO | NÃO | SIM (Aurora) | NÃO |
| P10 | BAIXO | SIM (novo service) | SIM (card) | NÃO |
| P11 | BAIXO | NÃO | SIM (checkpoints) | NÃO |
| P12 | BAIXO | NÃO | NÃO | NÃO |
| P13 | BAIXO | NÃO | NÃO | NÃO |
| P14 | ZERO | NÃO | NÃO | NÃO |

---

**Fim do Roadmap. Próxima ação: executar P0.**
