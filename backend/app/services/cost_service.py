"""Cost Service — Finance Monster / Gringotts foundation.

Tracks LLM execution costs, provides cost summaries, and enforces budget guardrails.
All data stored in SQLite via app.db — local-first, zero cloud dependency.
"""

from datetime import datetime, timezone, timedelta

# ── Model pricing ($ per 1M tokens) ─────────────────────────────────────────

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

SENSITIVE_META_KEYS = {"api_key", "api_secret", "password", "token", "secret", "authorization", "bearer"}


def _get_model_price(model: str) -> dict:
    return MODEL_PRICING.get(model, DEFAULT_PRICING)


def _is_local(model: str) -> bool:
    pricing = _get_model_price(model)
    return pricing["provider"] == "local"


def get_pricing_from_db(model: str) -> dict | None:
    """Look up model pricing from model_pricing table. Returns None if not found."""
    from app.db import get_db
    db = get_db()
    row = db.execute(
        "SELECT provider, input_price_per_1m, output_price_per_1m, is_local "
        "FROM model_pricing WHERE model_name = ?", (model,)
    ).fetchone()
    db.close()
    if row:
        return {
            "provider": row["provider"],
            "input_1m": row["input_price_per_1m"],
            "output_1m": row["output_price_per_1m"],
            "is_local": bool(row["is_local"]),
        }
    return None


# ── Cost Calculation ─────────────────────────────────────────────────────────

def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Calculate estimated USD cost for an execution."""
    if _is_local(model):
        return 0.0
    pricing = _get_model_price(model)
    cost = (input_tokens / 1_000_000 * pricing["input_1m"]) + \
           (output_tokens / 1_000_000 * pricing["output_1m"])
    return round(cost, 6)


def calculate_cost_breakdown(model: str, input_tokens: int, output_tokens: int) -> dict:
    """Calculate cost with input/output breakdown."""
    if _is_local(model):
        return {"input_cost": 0.0, "output_cost": 0.0, "total_cost": 0.0, "is_local": True}
    pricing = _get_model_price(model)
    input_cost = round(input_tokens / 1_000_000 * pricing["input_1m"], 6)
    output_cost = round(output_tokens / 1_000_000 * pricing["output_1m"], 6)
    return {
        "input_cost": input_cost,
        "output_cost": output_cost,
        "total_cost": round(input_cost + output_cost, 6),
        "is_local": False,
    }


# ── Cost Ledger CRUD ─────────────────────────────────────────────────────────

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

    _upsert_provider_usage(provider, model, entry["timestamp"][:7], input_tokens, output_tokens, estimated_cost)
    _update_mission_cost(mission_id, estimated_cost)

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


# ── Provider Usage Aggregation ───────────────────────────────────────────────

def _upsert_provider_usage(provider: str, model: str, period: str,
                           input_tokens: int, output_tokens: int, cost: float) -> None:
    from app.db import get_db, generate_id, now_iso
    db = get_db()
    existing = db.execute(
        "SELECT id, input_tokens_total, output_tokens_total, total_cost_usd, call_count "
        "FROM provider_usage WHERE provider=? AND model_name=? AND period=?",
        (provider, model, period),
    ).fetchone()

    if existing:
        db.execute(
            "UPDATE provider_usage SET input_tokens_total=?, output_tokens_total=?, "
            "total_cost_usd=?, call_count=?, last_updated=? WHERE id=?",
            (existing["input_tokens_total"] + input_tokens,
             existing["output_tokens_total"] + output_tokens,
             round(existing["total_cost_usd"] + cost, 6),
             existing["call_count"] + 1,
             now_iso(),
             existing["id"]),
        )
    else:
        db.execute(
            "INSERT INTO provider_usage (id, provider, model_name, period, "
            "input_tokens_total, output_tokens_total, total_cost_usd, call_count, last_updated) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (generate_id(), provider, model, period,
             input_tokens, output_tokens, cost, 1, now_iso()),
        )
    db.commit()
    db.close()


def get_provider_usage(period: str = None) -> dict:
    """Aggregate provider/model usage, optionally filtered by period (YYYY-MM)."""
    from app.db import get_db
    db = get_db()

    if period:
        rows = db.execute(
            "SELECT * FROM provider_usage WHERE period=? ORDER BY total_cost_usd DESC",
            (period,),
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM provider_usage ORDER BY period DESC, total_cost_usd DESC"
        ).fetchall()

    db.close()

    usage = []
    for row in rows:
        usage.append({
            "provider": row["provider"],
            "model_name": row["model_name"],
            "period": row["period"],
            "input_tokens_total": row["input_tokens_total"],
            "output_tokens_total": row["output_tokens_total"],
            "total_cost_usd": row["total_cost_usd"],
            "call_count": row["call_count"],
            "last_updated": row["last_updated"],
        })

    return {"usage": usage, "total_entries": len(usage), "source": "real"}


# ═══════════════════════════════════════════════════════════════════════════════
# M5B — LiteLLM Callback Intake
# ═══════════════════════════════════════════════════════════════════════════════

def _sanitize_metadata(metadata: dict | None) -> dict:
    """Remove sensitive keys from metadata before storage."""
    if not metadata:
        return {}
    return {k: v for k, v in metadata.items()
            if k.lower() not in SENSITIVE_META_KEYS and not any(
                s in k.lower() for s in SENSITIVE_META_KEYS)}


def _detect_callback_format(payload: dict) -> str:
    """Detect whether payload is LiteLLM webhook or OMNIS internal format."""
    if "spend" in payload or "max_budget" in payload:
        return "litellm"
    if "execution_id" in payload and "model" in payload:
        return "internal"
    return "unknown"


def _normalize_callback(payload: dict, fmt: str) -> dict:
    """Extract normalized fields from callback payload."""
    if fmt == "litellm":
        meta = payload.get("metadata", {}) or {}
        model = meta.get("model", payload.get("model", "unknown"))
        input_tokens = meta.get("input_tokens", payload.get("input_tokens", 0))
        output_tokens = meta.get("output_tokens", payload.get("output_tokens", 0))
        mission_id = meta.get("mission_id", payload.get("customer_id", "unknown"))
        execution_id = payload.get("token", payload.get("execution_id", ""))
        external_spend = payload.get("spend")
        return {
            "model": model,
            "input_tokens": int(input_tokens),
            "output_tokens": int(output_tokens),
            "mission_id": str(mission_id),
            "execution_id": str(execution_id) if execution_id else "",
            "provider": meta.get("provider", ""),
            "agent_id": meta.get("agent_id", ""),
            "metadata": _sanitize_metadata(meta),
            "external_spend": float(external_spend) if external_spend is not None else None,
        }

    elif fmt == "internal":
        return {
            "model": payload.get("model", "unknown"),
            "input_tokens": int(payload.get("input_tokens", 0)),
            "output_tokens": int(payload.get("output_tokens", 0)),
            "mission_id": str(payload.get("mission_id", "unknown")),
            "execution_id": str(payload.get("execution_id", "")),
            "provider": payload.get("provider", ""),
            "agent_id": payload.get("agent_id", ""),
            "metadata": _sanitize_metadata(payload.get("metadata")),
            "external_spend": None,
        }

    return {"model": "unknown", "input_tokens": 0, "output_tokens": 0,
            "mission_id": "unknown", "execution_id": "", "provider": "",
            "agent_id": "", "metadata": {}, "external_spend": None}


def handle_litellm_callback(payload: dict, dry_run: bool = False) -> dict:
    """Process a LiteLLM or internal callback, record cost, check budget.

    Supports two formats:
    - LiteLLM spend webhook (has 'spend' or 'max_budget' fields)
    - OMNIS internal format (has 'execution_id' + 'model' fields)

    Args:
        payload: Raw callback JSON payload
        dry_run: If True, calculates cost but does NOT write to ledger

    Returns:
        Dict with recorded flag, execution_id, cost, provider, budget status
    """
    fmt = _detect_callback_format(payload)
    if fmt == "unknown":
        return {
            "recorded": False,
            "execution_id": "",
            "estimated_cost_usd": 0.0,
            "model": "unknown",
            "provider": "unknown",
            "dry_run": dry_run,
            "budget_status": "unknown",
            "budget_warnings": [],
            "error": "Unknown callback format. Expected LiteLLM webhook or internal format.",
        }

    norm = _normalize_callback(payload, fmt)
    model = norm["model"]
    input_tokens = norm["input_tokens"]
    output_tokens = norm["output_tokens"]
    mission_id = norm["mission_id"]
    execution_id = norm["execution_id"] or ""
    agent_id = norm["agent_id"]
    external_spend = norm["external_spend"]
    sanitized_meta = norm["metadata"]

    # Calculate cost
    if external_spend is not None and external_spend > 0:
        estimated_cost = round(external_spend, 6)
        pricing = _get_model_price(model)
        provider = pricing["provider"]
    else:
        breakdown = calculate_cost_breakdown(model, input_tokens, output_tokens)
        estimated_cost = breakdown["total_cost"]
        pricing = _get_model_price(model)
        provider = pricing["provider"]

    local_or_cloud = "local" if provider == "local" else "cloud"
    notes = f"callback:{fmt}"
    if agent_id:
        notes += f" agent:{agent_id}"

    # Record if not dry_run
    if not dry_run and execution_id:
        record_cost(
            execution_id=execution_id,
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            mission_id=mission_id,
            endpoint="/cost/litellm-callback",
            notes=notes,
        )
        recorded = True
    elif dry_run:
        recorded = False
    else:
        recorded = False

    # Check budget
    budget = get_budget_status()

    return {
        "recorded": recorded,
        "execution_id": execution_id,
        "estimated_cost_usd": estimated_cost,
        "model": model,
        "provider": provider,
        "local_or_cloud": local_or_cloud,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "mission_id": mission_id,
        "dry_run": dry_run,
        "budget_status": budget["overall_status"],
        "budget_warnings": budget.get("warnings", []),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# M5C — Budget Rules + Mission ROI
# ═══════════════════════════════════════════════════════════════════════════════

def _get_current_spend(scope: str, scope_value: str | None, period: str) -> float:
    """Calculate current spend for a given scope and period."""
    from app.db import get_db
    db = get_db()

    today = datetime.now(timezone.utc)
    if period == "daily":
        since = today.strftime("%Y-%m-%d") + "T00:00:00Z"
    elif period == "monthly":
        since = today.strftime("%Y-%m") + "-01T00:00:00Z"
    elif period == "weekly":
        since = (today - timedelta(days=today.weekday())).strftime("%Y-%m-%d") + "T00:00:00Z"
    else:
        since = today.strftime("%Y-%m") + "-01T00:00:00Z"

    query = "SELECT COALESCE(SUM(estimated_cost_usd), 0) FROM cost_ledger WHERE timestamp >= ?"
    params = [since]

    if scope == "provider" and scope_value:
        query += " AND provider = ?"
        params.append(scope_value)
    elif scope == "model" and scope_value:
        query += " AND model = ?"
        params.append(scope_value)
    elif scope == "mission" and scope_value:
        query += " AND mission_id = ?"
        params.append(scope_value)

    row = db.execute(query, params).fetchone()
    db.close()
    return round(row[0], 6) if row else 0.0


def check_budget_rules() -> list[dict]:
    """Evaluate all active budget rules against current spend. Returns list of breaches."""
    from app.db import get_db
    db = get_db()
    rules = db.execute(
        "SELECT * FROM budget_rules WHERE active=1 ORDER BY scope, rule_name"
    ).fetchall()
    db.close()

    warnings = []
    for rule in rules:
        current = _get_current_spend(rule["scope"], rule["scope_value"], rule["period"])
        threshold = rule["threshold_usd"]
        warn_pct = rule["warning_pct"]

        if threshold <= 0:
            continue

        pct = round(current / threshold * 100, 1)

        if pct >= 100:
            level = "critical"
        elif pct >= warn_pct:
            level = "warning"
        else:
            level = "ok"

        warnings.append({
            "rule_name": rule["rule_name"],
            "scope": rule["scope"],
            "scope_value": rule["scope_value"],
            "period": rule["period"],
            "threshold_usd": threshold,
            "current_spend_usd": current,
            "pct_used": pct,
            "level": level,
            "alert_severity": rule["alert_severity"],
        })

    return warnings


def get_budget_status() -> dict:
    """Full budget status: all rules evaluated, overall status."""
    rules = check_budget_rules()

    criticals = [r for r in rules if r["level"] == "critical"]
    warnings = [r for r in rules if r["level"] == "warning"]

    if criticals:
        overall = "CRITICAL"
    elif warnings:
        overall = "WARNING"
    elif rules:
        overall = "OK"
    else:
        overall = "UNKNOWN"

    return {
        "overall_status": overall,
        "rules": rules,
        "critical_count": len(criticals),
        "warning_count": len(warnings),
        "ok_count": len([r for r in rules if r["level"] == "ok"]),
        "mode": "observe_only",
        "note": "Budget rules are observe-only — execution is never blocked",
    }


# ── Mission ROI ──────────────────────────────────────────────────────────────

def _update_mission_cost(mission_id: str, cost: float) -> None:
    """Increment mission cost in mission_roi table."""
    from app.db import get_db, generate_id, now_iso
    now = now_iso()
    period = now[:7]  # YYYY-MM

    db = get_db()
    existing = db.execute(
        "SELECT id, total_cost_usd FROM mission_roi WHERE mission_id=? AND period=?",
        (mission_id, period),
    ).fetchone()

    if existing:
        db.execute(
            "UPDATE mission_roi SET total_cost_usd=?, updated_at=? WHERE id=?",
            (round(existing["total_cost_usd"] + cost, 6), now, existing["id"]),
        )
    else:
        db.execute(
            "INSERT INTO mission_roi (id, mission_id, period, total_cost_usd, "
            "estimated_value_usd, roi_ratio, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, 0.0, 0.0, ?, ?)",
            (generate_id(), mission_id, period, round(cost, 6), now, now),
        )
    db.commit()
    db.close()


def get_mission_cost(mission_id: str) -> dict:
    """Get total cost and ROI for a mission across all periods."""
    from app.db import get_db
    db = get_db()
    rows = db.execute(
        "SELECT * FROM mission_roi WHERE mission_id=? ORDER BY period DESC",
        (mission_id,),
    ).fetchall()
    db.close()

    periods = []
    total_cost = 0.0
    total_value = 0.0

    for row in rows:
        periods.append({
            "period": row["period"],
            "total_cost_usd": row["total_cost_usd"],
            "estimated_value_usd": row["estimated_value_usd"],
            "roi_ratio": row["roi_ratio"],
            "notes": row["notes"],
        })
        total_cost += row["total_cost_usd"]
        total_value += row["estimated_value_usd"]

    total_cost = round(total_cost, 6)
    total_value = round(total_value, 6)
    roi = round(total_value - total_cost, 6)
    roi_ratio = round(total_value / max(total_cost, 0.000001), 2)

    return {
        "mission_id": mission_id,
        "total_cost_usd": total_cost,
        "total_estimated_value_usd": total_value,
        "roi_usd": roi,
        "roi_ratio": roi_ratio,
        "roi_status": "UNKNOWN" if total_value == 0 else ("POSITIVE" if roi > 0 else "NEGATIVE"),
        "periods": periods,
        "source": "real",
    }


def set_mission_roi(mission_id: str, estimated_value_usd: float, notes: str = "") -> dict:
    """Set or update the estimated value for a mission (current period)."""
    from app.db import get_db, generate_id, now_iso
    now = now_iso()
    period = now[:7]

    db = get_db()
    existing = db.execute(
        "SELECT id, total_cost_usd FROM mission_roi WHERE mission_id=? AND period=?",
        (mission_id, period),
    ).fetchone()

    if existing:
        cost = existing["total_cost_usd"]
        ratio = round(estimated_value_usd / max(cost, 0.000001), 2)
        db.execute(
            "UPDATE mission_roi SET estimated_value_usd=?, roi_ratio=?, notes=?, updated_at=? WHERE id=?",
            (estimated_value_usd, ratio, notes, now, existing["id"]),
        )
    else:
        ratio = 0.0  # no cost yet
        db.execute(
            "INSERT INTO mission_roi (id, mission_id, period, total_cost_usd, "
            "estimated_value_usd, roi_ratio, notes, created_at, updated_at) "
            "VALUES (?, ?, ?, 0.0, ?, ?, ?, ?, ?)",
            (generate_id(), mission_id, period, estimated_value_usd, ratio, notes, now, now),
        )

    db.commit()
    db.close()

    return get_mission_cost(mission_id)
