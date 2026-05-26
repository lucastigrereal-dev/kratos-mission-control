"""omnis_runs — lê mission_runs.jsonl do OMNIS.

Retorna os N runs mais recentes sem inventar dado.
Sem dado real = data: [].
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from fastapi import APIRouter, Query

router = APIRouter(prefix="/omnis-runs", tags=["omnis-runs"])

OMNIS_DIR = Path(os.environ.get("OMNIS_DIR", r"C:\Users\lucas\omnis-control"))
RUNS_LOG = OMNIS_DIR / "logs" / "mission_runs.jsonl"


def _read_runs(limit: int = 20) -> list[dict]:
    try:
        if not RUNS_LOG.exists():
            return []
        lines = [l for l in RUNS_LOG.read_text(encoding="utf-8").splitlines() if l.strip()]
        runs = []
        for line in reversed(lines):  # mais recentes primeiro
            try:
                runs.append(json.loads(line))
            except json.JSONDecodeError:
                continue
            if len(runs) >= limit:
                break
        return runs
    except Exception:
        return []


@router.get("/list")
def omnis_runs_list(limit: int = Query(default=10, ge=1, le=100)):
    """Últimos N mission_runs do OMNIS — mais recente primeiro."""
    runs = _read_runs(limit)
    return {
        "data": runs,
        "total": len(runs),
        "source": "live" if runs else "empty",
        "log_path": str(RUNS_LOG),
    }
