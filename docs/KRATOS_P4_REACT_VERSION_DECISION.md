# KRATOS P4 — REACT VERSION DECISION

**Date:** 2026-05-15 | **Phase:** P4 | **Status:** PASS

---

## 1. Objective
Diagnose and resolve the React 19 (root) vs React 18 (frontend) version mismatch.

## 2. Findings

### Root (`package.json`)
```json
"react": "^19.2.0",
"react-dom": "^19.2.0"
```
- **Source:** TanStack Start scaffold from Lovable (`tanstack_start_ts` template)
- **Installed?** NO — `node_modules/react/` does not exist at root
- **Used by:** `src/` directory (TanStack Start app with SSR, file-based routing)
- **Status:** **LEGACY SCAFFOLD** — never installed, never ran, not part of any build

### Frontend (`frontend/package.json`)
```json
"react": "^18.3.1",
"react-dom": "^18.3.1"
```
- **Source:** Manual Vite + React setup for KRATOS cockpit
- **Installed?** YES — `frontend/node_modules/react@18.3.1`
- **Used by:** All 18 components, 8 pages, 3 hooks, Vite build
- **Status:** **ACTIVE** — the actual application

### `src/` Directory Analysis
```
src/components/   ← 53 legacy components (kratos/ subfolder)
src/hooks/        ← Legacy hooks
src/routes/       ← TanStack Start file-based routes
src/router.tsx    ← TanStack Router config
src/server.ts     ← SSR server entry
src/start.ts      ← TanStack Start entry
```
- **Imported by frontend/ build?** NO — Vite doesn't reference this directory
- **Wave 7 audit confirmed:** `src/components/kratos/` mirrors `frontend/src/components/` but is NOT in the build output
- **Recommendation:** Archive in P12 (docs cleanup)

## 3. Dependency Tree Reality

```
Root (never installed)
├── react@19.2.0 (specified, not installed)
├── TanStack Start (specified, not installed)
└── Radix UI x23 (specified, not installed)

Frontend (actual app)
├── react@18.3.1 ✅
├── react-dom@18.3.1 ✅
├── react-router-dom@6.28.0 ✅
├── tailwindcss@4.x ✅
├── vite@5.4.21 ✅
├── vitest@3.2.4 ✅
└── @testing-library/* ✅
```

## 4. Decision

```
ISOLATE — React 18 is the sole active React version
```

**Rationale:**
1. React 19 was never installed at root level
2. The `src/` TanStack Start scaffold is inactive legacy
3. The `frontend/` React 18 app is the only running application
4. There is no actual version conflict — it's a phantom mismatch from an uninstalled scaffold
5. Zero action required for React versions

## 5. Recommended Future Action (P12)
During docs cleanup:
- Archive `src/components/kratos/` (53 legacy files, duplicate of active components)
- Archive `src/routes/`, `src/router.tsx`, `src/server.ts`, `src/start.ts` (unused SSR scaffold)
- Archive `.lovable/` (template metadata only)
- Archive root `node_modules/` if empty
- Consider removing root `package.json` React/TanStack deps or marking as legacy

**Do NOT delete `src/` entirely without human review** — there may be non-KRATOS artifacts worth preserving.

## 6. Validation
| Check | Result |
|---|---|
| Active React version confirmed | 18.3.1 in frontend/ |
| Root React confirmed not installed | node_modules/react/ missing at root |
| Build unaffected | 596ms, 0 TS errors |
| Tests unaffected | 31/31 PASS |
| No changes needed | PASS |

## 7. Decision
```
PASS
```

React version is resolved: React 18 is the sole active version. No migration, no upgrade, no code changes needed.

## 8. Next Phase
**P5 — CSS Split Seguro.** Auto-advancing.
