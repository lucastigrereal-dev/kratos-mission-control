# KRATOS — Local Development Runbook

**Date:** 2026-05-17  
**Wave:** K24  

---

## I. PREREQUISITES

```bash
# Required:
bun --version   # 1.3.10+
node --version  # 18+ (via Bun)
git --version   # 2.x+

# Optional (for Cloudflare deploy — requires Lucas authorization):
wrangler --version  # 3.x+
```

---

## II. INSTALL DEPENDENCIES

```bash
bun install
```

If `bun install` fails with lock errors:
```bash
rm -rf node_modules bun.lockb && bun install
```

---

## III. RUN DEV SERVER

```bash
bun run dev
# Opens at http://localhost:3000
```

Routes available locally:
- `http://localhost:3000/` — Dashboard
- `http://localhost:3000/agora` — Foco
- `http://localhost:3000/agenda` — Agenda
- `http://localhost:3000/checkpoints` — Checkpoints
- `http://localhost:3000/projetos` — Projetos
- `http://localhost:3000/contexto` — Contexto
- `http://localhost:3000/sistema` — Sistema

---

## IV. BUILD

```bash
bun run build
# Expected: ✓ built in ~2s
# Outputs to: dist/
```

---

## V. RUN TESTS

```bash
# All tests (recommended):
bun test tests/

# Just stores:
bun test tests/stores/

# Just contracts:
bun test tests/contracts/

# Specific file:
bun test tests/stores/contexto-snapshot.test.ts
```

Expected result: `176+ pass / 0 fail`

---

## VI. ENVIRONMENT VARIABLES

Create `.env.local` (gitignored — never commit):
```
GITHUB_TOKEN=ghp_your_token_here
OMNIS_BASE_URL=http://localhost:8090
```

Without these, the app runs fully on mock data (expected in local dev).

---

## VII. TROUBLESHOOTING

### EPERM / File Lock (Windows)
```bash
# Symptom: build fails with "EPERM: operation not permitted"
# Fix 1: Close any open dist/ files in Explorer or editor
# Fix 2: Run as the same user that owns the project
# Fix 3: Wait 5s and retry: bun run build
```

### Git index.lock
```bash
# Symptom: "Another git process seems to be running"
# Fix: Only run this if no git operation is actually running
rm -f .git/index.lock
```

### Port 3000 already in use
```bash
# Kill process on port 3000:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then retry:
bun run dev
```

### routeTree.gen.ts conflict
```bash
# NEVER edit routeTree.gen.ts manually
# If it's stale, start dev server: bun run dev
# The Vite plugin regenerates it automatically
```

### Bun test hangs
```bash
# Kill and rerun:
# Ctrl+C then:
bun test tests/ --timeout 10000
```

---

## VIII. CREDIT SAVER HOOKS

The KRATOS Credit Saver hook is active in Claude Code sessions.
It shows on session start:
```
=== KRATOS CREDIT SAVER ATIVO ===
```

If you need to check Claude Code hooks:
```bash
cat .claude/settings.json  # If exists
```

---

## IX. COMMIT CHECKLIST (before any commit)

```bash
# 1. Check staged files (never git add .):
git status --short
git diff --staged

# 2. Verify no secrets:
git diff --staged | grep -i "ghp_\|Bearer\|password\|SECRET"

# 3. Build passes:
bun run build

# 4. Tests pass:
bun test tests/

# 5. Commit selectively:
git add <specific files>
git commit -m "type(kratos): description"
```

---

## X. KEY FILES

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project rules — read before any change |
| `api-contract/` | Zod schemas — source of truth |
| `backend/*/store.ts` | In-memory stores — no DB |
| `src/lib/*-server-fns.ts` | Server functions (TanStack Start) |
| `src/routes/` | File-based routes (TanStack Router) |
| `src/routeTree.gen.ts` | AUTO-GENERATED — never edit |
| `wrangler.jsonc` | Cloudflare Worker config — never deploy without auth |
