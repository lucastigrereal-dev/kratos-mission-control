"""Agência endpoint — lê content_queue.jsonl do OMNIS.

Retorna sumário honesto: total, por status, próximo slot agendado.
Nunca inventa métrica de Instagram. Sem dado real = null.
"""
import json
import os
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/agencia", tags=["agencia"])

OMNIS_DIR = Path(os.environ.get("OMNIS_DIR", "C:\\Users\\lucas\\omnis-control"))
CONTENT_QUEUE_PATH = OMNIS_DIR / "data" / "content_queue.jsonl"


def _read_queue() -> list[dict]:
    try:
        if not CONTENT_QUEUE_PATH.exists():
            return []
        lines = CONTENT_QUEUE_PATH.read_text(encoding="utf-8").splitlines()
        return [json.loads(l) for l in lines if l.strip()]
    except Exception:
        return []


@router.get("/queue-summary")
def agencia_queue_summary():
    """Sumário do content_queue do OMNIS — contagens reais, sem invenção."""
    items = _read_queue()

    if not items:
        return {"data": None, "source": "live"}

    from collections import Counter
    statuses = Counter(i.get("status", "unknown") for i in items)

    # Próximo slot agendado (menor date+time com status != done)
    pendentes = [
        i for i in items
        if i.get("status") not in ("done", "published", "cancelled")
        and i.get("date") and i.get("time")
    ]
    pendentes.sort(key=lambda i: (i.get("date", ""), i.get("time", "")))
    proximo = pendentes[0] if pendentes else None

    return {
        "data": {
            "total": len(items),
            "por_status": dict(statuses),
            "proximo_slot": {
                "date": proximo["date"],
                "time": proximo["time"],
                "account": proximo.get("account_handle"),
                "objective": proximo.get("objective"),
                "status": proximo.get("status"),
            } if proximo else None,
        },
        "source": "live",
        "queue_path": str(CONTENT_QUEUE_PATH),
    }
