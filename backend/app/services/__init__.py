"""Service layer. Tries real collectors first, falls back to mock data."""

import json
from datetime import datetime, timezone
from pathlib import Path

MOCK_DIR = Path(__file__).parent.parent.parent.parent / "mock-data"


def _load_json(filename: str) -> dict | list:
    filepath = MOCK_DIR / filename
    if not filepath.exists():
        if filename.startswith(("tasks", "projects", "activity", "deliverables", "checkpoints", "tabs", "outputs", "reminders", "alerts")):
            return []
        return {}
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def _collector_wrapper(collector_fn, fallback_fn, *args):
    """Wrapper that catches all collector errors and returns metadata + data."""
    try:
        data, source, status = collector_fn(*args)
        return {"source": source, "collector_status": status, "data": data}
    except Exception as e:
        return {"source": "fallback", "collector_status": "error", "error": str(e), "data": fallback_fn()}


# ── Now (always mock for now) ────────────────────────────────────────────────

def get_now():
    return _load_json("now.json")


# ── Projects ─────────────────────────────────────────────────────────────────

def get_projects():
    """Return real projects from SQLite, falling back to mock on failure."""
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, name, description, type, status, phase, priority, "
            "repo_path, next_action, deadline, last_activity, risk_level, "
            "outputs_count, created_at, updated_at "
            "FROM projects ORDER BY updated_at DESC"
        ).fetchall()
        db.close()
        result = []
        for row in rows:
            result.append({
                "id": row["id"],
                "name": row["name"],
                "description": row["description"] or "",
                "type": row["type"] or "product",
                "status": row["status"] or "active",
                "phase": row["phase"] or "",
                "priority": row["priority"] or "medium",
                "repo_path": row["repo_path"] or "",
                "next_action": row["next_action"] or "",
                "deadline": row["deadline"] or "",
                "last_activity": row["last_activity"] or "",
                "risk_level": row["risk_level"] or "low",
                "outputs_count": row["outputs_count"] or 0,
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            })
        if result:
            return result
    except Exception:
        pass
    return _load_json("projects.json")


def get_project_detail(project_id: str):
    """Return one project from SQLite, falling back to mock on failure."""
    try:
        from app.db import get_db
        db = get_db()
        row = db.execute(
            "SELECT id, name, description, type, status, phase, priority, "
            "repo_path, next_action, deadline, last_activity, risk_level, "
            "outputs_count, created_at, updated_at "
            "FROM projects WHERE id = ?", (project_id,)
        ).fetchone()
        db.close()
        if row:
            return {
                "id": row["id"],
                "name": row["name"],
                "description": row["description"] or "",
                "type": row["type"] or "product",
                "status": row["status"] or "active",
                "phase": row["phase"] or "",
                "priority": row["priority"] or "medium",
                "repo_path": row["repo_path"] or "",
                "next_action": row["next_action"] or "",
                "deadline": row["deadline"] or "",
                "last_activity": row["last_activity"] or "",
                "risk_level": row["risk_level"] or "low",
                "outputs_count": row["outputs_count"] or 0,
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
    except Exception:
        pass
    mapping = {
        "publisher-os": "project_detail_argos.json",
        "omnis-control": "project_detail_omnis.json",
    }
    filename = mapping.get(project_id)
    if filename:
        return _load_json(filename)
    projects = get_projects()
    for p in projects:
        if p["id"] == project_id:
            return p
    return None


# ── System (real + fallback) ─────────────────────────────────────────────────

def get_system():
    from app.collectors.system_collector import collect as system_collect
    return _collector_wrapper(system_collect, lambda: _load_json("system.json"))


# ── Docker (real + fallback) ─────────────────────────────────────────────────

def get_docker():
    from app.collectors.docker_collector import collect as docker_collect
    return _collector_wrapper(docker_collect, lambda: _load_json("docker.json"))


# ── Git (real + fallback) ────────────────────────────────────────────────────

def get_git():
    from app.collectors.git_collector import collect as git_collect
    from app.collectors.git_collector import _fallback as git_fallback
    return _collector_wrapper(git_collect, git_fallback)


# ── OMNIS (real + fallback) ─────────────────────────────────────────────────

def get_omnis_status():
    from app.collectors.omnis_collector import collect_status
    return _collector_wrapper(collect_status, lambda: _load_json("omnis_status.json"))


def get_omnis_summary():
    from app.collectors.omnis_collector import collect_summary
    return _collector_wrapper(collect_summary, lambda: _load_json("omnis_summary.json"))


# ── AKASHA (real + fallback) ─────────────────────────────────────────────────

def get_akasha_status():
    from app.collectors.akasha_collector import collect_status
    return _collector_wrapper(collect_status, lambda: {"status": "unknown", "source_badge": "unknown"})


# ── Qdrant (real + fallback) ─────────────────────────────────────────────────

def get_qdrant_status():
    from app.collectors.qdrant_collector import collect_status
    return _collector_wrapper(collect_status, lambda: {"status": "unknown", "source_badge": "unknown"})


# ── External services (Publisher OS, Supabase, Redis, Ollama, n8n) ─────────────

def get_ollama_status():
    from app.collectors.external_services_collector import collect_ollama
    return _collector_wrapper(collect_ollama, lambda: {"status": "unknown", "source_badge": "offline"})


def get_publisher_os_status():
    from app.collectors.external_services_collector import collect_publisher_os
    return _collector_wrapper(collect_publisher_os, lambda: {"status": "unknown", "source_badge": "offline"})


def get_supabase_status():
    from app.collectors.external_services_collector import collect_supabase
    return _collector_wrapper(collect_supabase, lambda: {"status": "unknown", "source_badge": "offline"})


def get_redis_status():
    from app.collectors.external_services_collector import collect_redis
    return _collector_wrapper(collect_redis, lambda: {"status": "unknown", "source_badge": "offline"})


def get_n8n_status():
    from app.collectors.external_services_collector import collect_n8n
    return _collector_wrapper(collect_n8n, lambda: {"status": "unknown", "source_badge": "offline"})


# ── Cost (estimated — no real counters yet) ────────────────────────────────────

def get_cost_status():
    from app.collectors.cost_collector import collect_status
    return _collector_wrapper(collect_status, lambda: {"status": "unknown", "source_badge": "unknown"})


# ── CRM (doc_only — vendas_crm has zero implemented skills) ────────────────────────

def get_crm_status():
    from app.collectors.crm_collector import collect_status
    return _collector_wrapper(collect_status, lambda: {"status": "unknown", "source_badge": "unknown"})


# ── Outputs (real + fallback) ────────────────────────────────────────────────

def get_outputs():
    from app.collectors.outputs_collector import collect as outputs_collect
    return _collector_wrapper(outputs_collect, lambda: _load_json("outputs.json"))


# ── Unchanged mock services ──────────────────────────────────────────────────

def get_activity():
    return _load_json("activity.json")


def get_tabs():
    return _load_json("tabs.json")


def get_checkpoints():
    """Return real checkpoints from SQLite, falling back to mock on failure."""
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, project_id, name, description, tags, snapshot, created_at "
            "FROM checkpoints ORDER BY created_at DESC"
        ).fetchall()
        db.close()
        result = []
        for row in rows:
            result.append({
                "id": row["id"],
                "project_id": row["project_id"],
                "name": row["name"],
                "description": row["description"] or "",
                "tags": json.loads(row["tags"]) if row["tags"] else [],
                "snapshot": json.loads(row["snapshot"]) if row["snapshot"] else {},
                "created_at": row["created_at"],
            })
        return result
    except Exception:
        return _load_json("checkpoints.json")


def get_timeline():
    data = _load_json("timeline.json")
    if isinstance(data, list):
        return data
    return []


def get_alerts():
    data = _load_json("alerts.json")
    if isinstance(data, list):
        return data
    return []


def _task_row_to_dict(row) -> dict:
    """Convert a SQLite Row to task dict. Reused by all task queries."""
    return {
        "id": row["id"],
        "title": row["title"],
        "project_id": row["project_id"] or "",
        "status": row["status"] or "inbox",
        "priority": row["priority"] or "medium",
        "source": row["source"] or "manual",
        "due_date": row["due_date"] or "",
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def _task_envelope(data: list, source: str) -> dict:
    """W1-B5: Standard task response envelope.
    Shape: { data: [...], source: "live"|"mock", source_ts: iso }
    """
    return {
        "data": data,
        "source": source,
        "source_ts": datetime.now(timezone.utc).isoformat(),
    }


def _mock_task_envelope(filename: str) -> dict:
    """Return mock tasks wrapped in envelope with source='mock'."""
    raw = _load_json(filename)
    items = raw if isinstance(raw, list) else []
    return _task_envelope(items, "mock")


def get_tasks() -> dict:
    """W1-B3: Return all tasks. SQLite → live envelope. Exception → mock envelope.
    Empty SQLite table returns live envelope with empty list (NOT mock).
    """
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, title, project_id, status, priority, source, "
            "due_date, created_at, updated_at "
            "FROM tasks ORDER BY created_at DESC"
        ).fetchall()
        db.close()
        return _task_envelope([_task_row_to_dict(r) for r in rows], "live")
    except Exception:
        return _mock_task_envelope("tasks.json")


def get_today_tasks() -> dict:
    """W1-B3: Return tasks due today from SQLite. Live or mock envelope."""
    try:
        from app.db import get_db
        from datetime import date as dt_date
        today = dt_date.today().isoformat()
        db = get_db()
        rows = db.execute(
            "SELECT id, title, project_id, status, priority, source, "
            "due_date, created_at, updated_at "
            "FROM tasks WHERE due_date = ? ORDER BY priority DESC",
            (today,)
        ).fetchall()
        db.close()
        return _task_envelope([_task_row_to_dict(r) for r in rows], "live")
    except Exception:
        return _mock_task_envelope("today_tasks.json")


def get_overdue_tasks() -> dict:
    """W1-B3: Return overdue tasks from SQLite. Live or mock envelope."""
    try:
        from app.db import get_db
        from datetime import date as dt_date
        today = dt_date.today().isoformat()
        db = get_db()
        rows = db.execute(
            "SELECT id, title, project_id, status, priority, source, "
            "due_date, created_at, updated_at "
            "FROM tasks WHERE due_date < ? AND status NOT IN ('done', 'cancelled') "
            "ORDER BY due_date ASC",
            (today,)
        ).fetchall()
        db.close()
        return _task_envelope([_task_row_to_dict(r) for r in rows], "live")
    except Exception:
        return _mock_task_envelope("overdue_tasks.json")


def get_unfinished_items() -> dict:
    """W1-B3: Return tasks not done/cancelled from SQLite. Live or mock envelope."""
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, title, project_id, status, priority, source, "
            "due_date, created_at, updated_at "
            "FROM tasks WHERE status NOT IN ('done', 'cancelled') "
            "ORDER BY created_at DESC"
        ).fetchall()
        db.close()
        return _task_envelope([_task_row_to_dict(r) for r in rows], "live")
    except Exception:
        return _mock_task_envelope("unfinished_items.json")


def get_project_goals():
    data = _load_json("project_goals.json")
    if isinstance(data, list):
        return data
    return []


def get_deliverables():
    data = _load_json("deliverables.json")
    if isinstance(data, list):
        return data
    return []


def get_reminders():
    return _load_json("reminders.json")


def get_mentor_summary():
    data = _load_json("mentor_summary.json")
    if not isinstance(data, dict):
        data = {}
    defaults = {
        "next_action": "Definir missão do dia",
        "next_best_action": "Definir missão do dia",
        "today_focus": ["KRATOS 0.10 Verdade Operacional"],
        "today_agenda": [],
        "focus_mode": "execution",
        "risks": [],
        "checkpoint_summary": "Nenhum checkpoint ainda",
        "recommendations_count": 0,
    }
    for k, v in defaults.items():
        if k not in data:
            data[k] = v
    return data


def get_mentor_focus():
    data = _load_json("mentor_focus.json")
    if not isinstance(data, dict):
        data = {}
    defaults = {
        "mode": "execution",
        "focus_project": "kratos-mission-control",
        "focus_block_minutes": 90,
        "do_not_do": ["Nao abrir novo projeto sem fechar o atual"],
        "timebox_minutes": 90,
    }
    for k, v in defaults.items():
        if k not in data:
            data[k] = v
    return data


def get_deadlines():
    return _load_json("deadlines.json")


def get_calendar_today():
    return _load_json("calendar_today.json")


def get_calendar_week():
    return _load_json("calendar_week.json")


def get_execution_today():
    return _load_json("execution_today.json")


# ── ActivityWatch (collector + fallback) ───────────────────────────────────────

def get_activitywatch_status():
    from app.collectors.activitywatch_collector import collect as aw_collect
    return _collector_wrapper(aw_collect, lambda: _load_json("activitywatch_status.json"))


def get_activity_windows():
    return _load_json("activity_windows.json")


def get_browser_contexts():
    return _load_json("browser_contexts.json")


def get_activity_sessions():
    return _load_json("activity_sessions.json")


def get_context_switches():
    return _load_json("context_switches.json")


def get_context_current():
    """Compose live context from ActivityWatch + drift analysis if available.
    Falls back to mock JSON if AW is offline or data is stale."""
    mock = _load_json("context_current.json")
    try:
        aw_status = get_activitywatch_status()
    except Exception:
        return mock

    # AW offline — return mock augmented with drift, checkpoint_suggestion, source, collector_status
    if aw_status.get("source") != "real" or aw_status.get("collector_status") != "ok":
        mock["current_app"] = mock.get("current_app", "unknown")
        mock["current_title"] = mock.get("current_title", "")
        mock["current_url"] = mock.get("current_url", "")
        mock["current_domain"] = mock.get("current_domain", "")
        mock["project_guess"] = mock.get("project_guess", None)
        mock["mission_guess"] = mock.get("mission_guess", None)
        mock["reason_guess"] = mock.get("reason_guess", "")
        mock["confidence"] = mock.get("confidence", 0)
        mock["focus_project_today"] = mock.get("focus_project_today", "")
        mock["on_focus"] = mock.get("on_focus", False)
        mock["focus_drift_minutes"] = mock.get("focus_drift_minutes", 0)
        mock["drift_minutes"] = mock.get("drift_minutes", 0)
        mock["active_since"] = mock.get("active_since", "")
        mock["context_switches_today"] = mock.get("context_switches_today", 0)
        mock["source"] = aw_status.get("source", "fallback")
        mock["collector_status"] = aw_status.get("collector_status", "offline")
        mock["drift"] = {
            "state": "unknown",
            "severity": "none",
            "minutes_out_of_focus": 0,
            "reason": "ActivityWatch offline",
            "current_app": mock.get("current_app", "unknown"),
            "current_title": mock.get("current_title", ""),
            "inferred_project": mock.get("project_guess"),
            "expected_project": mock.get("focus_project_today", ""),
            "recovery_action": {
                "title": "Iniciar ActivityWatch para monitorar foco",
                "cta_label": "Verificar AW",
            },
            "should_suggest_checkpoint": False,
        }
        mock["checkpoint_suggestion"] = {
            "should_suggest": False,
            "severity": "none",
            "reason": "ActivityWatch offline",
            "trigger": {"type": "unknown", "minutes_out_of_focus": 0},
            "suggested_checkpoint": None,
            "cooldown": {"active": False, "remaining_minutes": 0},
        }
        return mock

    aw_data = aw_status.get("data", {})
    windows = aw_data.get("windows", [])
    afk_events = aw_data.get("afk", [])
    current_window = windows[0] if windows else None

    # Classify current window
    if current_window:
        from app.services.context_classifier_service import classify
        classification = classify(
            title=current_window.get("title", ""),
            url=current_window.get("url", ""),
            app=current_window.get("app", ""),
        )
    else:
        classification = {"project_guess": None, "mission_guess": None, "reason_guess": "", "confidence": 0.0}

    # Mission info from now.json (no circular dependency)
    now_data = get_now()
    mission_info = {
        "current_project": now_data.get("current_project", {}),
        "current_mission": now_data.get("current_mission", {}),
    }

    # Drift analysis
    from app.services.context_drift_service import analyze_drift
    drift = analyze_drift(
        current_window=current_window,
        source=aw_status.get("source", "fallback"),
        mission_info=mission_info,
        afk_events=afk_events,
    )

    # Context switches from stored data
    try:
        from app.db import get_db
        db = get_db()
        today = datetime.now(timezone.utc).date().isoformat()
        switches = db.execute(
            "SELECT COUNT(*) as cnt FROM context_switches WHERE date(switched_at) = ?",
            (today,),
        ).fetchone()
        db.close()
        switches_today = switches["cnt"] if switches else 0
    except Exception:
        switches_today = mock.get("context_switches_today", 0)

    # Checkpoint suggestion
    last_cp = None
    try:
        checkpoints = get_checkpoints()
        if checkpoints:
            last_cp = checkpoints[0]
    except Exception:
        pass

    from app.services.checkpoint_suggestion_service import build_checkpoint_suggestion
    checkpoint_suggestion = build_checkpoint_suggestion(
        context={
            "current_app": drift["current_app"],
            "current_title": drift["current_title"],
            "project_guess": drift["inferred_project"],
            "mission_guess": classification.get("mission_guess"),
            "confidence": classification.get("confidence", 0),
            "duration_seconds": current_window.get("duration_seconds", 0) if current_window else 0,
        },
        drift=drift,
        last_checkpoint=last_cp,
    )

    return {
        "current_app": drift["current_app"],
        "current_title": drift["current_title"],
        "current_url": current_window.get("url", "") if current_window else "",
        "current_domain": current_window.get("domain", "") if current_window else "",
        "project_guess": drift["inferred_project"],
        "mission_guess": classification.get("mission_guess"),
        "reason_guess": classification.get("reason_guess", ""),
        "confidence": classification.get("confidence", 0),
        "focus_project_today": drift["expected_project"],
        "on_focus": drift["state"] == "on_focus",
        "focus_drift_minutes": drift["state"] == "on_focus" and 0 or drift["minutes_out_of_focus"],
        "drift_minutes": drift["minutes_out_of_focus"],
        "active_since": current_window.get("started_at", "") if current_window else "",
        "context_switches_today": switches_today,
        "source": aw_status.get("source", "fallback"),
        "collector_status": aw_status.get("collector_status", "ok"),
        "drift": drift,
        "checkpoint_suggestion": checkpoint_suggestion,
    }


def get_context_lost():
    return _load_json("context_lost.json")
