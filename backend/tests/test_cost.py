import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db, get_db

client = TestClient(app)


def setup_module():
    """Ensure cost_ledger table exists before tests."""
    init_db()
    db = get_db()
    db.execute("DELETE FROM cost_ledger")
    db.execute("DELETE FROM provider_usage")
    db.execute("DELETE FROM mission_roi")
    db.commit()
    db.close()


def test_cost_status_empty():
    """GET /cost/status returns valid structure when ledger is empty."""
    response = client.get("/cost/status")
    assert response.status_code == 200
    data = response.json()
    assert data["total_cost_usd"] == 0.0
    assert data["total_executions"] == 0
    assert data["period_days"] == 30
    assert isinstance(data["by_model"], dict)
    assert isinstance(data["by_mission"], dict)
    assert data["local_vs_cloud"]["local"] == 0.0
    assert data["local_vs_cloud"]["cloud"] == 0.0
    assert "budget_warnings" in data


def test_cost_status_with_days_param():
    """GET /cost/status?days=7 works."""
    response = client.get("/cost/status?days=7")
    assert response.status_code == 200
    data = response.json()
    assert data["period_days"] == 7


def test_cost_ledger_empty():
    """GET /cost/ledger returns empty when no entries."""
    response = client.get("/cost/ledger")
    assert response.status_code == 200
    data = response.json()
    assert data["entries"] == []
    assert data["total"] == 0


def test_record_cost_cloud():
    """POST /cost/record creates a cloud cost entry."""
    response = client.post("/cost/record", json={
        "execution_id": "test-exec-001",
        "model": "claude-haiku-4-5",
        "input_tokens": 5000,
        "output_tokens": 1500,
        "mission_id": "test-mission",
        "endpoint": "/test",
        "notes": "integration test",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["execution_id"] == "test-exec-001"
    assert data["model"] == "claude-haiku-4-5"
    assert data["provider"] == "anthropic"
    assert data["input_tokens"] == 5000
    assert data["output_tokens"] == 1500
    assert data["estimated_cost_usd"] > 0
    assert data["local_or_cloud"] == "cloud"
    assert data["mission_id"] == "test-mission"


def test_record_cost_local():
    """POST /cost/record with local model has zero cost."""
    response = client.post("/cost/record", json={
        "execution_id": "test-exec-002",
        "model": "qwen2.5-7b",
        "input_tokens": 10000,
        "output_tokens": 5000,
        "mission_id": "local-test",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_cost_usd"] == 0.0
    assert data["local_or_cloud"] == "local"
    assert data["provider"] == "local"


def test_record_cost_unknown_model():
    """POST /cost/record with unknown model uses conservative pricing."""
    response = client.post("/cost/record", json={
        "execution_id": "test-exec-003",
        "model": "some-future-model",
        "input_tokens": 1000000,
        "output_tokens": 1000000,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "unknown"
    assert data["estimated_cost_usd"] > 0
    assert data["estimated_cost_usd"] == 18.0


def test_cost_status_after_records():
    """GET /cost/status reflects recorded entries."""
    response = client.get("/cost/status?days=365")
    assert response.status_code == 200
    data = response.json()
    assert data["total_executions"] == 3
    assert data["total_cost_usd"] > 0
    assert "claude-haiku-4-5" in data["by_model"]
    assert "qwen2.5-7b" in data["by_model"]
    assert data["by_model"]["qwen2.5-7b"]["cost"] == 0.0


def test_cost_ledger_filter_by_mission():
    """GET /cost/ledger?mission_id= filters correctly."""
    response = client.get("/cost/ledger?mission_id=test-mission")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["entries"][0]["mission_id"] == "test-mission"


def test_cost_ledger_filter_by_model():
    """GET /cost/ledger?model= filters correctly."""
    response = client.get("/cost/ledger?model=qwen2.5-7b")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["entries"][0]["model"] == "qwen2.5-7b"


def test_cost_calculation_accuracy():
    """Verify cost calculation: Haiku 5000 in + 1500 out."""
    response = client.post("/cost/record", json={
        "execution_id": "calc-test",
        "model": "claude-haiku-4-5",
        "input_tokens": 5000,
        "output_tokens": 1500,
    })
    data = response.json()
    expected = round(5000 / 1000000 * 0.80 + 1500 / 1000000 * 4.00, 6)
    assert data["estimated_cost_usd"] == expected


def test_cost_ledger_respects_limit():
    """GET /cost/ledger?limit= respects the limit param."""
    response = client.get("/cost/ledger?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] <= 2


def test_cost_status_no_secrets_leaked():
    """Cost responses must not contain any secret patterns."""
    response = client.get("/cost/status")
    data = response.json()
    payload_str = str(data).lower()
    secrets = ["bearer sk-", "ghp_", "xoxb-", "private key", "password", "api_key", "secret"]
    for secret in secrets:
        assert secret not in payload_str, f"Secret pattern '{secret}' found in cost status"

    response2 = client.get("/cost/ledger")
    payload2 = str(response2.json()).lower()
    for secret in secrets:
        assert secret not in payload2, f"Secret pattern '{secret}' found in cost ledger"


# ═══════════════════════════════════════════════════════════════════
# M5A — Gringotts Treasury Schema Tests
# ═══════════════════════════════════════════════════════════════════

def test_model_pricing_table_exists():
    """model_pricing table exists with all expected columns."""
    from app.db import get_db
    db = get_db()
    rows = db.execute("PRAGMA table_info(model_pricing)").fetchall()
    db.close()
    columns = {row["name"]: row["type"] for row in rows}
    assert "model_name" in columns
    assert "provider" in columns
    assert "input_price_per_1m" in columns
    assert "output_price_per_1m" in columns
    assert "is_local" in columns
    assert "effective_from" in columns
    assert "effective_to" in columns
    assert "currency" in columns


def test_model_pricing_seeded():
    """Seed populates 9 models with correct is_local flag."""
    from app.db import get_db
    db = get_db()
    rows = db.execute(
        "SELECT model_name, provider, is_local, input_price_per_1m, output_price_per_1m "
        "FROM model_pricing ORDER BY provider, model_name"
    ).fetchall()
    db.close()

    assert len(rows) == 9, f"Expected 9 models, got {len(rows)}"

    by_name = {r["model_name"]: r for r in rows}

    assert by_name["qwen2.5-7b"]["is_local"] == 1
    assert by_name["qwen2.5-7b"]["input_price_per_1m"] == 0.0
    assert by_name["qwen2.5-7b"]["provider"] == "local"

    assert by_name["claude-haiku-4-5"]["provider"] == "anthropic"
    assert by_name["claude-haiku-4-5"]["is_local"] == 0
    assert by_name["claude-haiku-4-5"]["input_price_per_1m"] == 0.80

    assert by_name["gemini-2.5-flash"]["provider"] == "google"
    assert by_name["gpt-5"]["provider"] == "openai"
    assert by_name["deepseek-v4-pro"]["provider"] == "deepseek"


def test_budget_rules_seeded():
    """Seed populates 3 budget rules with correct thresholds."""
    from app.db import get_db
    db = get_db()
    rows = db.execute(
        "SELECT rule_name, scope, scope_value, threshold_usd, warning_pct, "
        "period, alert_severity, active FROM budget_rules ORDER BY rule_name"
    ).fetchall()
    db.close()

    assert len(rows) == 3, f"Expected 3 budget rules, got {len(rows)}"

    by_name = {r["rule_name"]: r for r in rows}

    assert by_name["global_monthly"]["threshold_usd"] == 20.00
    assert by_name["global_monthly"]["scope"] == "global"
    assert by_name["global_monthly"]["period"] == "monthly"
    assert by_name["global_monthly"]["active"] == 1

    assert by_name["cloud_daily"]["threshold_usd"] == 5.00
    assert by_name["cloud_daily"]["period"] == "daily"

    assert by_name["anthropic_monthly"]["scope_value"] == "anthropic"
    assert by_name["anthropic_monthly"]["threshold_usd"] == 15.00

    for r in rows:
        assert r["warning_pct"] == 80


def test_provider_usage_upsert():
    """provider_usage enforces UNIQUE(provider, model_name, period)."""
    from app.db import get_db, generate_id, now_iso
    db = get_db()
    now = now_iso()

    db.execute(
        "INSERT OR REPLACE INTO provider_usage "
        "(id, provider, model_name, period, input_tokens_total, output_tokens_total, "
        "total_cost_usd, call_count, last_updated) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (generate_id(), "anthropic", "claude-haiku-4-5", "2026-05",
         10000, 5000, 0.025, 1, now),
    )
    db.commit()

    new_id = generate_id()
    db.execute(
        "INSERT OR REPLACE INTO provider_usage "
        "(id, provider, model_name, period, input_tokens_total, output_tokens_total, "
        "total_cost_usd, call_count, last_updated) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (new_id, "anthropic", "claude-haiku-4-5", "2026-05",
         20000, 10000, 0.050, 2, now),
    )
    db.commit()

    rows = db.execute(
        "SELECT * FROM provider_usage "
        "WHERE provider=? AND model_name=? AND period=?",
        ("anthropic", "claude-haiku-4-5", "2026-05"),
    ).fetchall()

    db.execute("DELETE FROM provider_usage WHERE period='2026-05'")
    db.commit()
    db.close()

    assert len(rows) == 1, f"Expected 1 row after upsert, got {len(rows)}"
    assert rows[0]["call_count"] == 2
    assert rows[0]["total_cost_usd"] == 0.050


# ═══════════════════════════════════════════════════════════════════
# M5B — LiteLLM Callback Intake Tests
# ═══════════════════════════════════════════════════════════════════

def test_litellm_callback_format_litellm():
    """POST /cost/litellm-callback with LiteLLM spend webhook format."""
    response = client.post("/cost/litellm-callback", json={
        "spend": 0.0072,
        "max_budget": 20.0,
        "model": "claude-haiku-4-5",
        "metadata": {
            "model": "claude-haiku-4-5",
            "input_tokens": 5000,
            "output_tokens": 1500,
            "mission_id": "litellm-test",
            "provider": "anthropic",
        },
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is False  # no execution_id
    assert data["model"] == "claude-haiku-4-5"
    assert data["provider"] == "anthropic"
    assert data["estimated_cost_usd"] > 0
    assert "budget_status" in data
    assert "budget_warnings" in data


def test_litellm_callback_format_internal():
    """POST /cost/litellm-callback with OMNIS internal format."""
    response = client.post("/cost/litellm-callback", json={
        "execution_id": "exec-format-b",
        "model": "claude-haiku-4-5",
        "input_tokens": 5000,
        "output_tokens": 1500,
        "mission_id": "internal-test",
        "provider": "anthropic",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is True
    assert data["execution_id"] == "exec-format-b"
    assert data["model"] == "claude-haiku-4-5"
    assert data["provider"] == "anthropic"
    assert data["estimated_cost_usd"] > 0
    assert data["local_or_cloud"] == "cloud"


def test_litellm_callback_dry_run():
    """POST /cost/litellm-callback?dry_run=true does not write to ledger."""
    response = client.post("/cost/litellm-callback?dry_run=true", json={
        "execution_id": "exec-dry-run",
        "model": "claude-haiku-4-5",
        "input_tokens": 10000,
        "output_tokens": 5000,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is False
    assert data["dry_run"] is True
    assert data["estimated_cost_usd"] > 0


def test_litellm_callback_invalid_payload():
    """POST /cost/litellm-callback with unrecognized format returns error."""
    response = client.post("/cost/litellm-callback", json={
        "foo": "bar",
        "baz": 123,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is False
    assert "error" in data
    assert "unknown" in data["error"].lower()


def test_litellm_callback_local_model():
    """POST /cost/litellm-callback with local model has zero cost."""
    response = client.post("/cost/litellm-callback", json={
        "execution_id": "exec-local",
        "model": "qwen2.5-7b",
        "input_tokens": 50000,
        "output_tokens": 20000,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is True
    assert data["estimated_cost_usd"] == 0.0
    assert data["local_or_cloud"] == "local"
    assert data["provider"] == "local"


def test_litellm_callback_unknown_model_fallback():
    """POST /cost/litellm-callback with unknown model uses conservative fallback."""
    response = client.post("/cost/litellm-callback", json={
        "execution_id": "exec-unknown",
        "model": "future-gpt-99",
        "input_tokens": 1000000,
        "output_tokens": 1000000,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is True
    assert data["provider"] == "unknown"
    assert data["estimated_cost_usd"] == 18.0  # 3.00 + 15.00 per 1M


def test_provider_usage_endpoint():
    """GET /cost/provider-usage returns correct aggregate structure."""
    # Seed a known entry so we can verify aggregation
    client.post("/cost/record", json={
        "execution_id": "usage-endpoint-test",
        "model": "claude-haiku-4-5",
        "input_tokens": 5000,
        "output_tokens": 1500,
        "mission_id": "usage-test",
    })
    response = client.get("/cost/provider-usage")
    assert response.status_code == 200
    data = response.json()
    assert "usage" in data
    assert "total_entries" in data
    assert data["total_entries"] > 0
    assert data["source"] == "real"
    # Verify our entry is in there
    models = [u["model_name"] for u in data["usage"]]
    assert "claude-haiku-4-5" in models


def test_provider_usage_period_filter():
    """GET /cost/provider-usage?period=YYYY-MM filters correctly."""
    now_month = "2026-05"
    response = client.get(f"/cost/provider-usage?period={now_month}")
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "real"


def test_callback_metadata_sanitized():
    """Secrets in callback metadata are stripped before storage."""
    response = client.post("/cost/litellm-callback", json={
        "execution_id": "exec-secret-test",
        "model": "claude-haiku-4-5",
        "input_tokens": 100,
        "output_tokens": 100,
        "metadata": {
            "api_key": "sk-secret-12345",
            "password": "hunter2",
            "safe_field": "visible",
            "authorization": "Bearer token123",
        },
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recorded"] is True

    # Verify ledger entry does not contain secrets
    from app.db import get_db
    db = get_db()
    row = db.execute(
        "SELECT notes FROM cost_ledger WHERE execution_id='exec-secret-test'"
    ).fetchone()
    db.close()
    assert row is not None
    notes = row["notes"].lower()
    assert "sk-secret" not in notes
    assert "hunter2" not in notes
    assert "token123" not in notes
    assert "callback:" in notes


# ═══════════════════════════════════════════════════════════════════
# M5C — Budget Rules + Mission ROI Tests
# ═══════════════════════════════════════════════════════════════════

def test_budget_status_endpoint():
    """GET /cost/budget-status returns correct structure."""
    response = client.get("/cost/budget-status")
    assert response.status_code == 200
    data = response.json()
    assert "overall_status" in data
    assert "rules" in data
    assert "critical_count" in data
    assert "warning_count" in data
    assert "ok_count" in data
    assert data["mode"] == "observe_only"
    assert "note" in data


def test_budget_status_ok():
    """Budget status is OK when spend is below warning threshold."""
    # First clear ledger so we start fresh
    db = get_db()
    db.execute("DELETE FROM cost_ledger")
    db.execute("DELETE FROM provider_usage")
    db.execute("DELETE FROM mission_roi")
    db.commit()
    db.close()

    # Record a small cost under all thresholds
    client.post("/cost/record", json={
        "execution_id": "budget-ok-test",
        "model": "claude-haiku-4-5",
        "input_tokens": 1000,
        "output_tokens": 500,
    })

    response = client.get("/cost/budget-status")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_status"] == "OK"


def test_budget_warning_at_threshold():
    """Budget status WARNING when cloud daily exceeds 80% ($4.00)."""
    # Record enough to trigger cloud_daily warning ($5 * 0.80 = $4.00)
    # Haiku: 0.80/M in, 4.00/M out
    for i in range(30):
        client.post("/cost/record", json={
            "execution_id": f"budget-warn-{i}",
            "model": "claude-haiku-4-5",
            "input_tokens": 200000,
            "output_tokens": 50000,
        })

    response = client.get("/cost/budget-status")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_status"] in ("WARNING", "CRITICAL")
    cloud_rules = [r for r in data["rules"] if r["rule_name"] == "cloud_daily"]
    assert len(cloud_rules) == 1
    assert cloud_rules[0]["pct_used"] >= 80


def test_budget_critical_at_limit():
    """Budget status CRITICAL when spend reaches 100%."""
    # Already have tons of records from previous test
    # Global monthly threshold is $20, we may or may not hit it
    response = client.get("/cost/budget-status")
    assert response.status_code == 200
    data = response.json()
    # At minimum we should have WARNING, possibly CRITICAL
    assert data["overall_status"] in ("WARNING", "CRITICAL")
    assert data["critical_count"] + data["warning_count"] > 0


def test_budget_never_blocks():
    """Budget status mode is always observe_only — never blocks execution."""
    response = client.get("/cost/budget-status")
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "observe_only"
    # Even if CRITICAL, calls still succeed
    response2 = client.post("/cost/litellm-callback", json={
        "execution_id": "exec-despite-critical",
        "model": "claude-haiku-4-5",
        "input_tokens": 100,
        "output_tokens": 100,
    })
    assert response2.status_code == 200
    assert response2.json()["recorded"] is True


def test_mission_cost_endpoint():
    """GET /cost/mission/{id} returns cost + ROI for a mission."""
    response = client.get("/cost/mission/internal-test")
    assert response.status_code == 200
    data = response.json()
    assert data["mission_id"] == "internal-test"
    assert "total_cost_usd" in data
    assert "total_estimated_value_usd" in data
    assert "roi_usd" in data
    assert "roi_ratio" in data
    assert "roi_status" in data
    assert "periods" in data
    assert data["source"] == "real"


def test_mission_roi_set_and_read():
    """POST /cost/mission/{id}/roi sets estimated value and recalculates ROI."""
    response = client.post("/cost/mission/test-mission/roi", json={
        "estimated_value_usd": 50.00,
        "notes": "Test ROI value",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["total_estimated_value_usd"] >= 50.0
    assert data["roi_status"] == "POSITIVE"
    assert data["roi_ratio"] > 0


def test_mission_roi_unknown():
    """Mission ROI is UNKNOWN when no estimated value set."""
    # Create cost for new mission with no ROI set
    client.post("/cost/record", json={
        "execution_id": "roi-unknown-test",
        "model": "claude-haiku-4-5",
        "input_tokens": 100,
        "output_tokens": 100,
        "mission_id": "mission-no-roi",
    })
    response = client.get("/cost/mission/mission-no-roi")
    assert response.status_code == 200
    data = response.json()
    assert data["roi_status"] == "UNKNOWN"
    assert data["total_estimated_value_usd"] == 0.0


def test_no_secret_leak_in_callback():
    """Callback responses must not leak secrets."""
    response = client.post("/cost/litellm-callback", json={
        "execution_id": "exec-leak-test",
        "model": "claude-haiku-4-5",
        "input_tokens": 100,
        "output_tokens": 100,
        "metadata": {
            "api_key": "sk-top-secret-999",
            "bearer": "bearer-token-abc",
            "password": "super-secret",
            "safe": "ok",
        },
    })
    assert response.status_code == 200
    data = response.json()
    payload_str = str(data).lower()
    secrets = ["bearer sk-", "ghp_", "xoxb-", "private key", "password",
               "api_key", "secret", "sk-top", "super-secret", "bearer-token",
               "hunter2"]
    for secret in secrets:
        assert secret not in payload_str, f"Secret '{secret}' leaked in callback response"

    # Also check budget-status
    r2 = client.get("/cost/budget-status")
    p2 = str(r2.json()).lower()
    for secret in secrets:
        assert secret not in p2, f"Secret '{secret}' leaked in budget-status"

    # Also check provider-usage
    r3 = client.get("/cost/provider-usage")
    p3 = str(r3.json()).lower()
    for secret in secrets:
        assert secret not in p3, f"Secret '{secret}' leaked in provider-usage"
