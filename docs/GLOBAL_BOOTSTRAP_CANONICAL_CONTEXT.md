# GLOBAL BOOTSTRAP CANONICAL CONTEXT
# Version: 1.0 | Ratified: 2026-05-21 | Authority: OMNIS/KRATOS Autopilot

---

## 1. CANONICAL PATHS

| Resource | Absolute Path |
|----------|---------------|
| KRATOS Source | `C:\Users\lucas\kratos-mission-control` |
| OMNIS Control (canonical) | `C:\Users\lucas\omnis-control` |
| OMNIS Maintenance | `C:\Users\lucas\omnis-maintenance` |
| OMNIS Runtime | `C:\Users\lucas\omnis-runtime` |
| Akasha Core | `C:\Users\lucas\akasha` |
| Akasha Paperless-brain | `C:\Users\lucas\akasha-paperless-brain` |
| Audit Root | `C:\Users\lucas\Desktop\ECOSSISTEMA_TIGRE_ULTRA_AUDIT_2026-05-19` |
| Reports Root | `C:\Users\lucas\Desktop\ECOSSISTEMA_TIGRE_ULTRA_AUDIT_2026-05-19\reports` |
| CLAUDE Global | `C:\Users\lucas\.claude` |
| CLAUDE Registry | `C:\Users\lucas\.claude\registry` |
| CLAUDE Skills | `C:\Users\lucas\.claude\skills` |
| Obsidian Vault | `C:\Users\lucas\Documents\Obsidian` |

---

## 2. SOURCE OF TRUTH BY DOMAIN

| Domain | Source of Truth | Format | Location |
|--------|----------------|--------|----------|
| Skills Catalog | `skills.yaml` | YAML | `~/.claude/registry/` |
| Capabilities | `capabilities.yaml` + `capabilities/` | YAML | `~/.claude/registry/` |
| Agents | `agents.yaml` | YAML | `~/.claude/registry/` |
| Workflows | `workflows.yaml` | YAML | `~/.claude/registry/` |
| Sectors | `sectors.yaml` | YAML | `~/.claude/registry/` |
| Decision Engine | `decision_engine.yaml` | YAML | `~/.claude/registry/` |
| Guardrails | `guardrails.yaml` | YAML | `~/.claude/registry/` |
| API Contracts | `reports/contract-truth/` | MD + JSON | Audit Root |
| Auth Spec | `reports/auth_minimum_layer/` | MD + JSON | Audit Root |
| Governance | `reports/governance/` | MD + JSON | Audit Root |
| Runtime Truth | `reports/runtime/` | MD + JSON | Audit Root |
| Backend Audit | `reports/backend/` | MD + JSON | Audit Root |
| Knowledge Systems | `reports/knowledge/` | MD + JSON | Audit Root |
| Overlord Status | `reports/overlord_control_tower/` | MD + JSON | Audit Root |
| Autopilot | `reports/autopilot/` | MD + JSON | Audit Root |
| KRATOS Code | `kratos-mission-control/backend/` | Python | KRATOS Repo |
| OMNIS Code | `omnis-control/src/` | Python | OMNIS Repo |

---

## 3. WRITING RULES

- **All new reports → Audit Root `reports/`** — never inside source repos
- **Code changes → Source repos only** — never in Audit Root
- **Docs that ship with code → `<repo>/docs/`** — canonical context, architecture decisions
- **Never write inside `node_modules/`, `.venv/`, `__pycache__/`, `.git/`**

---

## 4. BRANCH RULES

- KRATOS canonical: `feature/fase14-integration` (verify with `git branch --show-current`)
- OMNIS canonical: `feature/omnis-5waves-runtime-supreme`
- Never commit to `main`/`master` without explicit Human Slot
- Never force-push to any branch
- Never skip hooks (`--no-verify`)

---

## 5. PROHIBITIONS (ALL PHASES)

- Modifying source code before mapping it
- Committing without report + approval
- Pushing without explicit confirmation
- Touching `.env`, secrets, tokens, credentials
- Deleting files without backup
- Moving repo folders
- Advancing phase without gate
- Creating new 3D/visual UX
- Implementing features before Runtime Authority
- Running everything at once
- `git add -A` or `git add .`
- `git add -f` without Human Slot

---

## 6. HUMAN SLOT POLICY

L4/L5 actions requiring explicit Lucas approval:
- External API deployment
- Social media publishing
- Production database migration
- Credential rotation
- Repository deletion
- Force push
- New external service integration
- OAuth token refresh for production

---

## 7. CLAIM CLASSIFICATION LABELS

| Label | Meaning | Evidence Required |
|-------|---------|-------------------|
| `CONFIRMED` | Verified in code | File path, line number, live test |
| `PARTIAL` | Partially implemented | What exists vs what's missing |
| `DOC_ONLY` | Documented, not implemented | Doc reference |
| `HYPOTHESIS` | Logical inference | Basis for inference |
| `UNKNOWN` | Cannot verify | Why unverifiable |
| `BLOCKED` | Cannot proceed | What blocks it |

---

## 8. SEVERITY LEVELS

| Level | Meaning | Action |
|-------|---------|--------|
| `CRITICAL` | Stop everything | Reconcile before continuing |
| `HIGH` | Significant risk | Address before next phase |
| `MEDIUM` | Moderate risk | Track, address when possible |
| `LOW` | Minor | Document, fix later |

---

## 9. GLOBAL STATUS CLASSIFICATION

| Status | Meaning |
|--------|---------|
| `CLEAR` | All consistent, can continue |
| `WARN` | Risk or divergence, doesn't block |
| `BLOCKED` | Real risk of breaking architecture/path/security/contract |
| `CRITICAL` | Stop everything, reconcile before continuing |

---

*Global Bootstrap Canonical Context — Ratified by Autopilot Block 1*
