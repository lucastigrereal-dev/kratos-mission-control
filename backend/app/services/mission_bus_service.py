"""Mission Bus Service — MissionPackage + BusPublisher + BusDispatcher.

M6 MVP: Creates mission packages, publishes to Redis Bus via V2 envelope,
dispatches tasks to RuntimeAgents via agent.assignment.requested events.
"""
import json
import uuid
from datetime import datetime, timezone

import redis

import os
REDIS_HOST = os.environ.get("KRATOS_REDIS_HOST", "127.0.0.1")
REDIS_PORT = int(os.environ.get("KRATOS_REDIS_PORT", "6382"))

VALID_MISSION_EVENT_TYPES = {"mission.planned", "mission.completed", "mission.failed"}
VALID_ASSIGNMENT_EVENT_TYPE = "agent.assignment.requested"


def _make_envelope(event_type: str, mission_id: str, payload: dict,
                   severity: str = "info", status: str = "ok",
                   correlation_id: str | None = None) -> dict:
    """Create a V2 envelope following the same contract as event_bridge.py."""
    return {
        "event_id": f"evt-{uuid.uuid4().hex[:8]}",
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": {
            "service": "kratos-mission-control",
            "version": "0.12.0",
            "instance": "mission-bus",
        },
        "correlation_id": correlation_id or f"corr-{uuid.uuid4().hex[:8]}",
        "mission_id": mission_id,
        "severity": severity,
        "status": status,
        "trace_id": None,
        "payload": payload,
    }


def _get_redis() -> redis.Redis | None:
    """Get Redis connection. Returns None if unavailable (no crash)."""
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, socket_connect_timeout=3)
        r.ping()
        return r
    except Exception:
        return None


def publish_mission_event(event_type: str, mission_package: dict,
                          publish: bool = True) -> dict:
    """Wrap a mission event in V2 envelope and optionally publish to Redis.

    Args:
        event_type: One of mission.planned, mission.completed, mission.failed
        mission_package: MissionPackage dict
        publish: If True, publish to Redis channel mission:events

    Returns:
        V2 envelope dict

    Raises:
        ValueError: If event_type is unknown
    """
    if event_type not in VALID_MISSION_EVENT_TYPES:
        raise ValueError(
            f"Unknown mission event type: {event_type}. "
            f"Valid: {sorted(VALID_MISSION_EVENT_TYPES)}"
        )

    severity = "warn" if event_type == "mission.failed" else "info"
    status = "ok" if event_type != "mission.failed" else "failed"

    envelope = _make_envelope(
        event_type=event_type,
        mission_id=mission_package["mission_id"],
        payload={
            "mission_id": mission_package["mission_id"],
            "title": mission_package.get("title", ""),
            "description": mission_package.get("description", ""),
            "status": mission_package.get("status", "planned"),
            "priority": mission_package.get("priority", "medium"),
            "task_count": len(mission_package.get("tasks", [])),
        },
        severity=severity,
        status=status,
    )

    if publish:
        r = _get_redis()
        if r:
            r.publish("mission:events", json.dumps(envelope, ensure_ascii=False, default=str))

    return envelope


def dispatch_assignments(mission_id: str, tasks: list[dict],
                         publish: bool = True) -> list[dict]:
    """Convert mission tasks into AgentAssignmentEvents with V2 envelopes.

    Args:
        mission_id: Parent mission ID
        tasks: List of task dicts (from MissionPackage)
        publish: If True, publish each to Redis channel mission:assignments

    Returns:
        List of V2 envelope dicts (one per task)
    """
    assignments = []

    for task in tasks:
        envelope = _make_envelope(
            event_type=VALID_ASSIGNMENT_EVENT_TYPE,
            mission_id=mission_id,
            payload={
                "task_id": task["task_id"],
                "requested_capability": task["capability"],
                "suggested_agent_type": "runtime_worker",
                "priority": task.get("priority", "medium"),
                "risk_level": task.get("risk_level", "low"),
                "payload": {
                    "mission_summary": "",
                    "task_description": task.get("description", ""),
                    "expected_output": task.get("expected_output", ""),
                },
                "governance": task.get("governance", {
                    "requires_human_slot": False,
                    "allowed_tools": [],
                    "forbidden_tools": ["secrets", "production_write"],
                    "max_retries": 0,
                    "timeout_ms": 30000,
                }),
            },
        )

        assignments.append(envelope)

        if publish:
            r = _get_redis()
            if r:
                r.publish("mission:assignments", json.dumps(envelope, ensure_ascii=False, default=str))

    return assignments
