# W04 — Route Smoke Tests

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE

---

## Objetivo

Verificar que todas as 7 rotas do KRATOS existem, têm configuração
TanStack Router válida, e usam componentes reais (sem placeholders).

---

## Resultados

```
  PASS  / → DashboardView
  PASS  /agora → AgoraView
  PASS  /agenda → AgendaView
  PASS  /checkpoints → CheckpointsView
  PASS  /projetos → ProjetosView
  PASS  /contexto → ContextoView
  PASS  /sistema → SistemaPage (inline)
```

**7/7 pass** — zero rotas com placeholder ou "Em construção".

---

## Script de smoke test

Criado `scripts/route-smoke.ts`:
- Verifica existência de cada arquivo de rota
- Confirma chamada `createFileRoute`
- Confirma propriedade `component`
- Detecta texto "Em construção" ou imports `PlaceholderRoute`
- Extrai nome do view component para relatório

Uso: `bun run scripts/route-smoke.ts`

---

## Estados cobertos por rota

| Rota | Loading | Empty | Error | Dados reais |
|---|---|---|---|---|
| `/` (Dashboard) | Sim (4 queries) | Sim (0 itens) | Parcial | Sim (stats) |
| `/agora` | Sim | Sim | Sim | Sim (checkpoints) |
| `/agenda` | Sim | Sim | Sim | Sim (appointments) |
| `/checkpoints` | Sim | Sim | Sim | Sim (CRUD) |
| `/projetos` | Sim | Sim | Sim | Sim (CRUD) |
| `/contexto` | Sim | Sim | Sim | Sim (snapshots) |
| `/sistema` | Sim | N/A | Parcial | Sim (services) |

---

## Notas

- Browser tests (Playwright) não disponíveis — sem setup de E2E
- `bun test` tem 31 falhas pré-existentes (jsdom não configurado)
- Build (`bun run build`) cobre compilação de todas as rotas
- Smoke test estrutural é entregável pragmático para W04

---

## Arquivos criados/modificados

- `scripts/route-smoke.ts` (novo, 90 linhas)
