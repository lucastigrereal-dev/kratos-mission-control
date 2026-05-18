# KRATOS Sprint B W02 — FrontendGuard Control Plan

**Date:** 2026-05-17
**Wave:** B02

## Analysis

### What FrontendGuard Protects
- `frontend/` — secondary Vite standalone structure (separate `package.json`, `vite.config.ts`, own `src/`)

### What Sprint B Needs to Modify
| Path | Type | Blocked by FrontendGuard? |
|---|---|---|
| `src/hooks/useDashboard.ts` | Hook | NO — in root `src/` |
| `src/hooks/useContexto.ts` | Hook | NO — in root `src/` |
| `src/hooks/useOmnis.ts` | Hook | NO — in root `src/` |
| `src/hooks/useGithub.ts` | Hook | NO — in root `src/` |
| `src/hooks/useServices.ts` | Hook | NO — in root `src/` |
| `src/components/kratos/views/` | Components | NO — in root `src/` |
| `src/routes/` | Routes | NO — in root `src/` |
| `src/lib/*-server-fns.ts` | Server fns | NO — in root `src/` |
| `api-contract/` | Contracts | NO — root level |

## Decision
**No FrontendGuard adjustment needed for Sprint B.**

The `frontend/` directory is a secondary standalone Vite app — not the main KRATOS cockpit. All Sprint B wiring targets the main app in `src/`, which is NOT protected by FrontendGuard.

## Rules Preserved
- FrontendGuard remains fully active
- `frontend/` stays read-only throughout Sprint B
- No whitelist needed
- No rollback needed
- Zero risk of guard bypass
