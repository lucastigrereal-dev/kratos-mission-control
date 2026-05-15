"""Mentor Decision Service — NBA (Next Best Action) engine.

Reads collector_snapshots to generate recommendations stored in mentor_recommendations.
9-rule engine with priority scoring.
"""

import json
from datetime import datetime, timezone, timedelta
from app.db import now_iso, get_db, generate_id


# Rule weights
WEIGHT_DEADLINE = 30
WEIGHT_DRIFT_HIGH = 40
WEIGHT_DRIFT_MEDIUM = 25
WEIGHT_STALE_PROJECT = 20
WEIGHT_UNFINISHED_HIGH = 25
WEIGHT_MISSING_CHECKPOINT = 15
WEIGHT_OVERDUE_TASK = 35
WEIGHT_CRITICAL_ALERT = 45
WEIGHT_IDLE_PROJECT = 10


def _read_snapshot(collector_name: str) -> dict | None:
    """Read latest snapshot for a collector."""
    try:
        db = get_db()
        row = db.execute(
            "SELECT id, collector_name, source, collector_status, payload_json, collected_at "
            "FROM collector_snapshots WHERE collector_name = ? "
            "ORDER BY collected_at DESC LIMIT 1",
            (collector_name,)
        ).fetchone()
        db.close()
        if row and row["payload_json"]:
            return json.loads(row["payload_json"])
    except Exception:
        pass
    return None


def generate_recommendations() -> list[dict]:
    """Generate recommendations from collector snapshots and system state.
    Saves to mentor_recommendations and returns the list.
    """
    recs: list[dict] = []
    now = now_iso()

    # Rule A/E: Git hygiene
    git_data = _read_snapshot("git")
    if git_data:
        repos = git_data.get("repositories", [])
        for repo in repos:
            if not repo.get("dirty"):
                continue
            files_count = repo.get("modified_files_count", 0)
            last_commit = repo.get("last_commit_at", "")
            repo_name = repo.get("name", "unknown")

            try:
                if last_commit.endswith("Z"):
                    last_commit = last_commit[:-1] + "+00:00"
                commit_dt = datetime.fromisoformat(last_commit)
                days_since = (datetime.now(timezone.utc) - commit_dt).days
            except (ValueError, TypeError):
                days_since = 999

            severity = "critical" if files_count > 5 or days_since > 5 else "warning"
            score = 90 if severity == "critical" else 55

            rec_id = f"rec-git-{repo_name}"
            recs.append({
                "id": rec_id,
                "category": "git_hygiene",
                "title": f"Repo sujo: {repo_name}",
                "recommended_action": f"Commitar ou fazer stash das alteracoes em {repo_name}",
                "severity": severity,
                "status": "active",
                "priority_score": score,
                "related_entity_id": repo_name,
                "related_entity_type": "repository",
                "created_at": now,
                "updated_at": now,
            })

    # Rule E: Disk critical/warning
    sys_data = _read_snapshot("system")
    if sys_data:
        disk_pct = sys_data.get("disk_c_percent", sys_data.get("disk", {}).get("percent", 0))
        if isinstance(disk_pct, dict):
            disk_pct = disk_pct.get("percent", 0)

        if disk_pct >= 95:
            recs.append({
                "id": "rec-disk-critical",
                "category": "system_risk",
                "title": "Disco critico",
                "recommended_action": f"Liberar espaco em disco ({disk_pct}% utilizado)",
                "severity": "critical",
                "status": "active",
                "priority_score": 95,
                "related_entity_id": "disco c",
                "related_entity_type": "system",
                "created_at": now,
                "updated_at": now,
            })
        elif disk_pct >= 85:
            recs.append({
                "id": "rec-disk-warning",
                "category": "system_risk",
                "title": "Disco alto",
                "recommended_action": f"Monitorar espaco em disco ({disk_pct}% utilizado)",
                "severity": "warning",
                "status": "active",
                "priority_score": 65,
                "related_entity_id": "disco c",
                "related_entity_type": "system",
                "created_at": now,
                "updated_at": now,
            })

        # Check disk_c_percent for critical/warning
        mem_pct = sys_data.get("memory_percent", sys_data.get("memory", {}).get("percent", 0))
        if isinstance(mem_pct, dict):
            mem_pct = mem_pct.get("percent", 0)
        if mem_pct >= 90:
            recs.append({
                "id": "rec-memory-critical",
                "category": "system_risk",
                "title": "Memoria critica",
                "recommended_action": "Fechar aplicacoes nao essenciais",
                "severity": "critical",
                "status": "active",
                "priority_score": 90,
                "related_entity_id": "memoria",
                "related_entity_type": "system",
                "created_at": now,
                "updated_at": now,
            })

    # Rule B: No next action on active projects
    try:
        db = get_db()
        projects = db.execute(
            "SELECT id, name FROM projects WHERE status = 'active' AND (next_action IS NULL OR next_action = '')"
        ).fetchall()
        db.close()
        for p in projects:
            recs.append({
                "id": f"rec-no-action-{p['id']}",
                "category": "next_action_missing",
                "title": f"Sem proxima acao: {p['name']}",
                "recommended_action": f"Definir proxima acao para {p['name']}",
                "severity": "warning",
                "status": "active",
                "priority_score": 60,
                "related_entity_id": p["id"],
                "related_entity_type": "project",
                "created_at": now,
                "updated_at": now,
            })
    except Exception:
        pass

    # Rule D: Container unhealthy — check docker snapshot
    docker_data = _read_snapshot("docker")
    if docker_data:
        containers = docker_data.get("containers", [])
        for c in containers:
            if "unhealthy" in c.get("status_text", "").lower() or c.get("status") != "running":
                recs.append({
                    "id": f"rec-container-{c.get('name', '?')}",
                    "category": "blocker",
                    "title": f"Container: {c.get('name', '?')}",
                    "recommended_action": f"Verificar container {c.get('name', '?')}",
                    "severity": "warning",
                    "status": "active",
                    "priority_score": 70,
                    "related_entity_id": c.get("name", ""),
                    "related_entity_type": "container",
                    "created_at": now,
                    "updated_at": now,
                })

    # Rule G: Project abandonment (> 7 days no activity)
    try:
        db = get_db()
        cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        abandoned = db.execute(
            "SELECT id, name FROM projects WHERE status = 'active' "
            "AND (last_activity < ? OR last_activity IS NULL)",
            (cutoff,)
        ).fetchall()
        db.close()
        for p in abandoned:
            recs.append({
                "id": f"rec-abandoned-{p['id']}",
                "category": "project_abandonment",
                "title": f"Projeto abandonado: {p['name']}",
                "recommended_action": f"Arquivar ou retomar {p['name']}",
                "severity": "info",
                "status": "active",
                "priority_score": 35,
                "related_entity_id": p["id"],
                "related_entity_type": "project",
                "created_at": now,
                "updated_at": now,
            })
    except Exception:
        pass

    # Rule I: Too many active tasks
    try:
        db = get_db()
        count_row = db.execute(
            "SELECT COUNT(*) as cnt FROM tasks WHERE status NOT IN ('done', 'cancelled')"
        ).fetchone()
        db.close()
        active_count = count_row["cnt"] if count_row else 0
        if active_count > 10:
            recs.append({
                "id": "rec-too-many-active",
                "category": "focus",
                "title": f"Muitas tarefas ativas ({active_count})",
                "recommended_action": "Focar nas 3 mais prioritarias e pausar o resto",
                "severity": "warning",
                "status": "active",
                "priority_score": 50,
                "related_entity_id": "tasks",
                "related_entity_type": "system",
                "created_at": now,
                "updated_at": now,
            })
    except Exception:
        pass

    # Persist to mentor_recommendations (upsert-style: delete old, insert new)
    try:
        db = get_db()
        for r in recs:
            db.execute(
                "INSERT OR REPLACE INTO mentor_recommendations "
                "(id, category, title, recommended_action, severity, status, priority_score, "
                "related_entity_id, related_entity_type, created_at, updated_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    r["id"], r["category"], r["title"], r["recommended_action"],
                    r["severity"], r["status"], r["priority_score"],
                    r["related_entity_id"], r["related_entity_type"],
                    r["created_at"], r["updated_at"],
                ),
            )
        db.commit()
        db.close()
    except Exception:
        pass

    return recs


def get_active_recommendations(limit: int = 20) -> list[dict]:
    """Return active recommendations from mentor_recommendations table, generating fresh if empty."""
    try:
        db = get_db()
        rows = db.execute(
            "SELECT * FROM mentor_recommendations WHERE status = 'active' "
            "ORDER BY priority_score DESC LIMIT ?",
            (limit,)
        ).fetchall()
        db.close()
        if rows:
            return [_row_to_rec(r) for r in rows]
    except Exception:
        pass

    # Generate if table is empty
    recs = generate_recommendations()
    active = [r for r in recs if r.get("status") == "active"]
    active.sort(key=lambda r: r.get("priority_score", 0), reverse=True)
    return active[:limit]


def get_next_best_action() -> dict | None:
    """Return the single highest-scored active recommendation."""
    recs = get_active_recommendations(limit=1)
    if recs:
        return recs[0]
    return {
        "id": "rec-default",
        "category": "focus",
        "title": "Definir missao do dia",
        "recommended_action": "Definir missao do dia e executar sem interrupcoes",
        "severity": "info",
        "status": "active",
        "priority_score": 0,
        "related_entity_id": None,
        "related_entity_type": None,
    }


def get_projects_at_risk() -> list[dict]:
    """Return projects with risk signals."""
    at_risk = []
    try:
        db = get_db()
        cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        rows = db.execute(
            "SELECT id, name, status, last_activity, next_action, phase, risk_level "
            "FROM projects WHERE status = 'active' "
            "AND (last_activity < ? OR last_activity IS NULL OR next_action IS NULL OR next_action = '')",
            (cutoff,)
        ).fetchall()
        db.close()
        for p in rows:
            reasons = []
            if not p["last_activity"] or p["last_activity"] < cutoff:
                reasons.append("sem atividade recente")
            if not p["next_action"]:
                reasons.append("sem proxima acao definida")
            at_risk.append({
                "project_id": p["id"],
                "title": p["name"],
                "status": p["status"],
                "phase": p["phase"],
                "risk_level": p["risk_level"] or "medium",
                "severity": "warning" if len(reasons) >= 2 else "info",
                "reason": ", ".join(reasons),
                "last_activity": p["last_activity"],
            })
    except Exception:
        pass
    return at_risk


def get_finish_line() -> list[dict]:
    """Return tasks/projects close to completion."""
    items: list[dict] = []
    try:
        db = get_db()
        rows = db.execute(
            "SELECT id, title, project_id, status, priority FROM tasks "
            "WHERE status IN ('doing', 'next') AND priority IN ('high', 'critical') "
            "ORDER BY updated_at DESC LIMIT 5"
        ).fetchall()
        db.close()
        for t in rows:
            items.append({
                "id": t["id"],
                "title": t["title"],
                "project_id": t["project_id"],
                "status": t["status"],
                "priority": t["priority"],
                "category": "finish_line",
            })
    except Exception:
        pass
    return items


def update_recommendation(rec_id: str, new_status: str) -> dict | None:
    """Update a recommendation's status. Returns the updated rec dict, or None if not found."""
    try:
        db = get_db()
        exists = db.execute(
            "SELECT id FROM mentor_recommendations WHERE id = ?", (rec_id,)
        ).fetchone()
        if not exists:
            db.close()
            return None

        db.execute(
            "UPDATE mentor_recommendations SET status = ?, updated_at = ? WHERE id = ?",
            (new_status, now_iso(), rec_id),
        )
        db.commit()

        row = db.execute(
            "SELECT * FROM mentor_recommendations WHERE id = ?", (rec_id,)
        ).fetchone()
        db.close()
        if row:
            return _row_to_rec(row)
        return None
    except Exception:
        return None


def _row_to_rec(row) -> dict:
    return {
        "id": row["id"],
        "category": row["category"],
        "title": row["title"],
        "recommended_action": row["recommended_action"],
        "severity": row["severity"],
        "status": row["status"],
        "priority_score": row["priority_score"],
        "related_entity_id": row["related_entity_id"],
        "related_entity_type": row["related_entity_type"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }
