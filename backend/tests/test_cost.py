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
    db.execute(
        "CREATE TABLE IF NOT EXISTS cost_ledger ("
        "id TEXT PRIMARY KEY, "
        "execution_id TEXT NOT NULL, "
        "mission_id TEXT DEFAULT 'unknown', "
        "model TEXT NOT NULL, "
        "provider TEXT NOT NULL, "
        "input_tokens INTEGER DEFAULT 0, "
        "output_tokens INTEGER DEFAULT 0, "
        "estimated_cost_usd REAL DEFAULT 0.0, "
        "local_or_cloud TEXT DEFAULT 'cloud', "
        "endpoint TEXT DEFAULT '', "
        "timestamp TEXT NOT NULL, "
        "notes TEXT DEFAULT ''"
        ")"
    )
    db.execute("DELETE FROM cost_ledger")
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
    # Conservative: $3 + $15 = $18 for 1M+1M tokens
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
    # Haiku: $0.80/1M input, $4.00/1M output
    # cost = 5000/1M * 0.80 + 1500/1M * 4.00
    # cost = 0.004 + 0.006 = 0.01
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
