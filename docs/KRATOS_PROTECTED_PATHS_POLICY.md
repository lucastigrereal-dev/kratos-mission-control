# KRATOS — Protected Paths Policy

**Date:** 2026-05-17  
**Wave:** K25  

---

## I. PROTECTED PATHS (this sprint)

| Path | Protection Level | Who Can Change | Reason |
|---|---|---|---|
| `frontend/` | 🔴 READ-ONLY this sprint | FrontendGuard active | Visual sprint needed separately |
| `src/routeTree.gen.ts` | 🔴 NEVER edit manually | Auto-generated | Vite plugin regenerates it |
| `.env` / `.env.*` | 🔴 NEVER read/commit | Nobody | Security boundary |
| `wrangler.jsonc` (deploy) | 🔴 Deploy requires Lucas auth | Lucas only | Cloudflare deploy — explicit consent |
| `src/styles.css` (tokens) | 🟡 Visual sprint only | Frontend sprint | Design token system |

---

## II. PROTECTED COMPONENTS

| Component | File | Change Requires |
|---|---|---|
| AppShell | `src/components/kratos/shell/AppShell.tsx` | Lucas authorization + visual sprint |
| Topbar | `src/components/kratos/shell/Topbar.tsx` | Lucas authorization + visual sprint |
| Sidebar | `src/components/kratos/shell/Sidebar.tsx` | Lucas authorization + visual sprint |
| StatusBar | `src/components/kratos/shell/StatusBar.tsx` | Lucas authorization + visual sprint |
| AuroraPanel | `src/components/kratos/shell/AuroraPanel.tsx` | Lucas authorization + visual sprint |

---

## III. FREELY MODIFIABLE (this sprint)

| Path | Can Modify | Examples |
|---|---|---|
| `backend/*/store.ts` | ✅ Yes | Add helper functions, _reset() |
| `api-contract/*.schema.ts` | ✅ Yes (additive only) | Add new schemas, new fields |
| `src/lib/*-server-fns.ts` | ✅ Yes | Add endpoints, harden fallbacks |
| `src/hooks/use*.ts` | ✅ Yes (no UI changes) | Fix logic, add exports |
| `tests/**/*.test.ts` | ✅ Yes | Add/improve tests |
| `docs/**/*.md` | ✅ Yes | Documentation |
| `.github/workflows/*.yml` | ✅ Yes | CI/CD (no deploy) |

---

## IV. COMMIT RULES

```
ALWAYS:
  - git add <specific files>  (never git add .)
  - bun run build before commit
  - bun test tests/ before commit
  - No secrets in staged files

NEVER:
  - git add .
  - git reset --hard
  - git clean -f
  - Commit .env or .env.local
  - Commit secrets (Bearer, ghp_, sk-)
```

---

## V. OMNIS BOUNDARY

| Action | Status |
|---|---|
| Read OMNIS status via GET | ✅ Allowed |
| Display OMNIS data in cockpit | ✅ Allowed |
| POST to OMNIS (execute crew/job) | 🔴 FORBIDDEN |
| DELETE from OMNIS | 🔴 FORBIDDEN |
| Access `omnis-control/` directory | 🔴 FORBIDDEN |

---

## VI. LIFTING THE FRONTENDGUARD

To open frontend sprint:
1. Lucas explicitly says "FrontendGuard lifted" or "open visual sprint"
2. Confirm: `bun run build` ✅ and `bun test tests/` ✅
3. Then `frontend/` and shell components become writable
4. Re-activate FrontendGuard when visual sprint closes

---

## VII. SECRET EXPOSURE PROTOCOL

If a secret is accidentally staged:
```bash
# 1. IMMEDIATELY unstage:
git reset HEAD <file>

# 2. Remove from working tree:
# Edit file to remove secret

# 3. Verify:
git diff --staged | grep -i "ghp_\|Bearer\|password"

# 4. If already committed:
# DO NOT push.
# Contact Lucas — treat as incident.
# Rotate the exposed credential immediately.
```
