"""Context loss detection — signals that indicate cognitive continuity risk.

Detects patterns like: project switching without checkpoints, long gaps,
incomplete sessions, stale tasks, and loss of mental context.
"""

from datetime import datetime, timezone, timedelta
from app.db import now_iso


def detect_context_loss() -> list[dict]:
    """Detect signals of context loss across projects, tasks, checkpoints.
    Returns list of loss signal dicts with description, severity, entity, suggested_action.
    """
    signals: list[dict] = []

    try:
        from app.db import get_db
        db = get_db()
    except Exception:
        return _mock_context_loss()

    try:
        # Signal 1: Projects with no recent checkpoint
        projects = db.execute(
            "SELECT p.id, p.name, p.last_activity, p.updated_at, "
            "  (SELECT MAX(c.created_at) FROM checkpoints c WHERE c.project_id = p.id) as last_cp "
            "FROM projects p WHERE p.status = 'active'"
        ).fetchall()

        for p in projects:
            last_activity = p["last_activity"] or p["updated_at"] or ""
            last_cp = p["last_cp"]

            if last_cp and last_activity:
                try:
                    cp_dt = _parse_iso(last_cp)
                    act_dt = _parse_iso(last_activity)
                    if act_dt > cp_dt and (act_dt - cp_dt).total_seconds() > 7200:
                        signals.append({
                            "description": f"Atividade em '{p['name']}' sem checkpoint há mais de 2h",
                            "severity": "warning",
                            "entity": p["id"],
                            "entity_type": "project",
                            "suggested_action": f"Criar checkpoint para {p['name']}",
                            "detected_at": now_iso(),
                        })
                except (ValueError, TypeError):
                    pass

            if not last_cp and p.get("last_activity"):
                signals.append({
                    "description": f"Projeto '{p['name']}' ativo sem nenhum checkpoint",
                    "severity": "info",
                    "entity": p["id"],
                    "entity_type": "project",
                    "suggested_action": f"Criar primeiro checkpoint para {p['name']}",
                    "detected_at": now_iso(),
                })

        # Signal 2: Tasks stuck in 'doing' for too long
        stuck = db.execute(
            "SELECT id, title, project_id, updated_at FROM tasks "
            "WHERE status = 'doing' AND updated_at < ?",
            ((datetime.now(timezone.utc) - timedelta(hours=4)).isoformat(),)
        ).fetchall()

        for t in stuck:
            signals.append({
                "description": f"Tarefa '{t['title']}' em 'doing' há mais de 4h — possível stall",
                "severity": "warning",
                "entity": t["id"],
                "entity_type": "task",
                "project_id": t["project_id"],
                "suggested_action": "Avançar tarefa para próxima etapa ou pedir ajuda",
                "detected_at": now_iso(),
            })

        # Signal 3: Recent context switches > threshold
        today = datetime.now(timezone.utc).date().isoformat()
        switches = db.execute(
            "SELECT COUNT(*) as cnt FROM context_switches WHERE date(switched_at) = ?",
            (today,),
        ).fetchone()
        switch_count = switches["cnt"] if switches else 0

        if switch_count > 30:
            signals.append({
                "description": f"Alto número de trocas de contexto hoje ({switch_count}) — risco de fragmentação",
                "severity": "warning" if switch_count > 50 else "info",
                "entity": "context",
                "entity_type": "system",
                "suggested_action": "Reduzir interrupções. Bloco de foco de 25min.",
                "detected_at": now_iso(),
            })

        # Signal 4: Tasks in inbox for > 3 days
        stale = db.execute(
            "SELECT id, title, project_id FROM tasks "
            "WHERE status = 'inbox' AND created_at < ?",
            ((datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),)
        ).fetchall()

        for t in stale:
            signals.append({
                "description": f"Tarefa '{t['title']}' parada no inbox há mais de 3 dias",
                "severity": "info",
                "entity": t["id"],
                "entity_type": "task",
                "project_id": t["project_id"],
                "suggested_action": "Processar inbox — defina status e prioridade",
                "detected_at": now_iso(),
            })

        db.close()
    except Exception:
        try:
            db.close()
        except Exception:
            pass

    return signals


def _parse_iso(s: str) -> datetime:
    """Parse ISO datetime string, handling Z suffix."""
    if not s:
        raise ValueError("empty string")
    if s.endswith("Z"):
        s = s[:-1] + "+00:00"
    return datetime.fromisoformat(s)


def _mock_context_loss() -> list[dict]:
    from app.services import _load_json
    loss = _load_json("context_loss.json")
    return loss if isinstance(loss, list) else []
