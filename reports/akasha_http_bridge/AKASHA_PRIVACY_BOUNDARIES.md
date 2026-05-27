# AKASHA PRIVACY BOUNDARIES — ABA23

**Date:** 2026-05-21 | **Project:** KRATOS Mission Control

---

## Core Principles

| Principle | Rule |
|-----------|------|
| Read-only by default | All Akasha bridge endpoints are GET or POST with no side effects |
| No automatic ingestion | Bridge does not write to Akasha database |
| No vector write | No embeddings creation via bridge |
| No full document dump | API returns metadata + controlled excerpts only |
| No Obsidian vault traversal | Bridge does not access Obsidian files |
| No production secrets | No credentials, tokens, or keys in responses |

## Privacy Limits

| Field | Policy | Max Length |
|-------|--------|------------|
| `chunk_text` | Truncated excerpt, no full document | 500 chars |
| `file_path` | Stripped system path prefix | Relative only |
| `file_name` | Visible (already public by nature of being in Akasha) | Full |
| `domain` | Visible | Full |
| `section_path` | Visible | Full |
| `page_number` | Visible | N/A |

## Content That MUST Be Filtered

If any of these appear in search results, they must be redacted:
- Passwords, API keys, tokens
- Full credit card numbers
- Full government ID numbers (CPF, RG)
- Private keys (SSH, GPG)
- `.env` file contents

The bridge does NOT perform deep PII scanning — it relies on:
1. Akasha's existing trust_score mechanism
2. Truncation to 500 chars as a safety measure
3. No full document retrieval

## Data Classification (L0-L5)

| Level | Type | Examples | Bridge Action |
|-------|------|----------|---------------|
| L0 | Public | Published blog posts, public content | Return full metadata |
| L1 | Internal | Project notes, todos | Return metadata + excerpt |
| L2 | Sensitive | Personal reflections, finances | Return metadata + limited excerpt |
| L3 | Confidential | Strategic plans, contracts | Return only count/summary |
| L4 | Private | Credentials, secrets, passwords | BLOCKED — never expose |
| L5 | Restricted | Legal, regulatory | BLOCKED — never expose |

**Note:** Akasha does not currently classify documents by L0-L5. This is a future governance improvement. Current bridge applies blanket truncation.

## Response Safety Checklist

All bridge responses MUST pass:
- [ ] No full document text
- [ ] No file_path revealing OS username
- [ ] No credentials or secrets
- [ ] No raw SQL dumps
- [ ] No Obsidian `.obsidian/` config files
- [ ] No `.env` content
- [ ] chunk_text ≤ 500 chars
- [ ] source_badge indicates data freshness
