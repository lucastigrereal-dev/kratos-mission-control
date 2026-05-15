import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_state_empty():
    # Reset first
    client.post("/continuity/reset")
    response = client.get("/continuity/state")
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "real"
    assert data["data"]["has_previous_session"] is False


def test_update_state():
    response = client.post("/continuity/state", json={
        "project_id": "kratos-mission-control",
        "project_name": "KRATOS Mission Control",
        "last_action": "Criando continuity service",
        "next_step": "Integrar na home page",
        "branch": "feature/kratos-kimi-supreme-zips-5waves",
        "critical_files": ["main.py", "continuity_service.py"],
        "focus_state": "execution",
    })
    assert response.status_code == 200
    assert response.json()["data"]["saved"] is True


def test_get_state_after_update():
    response = client.get("/continuity/state")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["has_previous_session"] is True
    assert data["project_name"] == "KRATOS Mission Control"
    assert data["last_action"] == "Criando continuity service"
    assert data["next_step"] == "Integrar na home page"
    assert data["branch"] == "feature/kratos-kimi-supreme-zips-5waves"
    assert data["focus_state"] == "execution"
    assert len(data["critical_files"]) == 2


def test_update_partial():
    response = client.post("/continuity/state", json={
        "focus_state": "review",
    })
    assert response.status_code == 200
    # Should preserve previous fields
    data = client.get("/continuity/state").json()["data"]
    assert data["focus_state"] == "review"
    assert data["project_name"] == "KRATOS Mission Control"  # preserved


def test_reset():
    response = client.post("/continuity/reset")
    assert response.status_code == 200
    assert response.json()["data"]["reset"] is True

    # Verify empty
    data = client.get("/continuity/state").json()["data"]
    assert data["has_previous_session"] is False
