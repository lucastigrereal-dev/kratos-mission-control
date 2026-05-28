# HANDOFF W0 — Backend Liveness (`ksw-w0-backend-alive`)

**Wave:** W0  
**Branch:** `feature/kratos-supreme-w0-w22`  
**Tag:** `ksw-w0-backend-alive`  
**Data:** 2026-05-28  
**Status:** ✅ CONCLUÍDA

---

## Objetivo

Garantir que KRATOS sabe quando o backend Python está vivo e informa ao usuário quando cai.

---

## O que foi entregue

### Infraestrutura (scripts/)

| Arquivo | Propósito |
|---|---|
| `scripts/start.ps1` | Sobe backend (uvicorn :8000) + frontend (bun run dev :5173), aguarda health check, relata 🟢/🔴/🟡 |
| `scripts/stop.ps1` | Para processos em :8000 e :5173 gracefully. NÃO para ActivityWatch |
| `scripts/install-autostart.ps1` | Registra `KRATOS_AutoStart` como Scheduled Task (AtLogOn, RunLevel Limited) |

### Frontend (src/)

| Arquivo | Propósito |
|---|---|
| `src/hooks/useBackendHealth.ts` | Watchdog hook — poll GET :8000/health a cada 30s. "offline" após 2 falhas consecutivas |
| `src/components/kratos/base/BackendStatusBadge.tsx` | Badge (live/degraded/offline/unknown) + BackendOfflineBanner (top: 90, z: 8990) |
| `src/components/kratos/shell/AppShell.tsx` | +2 linhas: import BackendOfflineBanner + `<BackendOfflineBanner />` após OfflineBanner |

### Documentação

| Arquivo | Propósito |
|---|---|
| `docs/setup/KRATOS_AUTOSTART.md` | Guia completo: start/stop, auto-start A/B, troubleshooting, AW |
| `docs/auditoria/BUGS_INCIDENTAIS.md` | #001 (13 erros TS pré-existentes) + #002 (AppShell stale closure) |
| `logs/.gitkeep` | Rastreia `logs/` no git sem commitar os `.log` |

### Tooling

| Mudança | Motivo |
|---|---|
| `package.json`: `"typecheck": "tsc --noEmit"` | Script ausente, revelado pelo audit |
| `tsconfig.json`: `"types": ["vite/client", "bun"]` | Eliminar erros `bun:test` pré-existentes |
| `bun add -d @types/bun@1.3.14` | Tipos para bun test runner |

### Testes adicionados

| Arquivo | Testes |
|---|---|
| `tests/stores/backend-health.test.ts` | 18 testes — derivação de status + parsing de resposta /health |

**Total:** 320 testes passando (era 302 antes de W0), 0 falhas.

---

## Gates de saída (todos ✅)

| Gate | Resultado |
|---|---|
| `bun run typecheck` | 0 novos erros (13 pré-existentes documentados em BUGS_INCIDENTAIS) |
| `bun run test` | 320 pass / 0 fail |
| `bun run build` | ✓ limpo, 4.04s |
| `/code-review high` | 2 HIGH resolvidos (tokens), 1 CRITICAL pré-existente documentado |

---

## Critérios Done (verificados)

- [x] start.ps1 sobe backend + frontend em background
- [x] `GET /health` poll a cada 30s implementado
- [x] Estado "offline" após 2 falhas consecutivas
- [x] Banner discreto no topo (não intrusivo, não tela cheia)
- [x] Botão "Reconectar" com force retry
- [x] Banner aparece só quando browser online (não duplica com OfflineBanner)
- [x] install-autostart.ps1 registra Scheduled Task sem admin

---

## Bugs documentados (não corrigidos inline)

- **#001** — 13 erros TS pré-existentes (AgenciaScreen, BillingScreen, hooks)
- **#002** — AppShell stale closure em `kratos:toggle-aurora` event handler

---

## Contexto para próxima wave

**Próxima wave:** W1 — aguardar autorização explícita do Lucas.  
**STOP antes de W3:** decisão sobre nível de captura do aw-watcher-web.

### Estado dos gates ativos:
- Backend Python: necessita start manual (`.\scripts\start.ps1`) ou auto-start instalado
- Frontend: necessita start manual (incluso no start.ps1)
- ActivityWatch: gerenciado separadamente (KRATOS verifica mas não inicia)

### APIs do backend relevantes para W1+:
- `GET /health` — status geral (usado por useBackendHealth)
- `GET /health/full` — status detalhado com feed de saúde
- Python backend versão `0.12.0`, phase `0.12 — KRATOS Live Cockpit`

---

_Gerado em: 2026-05-28 | Wave W0 — ksw-w0-backend-alive_
