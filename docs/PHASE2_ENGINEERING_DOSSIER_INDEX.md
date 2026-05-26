# Phase 2 Engineering Dossier Index

Generated: 2026-05-19

This index points to the Phase 2 documentation-only artifacts created under `reports/`.

## Files

- `reports/PHASE2_ENGINEERING_DOSSIER.md` - complete architecture dossier and verdict.
- `reports/REPO_TREE_AND_INVENTORY.txt` - repository tree and role inventory.
- `reports/ARCHITECTURE_DEPENDENCY_MAP.md` - package, runtime, and domain dependency maps.
- `reports/RUNTIME_AND_DATA_FLOWS.md` - runtime, SSE, context, mentor, OMNIS, Akasha/Obsidian flows.
- `reports/FRONTEND_BACKEND_DATABASE_ANALYSIS.md` - frontend/backend/database analysis and drift matrix.
- `reports/AI_AGENTS_SKILLS_GOVERNANCE.md` - AI orchestration, agent, skill, and governance analysis.
- `reports/RISK_DEBT_ROADMAP.md` - risk register, technical debt, and roadmap.
- `reports/architecture_inventory.json` - structured JSON inventory.
- `reports/mermaid/system_context.mmd` - system context diagram.
- `reports/mermaid/runtime_live_snapshot.mmd` - live snapshot sequence diagram.
- `reports/mermaid/akasha_obsidian_flow.mmd` - Akasha/Obsidian data flow.
- `reports/mermaid/governance_boundaries.mmd` - governance and boundary diagram.

## Current Dossier Verdict

KRATOS has a real architecture and real runtime components, but the next work should lock current truth before adding more features:

1. Choose canonical frontend.
2. Declare FastAPI vs Worker backend authority.
3. Resolve SQLite schema drift.
4. Harden API envelope tests.
5. Automate governance checks.

