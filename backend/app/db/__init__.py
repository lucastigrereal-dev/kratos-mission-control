import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

DB_DIR = Path(__file__).parent.parent.parent / "data"
DB_PATH = Path(os.environ.get("KRATOS_DB_PATH", str(DB_DIR / "kratos.db")))


def get_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript(SCHEMA)
    conn.commit()
    conn.close()
    seed_db()


def seed_db():
    """Seed projects table from mock data so FKs resolve."""
    import json
    from pathlib import Path as _Path

    mock_projects = _Path(__file__).parent.parent.parent.parent / "mock-data" / "projects.json"
    if not mock_projects.exists():
        return

    with open(mock_projects, "r", encoding="utf-8") as f:
        projects = json.load(f)

    conn = get_db()
    for p in projects:
        conn.execute(
            "INSERT OR IGNORE INTO projects (id, name, description, repo_path, type, status, phase, "
            "priority, next_action, deadline, last_activity, risk_level, outputs_count, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                p.get("id"),
                p.get("name"),
                p.get("description", ""),
                p.get("repo_path", ""),
                p.get("type", "product"),
                p.get("status", "active"),
                p.get("phase", ""),
                p.get("priority", "medium"),
                p.get("next_action", ""),
                p.get("deadline", ""),
                p.get("last_activity", ""),
                p.get("risk_level", "low"),
                p.get("outputs_count", 0),
                now_iso(),
                now_iso(),
            ),
        )
    conn.commit()
    conn.close()


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def generate_id():
    return uuid.uuid4().hex[:12]


SCHEMA = """
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    repo_path TEXT,
    type TEXT DEFAULT 'product',
    status TEXT DEFAULT 'active',
    phase TEXT,
    priority TEXT DEFAULT 'medium',
    next_action TEXT,
    deadline TEXT,
    last_activity TEXT,
    risk_level TEXT DEFAULT 'low',
    outputs_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    phase TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS checkpoints (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    snapshot TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS activity_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT,
    event_type TEXT NOT NULL,
    description TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    source TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'inbox',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    deadline_type TEXT DEFAULT 'soft',
    next_action TEXT,
    blocker TEXT,
    source TEXT DEFAULT 'manual',
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS project_goals (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    goal_title TEXT NOT NULL,
    goal_description TEXT,
    success_criteria TEXT,
    status TEXT DEFAULT 'active',
    target_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS deliverables (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'not_started',
    due_date TEXT,
    owner TEXT DEFAULT 'lucas',
    output_path TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    task_id TEXT,
    reminder_text TEXT NOT NULL,
    reminder_type TEXT DEFAULT 'followup',
    scheduled_for TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS unfinished_items (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    title TEXT NOT NULL,
    reason_detected TEXT,
    last_activity_at TEXT,
    suggested_next_action TEXT,
    risk_level TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS omnis_snapshot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    snapshot TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS collector_snapshots (
    id TEXT PRIMARY KEY,
    collector_name TEXT NOT NULL,
    source TEXT,
    collector_status TEXT,
    payload_json TEXT NOT NULL,
    payload_hash TEXT,
    collected_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collector_runs (
    id TEXT PRIMARY KEY,
    collector_name TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at TEXT NOT NULL,
    finished_at TEXT NOT NULL,
    duration_ms INTEGER,
    error_message TEXT,
    fallback_used INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alert_events (
    id TEXT PRIMARY KEY,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK(severity IN ('info','warning','critical')),
    title TEXT NOT NULL,
    message TEXT,
    entity_type TEXT,
    entity_id TEXT,
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','resolved','dismissed')),
    payload_json TEXT
);

CREATE TABLE IF NOT EXISTS metric_timeseries (
    id TEXT PRIMARY KEY,
    metric_name TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    value REAL NOT NULL,
    unit TEXT,
    collected_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mentor_recommendations (
    id TEXT PRIMARY KEY,
    priority_score INTEGER DEFAULT 0,
    severity TEXT NOT NULL CHECK(severity IN ('info','warning','critical')),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    recommended_action TEXT,
    project_id TEXT,
    related_entity_type TEXT,
    related_entity_id TEXT,
    reason TEXT,
    confidence REAL DEFAULT 0.8,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','completed','dismissed','snoozed')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    task_id TEXT,
    deliverable_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK(event_type IN ('task','deadline','reminder','review','checkpoint','delivery')),
    start_at TEXT,
    end_at TEXT,
    due_at TEXT,
    status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled','done','missed','cancelled')),
    priority TEXT DEFAULT 'medium',
    source TEXT DEFAULT 'manual' CHECK(source IN ('manual','mentor','collector','mock','test')),
    environment TEXT DEFAULT 'dev' CHECK(environment IN ('dev','test','production')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS execution_plans (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    focus_project_id TEXT,
    next_best_action_id TEXT,
    plan_text TEXT,
    do_not_do_json TEXT,
    timeblocks_json TEXT,
    source TEXT DEFAULT 'mentor',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_plans (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL UNIQUE,
    top_3_priorities_json TEXT,
    schedule_json TEXT,
    notes TEXT,
    completed INTEGER DEFAULT 0,
    source TEXT DEFAULT 'mentor',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_plans (
    id TEXT PRIMARY KEY,
    week_start TEXT NOT NULL UNIQUE,
    focus_project_id TEXT,
    goals_json TEXT,
    do_not_do_json TEXT,
    source TEXT DEFAULT 'mentor',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deadline_rules (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    rule_type TEXT NOT NULL,
    entity_type TEXT,
    days_until_due INTEGER,
    severity TEXT DEFAULT 'warning',
    source TEXT DEFAULT 'mentor',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_windows (
    id TEXT PRIMARY KEY,
    app TEXT,
    title TEXT,
    url TEXT,
    domain TEXT,
    started_at TEXT,
    ended_at TEXT,
    duration_seconds INTEGER DEFAULT 0,
    project_guess TEXT,
    mission_guess TEXT,
    confidence REAL DEFAULT 0.0,
    source TEXT DEFAULT 'activitywatch',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_sessions (
    id TEXT PRIMARY KEY,
    started_at TEXT,
    ended_at TEXT,
    primary_project_id TEXT,
    active_apps_json TEXT,
    active_domains_json TEXT,
    context_switch_count INTEGER DEFAULT 0,
    focus_score REAL DEFAULT 0.0,
    summary TEXT,
    source TEXT DEFAULT 'activitywatch',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS browser_contexts (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    domain TEXT,
    project_guess TEXT,
    reason_guess TEXT,
    confidence REAL DEFAULT 0.0,
    last_active_at TEXT,
    duration_seconds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'unknown' CHECK(status IN ('active','stale','distraction','unknown')),
    source TEXT DEFAULT 'activitywatch',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS context_switches (
    id TEXT PRIMARY KEY,
    from_project_id TEXT,
    to_project_id TEXT,
    from_app TEXT,
    to_app TEXT,
    switched_at TEXT NOT NULL,
    reason_guess TEXT,
    confidence REAL DEFAULT 0.0,
    source TEXT DEFAULT 'activitywatch',
    environment TEXT DEFAULT 'dev',
    created_at TEXT NOT NULL
);
"""
