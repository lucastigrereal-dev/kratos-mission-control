import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_approvals_empty():
    response = client.get("/approvals/")
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "real"
    assert isinstance(data["data"], list)


def test_create_approval():
    response = client.post("/approvals/", json={
        "title": "Test approval",
        "description": "Integration test",
        "risk": "low",
        "source": "manual"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["source"] == "real"
    assert data["data"]["title"] == "Test approval"
    assert data["data"]["status"] == "pending"
    assert "id" in data["data"]


def test_list_approvals_after_create():
    response = client.get("/approvals/")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) >= 1


def test_update_approval():
    # Create
    create = client.post("/approvals/", json={
        "title": "To approve",
        "risk": "medium",
    })
    approval_id = create.json()["data"]["id"]

    # Approve
    response = client.patch(f"/approvals/{approval_id}", json={"status": "approved"})
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "approved"


def test_update_invalid_status():
    create = client.post("/approvals/", json={"title": "Bad status test"})
    approval_id = create.json()["data"]["id"]

    response = client.patch(f"/approvals/{approval_id}", json={"status": "invalid"})
    assert response.status_code == 422


def test_update_not_found():
    response = client.patch("/approvals/nonexistent-id", json={"status": "approved"})
    assert response.status_code == 404


def test_delete_approval():
    create = client.post("/approvals/", json={"title": "To delete"})
    approval_id = create.json()["data"]["id"]

    response = client.delete(f"/approvals/{approval_id}")
    assert response.status_code == 200
    assert response.json()["data"]["deleted"] is True


def test_delete_not_found():
    response = client.delete("/approvals/nonexistent-id")
    assert response.status_code == 404


def test_filter_by_status():
    # Create one pending, one approved
    client.post("/approvals/", json={"title": "Pending one"})
    create2 = client.post("/approvals/", json={"title": "Approved one"})
    client.patch(f"/approvals/{create2.json()['data']['id']}", json={"status": "approved"})

    pending = client.get("/approvals/?status=pending")
    assert pending.status_code == 200
    for item in pending.json()["data"]:
        assert item["status"] == "pending"

    approved = client.get("/approvals/?status=approved")
    assert approved.status_code == 200
    for item in approved.json()["data"]:
        assert item["status"] == "approved"
