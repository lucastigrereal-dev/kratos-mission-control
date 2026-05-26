# CAPABILITY TYPE TAXONOMY

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED (domains/types/layers from live codebase audit)

## Domains

| Domain | Description | Example | Evidence |
|--------|-------------|---------|----------|
| `kratos` | Mission Control cockpit — frontend + backend FastAPI | `kratos.live.stream` | CONFIRMED — `src/routes/`, `backend/app/` |
| `akasha` | Vector memory — pgvector + embeddings + knowledge retrieval | `akasha.memory.search` | CONFIRMED — `akasha/src/`, Docker container |
| `omnis` | Agent execution engine — crews, skills, mission packages | `omnis.crew.execute` | CONFIRMED — `backend/app/omnis/` |
| `gringotts` | Finance + treasury — schema, analytics, cost tracking | `gringotts.cost.track` | CONFIRMED — commit `686f647`, 4 tables |
| `mission_control` | Cross-system orchestration — composition, health, governance | `mission_control.health.aggregate` | HYPOTHESIS — emerging from KRATOS sistema screen |
| `publisher_os` | Content publishing — Instagram, MCP, crews, scheduler | `publisher_os.content.produce` | CONFIRMED — `~/publisher-os/`, MCP server |
| `cross_cutting` | Shared infrastructure — auth, secrets, logging, config | `cross_cutting.auth.token` | HYPOTHESIS — token patterns exist but not centralized |
| `external` | Third-party integrations — GitHub, Docker, ActivityWatch, Meta | `external.github.status` | CONFIRMED — GitHub collector in backend |

## Types

| Type | Description | Example | Evidence |
|------|-------------|---------|----------|
| `route` | HTTP endpoint (REST/SSE) | `GET /live/stream` | CONFIRMED — `backend/app/routes/` |
| `hook` | Lifecycle hook (git, claude, system) | `pre-commit token scan` | CONFIRMED — `.claude/hooks/` |
| `agent` | AI agent with tool access | `kratos-architect` | CONFIRMED — `.claude/agents/` |
| `skill` | Reusable capability module | `neuro-ux-checker` | CONFIRMED — `.claude/skills/` |
| `collector` | Data gatherer (read-only system probe) | `git_collector.py` | CONFIRMED — `backend/app/collectors/` |
| `service` | Background service / daemon | `live_event_service.py` | CONFIRMED — `backend/app/services/` |
| `script` | Executable script (one-shot or scheduled) | `decompile_db.py` | CONFIRMED — `backend/*.py` scripts |
| `external` | Third-party system or API | `GitHub API` | CONFIRMED — `useGithub.ts` |
| `workflow` | Multi-step orchestrated process | `publish_content_flow` | CONFIRMED — Publisher OS CrewAI flows |
| `adapter` | Bridge between two systems | `omnis_collector.py` | CONFIRMED — reads OMNIS, exposes to KRATOS |
| `repo_lego` | Reusable template/repo block | `tanstack-start-template` | HYPOTHESIS — concept, not yet catalogued |
| `schema` | Data contract / type definition | `checkpoint.schema.ts` | CONFIRMED — `api-contract/` |
| `dashboard` | Visual monitoring panel | `MissionLens dashboard` | CONFIRMED — `src/routes/sistema.tsx` |
| `command` | CLI or slash command | `/audit` | CONFIRMED — AGENTS.md commands |
| `event` | Async event / message | `live.snapshot` | CONFIRMED — SSE event stream |
| `memory_source` | Knowledge store backend | `Akasha pgvector` | CONFIRMED — `akasha/src/` |
| `governor` | Policy enforcer / gatekeeper | `token-enforcer` | CONFIRMED — `.claude/skills/token-enforcer/` |
| `prompt_pack` | Curated prompt collection | `kimi-to-code` | HYPOTHESIS — skill contains prompts |

## Layers

| Layer | Description | Example | Evidence |
|-------|-------------|---------|----------|
| `interface` | User-facing UI components | `AgoraView.tsx` | CONFIRMED — `src/components/kratos/views/` |
| `transport` | Network communication (HTTP, SSE, WS) | `live_event_service.py` | CONFIRMED — SSE `/live/stream` |
| `application` | Use case orchestration | `useLiveKratos.ts` | CONFIRMED — `src/hooks/` |
| `domain` | Business logic + rules | `checkpoint suggestion service` | CONFIRMED — `backend/app/services/` |
| `infrastructure` | Storage, compute, networking | `SQLite WAL database` | CONFIRMED — `backend/app/` persistence |
| `memory` | Knowledge storage + retrieval | `pgvector embeddings` | CONFIRMED — `akasha/src/` |
| `orchestration` | Multi-system coordination | `OMNIS crew execution` | CONFIRMED — `omnis/` directory |
| `governance` | Policy, safety, compliance | `token-enforcer` | CONFIRMED — `.claude/skills/` |
| `observability` | Monitoring, logging, health | `health.py` | CONFIRMED — `backend/app/routes/health.py` |
| `automation` | Scheduled / triggered execution | `post_scheduler.py` | CONFIRMED — Publisher OS U1 |
| `content` | Publishing + media pipelines | `produce_content crew` | CONFIRMED — `mcp__publisher-os__produce_content` |
| `external` | Third-party system boundary | `GitHub API client` | CONFIRMED — `useGithub.ts` |
