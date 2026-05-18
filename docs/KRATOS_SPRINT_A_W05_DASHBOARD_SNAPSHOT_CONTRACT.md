# KRATOS Sprint A W05 — Dashboard Snapshot Contract

**Date:** 2026-05-17
**Wave:** A05

---

## Contract: `DashboardSnapshotData`

Created `api-contract/dashboard.schema.ts`:

- `DashboardSummaryCardSchema` — label, value, trend (up/down/stable), detail
- `DashboardServicesSummarySchema` — total, live, degraded, offline, unknown
- `DashboardRepoDigestSchema` — abbreviated repo info (nome, openPRs, openIssues, ultimoPush)
- `DashboardNextActionSchema` — action, project, priority (high/medium/low), deadline
- `DashboardSnapshotDataSchema` — aggregates summary_cards, services, repos, next_actions, health

## Build

✅ Green (2.28s SSR)
