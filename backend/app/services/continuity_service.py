"""Continuity service — session state persistence for project context across restarts."""
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

STATE_FILE = Path(__file__).parent.parent.parent.parent / "mock-data" / "continuity_state.json"


def _load() -> dict:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def _save(state: dict) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def get_continuity_state() -> dict:
    state = _load()
    if not state:
        return {
            "has_previous_session": False,
            "message": "Nenhuma sessao anterior encontrada. Tudo limpo para comecar.",
        }

    return {
        "has_previous_session": True,
        "project_id": state.get("project_id"),
        "project_name": state.get("project_name"),
        "last_action": state.get("last_action"),
        "next_step": state.get("next_step"),
        "branch": state.get("branch"),
        "critical_files": state.get("critical_files", []),
        "focus_state": state.get("focus_state"),
        "last_active_at": state.get("last_active_at"),
        "session_count": state.get("session_count", 1),
        "message": f"Voce estava trabalhando em **{state.get('project_name', 'projeto desconhecido')}**. Ultima acao: {state.get('last_action', 'nao registrada')}.",
    }


def update_continuity_state(
    project_id: Optional[str] = None,
    project_name: Optional[str] = None,
    last_action: Optional[str] = None,
    next_step: Optional[str] = None,
    branch: Optional[str] = None,
    critical_files: Optional[list[str]] = None,
    focus_state: Optional[str] = None,
) -> dict:
    state = _load()
    now = datetime.now(timezone.utc).isoformat()

    if "session_count" not in state:
        state["session_count"] = 0
    state["session_count"] += 1

    if project_id is not None:
        state["project_id"] = project_id
    if project_name is not None:
        state["project_name"] = project_name
    if last_action is not None:
        state["last_action"] = last_action
    if next_step is not None:
        state["next_step"] = next_step
    if branch is not None:
        state["branch"] = branch
    if critical_files is not None:
        state["critical_files"] = critical_files
    if focus_state is not None:
        state["focus_state"] = focus_state

    state["last_active_at"] = now
    _save(state)

    return {"saved": True, "last_active_at": now, "session_count": state["session_count"]}


def reset_continuity() -> dict:
    if STATE_FILE.exists():
        STATE_FILE.unlink()
    return {"reset": True, "message": "Estado de continuidade resetado."}
