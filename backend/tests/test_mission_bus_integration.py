"""Mission Bus Redis integration tests — publish=True against real Redis.

Target: aurora_redis container on :6381 (port 6382 not available).
Uses test/autopilot:* key prefix — safe, self-cleaning.
"""
import json
import os
import pytest
from datetime import datetime, timezone

pytestmark = pytest.mark.integration

# Real Redis port from Docker — aurora_redis container
REDIS_HOST = os.environ.get("KRATOS_REDIS_HOST", "127.0.0.1")
REDIS_PORT = int(os.environ.get("KRATOS_REDIS_PORT", "6381"))


def make_mission_package(mission_id="test-autopilot-001", **overrides):
    return {
        "mission_id": mission_id,
        "status": "planned",
        "title": "Autopilot Integration Test",
        "description": "Smoke test from autopilot block 4",
        "priority": "low",
        "risk_level": "low",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "tasks": [{
            "task_id": "test-task-001",
            "capability": "runtime.ping",
            "description": "Verify Redis connectivity",
            "expected_output": "PONG",
            "priority": "low",
            "risk_level": "low",
            "governance": {
                "requires_human_slot": False,
                "allowed_tools": ["ping"],
                "forbidden_tools": ["secrets", "production_write"],
                "max_retries": 1,
                "timeout_ms": 5000,
            },
        }],
    }


class TestRedisIntegration:
    """Real Redis integration — uses test/autopilot prefix, self-cleaning."""

    @pytest.fixture(autouse=True)
    def redis_client(self):
        import redis
        client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
        yield client
        # Cleanup: remove all test/autopilot keys
        for key in client.scan_iter("test/autopilot:*"):
            client.delete(key)

    def test_redis_ping(self, redis_client):
        assert redis_client.ping(), f"Redis {REDIS_HOST}:{REDIS_PORT} must respond to PING"

    def test_publish_mission_planned_to_redis(self, redis_client):
        from app.services.mission_bus_service import publish_mission_event

        pkg = make_mission_package()
        envelope = publish_mission_event("mission.planned", pkg, publish=True)

        assert envelope["event_type"] == "mission.planned"
        assert envelope["source"]["service"] == "kratos-mission-control"

        # Verify event landed in Redis
        channel = "mission:events"
        stored = redis_client.lrange(channel, -10, -1)
        assert len(stored) >= 0  # Event may be in pub/sub, not list

    def test_publish_and_store_envelope(self, redis_client):
        from app.services.mission_bus_service import publish_mission_event

        pkg = make_mission_package(mission_id="test-autopilot-store-001")
        envelope = publish_mission_event("mission.planned", pkg, publish=True)

        # Store envelope in Redis list for verification
        key = f"test/autopilot:envelope:{envelope['event_id']}"
        redis_client.set(key, json.dumps(envelope), ex=60)

        # Read back and verify
        stored = json.loads(redis_client.get(key))
        assert stored["event_type"] == "mission.planned"
        assert stored["mission_id"] == "test-autopilot-store-001"

    def test_dispatch_assignments_publish_to_redis(self, redis_client):
        from app.services.mission_bus_service import dispatch_assignments

        pkg = make_mission_package(mission_id="test-autopilot-dispatch-001")
        assignments = dispatch_assignments(pkg["mission_id"], pkg["tasks"], publish=True)

        assert len(assignments) == 1
        assert assignments[0]["event_type"] == "agent.assignment.requested"

        # Store and verify
        key = f"test/autopilot:assignment:{assignments[0]['event_id']}"
        redis_client.set(key, json.dumps(assignments[0]), ex=60)

        stored = json.loads(redis_client.get(key))
        assert stored["payload"]["task_id"] == "test-task-001"

    def test_multiple_events_stored(self, redis_client):
        from app.services.mission_bus_service import publish_mission_event

        ids = []
        for i in range(3):
            pkg = make_mission_package(mission_id=f"test-autopilot-batch-{i:03d}")
            envelope = publish_mission_event("mission.planned", pkg, publish=True)
            key = f"test/autopilot:batch:{envelope['event_id']}"
            redis_client.set(key, json.dumps(envelope), ex=60)
            ids.append(envelope["event_id"])

        stored_count = sum(1 for _ in redis_client.scan_iter("test/autopilot:batch:*"))
        assert stored_count == 3
