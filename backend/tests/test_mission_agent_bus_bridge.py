"""E2E Integration: MissionPackage → Bus → RuntimeAgent → Result.

Tests the complete bridge WITHOUT Redis dependency.
"""
import pytest
from tests.test_mission_bus import make_mission_package, make_assignment_event


class TestE2EMissionAgentBusBridge:
    """Full integration: create mission, dispatch, agent executes, collect results."""

    def test_full_bridge_flow_single_task(self):
        from app.services.mission_bus_service import publish_mission_event, dispatch_assignments
        from app.services.runtime_agent_service import RuntimeAgent, AgentRegistry

        # 1. Create MissionPackage
        pkg = make_mission_package(mission_id="e2e-test-001")
        assert pkg["status"] == "planned"

        # 2. Publish mission.planned (dry-run, no Redis)
        envelope = publish_mission_event("mission.planned", pkg, publish=False)
        assert envelope["event_type"] == "mission.planned"
        assert envelope["mission_id"] == "e2e-test-001"

        # 3. Dispatch assignments from mission
        assignments = dispatch_assignments(pkg["mission_id"], pkg["tasks"], publish=False)
        assert len(assignments) == 1
        assert assignments[0]["event_type"] == "agent.assignment.requested"

        # 4. Register agent and evaluate
        registry = AgentRegistry()
        agent = RuntimeAgent(
            agent_id="runtime.health_check_worker",
            name="Health Check Worker",
            capabilities=["runtime.health_check"],
            execution_mode="mock",
        )
        registry.register(agent)

        # 5. Agent receives assignment (extract from envelope payload)
        assignment_event = {
            "mission_id": assignments[0]["mission_id"],
            "task_id": assignments[0]["payload"]["task_id"],
            "requested_capability": assignments[0]["payload"]["requested_capability"],
            "risk_level": assignments[0]["payload"]["risk_level"],
            "governance": assignments[0]["payload"]["governance"],
        }

        accepted = agent.evaluate(assignment_event)
        assert accepted is True
        assert agent.status == "accepted"

        # 6. Execute task
        result = agent.execute(assignment_event)
        assert result["status"] == "completed"
        assert result["output"]["mock"] is True

        # 7. Collect agent events
        events = agent.flush_events()
        event_types = [e["event_type"] for e in events]
        assert "agent.task.started" in event_types
        assert "agent.task.completed" in event_types

        # 8. Publish mission.completed
        pkg["status"] = "completed"
        final_envelope = publish_mission_event("mission.completed", pkg, publish=False)
        assert final_envelope["event_type"] == "mission.completed"

    def test_full_bridge_flow_multi_task(self):
        from app.services.mission_bus_service import dispatch_assignments
        from app.services.runtime_agent_service import RuntimeAgent, AgentRegistry

        # Multi-task mission
        pkg = make_mission_package(mission_id="e2e-multi-001", tasks=[
            {"task_id": "t1", "capability": "runtime.health_check", "description": "a", "expected_output": "x", "priority": "low", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}},
            {"task_id": "t2", "capability": "runtime.ping_check", "description": "b", "expected_output": "y", "priority": "low", "risk_level": "low", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}},
        ])

        assignments = dispatch_assignments(pkg["mission_id"], pkg["tasks"], publish=False)
        assert len(assignments) == 2

        # Agent handles both capabilities
        registry = AgentRegistry()
        agent = RuntimeAgent(
            agent_id="runtime.multi_worker",
            name="Multi Worker",
            capabilities=["runtime.health_check", "runtime.ping_check"],
            execution_mode="mock",
        )
        registry.register(agent)

        results = []
        for assignment in assignments:
            event = {
                "mission_id": assignment["mission_id"],
                "task_id": assignment["payload"]["task_id"],
                "requested_capability": assignment["payload"]["requested_capability"],
                "risk_level": assignment["payload"]["risk_level"],
                "governance": assignment["payload"]["governance"],
            }

            accepted = agent.evaluate(event)
            assert accepted is True
            result = agent.execute(event)
            assert result["status"] == "completed"
            results.append(result)
            agent.reset()

        assert len(results) == 2

    def test_bridge_rejection_flow(self):
        from app.services.mission_bus_service import dispatch_assignments
        from app.services.runtime_agent_service import RuntimeAgent, AgentRegistry

        pkg = make_mission_package(mission_id="e2e-reject-001")
        assignments = dispatch_assignments(pkg["mission_id"], pkg["tasks"], publish=False)

        # Agent without matching capability
        registry = AgentRegistry()
        agent = RuntimeAgent(
            agent_id="runtime.wrong_worker",
            name="Wrong Worker",
            capabilities=["runtime.deploy_production"],
            execution_mode="mock",
        )
        registry.register(agent)

        assignment = assignments[0]
        event = {
            "mission_id": assignment["mission_id"],
            "task_id": assignment["payload"]["task_id"],
            "requested_capability": assignment["payload"]["requested_capability"],
            "risk_level": assignment["payload"]["risk_level"],
            "governance": assignment["payload"]["governance"],
        }

        accepted = agent.evaluate(event)
        assert accepted is False
        assert agent.status == "rejected"
        assert "capability_mismatch" in agent.last_rejection_reason

    def test_bridge_governance_blocks_high_risk(self):
        from app.services.mission_bus_service import dispatch_assignments
        from app.services.runtime_agent_service import RuntimeAgent

        pkg = make_mission_package(mission_id="e2e-blocked-001", risk_level="critical",
            tasks=[{"task_id": "t1", "capability": "runtime.health_check", "description": "a", "expected_output": "x", "priority": "high", "risk_level": "critical", "governance": {"requires_human_slot": False, "allowed_tools": [], "forbidden_tools": ["secrets"], "max_retries": 0, "timeout_ms": 5000}}])
        assignments = dispatch_assignments(pkg["mission_id"], pkg["tasks"], publish=False)

        agent = RuntimeAgent(
            agent_id="runtime.safe_worker",
            name="Safe Worker",
            capabilities=["runtime.health_check"],
            execution_mode="mock",
            max_risk_level="medium",
        )

        assignment = assignments[0]
        event = {
            "mission_id": assignment["mission_id"],
            "task_id": assignment["payload"]["task_id"],
            "requested_capability": assignment["payload"]["requested_capability"],
            "risk_level": assignment["payload"]["risk_level"],
            "governance": assignment["payload"]["governance"],
        }

        accepted = agent.evaluate(event)
        assert accepted is False
        assert "risk" in agent.last_rejection_reason.lower()
