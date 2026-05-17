# KRATOS — Placeholder Skills Guard

**Date:** 2026-05-17  
**Wave:** K27  

---

## GUARDED SKILLS

These skills are marked `status: placeholder` and must NOT be invoked this sprint:

### 1. `akasha-vault-builder`
- **File:** `.claude/skills/akasha-vault-builder.md`
- **Status:** `placeholder` in frontmatter
- **Blocked because:**
  - Requires writing to `frontend/` (FrontendGuard active)
  - Requires Akasha integration contracts (not yet defined)
  - Requires `AKASHA_URL` env var (not configured)
- **Unlock conditions:**
  1. FrontendGuard lifted (visual sprint authorized)
  2. `AKASHA_URL` configured in Cloudflare Worker
  3. Akasha contracts defined in `api-contract/`

### 2. `omnis-lab-builder`
- **File:** `.claude/skills/omnis-lab-builder.md`
- **Status:** `placeholder` in frontmatter
- **Blocked because:**
  - Requires writing to `frontend/` (FrontendGuard active)
  - OMNIS Lab would need display of execution controls (OMNIS boundary risk)
  - `/omnis` route doesn't exist in current router
- **Unlock conditions:**
  1. FrontendGuard lifted (visual sprint authorized)
  2. OMNIS read-only display contract fully defined
  3. Explicit Lucas authorization that OMNIS Lab is display-only

---

## VISUAL-ONLY SKILLS (deferred this sprint)

These skills work correctly but can only be used when frontend/ is writable:

| Skill | Blocked By |
|---|---|
| `glass-panel-builder` | FrontendGuard |
| `hud-assembler` | FrontendGuard |
| `island-composer` | FrontendGuard |
| `kimi-to-code` | FrontendGuard |
| `visual-qa-kimi` | FrontendGuard |

---

## HOW TO CHECK SKILL STATUS

```bash
# Check status frontmatter of any skill:
head -15 .claude/skills/<skill-name>.md | grep "status:"

# List all placeholder skills:
grep -l "status: placeholder" .claude/skills/*.md
```

---

## GUARD PROTOCOL

If someone (human or agent) tries to invoke a placeholder skill:
1. Check frontmatter `status:` field
2. If `placeholder` → STOP
3. Return: "Skill `<name>` is a placeholder — unlock conditions not met: [list]"
4. Log attempt in session notes

---

## SUMMARY

✅ akasha-vault-builder: confirmed placeholder, conditions documented  
✅ omnis-lab-builder: confirmed placeholder, conditions documented  
✅ Visual-only skills: listed and deferred  
✅ Guard protocol documented  
