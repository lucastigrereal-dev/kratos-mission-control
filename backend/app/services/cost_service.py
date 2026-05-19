"""Cost Service — Finance Monster / Gringotts foundation.

Tracks LLM execution costs, provides cost summaries, and enforces budget guardrails.
All data stored in SQLite via app.db — local-first, zero cloud dependency.
"""

from datetime import datetime, timezone, timedelta

# Model pricing ($ per 1M tokens)
MODEL_PRICING = {
    "claude-opus-4-7":      {"provider": "anthropic", "input_1m": 15.00, "output_1m": 75.00},
    "claude-sonnet-4-6":    {"provider": "anthropic", "input_1m": 3.00,  "output_1m": 15.00},
    "claude-haiku-4-5":     {"provider": "anthropic", "input_1m": 0.80,  "output_1m": 4.00},
    "deepseek-v4-pro":      {"provider": "deepseek",  "input_1m": 0.50,  "output_1m": 2.00},
    "gemini-2.5-flash":     {"provider": "google",    "input_1m": 0.15,  "output_1m": 0.60},
    "gemini-2.5-pro":       {"provider": "google",    "input_1m": 1.25,  "output_1m": 5.00},
    "gpt-5":                {"provider": "openai",    "input_1m": 3.75,  "output_1m": 15.00},
    "gpt-5-mini":           {"provider": "openai",    "input_1m": 0.50,  "output_1m": 2.00},
    "qwen2.5-7b":           {"provider": "local",     "input_1m": 0.00,  "output_1m": 0.00},
}

DEFAULT_PRICING = {"provider": "unknown", "input_1m": 3.00, "output_1m": 15.00}


def _get_model_price(model: str) -> dict:
    """Return pricing dict for a model, falling back to conservative defaults."""
    return MODEL_PRICING.get(model, DEFAULT_PRICING)


def _is_local(model: str) -> bool:
    """Determine if a model runs locally (zero cost)."""
    pricing = _get_model_price(model)
    return pricing["provider"] == "local"


def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Calculate estimated USD cost for an execution."""
    if _is_local(model):
        return 0.0
    pricing = _get_model_price(model)
    cost = (input_tokens / 1_000_000 * pricing["input_1m"]) + \
           (output_tokens / 1_000_000 * pricing["output_1m"])
    return round(cost, 6)


def record_cost(
    execution_id: str,
    model: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
    mission_id: str = "unknown",
    endpoint: str = "",
    notes: str = "",
) -> dict:
    """Record a cost entry in the ledger. Returns the created entry."""
    from app.db import get_db, generate_id, now_iso

    pricing = _get_model_price(model)
    provider = pricing["provider"]
    local_or_cloud = "local" if provider == "local" else "cloud"
    estimated_cost = calculate_cost(model, input_tokens, output_tokens)

    entry = {
        "id": generate_id(),
        "execution_id": execution_id,
        "mission_id": mission_id,
        "model": model,
        "provider": provider,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "estimated_cost_usd": estimated_cost,
        "local_or_cloud": local_or_cloud,
        "endpoint": endpoint,
        "timestamp": now_iso(),
        "notes": notes,
    }

    db = get_db()
    db.execute(
        "INSERT INTO cost_ledger (id, execution_id, mission_id, model, provider, "
        "input_tokens, output_tokens, estimated_cost_usd, local_or_cloud, "
        "endpoint, timestamp, notes) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            entry["id"], entry["execution_id"], entry["mission_id"],
            entry["model"], entry["provider"], entry["input_tokens"],
            entry["output_tokens"], entry["estimated_cost_usd"],
            entry["local_or_cloud"], entry["endpoint"],
            entry["timestamp"], entry["notes"],
        ),
    )
    db.commit()
    db.close()
    return entry


def get_ledger(mission_id: str = None, model: str = None, days: int = 30, limit: int = 100) -> dict:
    """Query cost ledger entries with optional filters."""
    from app.db import get_db

    db = get_db()
    cursor = db.cursor()

    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    query = "SELECT * FROM cost_ledger WHERE timestamp >= ?"
    params = [since]

    if mission_id:
        query += " AND mission_id = ?"
        params.append(mission_id)
    if model:
        query += " AND model = ?"
        params.append(model)

    query += " ORDER BY timestamp DESC LIMIT ?"
    params.append(limit)

    try:
        rows = cursor.execute(query, params).fetchall()
    except Exception:
        db.close()
        return {"entries": [], "total": 0, "source": "error"}

    entries = []
    for row in rows:
        entries.append({
            "id": row["id"],
            "execution_id": row["execution_id"],
            "mission_id": row["mission_id"],
            "model": row["model"],
            "provider": row["provider"],
            "input_tokens": row["input_tokens"],
            "output_tokens": row["output_tokens"],
            "estimated_cost_usd": row["estimated_cost_usd"],
            "local_or_cloud": row["local_or_cloud"],
            "endpoint": row["endpoint"],
            "timestamp": row["timestamp"],
            "notes": row["notes"],
        })

    db.close()
    return {"entries": entries, "total": len(entries), "source": "real"}


def get_cost_status(days: int = 30) -> dict:
    """Build cost status summary: totals, by-model, by-mission, local-vs-cloud."""
    from app.db import get_db

    db = get_db()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    try:
        rows = db.execute(
            "SELECT * FROM cost_ledger WHERE timestamp >= ?", (since,)
        ).fetchall()
    except Exception:
        db.close()
        return {
            "status": "degraded",
            "source": "error",
            "period_days": days,
            "total_cost_usd": 0.0,
            "total_executions": 0,
            "by_model": {},
            "by_mission": {},
            "local_vs_cloud": {"local": 0.0, "cloud": 0.0},
            "local_percent": 0.0,
            "daily_average_usd": 0.0,
            "projected_monthly_usd": 0.0,
            "budget_warnings": [],
        }

    db.close()

    total_cost = 0.0
    total_execs = len(rows)
    by_model = {}
    by_mission = {}
    local_cost = 0.0
    cloud_cost = 0.0

    for row in rows:
        cost = row["estimated_cost_usd"] or 0.0
        model = row["model"]
        mission = row["mission_id"]
        loc = row["local_or_cloud"] or "cloud"

        total_cost += cost

        if model not in by_model:
            by_model[model] = {"cost": 0.0, "calls": 0}
        by_model[model]["cost"] += cost
        by_model[model]["calls"] += 1

        if mission not in by_mission:
            by_mission[mission] = {"cost": 0.0, "calls": 0}
        by_mission[mission]["cost"] += cost
        by_mission[mission]["calls"] += 1

        if loc == "local":
            local_cost += cost
        else:
            cloud_cost += cost

    total_cost = round(total_cost, 6)
    daily_avg = round(total_cost / max(days, 1), 6)
    projected = round(daily_avg * 30, 6)
    local_pct = round(local_cost / max(total_cost, 0.000001) * 100, 1)

    budget_warnings = []
    if cloud_cost > 10.0:
        budget_warnings.append({
            "level": "warning",
            "message": f"Cloud spend ${cloud_cost:.2f} exceeds $10.00 in {days}d",
        })
    if projected > 20.0:
        budget_warnings.append({
            "level": "warning",
            "message": f"Projected monthly ${projected:.2f} exceeds $20.00 limit",
        })

    return {
        "status": "ok",
        "source": "real",
        "period_days": days,
        "total_cost_usd": total_cost,
        "total_executions": total_execs,
        "by_model": by_model,
        "by_mission": by_mission,
        "local_vs_cloud": {"local": local_cost, "cloud": cloud_cost},
        "local_percent": local_pct,
        "daily_average_usd": daily_avg,
        "projected_monthly_usd": projected,
        "budget_warnings": budget_warnings,
    }
