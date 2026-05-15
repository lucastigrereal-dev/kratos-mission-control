# KRATOS Mission Control — 5-Waves UI Review

**Audited:** 2026-05-15  
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists)  
**Screenshots:** Not captured (no dev server running at ports 3000, 5173, or 8080)  
**Audit type:** Code-only (Tailwind class audit, string audit, state handling check, CSS token audit)  
**Scope:** 11 pages, 40+ components, 7 CSS files, 1 hook

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Systematic missing diacritics across ~20 Portuguese UI strings |
| 2. Visuals | 3/4 | Strong glassmorphism identity; known unicode icon limitation |
| 3. Color | 3/4 | Thoroughly tokenized but hardcoded `#fff`/`#000` remain; dual token files cause ambiguity |
| 4. Typography | 3/4 | Well-defined scale in tokens, but magic font sizes bypass it in 5+ locations |
| 5. Spacing | 2/4 | Token scale exists but inconsistently applied; touch targets below 44px WCAG minimum |
| 6. Experience Design | 2/4 | State patterns consistent but no delete confirmation, no ErrorBoundary, silent error swallowing |

**Overall: 15/24**

---

## Top 3 Priority Fixes

1. **Add Portuguese diacritics to all UI labels** -- User impact: the application appears unpolished and unprofessional to its primary pt-BR audience. Search/find-in-page for terms like "aprovação" silently fails. Affects ~20 strings across 8 files. Fix: audit all `children`, `title`, `label`, `placeholder`, and `description` props, adding missing accents (`ç`, `ã`, `õ`, `é`, `ê`, `ú`).

2. **Add confirmation dialog for destructive actions and ErrorBoundary** -- User impact: accidental click on "x" in ApprovalCard permanently deletes an approval with no undo. Any uncaught JS exception crashes the entire SPA to a white screen. Fix: wrap `<ApprovalCard onDelete>` with a `window.confirm()` or a modal confirmation. Add a `React.ErrorBoundary` wrapper at the `<Layout>` level to catch rendering errors gracefully.

3. **Standardize spacing to token-only values and increase touch targets to 44px** -- User impact: sidebar nav items and risk rows with ~30px height are difficult to tap accurately on touch devices. Inconsistent spacing values (hardcoded `4px`, `6px`, `1rem`, `0.75rem` alongside `--kr-space-*` tokens) create visual rhythm breaks. Fix: replace all hardcoded pixel/rem values with nearest `--kr-space-N` token. Increase sidebar item and risk row padding to achieve 44px+ height.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

**Strengths:**
- All copy is in Brazilian Portuguese, consistent with `lang="pt-BR"` in `index.html`
- Time-aware greeting: "Bom dia", "Boa tarde", "Boa noite" (`KratosTopHud.tsx:10-15`)
- Error states provide specific context: "Erro ao carregar tarefas", "Falha ao conectar com OMNIS"
- Empty states have contextual descriptions and optional CTAs (`EmptyState.tsx`)
- SourceBadge labels are consistent: "ao vivo", "cache", "fallback", "mock", "erro", "desconhecido"
- Aurora command input has an engaging, example-driven placeholder (`AuroraFullScreenPanel.tsx:258`)
- Checkpoint banner uses branded language: "Sugestão Aurora" with severity labels "Urgente"/"Recomendado"

**Issues found:**

| File | Line | Current | Should Be |
|------|------|---------|-----------|
| `TodayMissionPanel.tsx` | 29 | `Missao Atual` | `Missão Atual` |
| `TodayMissionPanel.tsx` | 53 | `Missao indefinida` | `Missão indefinida` |
| `TodayMissionPanel.tsx` | 23 | `Execucao` (in focusLabel map) | `Execução` |
| `NextBestActionCard.tsx` | 39 | `Proxima Acao` | `Próxima Ação` |
| `NextBestActionCard.tsx` | 17 | `Nenhuma acao definida` | `Nenhuma ação definida` |
| `ApprovalsPage.tsx` | 79 | `fila de decisao` | `fila de decisão` |
| `ApprovalsPage.tsx` | 79 | `aprovacao humana` | `aprovação humana` |
| `ApprovalsPage.tsx` | 95 | `Nova aprovacao...` | `Nova aprovação...` |
| `ApprovalsPage.tsx` | 151 | `Erro ao carregar aprovacoes` | `Erro ao carregar aprovações` |
| `ApprovalsPage.tsx` | 153 | `Nenhuma aprovacao` / `Crie uma aprovacao` | `Nenhuma aprovação` / `Crie uma aprovação` |
| `FocusNowCard.tsx` | 57 | `NAO fazer agora` | `NÃO fazer agora` |
| `FocusNowCard.tsx` | 15 | `Aprendizado` | Correct |
| `ProjectContinuityCard.tsx` | 36 | `Retomar sessao anterior` | `Retomar sessão anterior` |
| `ProjectContinuityCard.tsx` | 38 | `sessao {N}` | `sessão {N}` |
| `ProjectContinuityCard.tsx` | 72 | `Arquivos criticos` | `Arquivos críticos` |
| `CheckpointsPage.tsx` | 47 | `entre sessoes` | `entre sessões` |
| `VisaoGeralPage.tsx` | 42 | `aprovacao humana` | `aprovação humana` |
| `VisaoGeralPage.tsx` | 63 | `Pendencias` | `Pendências` |
| `ContextoPage.tsx` | 74 | `Desconhecido` | Correct |
| `ApprovalCard.tsx` | 30 | `Critico` | `Crítico` |
| `ApprovalCard.tsx` | 28 | `Medio` | `Médio` |

Also flagged:
- Mixed-language section headers: "Mission Control" (VisaoGeralPage.tsx:38), "Approval Cockpit" (ApprovalsPage.tsx:75), "AURORA - Sentinel" (AuroraPanel.tsx:78) -- while branding is defensible, consistency would benefit from all-Portuguese labeling
- Hardcoded "OK" as status fallback (MissionLensPage.tsx:103) -- should use "Operacional" or "Estavel"
- Delete button uses bare "x" character (ApprovalCard.tsx:91) -- no text label, poor affordance

---

### Pillar 2: Visuals (3/4)

**Strengths:**
- Coherent 5-zone grid shell: TopHUD, Sidebar, MainCanvas, RightRail, BottomDock (`shell.css`)
- Glassmorphism executed thoroughly: `backdrop-filter: blur()`, translucent `rgba()` backgrounds, subtle borders
- World map is visually distinctive with floating islands, central castle, rope bridges, drifting clouds, gradient ocean (`world.css`)
- Shadow depth scale provides elevation hierarchy: surface -> card -> glass -> glass-hover -> island -> float
- Status indicators are visually differentiated: dots pulse (live), glow (critical), static (healthy, offline)
- Hover states are polished with `translateY()`, glow expansion, and brightness shifts
- AuroraPanel holographic orb with rotating rings and float animation adds visual interest
- Central castle portal glow with pulsating animation creates a clear focal point

**Issues found:**

1. **Unicode icon dependency** (`KratosSidebar.tsx:3-6`, lines 15-29)
   - Navigation uses raw unicode characters: `◈`, `◉`, `☰`, `⬡`, `◎`, `⚙`, `◆`, `◬`, `◷`, `✦`
   - These render with inconsistent glyphs across Windows/macOS/Linux and browsers
   - The codebase itself acknowledges this with a TODO comment at lines 3-6: "Trocar unicode chars por SVG icons"
   - Same issue propagates to AuroraPanel.tsx decision icons: `⊘` (blocker), `◈` (recommendation), `⏸` (doNotDo)

2. **"Loading forever" placeholder** (`VisaoGeralPage.tsx:70, 78`)
   - Tarefas and Projetos metric badges show `...` (ellipsis) as permanent values with no loading distinction
   - Users cannot tell if data is loading, unavailable, or intentionally empty

3. **Delete button affordance** (`ApprovalCard.tsx:91`)
   - Uses bare lowercase "x" with red background -- ambiguous whether it means "close", "clear", or "delete"
   - No icon, no text label beyond the unhelpful `title="Remover"`

4. **Orphaned CSS file** (`kratos-tokens.css`, 355 lines)
   - Present in source but NOT imported by `index.css` -- dead code or documentation artifact
   - Creates confusion about canonical token source

---

### Pillar 3: Color (3/4)

**Strengths:**
- Extensive CSS custom property token system: ~150 `--kr-*` tokens across sky/ocean, azure, teal, green, red-orange, gold, aurora, glass, islands, shadows, status, risk, energy, mission states
- `color-mix()` extensively used for translucent backgrounds (source badges, squad chips, status indicators, risk rows): `color-mix(in srgb, var(--kr-green-400) 10%, transparent)`
- Semantic color mapping: healthy=green, degraded=yellow, critical=red, offline=muted, stale=orange
- Status colors consistently applied across .kr-dot, .kr-chip, .kr-status-badge, .kr-metric-badge variant classes
- High-contrast media query overrides glass panels with solid backgrounds (`components.css:750-762`)
- Dark theme consistent: base `--kr-bg-abyss: #06060d`, text `--kr-text-primary: #e4e4ef`
- Island identity tokens with per-island glow colors (11 islands)

**Issues found:**

1. **Hardcoded `#fff`** -- 2 occurrences:
   - `ApprovalsPage.tsx:138`: submit button `color: "#fff"` -- should be `var(--kr-text-primary)` or `var(--kr-text-inverse)`
   - `AuroraCommandInput.tsx:115`: execute button `color: "#fff"` -- same issue

2. **Hardcoded `#000`** -- 1 occurrence:
   - `ResumeFromHereCard.tsx:93`: "Retomar daqui" button `color: "#000"` -- should be `var(--kr-text-inverse)`

3. **Hardcoded fallback hex** -- 1 occurrence:
   - `AuroraPage.tsx:23`: `background: "var(--kr-world-bg, #0a0d1a)"` -- the fallback `#0a0d1a` is not a defined token

4. **Dual token files with overlap**:
   - `tokens.css` (446 lines): imported by `index.css`, defines `--kr-bg-*`, `--kr-text-*`, `--kr-blue-*`, `--kr-green-*` etc., plus Tailwind-compatible aliases
   - `kratos-tokens.css` (355 lines): NOT imported, defines `--kr-sky-*`, `--kr-ocean-*`, `--kr-glass-*`, `--kr-space-*`, `--kr-font-*` with different naming conventions
   - Many tokens defined in both files (e.g., `--kr-azure-50` through `--kr-azure-900`, `--kr-gold-300` through `--kr-gold-600`)
   - The `kratos-tokens.css` file has tokens referenced by components (via `var()`) but since it is not imported, the fallback values in `tokens.css` or browser defaults silently apply

5. **Broken token reference** (`ProjectContinuityCard.tsx:64`):
   - Uses `"var(--kr-purple-900)"` and `"var(--kr-purple-200)"` -- these tokens are defined in NEITHER `tokens.css` NOR `kratos-tokens.css` (only `--kr-purple-400/500/600` exist)
   - Will silently resolve to `unset`/inherit, likely rendering as transparent or white

6. **Color token overuse on VisaoGeralPage** (lines 49-80):
   - 4 metric badges simultaneously use `kr-metric-badge--good`, `kr-metric-badge--warning`, `kr-metric-badge--danger`, `kr-metric-badge--info`, `kr-metric-badge--neutral` -- the rapid context-switching of color semantics across a single row reduces scannability

---

### Pillar 4: Typography (3/4)

**Strengths:**
- Typography scale defined in tokens: `--kr-font-display: 1.5rem`, `--kr-font-headline: 1.25rem`, `--kr-font-title: 1rem`, `--kr-font-body: 0.8125rem`, `--kr-font-label: 0.75rem`, `--kr-font-caption: 0.625rem`
- Font weights: display (700), headline (600), body (400), label (500)
- Leading: tight (1.2), normal (1.5), relaxed (1.7)
- Tracking: tight (-0.02em), normal (0), wide (0.04em), label (0.08em)
- Monospace font used appropriately for data values: MissionBar time, MetricBadge values, ProgressRing labels
- Uppercase labels with 0.03-0.08em tracking for section headers and status indicators -- creates clear information hierarchy
- Responsive font size reductions in mobile breakpoints (responsive.css)
- `-webkit-font-smoothing: antialiased` and `text-rendering: optimizelegibility` set globally

**Issues found:**

1. **Magic font sizes bypassing the token scale** -- 6 occurrences:
   - `NextBestActionCard.tsx:49`: `fontSize: "1.05rem"` -- no corresponding token exists
   - `AuroraFullScreenPanel.tsx:132`: `fontSize: "1.1rem"` -- no corresponding token
   - `AuroraFullScreenPanel.tsx:200`: `fontSize: "1.1rem"` -- duplicate magic value
   - `shell.css:589`: `font-size: 9px` -- below minimum readable size, no token
   - `shell.css:495`: `font-size: 10px` -- below token scale minimum
   - `shell.css:541`: `font-size: 10px` -- duplicate

2. **Heading elements lack semantic differentiation** (`components.css:31-33`):
   - h1, h2, h3 all use `font-weight: 600` -- a single-page layout with h1, h2, h3 should show clear weight/size step differences
   - h6 is repurposed as an uppercase section label (`text-transform: uppercase`) -- violates semantic HTML heading hierarchy

3. **Dual typography naming conventions**:
   - `tokens.css` uses `--kr-text-xs` through `--kr-text-3xl` (8 steps)
   - `kratos-tokens.css` uses `--kr-font-display` through `--kr-font-caption` (6 steps)
   - Components mix both conventions, creating maintenance ambiguity

4. **No font-display strategy**: No `@font-face` declarations or `font-display: swap` for Inter or JetBrains Mono -- if these fonts are loaded from Google Fonts or similar, they can cause FOIT (Flash of Invisible Text) on slow connections

---

### Pillar 5: Spacing (2/4)

**Strengths:**
- Dedicated spacing scale: `--kr-space-1` (4px) through `--kr-space-16` (64px), 4px base / 8px rhythm
- Shell zone dimensions tokenized: `--kr-shell-sidebar-width: 220px`, `--kr-shell-rightrail-width: 320px`, `--kr-shell-bottomdock-height: 72px`, `--kr-shell-tophud-height: 44px`
- Responsive column/row adjustments at 1920px, 1440px, 1366px, 1024px, 768px, 480px breakpoints
- Zero arbitrary `[px]` or `[rem]` values in TSX files (no Tailwind arbitrary value escapes found)
- Island sizing tokens: `--kr-island-central-size`, `--kr-island-large-size`, etc.

**Issues found:**

1. **Hardcoded pixel values bypassing the spacing scale** -- 10+ occurrences in CSS:
   - `shell.css:112`: `gap: 6px` (TopHUD status)
   - `shell.css:143`: `gap: 4px` (Sidebar)
   - `shell.css:155`: `gap: 2px` (Sidebar section)
   - `shell.css:257`: `gap: 6px` (Right rail)
   - `shell.css:268`: `gap: 6px` (Risk item)
   - `shell.css:329`: `margin: 0 auto 6px` (Orb)
   - `shell.css:731`: `gap: 6px` (Dock squads)
   - `components.css:110`: `padding: 1rem` (Card)
   - `components.css:270`: `padding: 2.5rem 1rem` (Empty state)
   - `components.css:270`: `gap: 0.75rem` (Empty state)
   - `AuroraFullScreenPanel.tsx:125`: `gap: 12` (Header)
   - `MissionLensPage.tsx:63`: `padding: "1rem"` (Mentor summary)

2. **Touch targets below WCAG 2.1 SC 2.5.5 minimum (44px)**:
   - Sidebar items: `padding: 7px 10px` = ~30px clickable height (`shell.css:162`)
   - Right rail risk rows: `padding: 6px 10px` = ~28px height (`shell.css:269`)
   - Section title action buttons: `padding: 2px 10px` = ~22px height (`components.css:233`)
   - Source badge chips in dock: `padding: 3px 10px` = ~24px height (`shell.css:768`)
   - All fall below the 44x44px minimum touch target recommended by WCAG and Apple HIG

3. **Padding inconsistency on same component class**:
   - `.kr-glass-panel` gets padding via inline styles on each usage: some use `var(--kr-space-section)`, others use `"1rem"`, some have `var(--kr-space-hud) var(--kr-space-section)` -- no canonical internal padding for the class itself

---

### Pillar 6: Experience Design (2/4)

**Strengths:**
- Every page (11/11) handles loading, error, empty, and data states explicitly
- Connection state system with 5 levels: live, reconnecting, polling, fallback, offline (`useLiveKratos.ts`)
- Offline/reconnecting/polling overlays provide inline feedback without blocking the UI (`Layout.tsx:101-118`)
- Degraded indicators for stale data with amber tint overlay (`.kr-data-stale`)
- Fresh data green pulse animation on live refresh (`.kr-data-fresh`)
- State transition crossfade via `.kr-state-transition` with `@keyframes kr-state-enter`
- Focus mode dims sidebar/right-rail/legend to 40% opacity with hover reveal (`.kr-focus-mode`)
- Skip link for keyboard users (`index.html:10`, `components.css:769-785`)
- `scroll-margin-top: 56px` for anchor targets (`.kr-scroll-anchor`)
- `prefers-reduced-motion` respected across all animation sources (tokens, components, responsive, world CSS files)
- `prefers-contrast: high` overrides glass panels with visible borders
- Aurora full-screen with Escape key to exit (`AuroraPage.tsx:9-16`)
- Aurora command input with ArrowUp/ArrowDown history navigation (`AuroraCommandInput.tsx:55-79`)
- ProgressRing with aria-valuenow/valuemin/valuemax attributes
- World map islands are semantic `<button>` elements with `aria-label`

**Issues found:**

1. **No React ErrorBoundary** -- Critical gap:
   - The entire SPA has zero `ErrorBoundary` components or `componentDidCatch` implementations
   - A single uncaught exception in any component (e.g., null data access, JSON parse failure) crashes the entire app to a white screen
   - The `useApi` hook's catch block (`useApi.ts:27-29`) only catches fetch errors, not render errors
   - Industry standard: at minimum, wrap `<Layout>` with an ErrorBoundary that shows a recovery UI

2. **No confirmation for destructive delete** (`ApprovalCard.tsx:77-93`):
   - The delete button fires `onDelete(approval.id)` immediately with no confirmation step
   - No `window.confirm()`, no modal, no undo capability
   - The delete is a direct `fetch(DELETE)` call (`ApprovalsPage.tsx:67`) -- permanent and irreversible
   - Combined with the ambiguous "x" label, this is a high-risk interaction

3. **Silent error swallowing** (`ResumeFromHereCard.tsx:40-44`):
   - The continuity restore POST failure is caught with an empty catch block: `// Silently fail -- continuity is advisory`
   - User clicks "Retomar daqui", sees button change to "..." loading state, then nothing happens with no error feedback
   - User is left uncertain whether the action succeeded

4. **Full-page reload instead of SPA navigation** -- 2 occurrences:
   - `Layout.tsx:144`: `window.location.assign("/tarefas")` forces a full browser reload, losing React state
   - `KratosRightRail.tsx:69`: `window.location.assign("/checkpoints")` same issue
   - These should use `react-router-dom`'s `useNavigate()` for client-side routing

5. **No transition feedback during route navigation**:
   - Clicking a world map island triggers `navigate(route)` instantly with no loading indicator
   - If the target page makes API calls, there is a blank moment before `LoadingSkeleton` renders
   - No page-level transition animation (fade, slide)

6. **Keyboard navigation gaps**:
   - World map islands have no managed tab order (all `button` elements at same DOM level, tab order follows source order which is fine)
   - However, with 7 islands plus castle, keyboard users must Tab through all to reach the main content area
   - No arrow key navigation between islands (common in spatial UIs)
   - No `tabIndex={-1}` or focus management for off-screen/decorative elements

7. **Missing loading state for VisaoGeralPage metrics** (`VisaoGeralPage.tsx:70, 78`):
   - Tarefas and Projetos counts show `...` with no loading skeleton distinction
   - Unlike Omnis/Approvals which show actual data, these are permanently placeholder

8. **ApprovalCard delete button has no progress state**:
   - No `disabled` or loading state while the DELETE request is in flight
   - User could double-click and send two DELETE requests (second one 404s)

---

## Registry Safety Audit

**Shadcn/ui:** Not present (no `components.json` file). Skipped.

---

## Files Audited

```
CSS (7 files):
  src/styles/kratos-tokens.css        (355 lines — NOT imported, orphaned)
  src/styles/tokens.css               (446 lines — imported, canonical)
  src/styles/shell.css                (800 lines)
  src/styles/components.css           (829 lines)
  src/styles/motion.css               (76 lines)
  src/styles/responsive.css           (342 lines)
  src/styles/world.css                (791 lines)
  src/index.css                       (import aggregator)

Pages (11 files):
  src/pages/VisaoGeralPage.tsx        (103 lines)
  src/pages/TarefasPage.tsx           (75 lines)
  src/pages/ProjetosPage.tsx          (78 lines)
  src/pages/ContextoPage.tsx          (157 lines)
  src/pages/SistemaPage.tsx           (151 lines)
  src/pages/OmnisPage.tsx             (202 lines)
  src/pages/ApprovalsPage.tsx         (174 lines)
  src/pages/AuroraPage.tsx            (30 lines)
  src/pages/CheckpointsPage.tsx       (83 lines)
  src/pages/MissionLensPage.tsx       (171 lines)
  src/App.tsx                         (33 lines)

Core components (15 files):
  src/components/Layout.tsx           (157 lines)
  src/components/KratosVisualShell.tsx(28 lines)
  src/components/KratosTopHud.tsx     (76 lines)
  src/components/KratosSidebar.tsx    (75 lines)
  src/components/KratosRightRail.tsx  (79 lines)
  src/components/KratosBottomDock.tsx (75 lines)
  src/components/KratosWorldMap.tsx   (179 lines)
  src/components/FloatingIsland.tsx   (66 lines)
  src/components/CentralCastleIsland.tsx (67 lines)
  src/components/AuroraPanel.tsx      (174 lines)
  src/components/AuroraFullScreenPanel.tsx (263 lines)
  src/components/AuroraCommandInput.tsx (133 lines)
  src/components/MissionBar.tsx       (57 lines)
  src/components/SourceBadge.tsx      (66 lines)
  src/components/LoadingSkeleton.tsx  (23 lines)

Dashboard cards (5 files):
  src/components/TodayMissionPanel.tsx     (70 lines)
  src/components/NextBestActionCard.tsx    (67 lines)
  src/components/BlockedItemsCard.tsx      (82 lines)
  src/components/FocusNowCard.tsx          (71 lines)
  src/components/ProjectContinuityCard.tsx (80 lines)

Feature components (5 files):
  src/components/ApprovalCard.tsx              (98 lines)
  src/components/CheckpointTimeline.tsx       (111 lines)
  src/components/ResumeFromHereCard.tsx       (126 lines)
  src/components/CheckpointSuggestionBanner.tsx (201 lines)
  src/components/IslandBridge.tsx             (lines for bridge SVG)

UI primitives (5 files):
  src/components/ui/EmptyState.tsx            (23 lines)
  src/components/ui/ErrorState.tsx            (36 lines)
  src/components/ui/MetricBadge.tsx
  src/components/ui/ProgressRing.tsx
  src/components/ui/SectionTitle.tsx

World components (3 files):
  src/components/WorldOceanBackground.tsx
  src/components/WorldClouds.tsx
  src/components/world/IslandMiniCard.tsx
  src/components/world/WorldMapLegend.tsx

Hooks (2 files):
  src/hooks/useApi.ts                         (40 lines)
  src/hooks/useLiveKratos.ts

Entry points:
  index.html
  src/main.tsx
```

**Total audited:** ~55 source files, ~4,500+ lines of code

---

## Recommendation Summary

| # | Severity | Pillar | Issue | Files Affected | Fix Effort |
|---|----------|--------|-------|----------------|------------|
| 1 | HIGH | Copywriting | Missing Portuguese diacritics | 8 files, ~20 strings | ~30 min |
| 2 | HIGH | Experience | No delete confirmation + no ErrorBoundary | 2 files | ~45 min |
| 3 | MEDIUM | Spacing | Touch targets below 44px; hardcoded spacing values | 5 files, ~12 values | ~30 min |
| 4 | MEDIUM | Color | Hardcoded #fff/#000; orphaned kratos-tokens.css | 3 files | ~20 min |
| 5 | MEDIUM | Typography | Magic font sizes bypassing scale | 3 files, ~6 values | ~15 min |
| 6 | LOW | Experience | window.location.assign instead of react-router | 2 files | ~10 min |
| 7 | LOW | Visuals | Unicode icon replacement with SVG | 2 files (sidebar, aurora) | ~60 min (deferred) |
| 8 | LOW | Typography | No font-display strategy | index.html or tokens.css | ~5 min |
