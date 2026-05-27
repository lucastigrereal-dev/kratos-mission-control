"""missions — lê data/missions/ do OMNIS e projeta estado atual.

READ-ONLY. Lê index.jsonl + events/<id>.jsonl diretamente.
Sem importar módulos do OMNIS — puro JSON parsing.
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from fastapi import APIRouter, Query

router = APIRouter(prefix="/missions", tags=["missions"])

OMNIS_DIR = Path(os.environ.get("OMNIS_DIR", r"C:\Users\lucas\omnis-control"))
MISSIONS_DIR = OMNIS_DIR / "data" / "missions"
INDEX_PATH = MISSIONS_DIR / "index.jsonl"
EVENTS_DIR = MISSIONS_DIR / "events"

# Mapeamento de event_type → label humano curto
EVENT_LABELS: dict[str, str] = {
    "mission_created":   "Criado",
    "mission_started":   "Iniciado",
    "plan_drafted":      "Planejando",
    "plan_approved":     "Plano aprovado",
    "mission_planned":   "Planejado",
    "step_started":      "Executando step",
    "step_completed":    "Step concluído",
    "tool_invoked":      "Tool invocada",
    "tool_returned":     "Tool retornou",
    "skill_invoked":     "Skill invocada",
    "skill_returned":    "Skill retornou",
    "approval_requested":"Aguardando aprovação",
    "approval_granted":  "Aprovado",
    "approval_rejected": "Rejeitado",
    "artifact_produced": "Artefato gerado",
    "retry_attempted":   "Tentativa retry",
    "budget_exceeded":   "Budget excedido",
    "mission_paused":    "Pausado",
    "mission_resumed":   "Retomado",
    "mission_completed": "Concluído",
    "mission_failed":    "Falhou",
    "mission_cancelled": "Cancelado",
    "checkpoint_created":"Checkpoint salvo",
    "error_logged":      "Erro registrado",
}

STATUS_ORDER = ["running", "paused", "draft", "completed", "failed", "cancelled"]


def _read_index() -> dict[str, dict]:
    """Lê index.jsonl — deduplica por mission_id, mantém última entrada."""
    if not INDEX_PATH.exists():
        return {}
    missions: dict[str, dict] = {}
    try:
        for line in INDEX_PATH.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                m = json.loads(line)
                mid = m.get("mission_id", "")
                if mid:
                    missions[mid] = m
            except json.JSONDecodeError:
                continue
    except Exception:
        pass
    return missions


def _read_events(mission_id: str) -> list[dict]:
    """Lê events/<id>.jsonl ordenados por sequence."""
    path = EVENTS_DIR / f"{mission_id}.jsonl"
    if not path.exists():
        return []
    events: list[dict] = []
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    except Exception:
        return []
    return sorted(events, key=lambda e: e.get("sequence", 0))


def _project_state(mission_id: str, base: dict) -> dict:
    """Projeta estado atual a partir dos eventos."""
    events = _read_events(mission_id)

    status = base.get("status", "draft")
    current_step: str | None = None
    retry_count = 0
    max_retries = 3  # padrão do OMNIS TaskState
    last_retry_node: str | None = None
    checkpoint_id: str | None = None
    checkpoint_label: str | None = None
    cumulative_cost_usd = 0.0
    last_event_type: str | None = None
    last_event_at: str | None = None
    errors: list[str] = []

    for ev in events:
        etype = ev.get("event_type", "")
        last_event_type = etype
        last_event_at = ev.get("timestamp", "")
        cumulative_cost_usd = max(cumulative_cost_usd, ev.get("cumulative_cost_usd", 0.0))

        match etype:
            case "mission_started":
                status = "running"
                # max_retries pode estar no payload do mission_started
                _mr = ev.get("payload", {}).get("max_retries")
                if _mr is not None:
                    max_retries = int(_mr)
            case "mission_completed":
                status = "completed"
            case "mission_failed":
                status = "failed"
            case "mission_cancelled":
                status = "cancelled"
            case "mission_paused":
                status = "paused"
            case "mission_resumed":
                status = "running"
            case "step_started":
                current_step = ev.get("payload", {}).get("step_name") or current_step
            case "step_completed":
                current_step = None
            case "retry_attempted":
                retry_count += 1
                last_retry_node = ev.get("payload", {}).get("node") or ev.get("payload", {}).get("step")
                # max_retries pode estar no payload
                _mr = ev.get("payload", {}).get("max_retries")
                if _mr is not None:
                    max_retries = int(_mr)
            case "checkpoint_created":
                checkpoint_id = ev.get("payload", {}).get("checkpoint_id")
                checkpoint_label = ev.get("payload", {}).get("label", "")
            case "error_logged":
                msg = ev.get("payload", {}).get("error", "")
                if msg:
                    errors.append(msg)

    return {
        "mission_id": mission_id,
        "title": base.get("title", ""),
        "sector": base.get("sector", ""),
        "status": status,
        "current_step": current_step,
        "retry_count": retry_count,
        "max_retries": max_retries,
        "last_retry_node": last_retry_node,
        "checkpoint_id": checkpoint_id,
        "checkpoint_label": checkpoint_label,
        "cumulative_cost_usd": cumulative_cost_usd,
        "last_event_type": last_event_type,
        "last_event_label": EVENT_LABELS.get(last_event_type or "", last_event_type or ""),
        "last_event_at": last_event_at,
        "error_count": len(errors),
        "last_error": errors[-1] if errors else None,
        "event_count": len(events),
    }


@router.get("/active")
def missions_active(
    limit: int = Query(default=10, ge=1, le=50),
):
    """Missões ativas do OMNIS com estado projetado — READ-ONLY."""
    _limit = int(limit) if isinstance(limit, (int, float, str)) else 10
    index = _read_index()
    if not index:
        return {"data": [], "total": 0, "source": "empty", "missions_dir": str(MISSIONS_DIR)}

    # Projeta estado e ordena por prioridade de status
    projected = [_project_state(mid, base) for mid, base in index.items()]
    projected.sort(
        key=lambda m: (
            STATUS_ORDER.index(m["status"]) if m["status"] in STATUS_ORDER else 99
        )
    )
    projected = projected[:_limit]

    return {
        "data": projected,
        "total": len(projected),
        "source": "live" if projected else "empty",
        "missions_dir": str(MISSIONS_DIR),
    }
