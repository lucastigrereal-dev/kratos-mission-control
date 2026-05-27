"""content_drafts — lê caption_drafts.jsonl do OMNIS.

Exibe fila de aprovação de conteúdo — READ-ONLY.
KRATOS observa, OMNIS aprova (via: omnis content approve --batch).
Sem dado = data: [].
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from fastapi import APIRouter, Query

router = APIRouter(prefix="/content/drafts", tags=["content-drafts"])

OMNIS_DIR = Path(os.environ.get("OMNIS_DIR", r"C:\Users\lucas\omnis-control"))
DRAFTS_PATH = OMNIS_DIR / "data" / "caption_drafts.jsonl"

VALID_STATUSES = {"draft", "needs_review", "approved", "rejected"}


def _read_drafts(status: str | None = None, limit: int = 20) -> list[dict]:
    try:
        if not DRAFTS_PATH.exists():
            return []
        lines = [l for l in DRAFTS_PATH.read_text(encoding="utf-8").splitlines() if l.strip()]
        items = []
        for line in reversed(lines):  # mais recentes primeiro
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue
            if status and item.get("status") != status:
                continue
            items.append(item)
            if len(items) >= limit:
                break
        return items
    except Exception:
        return []


@router.get("")
def list_drafts(
    status: str | None = Query(default=None, description="Filtrar por status"),
    limit: int = Query(default=20, ge=1, le=100),
):
    """Fila de drafts de conteúdo do OMNIS — READ-ONLY."""
    items = _read_drafts(status=status, limit=limit)
    # Contagens por status (sempre calculadas do arquivo completo)
    all_items = _read_drafts(limit=1000)
    from collections import Counter
    por_status = dict(Counter(i.get("status", "unknown") for i in all_items))

    return {
        "data": items,
        "total_filtered": len(items),
        "por_status": por_status,
        "source": "live" if items else "empty",
        "drafts_path": str(DRAFTS_PATH),
    }
