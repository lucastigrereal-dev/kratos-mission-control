"""Mentor signal service — generates lightweight signals/notifications for the cockpit.

Signals are simple dicts: {type, title, description, severity, entity, entity_type, created_at}.
"""

from datetime import datetime, timezone, timedelta
from app.db import now_iso


def generate_signals() -> list[dict]:
    """Generate operational signals from current system state. Returns list of signal dicts."""
    signals: list[dict] = []

    # Check system health
    try:
        from app.services import get_system
        sys_data = get_system()
        sys_source = sys_data.get("source", "unknown")
        if sys_source == "real":
            data = sys_data.get("data", {})
            disk = data.get("disk", {})
            if isinstance(disk, dict) and disk.get("percent", 0) >= 90:
                signals.append({
                    "type": "system_health",
                    "title": f"Disco em {disk['percent']}%",
                    "description": f"Espaço em disco crítico: {disk.get('free_gb', 0):.1f}GB livres",
                    "severity": "critical" if disk["percent"] >= 95 else "warning",
                    "entity": "disk",
                    "entity_type": "system",
                    "created_at": now_iso(),
                })
            mem = data.get("memory", {})
            if isinstance(mem, dict) and mem.get("percent", 0) >= 85:
                signals.append({
                    "type": "system_health",
                    "title": f"Memória em {mem['percent']}%",
                    "description": f"RAM alta: {mem.get('used_gb', 0):.1f}GB / {mem.get('total_gb', 0):.1f}GB",
                    "severity": "warning",
                    "entity": "memory",
                    "entity_type": "system",
                    "created_at": now_iso(),
                })
    except Exception:
        pass

    # Check Docker unhealthy containers
    try:
        from app.services import get_docker
        docker_data = get_docker()
        if docker_data.get("source") == "real":
            data = docker_data.get("data", {})
            unhealthy = data.get("unhealthy", 0)
            if unhealthy > 0:
                signals.append({
                    "type": "docker_health",
                    "title": f"{unhealthy} container(es) unhealthy",
                    "description": "Containers Docker com status unhealthy detectados",
                    "severity": "warning",
                    "entity": "docker",
                    "entity_type": "infrastructure",
                    "created_at": now_iso(),
                })
    except Exception:
        pass

    # Check dirty repos
    try:
        from app.services import get_git
        git_data = get_git()
        if git_data.get("source") == "real":
            data = git_data.get("data", {})
            dirty_count = data.get("dirty", 0)
            if dirty_count > 2:
                signals.append({
                    "type": "git_hygiene",
                    "title": f"{dirty_count} repo(s) com alterações não commitadas",
                    "description": "Alterações não salvas são trabalho em risco",
                    "severity": "warning" if dirty_count > 4 else "info",
                    "entity": "git",
                    "entity_type": "infrastructure",
                    "created_at": now_iso(),
                })
    except Exception:
        pass

    # Check for stalled tasks
    try:
        from app.db import get_db
        db = get_db()
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=6)).isoformat()
        stalled = db.execute(
            "SELECT COUNT(*) as cnt FROM tasks "
            "WHERE status = 'doing' AND updated_at < ?",
            (cutoff,)
        ).fetchone()
        db.close()
        if stalled and stalled["cnt"] > 0:
            signals.append({
                "type": "task_stall",
                "title": f"{stalled['cnt']} tarefa(s) parada(s) em 'doing' há mais de 6h",
                "description": "Tarefas paradas podem indicar bloqueio ou perda de foco",
                "severity": "info",
                "entity": "tasks",
                "entity_type": "project",
                "created_at": now_iso(),
            })
    except Exception:
        pass

    return signals
