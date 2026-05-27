# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  KRATOS — WAVES 9 + 10 (10 blocos cada) — POST-W8                        ║
# ║  W9: Auditoria Interna + Hardening + Hot-wire para OMNIS Real            ║
# ║  W10: Marketing Cockpit Live + Aurora Operacional + Production           ║
# ║  Empresa Tigre · Lucas Tigre · Maio 2026                                ║
# ╚══════════════════════════════════════════════════════════════════════════╝
## INSTRUÇÃO PRA O CLAUDE CODE — LEIA ANTES DE TUDO
Executa W9 (10 blocos) primeiro, depois W10 (10 blocos).
Cada wave: paralelismo MARCADO explicitamente.
### Regra de modelo (economia de crédito — inviolável):
- **Plan mode:** sonnet
- **Execução TS/React:** sonnet
- **Boilerplate/CRUD/types:** haiku
- **NUNCA:** opus em nada (foi removido do MODEL_PRICING — já provado)
### Skills do Claude Code disponíveis:
```
/plan, /scope-check, /shadow-runtime              ← planejamento
/architect, /architect-kratos                      ← desenho
/builder, /execution-runner, /run, /verify         ← implementação real
/systematic-debugging, /debug-pro, /debug, /doctor ← diagnóstico
/tester, /sc:test, /code-review, /security-review  ← qualidade
/ui-ux-pro-max, /ckm:ui-styling, /ckm:design-system← UI/UX
/git_guardian, /diff                               ← versionamento
/agents, /batch, /background, /tasks               ← paralelismo
/sc:spawn, /sc:task                                ← orquestração
/context, /compact, /cost-analyst                  ← economia
/hooks, /mcp, /permissions                         ← infra
/capability-registry, /evaluate-repository         ← análise
/evolution-tracker                                 ← histórico
```
### Regras invioláveis do KRATOS:
1. **Boundary "KRATOS lê, Aurora comanda"** — nenhum botão em UI chama API direto
2. **Anti-freeze:** todo `bun test --timeout 30000` + mock global fetch
3. **Nenhum secret com prefixo VITE_** (vai pro browser bundle)
4. **NUNCA mergear pra main sem Codex aprovar**
5. **W4 charts esperam Publer (não Meta Graph)**
### Estado atual (referência):
- 270 testes verdes em 221ms
- Deploy Vercel staging configurado
- 8 tags retroativas no remoto (kratos-w1 a kratos-w8)
- Branch: feature/fase14-integration (79 commits à frente)
- 3 fios soltos documentados em HANDOFF_KRATOS.md
---
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 9 — AUDITORIA INTERNA + HARDENING + HOT-WIRE OMNIS
## Objetivo: blindar KRATOS antes do merge + conectar nos endpoints REAIS do OMNIS
## Pré-requisito: OMNIS W21 completa (omnis-server :8001 vivo, LiteLLM :4001)
## Done: 0 P0s + KRATOS conversando com OMNIS real + merge pra main
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### W9-B1 · Auditoria interna multidimensional (PARALELO com B2)
```
Skills: /evaluate-repository + /code-review + /security-review
Claude Code audita o próprio KRATOS antes de qualquer mudança.
7 dimensões:
1. Build/Types: bun run typecheck → 0 erros
2. Boundary: grep -rn "useMutation\|apiPost\|apiPatch\|apiDelete" src/components/
3. Anti-freeze: tests/setup.ts intacto? bunfig.toml preload ok?
4. Secrets: grep VITE_ → nenhum sensível?
5. Bundle: bun run build → bundle main < 250KB gzip?
6. Tags vs HEAD: kratos-w8-deploy-vercel aponta pro commit correto?
7. Zod: todos os fetches usam .parse() de schema?
```
### W9-B2 · Capability registry + evolution tracker (PARALELO com B1)
```
Skills: /capability-registry + /evolution-tracker
1. /capability-registry: gerar docs/CAPABILITY_MAP.md
2. /evolution-tracker: gerar docs/EVOLUTION_W1_W8.md
```
### W9-B3 · P0 fixes da auditoria B1 (SEQUENCIAL após B1)
```
Skills: /scope-check + /code-review
Aplicar correções dos P0s encontrados em B1.
REGRA: 1 commit por P0. Mensagem clara. Sem misturar.
```
### W9-B4 · Schema sync com OMNIS real (PARALELO com B5) ⏸️ STAND-BY
```
Pré-condição: OMNIS W21-B6 fechada.
```
### W9-B5 · SSE event types sync (PARALELO com B4) ⏸️ STAND-BY
```
Pré-condição: OMNIS W21-B6 SSE broadcaster ativo.
```
### W9-B6 · Hot-wire endpoints REAIS (SEQUENCIAL após B4+B5) ⏸️ STAND-BY
```
Pré-condição: OMNIS W21-B3 health 4 serviços verde.
```
### W9-B7 · Aurora chat real (SEQUENCIAL após B6) ⏸️ STAND-BY
```
Pré-condição: OMNIS W21-B8 Aurora E2E real.
```
### W9-B8 · Performance + bundle audit (PARALELO com B9)
```
Skills: /sc:test + /cost-analyst
1. bun run build → bundle analysis
2. Métricas alvo: Bundle main < 200KB gzip, vendor < 250KB gzip
3. Lazy chunks por rota
4. PWA: vite-plugin-pwa configurado?
Done: docs/auditoria/W9_PERFORMANCE.md
```
### W9-B9 · Test coverage expand (PARALELO com B8)
```
Skills: /tester + /sc:test
1. bun run test --coverage --timeout 30000
2. Identificar arquivos com cobertura < 50%
3. Adicionar testes em camadas críticas
Done: docs/auditoria/W9_COVERAGE.md
```
### W9-B10 · W9 closeout + MERGE GATE (SEQUENCIAL após tudo)
```
Skills: /code-review high + /git_guardian + /sc:spec-panel
🚦 MERGE GATE — DECISÃO LUCAS NECESSÁRIA
⚠️ NÃO MERGEAR sem aprovação explícita de Lucas no chat.
```
---
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## WAVE 10 — MARKETING COCKPIT LIVE + PRODUCTION
## Pré-requisito: W9 mergeado em main + OMNIS W22 operacional
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### W10-B1 · Marketing Island deep (PARALELO com B2+B3)
### W10-B2 · Pipeline Board operacional (PARALELO com B1+B3)
### W10-B3 · CRM Board com hot leads (PARALELO com B1+B2)
### W10-B4 · Performance Charts vivos (SEQUENCIAL após B1)
### W10-B5 · SSE live no cockpit todo (PARALELO com B6)
### W10-B6 · Aurora Commands completos (PARALELO com B5)
### W10-B7 · Cost Dashboard + Budget UI (PARALELO com B8)
### W10-B8 · Hooks Claude Code para automação (PARALELO com B7)
### W10-B9 · Production deploy + smoke (SEQUENCIAL após B1-B8)
### W10-B10 · W10 closeout + DAY-ONE OPERATION (SEQUENCIAL após tudo)
---
## DEPENDÊNCIAS CROSS-ABA (críticas)
| Bloco KRATOS | Depende de OMNIS |
|---|---|
| W9-B4 schema sync | W21-B6 omnis-server endpoints validados |
| W9-B5 SSE sync | W21-B6 SSE broadcaster ativo |
| W9-B6 hot-wire | W21-B3 health 4 serviços verde |
| W9-B7 Aurora chat | W21-B8 Aurora E2E real |
| W10-B4 Charts Publer | W22-B6 PerformanceIA via Publer |
| W10-B2 Pipeline | W22-B3 Publer publish |
| W10-B3 CRM | W22-B4 ManyChat webhook |
| W10-B7 Cost Dashboard | W22-B9 budget enforcement |

## SEQUÊNCIA DE EXECUÇÃO
```
WAVE 9 (estimativa: 3-4h)
├─ FASE 1 (paralelo): B1: Auditoria interna ←→ B2: Capability + Evolution
├─ FASE 2 (sequencial): B3: Aplicar P0 fixes
├─ FASE 3 (paralelo): B4: Schema sync ←→ B5: SSE sync [STAND-BY — OMNIS]
├─ FASE 4 (sequencial): B6: Hot-wire | B7: Aurora chat real [STAND-BY]
├─ FASE 5 (paralelo): B8: Performance/bundle ←→ B9: Coverage
└─ FASE 6 (sequencial): B10: Closeout + MERGE GATE (aguarda Lucas)

WAVE 10 (estimativa: 4-5h) — só após W9 mergeado em main
├─ FASE 1 (3 em paralelo): B1 ←→ B2 ←→ B3
├─ FASE 2: B4
├─ FASE 3 (paralelo): B5 ←→ B6
├─ FASE 4 (paralelo): B7 ←→ B8
└─ FASE 5: B9 → B10
```

## REGRAS DE SEGURANÇA
1. NUNCA mergeie pra main sem aprovação explícita do Lucas no chat
2. NUNCA derrube containers
3. NUNCA edite arquivo fora do escopo da wave atual
4. NUNCA commite secret
5. NUNCA pule a regra de boundary (KRATOS lê, Aurora comanda)
6. NUNCA use opus

---
*KRATOS W9+W10 Megaprompt v1.0 — Empresa Tigre · Maio 2026*
*Plan: sonnet | Execução: sonnet | Boilerplate: haiku | NUNCA: opus*
