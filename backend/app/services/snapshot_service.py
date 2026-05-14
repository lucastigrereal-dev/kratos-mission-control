"""Snapshot service — persistence layer for collector snapshots, runs, and metrics."""

import json
from app.db import get_db, generate_id, now_iso


def save_snapshot(collector_name: str, source: str = "real", collector_status: str = "ok", data: dict | None = None, project_id: str | None = None) -> str:
    """Save a collector snapshot. Returns the snapshot ID.

    Uses collector_snapshots table schema: id, collector_name, source, collector_status, payload_json, collected_at.
    """
    snapshot_id = generate_id()
    db = get_db()
    payload = data if data is not None else {}
    db.execute(
        "INSERT INTO collector_snapshots (id, collector_name, source, collector_status, payload_json, collected_at) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (snapshot_id, collector_name, source, collector_status, json.dumps(payload), now_iso()),
    )
    db.commit()
    db.close()
    return snapshot_id


def save_run(run_type: str, project_id: str | None = None, data: dict | None = None) -> str:
    """Save a run record. Returns the run ID."""
    run_id = generate_id()
    db = get_db()
    db.execute(
        "INSERT INTO runs (id, run_type, project_id, data, collected_at) VALUES (?, ?, ?, ?, ?)",
        (run_id, run_type, project_id or "", json.dumps(data or {}), now_iso()),
    )
    db.commit()
    db.close()
    return run_id


def save_metrics(metrics: dict, source: str = "system") -> str:
    """Save metrics record. Returns the metrics ID."""
    metric_id = generate_id()
    db = get_db()
    db.execute(
        "INSERT INTO metrics (id, source, data, collected_at) VALUES (?, ?, ?, ?)",
        (metric_id, source, json.dumps(metrics), now_iso()),
    )
    db.commit()
    db.close()
    return metric_id


def get_latest_snapshot(collector_name: str | None = None) -> dict | None:
    """Get the most recent snapshot, optionally filtered by collector_name."""
    db = get_db()
    if collector_name:
        row = db.execute(
            "SELECT id, collector_name, source, collector_status, payload_json, collected_at "
            "FROM collector_snapshots WHERE collector_name = ? "
            "ORDER BY collected_at DESC LIMIT 1",
            (collector_name,)
        ).fetchone()
    else:
        row = db.execute(
            "SELECT id, collector_name, source, collector_status, payload_json, collected_at "
            "FROM collector_snapshots ORDER BY collected_at DESC LIMIT 1"
        ).fetchone()
    db.close()
    if row:
        return {
            "id": row["id"],
            "collector_name": row["collector_name"],
            "source": row["source"],
            "status": row["collector_status"],
            "payload": json.loads(row["payload_json"]) if row["payload_json"] else {},
            "payload_json": row["payload_json"],
            "collected_at": row["collected_at"],
        }
    return None


def get_snapshots(limit: int = 20) -> list[dict]:
    """Return recent collector snapshots."""
    db = get_db()
    rows = db.execute(
        "SELECT id, collector_name, source, collector_status, payload_json, collected_at "
        "FROM collector_snapshots ORDER BY collected_at DESC LIMIT ?",
        (limit,),
    ).fetchall()
    db.close()
    return [
        {
            "id": row["id"],
            "collector_name": row["collector_name"],
            "source": row["source"],
            "collector_status": row["collector_status"],
            "data": json.loads(row["payload_json"]) if row["payload_json"] else {},
            "collected_at": row["collected_at"],
        }
        for row in rows
    ]
