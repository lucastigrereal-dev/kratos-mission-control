"""omnis_health — lê health_scores.jsonl do OMNIS e retorna último score.

Nunca executa o scorer (evita side-effects no KRATOS).
Sem dado real = {data: null}.
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/omnis-health", tags=["omnis-health"])

OMNIS_DIR = Path(os.environ.get("OMNIS_DIR", r"C:\Users\lucas\omnis-control"))
HEALTH_LOG = OMNIS_DIR / "logs" / "health_scores.jsonl"

_COLOR_GREEN  = "green"
_COLOR_YELLOW = "yellow"
_COLOR_RED    = "red"


def _derive_color(score: int) -> str:
    if score >= 70:
        return _COLOR_GREEN
    if score >= 40:
        return _COLOR_YELLOW
    return _COLOR_RED


def _read_latest() -> dict | None:
    """Lê última linha do JSONL. Retorna None se arquivo ausente/vazio."""
    try:
        if not HEALTH_LOG.exists():
            return None
        lines = [l for l in HEALTH_LOG.read_text(encoding="utf-8").splitlines() if l.strip()]
        if not lines:
            return None
        raw = json.loads(lines[-1])
        score = int(raw.get("score", 0))
        # Formato compacto: {date, score} — derivo color e normalizo campo
        return {
            "score": score,
            "color": raw.get("color") or _derive_color(score),
            "generated_at": raw.get("generated_at") or raw.get("date", ""),
            "checks": raw.get("checks", []),
        }
    except Exception:
        return None


@router.get("/score")
def omnis_health_score():
    """Último health_score do OMNIS — lê logs/health_scores.jsonl."""
    data = _read_latest()
    return {
        "data": data,
        "source": "live" if data else "error",
        "log_path": str(HEALTH_LOG),
    }
