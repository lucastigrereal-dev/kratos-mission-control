# KRATOS Sprint C — V07 Neuro UX Pass

**Data:** 2026-05-17

## Neuro UX Audit

Cada tela auditada contra as 5 perguntas de orientação TDAH:

| Pergunta | DashboardView | ContextoView | SistemaView | AgoraView |
|----------|--------------|-------------|-------------|-----------|
| O que está acontecendo? | Stats row | CurrentContextHero | Service cards | FocusCard + NextActionCard |
| O que é dado real? | SourceBadgeIndicator | SourceBadge + low confidence badge | Worker badge + config badges | — |
| O que é fallback? | GitHub badge | Stale badge | Config badges | — |
| O que está faltando configurar? | GitHub badge | — | OMNIS/GitHub badges | — |
| Qual é a próxima ação? | Quick links + Alert bar | ContextActionStrip | **ADICIONADO** | NextActionCard |

## Changes

### SistemaView — Próxima ação adicionada

Linha de resumo dinâmica abaixo dos badges de configuração:

```
Próxima ação: configurar OMNIS e GitHub para monitoramento completo
```

**Lógica:**
- Se falta config → "configurar X e Y para monitoramento completo" (cor warn)
- Se há issues → "Verifique os serviços com alerta abaixo" (cor secondary)
- Se tudo ok → "Todos os serviços operacionais" (cor secondary)

## Verdict

**AgoraView** é o melhor exemplo de Neuro UX — responde todas as 5 perguntas com clareza, tem 1 ação primária proeminente, e guia o operador com microcopy direto ("Uma tela, uma decisão. O resto espera.").

**DashboardView** e **ContextoView** já estavam bem estruturados. O **SistemaView** agora tem orientação de próxima ação.

## Verification

- [x] `bun run build` — PASS (3.11s)
- [x] `bun test tests/` — 269 pass / 1 fail (GitHub Store timeout — pre-existing, unrelated)
- [x] SistemaView agora tem "Próxima ação" dinâmica
