# KRATOS KR30 W30 — Next Sprint Recommendation

**Date:** 2026-05-17  
**Wave:** K30  

---

## CURRENT STATE (post KR30)

- Build: ✅ Green (3.5s)
- Tests: ✅ 176 pass / 0 fail
- CI: ✅ Configured
- Contracts: ✅ All major contracts documented
- frontend/: 🔒 Untouched (FrontendGuard active)
- Deploy: ❌ Not done (requires authorization)

---

## RECOMMENDED NEXT SPRINTS (ranked)

### 🥇 SPRINT A — Worker Snapshots Real (HIGH VALUE)

**Goal:** Connect real data to KRATOS cockpit (GitHub + contexto at minimum)

**Waves:**
1. Configure GITHUB_TOKEN in Cloudflare Worker
2. Verify live GitHub data displays in `/sistema`
3. Implement `/api/dashboard/snapshot` server function
4. Implement `dashboard.schema.ts` Zod schema
5. Connect OMNIS_BASE_URL (when OMNIS is running)
6. Implement `/api/health` Worker endpoint (K13 plan)
7. Test with real data + fallback regression

**Requires:** Lucas authorization to set Cloudflare Worker secrets

---

### 🥈 SPRINT B — Visual Sprint (HIGH IMPACT)

**Goal:** Frontend MVP visual polish — FrontendGuard lifted

**Waves:**
1. Lift FrontendGuard explicitly
2. SourceBadge UI component (`src/components/kratos/base/SourceBadge.tsx`)
3. Dashboard visual improvements
4. /sistema visual hardening (real health badges)
5. Mobile 375px audit pass
6. Dark mode verification pass
7. Accessibility (ARIA) final pass
8. Neuro-UX TDAH review

**Requires:** Lucas authorization to open visual sprint

---

### 🥉 SPRINT C — Playwright E2E (QUALITY)

**Goal:** Visual smoke tests for all 7 routes

**Waves:**
1. Install Playwright (`bunx playwright install chromium`)
2. Create `playwright.config.ts`
3. Create `tests/e2e/smoke.spec.ts` (7 routes)
4. Add Playwright to CI workflow
5. Run first green E2E suite

**Requires:** Lucas authorization to install new dependency + CI has runners

---

### SPRINT D — Staging Deploy (MILESTONE)

**Goal:** First deployment to Cloudflare Workers

**Waves:**
1. Final pre-deploy checklist
2. Configure Worker secrets (GITHUB_TOKEN, OMNIS_BASE_URL)
3. `wrangler deploy` (REQUIRES explicit Lucas authorization)
4. Verify live URL works
5. Smoke test against live URL

**Requires:** EXPLICIT LUCAS AUTHORIZATION for every deploy step

---

## RECOMMENDATION MATRIX

| Sprint | Value | Risk | Auth Required | Time Estimate |
|---|---|---|---|---|
| A — Worker Snapshots | 🟢 High | 🟡 Medium | Worker secrets only | 1 session (15-20 waves) |
| B — Visual Sprint | 🟢 High | 🟡 Medium | FrontendGuard lift | 1-2 sessions |
| C — Playwright E2E | 🟡 Medium | 🟢 Low | Dependency install | 0.5 session |
| D — Staging Deploy | 🔴 High stakes | 🔴 High | Full explicit auth | 1 session |

---

## WHAT TO SAY TO START

To start Sprint A (recommended):
> "AUTORIZAÇÃO EXPLÍCITA: conectar GITHUB_TOKEN no Worker e implementar snapshots reais. Não fazer deploy."

To start Sprint B (visual):
> "AUTORIZAÇÃO EXPLÍCITA: FrontendGuard DESATIVADO. Sprint visual KRATOS."

To start Sprint C (Playwright):
> "AUTORIZAÇÃO EXPLÍCITA: instalar Playwright e criar smoke tests E2E."

To start Sprint D (deploy — caution):
> "AUTORIZAÇÃO EXPLÍCITA: deploy KRATOS staging no Cloudflare Workers."

---

## SUMMARY

✅ KRATOS backend is solid (176 tests, CI, contracts)  
✅ Next sprint options are clear and ranked  
✅ All options preserve boundaries  
🎯 Recommended: Sprint A (Worker Snapshots) — highest ROI, lowest risk  
