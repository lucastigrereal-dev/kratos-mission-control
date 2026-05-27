"""RuntimeAgent tests — lifecycle, governance, mock execution."""
import pytest
from tests.test_mission_bus import make_assignment_event


# ── RuntimeAgent Lifecycle Tests ────────────────────────────────

class TestRuntimeAgentLifecycle:
    """RuntimeAgent state machine: IDLE → EVALUATING → ACCEPTED/REJECTED → RUNNING → COMPLETED/FAILED → IDLE."""

    @pytest.fixture
    def agent(self):
        from app.services.runtime_agent_service import RuntimeAgent
        return RuntimeAgent(
            agent_id="runtime.health_check_worker",
            name="Health Check Worker",
            capabilities=["runtime.health_check", "runtime.ping_check"],
            execution_mode="mock",
            requires_human_slot=False,
        )

    def test_agent_starts_idle(self, agent):
        assert agent.status == "idle"

    def test_agent_accepts_matching_capability(self, agent):
        event = make_assignment_event(requested_capability="runtime.health_check")
        accepted = agent.evaluate(event)
        assert accepted is True
        assert agent.status == "accepted"

    def test_agent_rejects_non_matching_capability(self, agent):
        event = make_assignment_event(requested_capability="runtime.deploy_production")
        accepted = agent.evaluate(event)
        assert accepted is False
        assert agent.status == "rejected"
        assert agent.last_rejection_reason is not None

    def test_agent_rejects_forbidden_tools(self, agent):
        # Agent accepts when assignment also forbids the same tools (no conflict)
        event = make_assignment_event(
            governance={
                "requires_human_slot": False,
                "allowed_tools": ["health_check"],
                "forbidden_tools": ["secrets", "production_write"],
                "max_retries": 0,
                "timeout_ms": 5000,
            }
        )
        accepted = agent.evaluate(event)
        assert accepted is True

    def test_agent_execute_mock_returns_result(self, agent):
        event = make_assignment_event()
        agent.evaluate(event)
        result = agent.execute(event)
        assert result["status"] == "completed"
        assert result["output"]["mock"] is True
        assert result["task_id"] == event["task_id"]

    def test_agent_execute_sets_status_to_completed(self, agent):
        event = make_assignment_event()
        agent.evaluate(event)
        agent.execute(event)
        assert agent.status == "completed"

    def test_agent_lifecycle_events_are_emitted(self, agent):
        event = make_assignment_event()

        accepted = agent.evaluate(event)
        assert accepted

        # After evaluate: only accepted event emitted
        events = agent.flush_events()
        assert len(events) == 1
        assert events[0]["event_type"] == "agent.assignment.accepted"

        result = agent.execute(event)
        assert result["status"] == "completed"
        # After execute: started + completed events emitted
        events = agent.flush_events()
        assert len(events) == 2
        assert events[0]["event_type"] == "agent.task.started"
        assert events[1]["event_type"] == "agent.task.completed"

    def test_agent_returns_to_idle_after_reset(self, agent):
        event = make_assignment_event()
        agent.evaluate(event)
        agent.execute(event)
        assert agent.status == "completed"
        agent.reset()
        assert agent.status == "idle"

    def test_agent_execute_fails_when_not_accepted(self, agent):
        event = make_assignment_event(requested_capability="runtime.unknown")
        agent.evaluate(event)
        assert agent.status == "rejected"
        with pytest.raises(RuntimeError, match="cannot execute"):
            agent.execute(event)

    def test_agent_requires_human_slot_holds(self, agent):
        # Agent does NOT have human slot; event REQUIRES it → reject
        event = make_assignment_event(
            governance={
                "requires_human_slot": True,
                "allowed_tools": [],
                "forbidden_tools": ["secrets"],
                "max_retries": 0,
                "timeout_ms": 5000,
            }
        )
        accepted = agent.evaluate(event)
        assert accepted is False
        assert agent.status == "rejected"
        assert "human_slot" in agent.last_rejection_reason.lower()

    def test_agent_report_includes_lifecycle_history(self, agent):
        event = make_assignment_event()
        agent.evaluate(event)
        agent.execute(event)

        report = agent.report()
        assert report["agent_id"] == "runtime.health_check_worker"
        assert report["status"] == "completed"
        assert len(report["history"]) >= 3  # accepted, started, completed


# ── Governance Tests ────────────────────────────────────────────

class TestRuntimeAgentGovernance:
    """Governance checks: forbidden tools, risk levels, capability matching."""

    @pytest.fixture
    def strict_agent(self):
        from app.services.runtime_agent_service import RuntimeAgent
        return RuntimeAgent(
            agent_id="runtime.strict_worker",
            name="Strict Worker",
            capabilities=["runtime.health_check"],
            execution_mode="mock",
            requires_human_slot=False,
            max_risk_level="medium",
        )

    def test_rejects_assignment_above_risk_level(self, strict_agent):
        event = make_assignment_event(
            requested_capability="runtime.health_check",
            risk_level="critical",
        )
        accepted = strict_agent.evaluate(event)
        assert accepted is False
        assert "risk" in strict_agent.last_rejection_reason.lower()


# ── Agent Registry Tests ────────────────────────────────────────

class TestAgentRegistry:
    """Multiple agents, capability matching dispatch."""

    def test_registry_finds_matching_agent(self):
        from app.services.runtime_agent_service import RuntimeAgent, AgentRegistry

        registry = AgentRegistry()
        registry.register(RuntimeAgent(
            agent_id="agent-a",
            name="Agent A",
            capabilities=["runtime.health_check"],
            execution_mode="mock",
        ))
        registry.register(RuntimeAgent(
            agent_id="agent-b",
            name="Agent B",
            capabilities=["runtime.deploy"],
            execution_mode="mock",
        ))

        candidates = registry.find_candidates("runtime.health_check")
        assert len(candidates) == 1
        assert candidates[0].agent_id == "agent-a"

    def test_registry_returns_empty_when_no_match(self):
        from app.services.runtime_agent_service import AgentRegistry

        registry = AgentRegistry()
        candidates = registry.find_candidates("runtime.unknown")
        assert candidates == []

    def test_registry_finds_multiple_candidates(self):
        from app.services.runtime_agent_service import RuntimeAgent, AgentRegistry

        registry = AgentRegistry()
        registry.register(RuntimeAgent(
            agent_id="agent-a", name="A",
            capabilities=["runtime.health_check"], execution_mode="mock",
        ))
        registry.register(RuntimeAgent(
            agent_id="agent-b", name="B",
            capabilities=["runtime.health_check", "runtime.ping"],
            execution_mode="mock",
        ))

        candidates = registry.find_candidates("runtime.health_check")
        assert len(candidates) == 2
