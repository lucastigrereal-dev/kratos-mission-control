# KRATOS AI Orchestration, Agents, Skills, and Governance

Generated: 2026-05-19

## 1. Governance Summary

KRATOS has a real project operating system:

- `CLAUDE.md` defines architecture, rules, protected components, test gates, design standards and boundaries.
- `AGENTS.md` defines mandatory reading, safety rules, and agent responsibilities.
- `docs/project-os/governance-constitution.md` is canonical governance.
- `docs/project-os/boundary-map.md` defines system separation.
- `docs/project-os/agent-manifest.md` defines agent roles.
- `docs/project-os/skill-manifest.md` defines skill roles.

This is not accidental documentation. It is an explicit attempt to manage multi-agent development without losing control.

## 2. Agent System

Active agents:

| Agent | Scope | Correct use |
|---|---|---|
| `kratos-architect` | Architecture planning | Before multi-file features |
| `kratos-data-layer` | Schemas, hooks, mock data, stores | Before UI consumption |
| `kratos-api-builder` | API endpoints/contracts | When backend/API changes |
| `kratos-ui-builder` | Route/components/views | After data/contract exists |
| `kratos-qa-guard` | Review and quality gate | Before commit/merge |

Canonical execution order:

```text
architect -> data-layer -> api-builder -> ui-builder -> qa-guard
```

This ordering is sane because it avoids UI being built before the data contract.

## 3. Agent Risks

| Risk | Severity | Explanation |
|---|---|---|
| Agent instructions stale vs code reality | High | Some docs mention Hono/Worker while real backend is FastAPI |
| Parallel work conflicts | Medium | Protected files and route tree can collide |
| Agent overreach | High | Governance says KRATOS observes only; agents must not add execution features |
| Historical context overload | Medium | Many reports make it hard to know current truth |
| Unenforced rules | High | Documentary rules need CI/hook verification |

## 4. Skills System

Active skill classes:

| Tier | Skills | Purpose |
|---|---|---|
| Core | api-contract-sync, token-enforcer, visual-qa-kimi, neuro-ux-checker, motion-guardian | Quality and consistency gates |
| Builder | glass-panel-builder, hud-assembler, island-composer | UI construction |
| Integration | akasha-vault-builder, omnis-lab-builder | External system status UI |
| Meta | kimi-to-code | Convert specs into implementation |

## 5. Skills System Risks

| Risk | Severity | Explanation |
|---|---|---|
| Skills become decorative docs | Medium | They need direct mapping to checks |
| Placeholder skills not detected | Medium | Manifest should be machine-validated |
| KIMI visual specs override current UX | Medium | KIMI references must not break KRATOS operating model |
| Token enforcement not automated | High | Design token drift is hard to detect manually |

## 6. Governance Strengths

- Clear "KRATOS sees, OMNIS acts, Akasha remembers" split.
- Explicit protected components.
- Explicit no deploy/no push/no secret policy.
- Explicit no `routeTree.gen.ts` manual edit policy.
- TDAH-first UX principles.
- Source/provenance philosophy.
- Read-only OMNIS contract.

## 7. Governance Contradictions

### Contradiction 1: Backend identity

Docs in places describe Hono/Cloudflare Worker as the backend architecture. The real local backend is FastAPI.

Impact:

- Agents may implement the wrong layer.
- Tests may verify the wrong runtime.
- Deployment architecture may become confused.

### Contradiction 2: KRATOS does not write Akasha vs scripts write Akasha

The boundary map says KRATOS never writes Akasha. The scripts in this repo can write Akasha.

Resolution:

- KRATOS runtime never writes Akasha.
- Authorized maintenance scripts can write Akasha when explicitly invoked.
- This distinction must be documented.

### Contradiction 3: Aurora owns interpretation vs backend mentor services

Backend services already generate signals, recommendations and mission intelligence.

Resolution:

- KRATOS backend may compute deterministic operational heuristics.
- Aurora owns conversational interpretation and mentor voice.
- Anything that sounds like autonomous judgment should expose rationale/source/confidence.

## 8. Required Governance Automation

Add checks for:

- forbidden `.env` reads in report/build tasks
- no OMNIS mutation calls
- no protected component changes without explicit flag
- no manual `src/routeTree.gen.ts` edits
- API contract freshness
- source badge coverage
- DB schema drift
- generated report inventory

## 9. Governance Roadmap

1. Create `docs/architecture/CURRENT_RUNTIME_AUTHORITY.md`.
2. Create `docs/architecture/FRONTEND_AUTHORITY.md`.
3. Create `docs/architecture/DATABASE_SCHEMA_AUTHORITY.md`.
4. Convert governance rules into scripts/checks.
5. Add a single command that reports:
   - current branch
   - dirty files
   - protected file changes
   - source code vs docs-only changes
   - contract drift
   - DB drift

