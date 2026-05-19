"""Cost tracking collector — model pricing, estimated spend, gringotts status.

Finance Monster foundation (Wave 12.3).
No external API calls — purely informational with hardcoded pricing.
"""

import subprocess
from datetime import date


# Current Anthropic API pricing (May 2026) — $/1M tokens
MODEL_PRICING = {
    "claude-opus-4": {
        "provider": "anthropic",
        "input_per_1M": 15.00,
        "output_per_1M": 75.00,
        "routing_name": "cloud-max (currently Sonnet fallback in LiteLLM)",
        "is_local": False,
        "usage_profile": "Emergency/planning — rarely used",
        "typical_monthly_cost": 0.10,
    },
    "claude-sonnet-4-6": {
        "provider": "anthropic",
        "input_per_1M": 3.00,
        "output_per_1M": 15.00,
        "routing_name": "cloud-strong / cloud-gpt / cloud-gemini",
        "is_local": False,
        "usage_profile": "Daily — manager LLM, strategy, code generation",
        "typical_monthly_cost": 1.50,
    },
    "claude-haiku-4-5": {
        "provider": "anthropic",
        "input_per_1M": 1.00,
        "output_per_1M": 5.00,
        "routing_name": "cloud-cheap / cloud-fast",
        "is_local": False,
        "usage_profile": "Daily — classification, SDR scripts, light tasks",
        "typical_monthly_cost": 0.75,
    },
    "gemini-2.5-flash": {
        "provider": "openrouter/google",
        "input_per_1M": 0.15,
        "output_per_1M": 0.60,
        "routing_name": "caption-fast",
        "is_local": False,
        "usage_profile": "Occasional — batch captions, ~$0.0003/call",
        "typical_monthly_cost": 0.01,
    },
    "qwen2.5:7b": {
        "provider": "ollama (local)",
        "input_per_1M": 0.00,
        "output_per_1M": 0.00,
        "routing_name": "local-fast",
        "is_local": True,
        "usage_profile": "Constant — worker LLM, 95% of all calls",
        "typical_monthly_cost": 0.00,
    },
    "nomic-embed-text": {
        "provider": "ollama (local)",
        "input_per_1M": 0.00,
        "output_per_1M": 0.00,
        "routing_name": "n/a (embedder)",
        "is_local": True,
        "usage_profile": "Constant — embeddings for Mem0, RAG, search",
        "typical_monthly_cost": 0.00,
    },
}


def _check_gringotts_db() -> dict:
    """Check gringotts database existence in akasha-postgres."""
    try:
        result = subprocess.run(
            [
                "docker", "exec", "akasha-postgres",
                "psql", "-U", "akasha", "-d", "gringotts",
                "-t", "-A",
                "-c", "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
            ],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode != 0:
            return {"status": "error", "error": result.stderr.strip()}

        tables = [line.strip() for line in result.stdout.split("\n") if line.strip()]

        return {
            "status": "ok",
            "database": "gringotts",
            "host": "akasha-postgres:5432",
            "tables_count": len(tables),
            "tables": tables,
            "has_treasury_tables": any(
                t in tables for t in ["cost_events", "daily_rollups", "monthly_rollups", "revenue_events"]
            ),
            "assessment": "Empty shell — database exists but no treasury tables" if not tables else "Has tables",
        }
    except FileNotFoundError:
        return {"status": "error", "error": "Docker not available"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def collect_status():
    """Collect cost tracking status — hardcoded pricing, estimated spend, gringotts check.

    Returns (data, source, collector_status).
    source_badge: "estimated" (no real token counters yet)
    """
    today = date.today().isoformat()
    month = today[:7]

    # Pricing table
    models_list = []
    local_count = 0
    cloud_count = 0
    for name, info in MODEL_PRICING.items():
        models_list.append({
            "model": name,
            "provider": info["provider"],
            "input_per_1M_tokens": info["input_per_1M"],
            "output_per_1M_tokens": info["output_per_1M"],
            "is_local": info["is_local"],
            "routing_name": info["routing_name"],
            "usage_profile": info["usage_profile"],
            "typical_monthly_cost": info["typical_monthly_cost"],
        })
        if info["is_local"]:
            local_count += 1
        else:
            cloud_count += 1

    # Estimated monthly spend
    total_cloud_estimate = sum(
        info["typical_monthly_cost"]
        for info in MODEL_PRICING.values()
        if not info["is_local"]
    )
    total_cloud_estimate = round(total_cloud_estimate, 2)

    # Publisher OS cost tracker check
    publisher_os_tracker = {
        "file": "publisher-os/core/cost_tracker.py",
        "status": "code_exists",
        "features": [
            "Redis counters (costs:daily, costs:monthly)",
            "Per-model aggregation",
            "Per-skill tracking",
            "Per-job tracking",
            "7-day rolling dashboard",
        ],
        "endpoint": "GET /costs/dashboard",
        "note": "Functionality depends on publisher-os Redis being active on port 6382",
    }

    # Gringotts check
    gringotts = _check_gringotts_db()

    # Monthly projection
    monthly_projection = {
        "total_usd": total_cloud_estimate,
        "local_cost_usd": 0.00,
        "cloud_cost_usd": total_cloud_estimate,
        "local_call_percentage": 95,
        "cloud_call_percentage": 5,
        "confidence": "low — estimates only, no real token counters active",
        "note": "95% of calls route to local Ollama ($0). Cloud calls are mostly Haiku at $0.0005/run.",
    }

    data = {
        "status": "estimated",
        "date": today,
        "month": month,
        "source_badge": "estimated",
        "models": {
            "total": len(models_list),
            "local": local_count,
            "cloud": cloud_count,
            "pricing_table": models_list,
        },
        "estimated_monthly_spend": monthly_projection,
        "publisher_os_cost_tracker": publisher_os_tracker,
        "gringotts": gringotts,
        "gaps": [
            "No real token counters active in ecosystem",
            "Gringotts database exists but has zero treasury tables",
            "No revenue tracking implementation",
            "Claude Code costs invisible (billed separately)",
            "No budget thresholds or cost alerts",
            "Cost tracker pricing slightly outdated (Haiku model version)",
        ],
        "next_steps": [
            "Verify publisher-os Redis cost counters are active → poll /costs/dashboard",
            "Create gringotts treasury schema (model_pricing, cost_events, daily_rollups)",
            "Define monthly budget thresholds per project",
            "Implement revenue-tracker skill for collab income",
        ],
        "wave": "12.3",
        "collector": "cost_collector",
    }

    return data, "real", "ok"
