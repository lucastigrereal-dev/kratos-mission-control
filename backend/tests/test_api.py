import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db

client = TestClient(app)


def setup_module():
    init_db()


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] == "real"
    # External services (Ollama, Redis, etc.) may be offline in test env —
    # that makes overall "degraded", not "error". Core KRATOS collectors are ok.
    assert envelope["collector_status"] in ("ok", "degraded")
    data = envelope["data"]
    assert data["status"] in ("ok", "degraded")
    assert data["version"] in ("0.11.0", "0.12.0")
    assert "Operational Truth" in data["phase"] or "KRATOS" in data["phase"]
    # Core collectors must be present
    assert "system" in data["collectors"]
    assert "git" in data["collectors"]
    assert "docker" in data["collectors"]
    # External service collectors now present
    assert "ollama" in data["collectors"]
    assert "publisher_os" in data["collectors"]
    assert "supabase" in data["collectors"]
    assert "redis" in data["collectors"]
    assert "n8n" in data["collectors"]


def test_now():
    response = client.get("/now")
    assert response.status_code == 200
    data = response.json()
    assert "current_project" in data
    assert "next_action" in data
    assert "mentor_focus" in data


def test_projects():
    response = client.get("/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "id" in data[0]
    assert "name" in data[0]


def test_project_detail():
    response = client.get("/projects/omnis-control")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "omnis-control"


def test_project_not_found():
    response = client.get("/projects/nonexistent")
    assert response.status_code == 404


def test_system():
    response = client.get("/system")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] in ("real", "fallback")
    assert "collector_status" in envelope
    assert "data" in envelope
    data = envelope["data"]
    assert "hostname" in data
    assert "cpu" in data


def test_docker():
    response = client.get("/docker")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] in ("real", "fallback")
    data = envelope["data"]
    assert "containers" in data
    assert data["total"] > 0


def test_git():
    response = client.get("/git")
    assert response.status_code == 200
    envelope = response.json()
    data = envelope["data"]
    assert "repositories" in data


def test_activity():
    response = client.get("/activity")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_tabs():
    response = client.get("/tabs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_checkpoints_list():
    response = client.get("/checkpoints")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_checkpoint():
    response = client.post("/checkpoints", json={
        "name": "test-checkpoint",
        "project_id": "kratos-mission-control",
        "description": "Test checkpoint from automated test",
        "tags": ["test", "automated"]
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "test-checkpoint"
    assert data["project_id"] == "kratos-mission-control"
    assert "id" in data
    assert data["id"].startswith("checkpoint-")


def test_timeline():
    response = client.get("/timeline")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_outputs():
    response = client.get("/outputs")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] in ("real", "fallback")
    data = envelope["data"]
    assert isinstance(data, list)


def test_alerts():
    response = client.get("/alerts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_akasha_status():
    response = client.get("/akasha/status")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] in ("real", "fallback")
    assert "collector_status" in envelope
    data = envelope["data"]
    assert "status" in data
    assert "source_badge" in data
    assert data["source_badge"] in ("confirmed", "partial", "offline", "unknown")


def test_omnis_status():
    response = client.get("/omnis/status")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] in ("real", "fallback")
    data = envelope["data"]
    assert data["status"] == "operational"
    assert "checkers" in data


def test_omnis_summary():
    response = client.get("/omnis/summary")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["source"] in ("real", "fallback")
    data = envelope["data"]
    assert "omnis" in data


def test_tasks():
    response = client.get("/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_tasks_today():
    response = client.get("/tasks/today")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_tasks_overdue():
    response = client.get("/tasks/overdue")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_tasks_doing():
    response = client.get("/tasks/doing")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_tasks_unfinished():
    response = client.get("/tasks/unfinished")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_task():
    response = client.post("/tasks", json={
        "title": "Test task from automated test",
        "project_id": "kratos-mission-control",
        "status": "inbox",
        "priority": "low",
        "source": "manual"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test task from automated test"
    assert "id" in data


def test_project_goals():
    response = client.get("/projects/kratos-mission-control/goals")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_deliverables():
    response = client.get("/deliverables")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_deliverables_overdue():
    response = client.get("/deliverables/overdue")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_reminders():
    response = client.get("/reminders")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_reminders_today():
    response = client.get("/reminders/today")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_mentor_summary():
    response = client.get("/mentor/summary")
    assert response.status_code == 200
    data = response.json()
    assert "next_action" in data
    assert "today_focus" in data


def test_mentor_next_action():
    response = client.get("/mentor/next-action")
    assert response.status_code == 200
    data = response.json()
    assert "next_action" in data


def test_mentor_unfinished():
    response = client.get("/mentor/unfinished")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_mentor_deadlines():
    response = client.get("/mentor/deadlines")
    assert response.status_code == 200
    data = response.json()
    assert "critical" in data


def test_mentor_focus():
    response = client.get("/mentor/focus")
    assert response.status_code == 200
    data = response.json()
    assert "mode" in data
    assert "focus_project" in data or "primary_goal" in data
    assert "do_not_do" in data


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "KRATOS Mission Control"
    assert "endpoints" in data
