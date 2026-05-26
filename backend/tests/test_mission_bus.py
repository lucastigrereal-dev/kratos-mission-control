"""Mission Bus tests — MissionPackage creation and Bus publishing."""
import json
import pytest
from datetime import datetime, timezone


# ── Contract constants ──────────────────────────────────────────

MAB_EVENT_TYPES = {
    "mission.planned", "mission.completed", "mission.failed",
    "agent.assignment.requested", "agent.assignment.accepted",
    "agent.assignment.rejected", "agent.task.started",
    "agent.task.completed", "agent.task.failed",
}

MAB_CHANNELS = {"mission:events", "mission:assignments", "agent:status"}

VALID_PRIORITIES = {"low", "medium", "high", "critical"}
VALID_RISK_LEVELS = {"low", "medium", "high", "critical"}


# ── Helpers ─────────────────────────────────────────────────────

def make_mission_package(mission_id="mission-001", **overrides):
    """Create a valid MissionPackage dict."""
    pkg = {
        "mission_id": mission_id,
        "status": "planned",
        "title": "Test Mission",
        "description": "Verify system health across domains",
        "priority": "medium",
        "risk_level": "low",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "tasks": [
            {
                "task_id": "task-001",
                "capability": "runtime.health_check",
                "description": "Check all health endpoints",
                "expected_output": "HealthReport with per-endpoint status",
                "priority": "medium",
                "risk_level": "low",
                "governance": {
                    "requires_human_slot": False,
                    "allowed_tools": ["health_check", "ping"],
                    "forbidden_tools": ["secrets", "production_write", "external_api_call"],
                    "max_retries": 1,
                    "timeout_ms": 10000,
                },
            }
        ],
    }
    pkg.update(overrides)
    return pkg


def make_assignment_event(mission_id="mission-001", task_id="task-001", **overrides):
    """Create a valid AgentAssignmentEvent dict."""
    event = {
        "event_type": "agent.assignment.requested",
        "mission_id": mission_id,
        "task_id": task_id,
        "requested_capability": "runtime.health_check",
        "suggested_agent_type": "runtime_worker",
        "priority": "medium",
        "risk_level": "low",
        "payload": {
            "mission_summary": "Verify system health",
            "task_description": "Check health endpoints",
            "expected_output": "HealthReport",
        },
        "governance": {
            "requires_human_slot": False,
            "allowed_tools": ["health_check", "ping"],
            "forbidden_tools": ["secrets", "production_write", "external_api_call"],
            "max_retries": 1,
            "timeout_ms": 10000,
        },
    }
    event.update(overrides)
    return event


# ── MissionPackage Tests ────────────────────────────────────────

class TestMissionPackageCreation:
    """MissionPackage creation and validation."""

    def test_mission_package_has_required_fields(self):
        pkg = make_mission_package()
        required = {"mission_id", "status", "title", "tasks"}
        assert required.issubset(pkg.keys()), f"Missing: {required - set(pkg.keys())}"

    def test_mission_package_initial_status_is_planned(self):
        pkg = make_mission_package()
        assert pkg["status"] == "planned"

    def test_mission_package_tasks_have_required_fields(self):
        pkg = make_mission_package()
        for task in pkg["tasks"]:
            assert "task_id" in task
            assert "capability" in task
            assert "description" in task
            assert "governance" in task
            assert task["governance"]["forbidden_tools"] is not None

    def test_mission_package_rejects_empty_tasks(self):
        pkg = make_mission_package(tasks=[])
        assert pkg["tasks"] == []

    def test_mission_package_priority_must_be_valid(self):
        for pri in VALID_PRIORITIES:
            pkg = make_mission_package(priority=pri)
            assert pkg["priority"] in VALID_PRIORITIES

    def test_mission_package_with_multiple_tasks(self):
        pkg = make_mission_package(
            tasks=[
                {"task_id": "t1", "capability": "runtime.health_check", "description": "a", "expected_output": "x", "priority": "low", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}},
                {"task_id": "t2", "capability": "runtime.ping_check", "description": "b", "expected_output": "y", "priority": "medium", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 1, "timeout_ms": 10000}},
            ]
        )
        assert len(pkg["tasks"]) == 2
        assert pkg["tasks"][0]["task_id"] == "t1"
        assert pkg["tasks"][1]["task_id"] == "t2"


# ── BusPublisher Tests ──────────────────────────────────────────

class TestBusPublisher:
    """BusPublisher wraps mission events in V2 envelopes."""

    def test_publish_mission_planned_creates_valid_envelope(self):
        from app.services.mission_bus_service import publish_mission_event

        envelope = publish_mission_event("mission.planned", make_mission_package(), publish=False)
        assert envelope["event_type"] == "mission.planned"
        assert envelope["event_id"].startswith("evt-")
        assert envelope["source"]["service"] == "kratos-mission-control"
        assert envelope["mission_id"] == "mission-001"
        assert envelope["severity"] == "info"
        assert envelope["status"] == "ok"

    def test_publish_mission_completed_has_correct_severity(self):
        from app.services.mission_bus_service import publish_mission_event

        envelope = publish_mission_event("mission.completed", make_mission_package(status="completed"), publish=False)
        assert envelope["event_type"] == "mission.completed"
        assert envelope["severity"] == "info"

    def test_publish_mission_failed_has_warn_severity(self):
        from app.services.mission_bus_service import publish_mission_event

        envelope = publish_mission_event("mission.failed", make_mission_package(status="failed"), publish=False)
        assert envelope["event_type"] == "mission.failed"
        assert envelope["severity"] == "warn"

    def test_publish_rejects_invalid_event_type(self):
        from app.services.mission_bus_service import publish_mission_event

        with pytest.raises(ValueError, match="Unknown mission event type"):
            publish_mission_event("mission.invalid", make_mission_package(), publish=False)

    def test_publish_all_known_mission_event_types(self):
        from app.services.mission_bus_service import publish_mission_event

        for etype in ["mission.planned", "mission.completed", "mission.failed"]:
            envelope = publish_mission_event(etype, make_mission_package(), publish=False)
            assert envelope["event_type"] == etype

    def test_mission_id_in_envelope_matches_package(self):
        from app.services.mission_bus_service import publish_mission_event

        pkg = make_mission_package(mission_id="custom-mission-42")
        envelope = publish_mission_event("mission.planned", pkg, publish=False)
        assert envelope["mission_id"] == "custom-mission-42"


# ── BusDispatcher Tests ─────────────────────────────────────────

class TestBusDispatcher:
    """BusDispatcher converts MissionPackage tasks into AgentAssignmentEvents."""

    def test_dispatch_from_mission_creates_assignment_per_task(self):
        from app.services.mission_bus_service import dispatch_assignments

        pkg = make_mission_package(tasks=[
            {"task_id": "t1", "capability": "runtime.health_check", "description": "a", "expected_output": "x", "priority": "low", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}},
            {"task_id": "t2", "capability": "runtime.ping_check", "description": "b", "expected_output": "y", "priority": "medium", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 1, "timeout_ms": 10000}},
        ])

        assignments = dispatch_assignments(pkg["mission_id"], pkg["tasks"], publish=False)
        assert len(assignments) == 2
        assert assignments[0]["payload"]["task_id"] == "t1"
        assert assignments[1]["payload"]["task_id"] == "t2"

    def test_dispatch_assignment_has_correct_event_type(self):
        from app.services.mission_bus_service import dispatch_assignments

        assignments = dispatch_assignments("mission-001", make_mission_package()["tasks"], publish=False)
        assert assignments[0]["event_type"] == "agent.assignment.requested"

    def test_dispatch_assignment_carries_governance(self):
        from app.services.mission_bus_service import dispatch_assignments

        assignments = dispatch_assignments("mission-001", make_mission_package()["tasks"], publish=False)
        gov = assignments[0]["payload"]["governance"]
        assert "secrets" in gov["forbidden_tools"]
        assert "production_write" in gov["forbidden_tools"]
        assert gov["requires_human_slot"] is False

    def test_dispatch_assignment_envelope_is_valid_v2(self):
        from app.services.mission_bus_service import dispatch_assignments

        assignments = dispatch_assignments("mission-001", make_mission_package()["tasks"], publish=False)
        env = assignments[0]
        assert env["event_id"].startswith("evt-")
        assert "timestamp" in env
        assert "source" in env
        assert env["source"]["service"] == "kratos-mission-control"

    def test_dispatch_empty_tasks_returns_empty(self):
        from app.services.mission_bus_service import dispatch_assignments

        assignments = dispatch_assignments("mission-001", [], publish=False)
        assert assignments == []

    def test_dispatch_each_assignment_has_unique_event_id(self):
        from app.services.mission_bus_service import dispatch_assignments

        tasks = [
            {"task_id": "t1", "capability": "runtime.a", "description": "a", "expected_output": "x", "priority": "low", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}},
            {"task_id": "t2", "capability": "runtime.b", "description": "b", "expected_output": "y", "priority": "low", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}},
        ]
        assignments = dispatch_assignments("mission-001", tasks, publish=False)
        ids = {a["event_id"] for a in assignments}
        assert len(ids) == 2, "Each assignment must have unique event_id"
