"""Alert service — evaluates system state and generates alerts.

ENTREGA 4 fix: _evaluate_system_alerts() now reads nested system collector
payload (disk.percent, memory.percent, cpu.percent) instead of flat keys.
"""

from datetime import datetime, timezone
from app.db import now_iso

# Thresholds
DISK_CRITICAL_PCT = 95
DISK_WARNING_PCT = 85
MEMORY_CRITICAL_PCT = 90
MEMORY_WARNING_PCT = 75
CPU_SUSTAINED_HIGH_PCT = 85
UPTIME_LONG_HOURS = 168  # 7 days


def get_alerts(status: str | None = None, limit: int = 50) -> list[dict]:
    """Return alerts from SQLite, optionally filtered by status."""
    try:
        from app.db import get_db
        db = get_db()
        if status:
            rows = db.execute(
                "SELECT id, title, description, severity, status, source, entity, "
                "project_id, dismissed_at, created_at, updated_at "
                "FROM alerts WHERE status = ? ORDER BY created_at DESC LIMIT ?",
                (status, limit),
            ).fetchall()
        else:
            rows = db.execute(
                "SELECT id, title, description, severity, status, source, entity, "
                "project_id, dismissed_at, created_at, updated_at "
                "FROM alerts ORDER BY created_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
        db.close()
        return [_row_to_dict(row) for row in rows]
    except Exception:
        return _mock_alerts(status)


def get_active_alerts(limit: int = 10) -> list[dict]:
    """Return active (non-dismissed) alerts."""
    return get_alerts(status="active", limit=limit)


def evaluate_system_alerts(system_data: dict) -> list[dict]:
    """Evaluate system collector payload and generate alert dicts.

    Fixed (ENTREGA 4): reads nested structure from system_collector:
      {"cpu": {"percent": ...}, "memory": {"percent": ...}, "disk": {"percent": ...}}
    instead of flat keys like disk_c_percent.
    """
    alerts = []

    data = system_data.get("data", system_data)
    if isinstance(data, dict) and "source" in data and "data" in data:
        data = data["data"]

    cpu = data.get("cpu", {})
    if isinstance(cpu, dict):
        cpu_pct = cpu.get("percent", 0)
    else:
        cpu_pct = 0

    memory = data.get("memory", {})
    if isinstance(memory, dict):
        mem_pct = memory.get("percent", 0)
    else:
        mem_pct = 0

    disk = data.get("disk", {})
    if isinstance(disk, dict):
        disk_pct = disk.get("percent", 0)
    else:
        disk_pct = data.get("disk_percent", data.get("disk_c_percent", 0))

    uptime = data.get("uptime_hours", 0)

    now = now_iso()

    if disk_pct >= DISK_CRITICAL_PCT:
        alerts.append({
            "id": f"alert-disk-critical-{now}",
            "title": f"Disco Crítico — {disk_pct}% utilizado",
            "description": f"Espaço em disco abaixo de {100 - DISK_CRITICAL_PCT}% livre. Risco de falha iminente.",
            "severity": "critical",
            "status": "active",
            "source": "system_collector",
            "entity": "disk",
            "project_id": None,
            "created_at": now,
        })
    elif disk_pct >= DISK_WARNING_PCT:
        alerts.append({
            "id": f"alert-disk-warning-{now}",
            "title": f"Disco Alto — {disk_pct}% utilizado",
            "description": f"Espaço em disco abaixo de {100 - DISK_WARNING_PCT}% livre. Considere limpar.",
            "severity": "warning",
            "status": "active",
            "source": "system_collector",
            "entity": "disk",
            "project_id": None,
            "created_at": now,
        })

    if mem_pct >= MEMORY_CRITICAL_PCT:
        alerts.append({
            "id": f"alert-memory-critical-{now}",
            "title": f"Memória Crítica — {mem_pct}% utilizada",
            "description": "Memória RAM quase esgotada. Feche aplicações não essenciais.",
            "severity": "critical",
            "status": "active",
            "source": "system_collector",
            "entity": "memory",
            "project_id": None,
            "created_at": now,
        })
    elif mem_pct >= MEMORY_WARNING_PCT:
        alerts.append({
            "id": f"alert-memory-warning-{now}",
            "title": f"Memória Alta — {mem_pct}% utilizada",
            "description": "Uso de memória elevado. Monitore antes que afete performance.",
            "severity": "warning",
            "status": "active",
            "source": "system_collector",
            "entity": "memory",
            "project_id": None,
            "created_at": now,
        })

    if cpu_pct >= CPU_SUSTAINED_HIGH_PCT:
        alerts.append({
            "id": f"alert-cpu-high-{now}",
            "title": f"CPU Alta — {cpu_pct}%",
            "description": "CPU sustentada acima de 85%. Verifique processos pesados.",
            "severity": "warning",
            "status": "active",
            "source": "system_collector",
            "entity": "cpu",
            "project_id": None,
            "created_at": now,
        })

    if uptime > UPTIME_LONG_HOURS:
        days = int(uptime / 24)
        alerts.append({
            "id": f"alert-uptime-long-{now}",
            "title": f"Uptime Longo — {days} dias sem reboot",
            "description": "Máquina sem reboot há mais de 7 dias. Considere reiniciar para estabilidade.",
            "severity": "info",
            "status": "active",
            "source": "system_collector",
            "entity": "uptime",
            "project_id": None,
            "created_at": now,
        })

    return alerts


def _row_to_dict(row) -> dict:
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"] or "",
        "severity": row["severity"] or "info",
        "status": row["status"] or "active",
        "source": row["source"] or "system",
        "entity": row["entity"] or "",
        "project_id": row["project_id"] or None,
        "dismissed_at": row["dismissed_at"] or None,
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def _mock_alerts(status: str | None = None) -> list[dict]:
    """Fallback mock alerts when SQLite is unavailable."""
    from app.services import _load_json
    alerts = _load_json("alerts.json")
    if isinstance(alerts, list) and status:
        alerts = [a for a in alerts if a.get("status") == status]
    return alerts if isinstance(alerts, list) else []
