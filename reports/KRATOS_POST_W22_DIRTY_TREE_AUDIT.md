# KRATOS POST-W22 DIRTY TREE AUDIT

**Data:** 2026-05-30  
**Branch:** main  
**HEAD:** 938203b (W22 closure)  
**Auditor:** Leitura pura — nenhum arquivo alterado  

---

## Resumo Executivo

```
Tracked modificados (não staged): 4 arquivos
Untracked (nunca commitados):     50+ arquivos
Commits pendentes de push:        18 commits
```

O working tree está **sujo** — mas nenhuma sujeira impede o push dos 18 commits.
`git push` empurra commits, não o working tree.

---

## Parte 1 — Arquivos Tracked Modificados (não staged)

### 1. `frontend/package.json`
**Classificação: D — Risco, precisa revisão do Lucas**

| Item | Valor Commitado (HEAD) | Valor Working Tree |
|------|----------------------|-------------------|
| `"vite"` | `^5.4.11` | `^8.0.14` ⚠️ |
| `@types/chai` | não existia | `^5.2.3` (novo) |
| `@types/node` | não existia | `^25.9.1` (novo) |

**Motivo provável:** `npm install` rodou na pasta `frontend/` em algum momento (sessão anterior), atualizando vite 5 → 8 e adicionando 2 devDependencies.

**Risco de push sem limpar:**
- O push NÃO incluirá esta mudança (working tree não vai com push)
- Se futuramente for commitado sem revisão: vite v5→v8 é **major bump** com breaking changes
- `frontend/` é explicitamente **LEGADO** per CLAUDE.md — nenhuma sessão deve atualizar suas deps sem autorização

**Recomendação:** Não commitar até Lucas revisar se quer manter vite 8 ou reverter para 5. Candidato a `git checkout -- frontend/package.json` após decisão do Lucas.

---

### 2. `frontend/package-lock.json`
**Classificação: D — Risco (derivado do item 1)**

+1115 / -541 linhas. Lockfile que espelha a atualização de package.json.

**Motivo provável:** Gerado automaticamente pelo `npm install` que atualizou package.json.

**Risco de push sem limpar:** Igual ao item 1. Working tree não vai com push.

**Recomendação:** Tratar junto com `frontend/package.json`. Se Lucas reverter o package.json, este também deve ser revertido.

---

### 3. `frontend/tsconfig.tsbuildinfo`
**Classificação: B — Gerado automaticamente**

**`git diff`** mostra apenas 2 linhas de mudança (timestamps do build incremental do TypeScript).

**Motivo provável:** Compilação incremental TS rodou na pasta `frontend/`. Arquivo de cache/estado do compilador.

**Risco de push sem limpar:** Zero — não afeta funcionalidade. É artifact de build.

**Recomendação:** Idealmente adicionar `frontend/tsconfig.tsbuildinfo` ao `.gitignore` (mas não fazer agora — apenas registrar). Pode ser commitado num cleanup separado ou ignorado.

---

### 4. `src/routeTree.gen.ts`
**Classificação: B — CRLF-only, zero mudança real**

```
git diff -- src/routeTree.gen.ts
→ warning: LF will be replaced by CRLF
→ (nenhuma linha de diff exibida)
```

**Verificação de linha:** HEAD tem 241 linhas. Working tree tem 241 linhas. **Conteúdo idêntico.**

**Motivo:** Git detecta diferença de encoding LF/CRLF (Windows). O conteúdo do arquivo é exatamente igual ao commitado. Não há nova rota adicionada.

**Risco de push sem limpar:** Zero — o arquivo não mudou de conteúdo. O status `M` é falso positivo de CRLF.

**Recomendação:** Não commitar. Já está correto.

---

## Parte 2 — Arquivos Untracked (não commitados, nunca)

### Grupo A — Root level (`??` na raiz)

| Arquivo | Classificação | Motivo Provável | Risco Push |
|---------|--------------|----------------|------------|
| `KRATOS_CODEX_AUDIT.md` | C — Pré-existente | Gerado por sessão Codex de auditoria (Mai/28) | Nenhum |
| `KRATOS_CODEX_BRANCH_SCOPE_REPORT.md` | C — Pré-existente | Idem | Nenhum |
| `KRATOS_FOUNDATION_DESIGN_SYSTEM_FINAL_REPORT.md` | C — Pré-existente | Sessão de foundation design system (Mai/28) | Nenhum |
| `KRATOS_FOUNDATION_DESIGN_SYSTEM_REPORT.md` | C — Pré-existente | Idem | Nenhum |

**Observação:** Estes 4 arquivos estão na **raiz** do repositório, o que é incomum. Relatórios deveriam estar em `reports/` ou `docs/`. São documentos de auditoria de sessões anteriores.

**Recomendação:** Commitar num "chore: add legacy audit reports" separado OU mover para `docs/` e commitar. Decidir com Lucas. Não urgente para o push.

---

### Grupo B — `.claude/hooks/`

| Arquivo | Classificação | Motivo Provável | Risco Push |
|---------|--------------|----------------|------------|
| `.claude/hooks/preflight-check.sh` | C — Pré-existente, não tocar | Config do Claude Code local | Nenhum |

**Observação:** Arquivo de configuração do Claude Code, não pertence ao codebase da aplicação. Pode ser gitignored ou commitado em `.claude/` dependendo da preferência do Lucas.

---

### Grupo C — `docs/kratos-visual/` (43 arquivos)

**Criados em:** 2026-05-28 20:08–20:30 (sessão anterior a W19-W22)

**Tipos de arquivo:**
- `*_COMPONENT.md` (24 arquivos) — documentação de componentes
- `*.tsx` (10 arquivos) — cópias de componentes existentes em `src/`
- `*.md` (9 arquivos) — docs de arquitetura visual, UI Bible, design tokens
- `index.ts` (1 arquivo)

**Arquivos `.tsx` presentes:**

| Arquivo em docs/kratos-visual/ | Correspondente em src/ |
|-------------------------------|----------------------|
| `EmptyState.tsx` | `src/components/kratos/base/EmptyState.tsx` |
| `ErrorState.tsx` | `src/components/kratos/base/ErrorState.tsx` |
| `GlassPanel.tsx` | `src/components/kratos/ui-primitives/GlassPanel.tsx` |
| `KratosCard.tsx` | `src/components/kratos/ui-primitives/KratosCard.tsx` |
| `LoadingSkeleton.tsx` | `src/components/kratos/base/LoadingSkeleton.tsx` |
| `MetricBadge.tsx` | `src/components/kratos/base/MetricBadge.tsx` |
| `ProgressRing.tsx` | `src/components/kratos/base/ProgressRing.tsx` |
| `SeverityBadge.tsx` | `src/components/kratos/base/SeverityBadge.tsx` |
| `SourceBadge.tsx` | `src/components/kratos/base/SourceBadge.tsx` |
| `StatusChip.tsx` | `src/components/kratos/base/StatusChip.tsx` |

**⚠️ Importante:** Estes `.tsx` em `docs/kratos-visual/` são **cópias de documentação**, NÃO fazem parte do build. O Vite só processa `src/`. Não há risco de conflito de build.

**Classificação:** C — Pré-existentes, não tocar agora.

**Risco de push:** Zero. São untracked — não vão com o push.

**Recomendação:** Decidir com Lucas se vai commitar como `docs/kratos-visual/` (documentação visual da foundation) ou deletar. Podem ser úteis como referência. Não urgente.

---

## Parte 3 — Commits Pendentes de Push (18)

```
938203b docs(W22): ksw-w22-prd-closure — PRD Finalization closure docs + readiness reports
5f6e8b0 feat(W21): ksw-w21-analytics-local — Analytics dashboard local + Meta OAuth Human Slot
9c410c8 feat(W20): ksw-w20-multi-operator-saas — Multi-Operator SaaS local model + RBAC visual
c43d502 feat(W19): ksw-w19-omnis-write-bridge — OMNIS Write Bridge dry-run contract + mock adapter
d2193b5 feat(W14): ksw-w14-autolearning — Auto-Learning UI + PWA
2307751 feat(W13): ksw-w13-memory-search — Memory Search UI
c15ac71 feat(W12): ksw-w12-multipage — Multi-Page Cockpit UI
07b4671 feat(W11): ksw-w11-saneamento — observability + SSE client real
69cfe36 feat(P0): ksw-p0-marco — KRATOS SUPREME Marco P0 atingido
248a291 feat(W5): ksw-w5-sse-hardening — SSE polling hardened and tested
7966f12 feat(W4.5): ksw-w4.5-aurora-real — AuroraDrawer wired to real tasks, agenda, mission lens
ea47973 feat(W4): ksw-w4-missions-real — OMNIS active missions wired to Dashboard
6ac7f52 feat(W3): ksw-w3-context-real — ContextoView wired to ActivityWatch backend
e6c597e feat(W6): ksw-w6-system-real — 4 mock IslandCards wired to /live/snapshot
3967ab4 docs: HANDOFF_W2 — wave summary projects reality
c6d157c feat(W2): ksw-w2-projects-real — GET /projects agora lê SQLite real
3bc2ef1 feat(W1): ksw-w1-tasks-real — GET /tasks agora lê SQLite real
dc20cd2 feat(W0): ksw-w0-backend-alive — backend liveness watchdog
```

**Estes 18 commits são limpos.** Nenhuma sujeira do working tree está neles.

---

## Parte 4 — Análise de Risco de Push

| Item | Impacto no Push | Veredicto |
|------|----------------|-----------|
| 18 commits | Conteúdo limpo, testes 739/0 | ✅ READY |
| `frontend/package.json` vite v8 | NÃO vai com push (unst.) | ⚠️ Revisar depois |
| `frontend/package-lock.json` | NÃO vai com push | ⚠️ Revisar depois |
| `frontend/tsconfig.tsbuildinfo` | NÃO vai com push | ✅ OK |
| `src/routeTree.gen.ts` | NÃO vai com push (só CRLF) | ✅ OK |
| `docs/kratos-visual/` (43) | NÃO vai com push | ✅ OK |
| Root level `.md` (4) | NÃO vai com push | ✅ OK |
| `.claude/hooks/preflight-check.sh` | NÃO vai com push | ✅ OK |

**Conclusão:** O push dos 18 commits é seguro. A sujeira fica local.

---

## Parte 5 — Ações Recomendadas (para Lucas decidir)

### Imediatas (antes ou depois do push, não bloqueiam):
- Nenhuma ação obrigatória

### Curto prazo (próxima sessão de limpeza):
1. **Revisar** `frontend/package.json`: manter vite 8 ou reverter para 5?
2. **Decidir** se `docs/kratos-visual/` vai para o repo (documentação visual) ou é deletado
3. **Mover ou commitar** os 4 `.md` da raiz para `docs/` ou `reports/`
4. **Avaliar** adicionar `frontend/tsconfig.tsbuildinfo` ao `.gitignore`
5. **Avaliar** commitar `.claude/hooks/preflight-check.sh`

---

## Comando de Push (NÃO EXECUTAR — aguarda autorização do Lucas)

```bash
# Verificação final antes de executar:
bun run test   # deve retornar 739 pass / 0 fail
bun run build  # deve passar limpo

# Push quando autorizado:
git push origin main --follow-tags
```

**Tags locais que serão empurradas com `--follow-tags`:**
- `kratos-v2.0-main` (d2193b5 → W14)
- `ksw-w*` (todas as wave tags)

---

## VEREDITO FINAL

```
STATUS PUSH READINESS: NEEDS_REVIEW
```

**Motivo:** Os 18 commits são LIMPOS e tecnicamente prontos para push (739 testes, build limpo, zero secrets). Mas o `frontend/package.json` tem um upgrade de vite 5→8 no working tree que Lucas deve conhecer e decidir antes de qualquer commit adicional. Este item NÃO bloqueia o push atual — ele não está nos commits — mas seria problemático se commitado inadvertidamente depois.

**Recomendação para Lucas:**
1. Dizer "pode fazer push" → executar `git push origin main --follow-tags`
2. Depois, numa sessão separada: decidir o que fazer com `frontend/package.json` (vite 8 vs 5)
