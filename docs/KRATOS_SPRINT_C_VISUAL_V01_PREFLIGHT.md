# KRATOS Sprint C — V01 Visual Preflight

**Data:** 2026-05-17
**Branch:** parallel/kratos-c-visual

## Baseline Numbers

| Métrica | Valor |
|----------|-------|
| Build | PASS (4.63s) |
| Tests | 270 pass / 0 fail / 25 files |
| Components | 49 kratos + 47 shadcn/ui |
| Routes | 7 (index, agora, agenda, checkpoints, projetos, contexto, sistema) |
| Hooks | 10 |
| API contracts | 9 schemas Zod |

## Scope Mapped

### 1. DashboardView
`src/components/kratos/views/DashboardView.tsx`

**Structure:**
- SectionHeader ("Mission Control" → "KRATOS")
- SourceBadgeIndicator + GitHub config badge
- 4 StatBlock cards: Projetos ativos, Em progresso, Compromissos hoje, Foco
- Alert bar (overdue → critical signal, links to /agenda)
- Quick nav: Agora, Agenda, Checkpoints, Projetos
- GitHub tracked repos section (loading → grid of TrackedRepoCard)

**States present:** Loading, data, empty (partial)
**Missing:** Top-level error state, stale data indicator, degraded state

**Token usage:** Mixed `var(--kratos-*)` and `var(--kr-color-*)` (drift detected)

### 2. ContextoView
`src/components/kratos/views/ContextoView.tsx`

**Structure:**
- SectionHeader + SourceBadgeIndicator
- CurrentContextHero (project, mission, focus status, confidence bar)
- FocusDriftCard (none/light/high)
- ActiveWindowCard + ContextReasonCard
- ContextActionStrip
- BrowserContextList / EmptyState

**States present:** Loading, Error (with retry), Empty
**Status:** Most complete view for states

**Issues:** ErrorState uses raw retry button, no missing_config badge

### 3. SistemaView
`src/components/kratos/views/SistemaView.tsx`

**Structure:**
- SectionHeader
- Worker health inline badge + OMNIS/GitHub config badges
- KRATOS services (loading → ServiceHealthCard grid)
- OMNIS services (loading/error/empty → OmnisServiceStatusCard grid)
- OMNIS crews (loading/error/empty → OmnisCrewCard grid)
- OMNIS jobs (loading/error/empty → OmnisJobItem list)
- Reference gallery: 9 live states + 3 panel states

**Missing:** SourceBadgeIndicator, top-level error boundary, degraded states

### 4. SourceBadgeIndicator
`src/components/kratos/base/SourceBadgeIndicator.tsx`

**Current implementation:**
- Supports 5 source types: live, mock, partial, stale, cache
- Color-coded severity: risk (stale/errors), amber (mock), mission (live), muted (other)
- Shows: dot + label + time ago + stale "!" indicator
- Title attribute with full details

**Gaps:**
- No `missing_config` state
- No `aria-label` on the badge itself
- No `external_unavailable` distinction
- Labels only in Portuguese — no i18n needed but consistent microcopy missing
- No visual distinction between "cache" and "fallback"

### 5. Design Tokens (`src/styles.css`)

**Current tokens:**
- Dark-only shell: `--kratos-surface-0` through `--kratos-surface-4`
- Semantic colors: `--kratos-ok`, `--kratos-warn`, `--kratos-critical`, `--kratos-info`, `--kratos-ghost`, `--kratos-accent`
- Border tokens: `--kratos-border`, `--kratos-border-on-focus`, `--kratos-border-off-focus`, `--kratos-border-live`
- Typography: Inter + JetBrains Mono
- Animations: kratos-pulse, kratos-blink, kratos-fade-in, kratos-critical-glow
- Reduced motion: Supported (wraps all animations)
- Utility classes: `.kratos-mono`, `.kratos-eyebrow`, `.kratos-display`, `.kratos-num`
- Dividers, focus-ring, card-hover, card-elevated
- Nav active item, aurora glass, chips, scrollbar

**Token Drift Detected (initial scan):**
| Issue | Location | Count |
|-------|----------|-------|
| `var(--kr-color-*)` instead of `var(--kratos-*)` | SistemaView, DashboardView | ~8 instances |
| Raw hex in style | StatusCard (rgba), ErrorState (rgba) | 4 instances |
| Font-size < 12px | Various | ~12 instances |
| `text-[0.65rem]` on badges | Multiple views | ~6 instances |

### 6. Existing Tests (270 pass)

**Store tests (25 files):**
- checkpoint-store (14), project-store (14), appointment-store (13)
- dashboard-snapshot, dashboard-snapshot-hook
- contexto-snapshot, contexto-mission-snapshot
- github-store, github-provider, github-token-safety
- omnis-store, omnis-provider, omnis-readonly-fallback
- provider-config-hooks, services-health, worker-health-hook
- health-endpoint, health-utils
- source-metadata, snapshot-contract-regression, snapshot-error-taxonomy
- Contract tests: api-envelope, backend-regression, kratos-routes, route-smoke

**No visual/DOM tests exist** — all tests are pure logic (per CLAUDE.md rules).

## Preflight Verdict

**Ready for polish.** Core infrastructure is solid. The 10 waves of polish are:
- V02: SourceBadgeIndicator — add missing_config, aria, microcopy
- V03: DashboardView — hierarchy, data provenance, next action
- V04: ContextoView — confidence, stale, source clarity
- V05: SistemaView — health states, missing_config, degraded
- V06: Operational states — standardize loading/empty/error/stale/missing_config
- V07: Neuro UX — "what is happening?", "what is real?", "what is next?"
- V08: Accessibility/motion — aria, focus-visible, contrast, reduced-motion audit
- V09: Token drift — fix raw hex, inline styles, token inconsistency
- V10: Final validation — build, tests, handoff
