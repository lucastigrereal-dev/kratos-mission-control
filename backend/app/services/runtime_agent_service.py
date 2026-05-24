"""Runtime Agent Service — M6 MVP.

RuntimeAgent: listens to Bus, evaluates assignments (capability + governance),
executes tasks (mock-only), emits lifecycle events.

AgentRegistry: manages multiple agents, finds candidates by capability.
"""
import uuid
import time
from datetime import datetime, timezone
from collections import deque


class RuntimeAgent:
    """Unidade operacional executavel do OMNIS. Mock-only no MVP."""

    def __init__(self, agent_id: str, name: str, capabilities: list[str],
                 execution_mode: str = "mock", requires_human_slot: bool = False,
                 max_risk_level: str = "high"):
        self.agent_id = agent_id
        self.name = name
        self.capabilities = capabilities
        self.execution_mode = execution_mode
        self.requires_human_slot = requires_human_slot
        self.max_risk_level = max_risk_level

        self.status = "idle"
        self.current_mission_id: str | None = None
        self.current_task_id: str | None = None
        self.last_rejection_reason: str | None = None
        self._events: deque = deque(maxlen=100)
        self._history: list[dict] = []

        self._risk_order = {"low": 0, "medium": 1, "high": 2, "critical": 3}

    def evaluate(self, event: dict) -> bool:
        """Evaluate an AgentAssignmentEvent. Returns True if accepted."""
        self.status = "evaluating"

        # Check 1: Capability match
        requested = event.get("requested_capability", "")
        if requested not in self.capabilities:
            self.status = "rejected"
            self.last_rejection_reason = f"capability_mismatch: {requested} not in {self.capabilities}"
            self._emit("agent.assignment.rejected", event)
            return False

        # Check 2: Risk level
        event_risk = event.get("risk_level", "low")
        if self._risk_order.get(event_risk, 0) > self._risk_order.get(self.max_risk_level, 0):
            self.status = "rejected"
            self.last_rejection_reason = f"risk_too_high: {event_risk} > {self.max_risk_level}"
            self._emit("agent.assignment.rejected", event)
            return False

        # Check 3: Human slot required but agent doesn't have one
        gov = event.get("governance", {})
        if gov.get("requires_human_slot", False) and not self.requires_human_slot:
            self.status = "rejected"
            self.last_rejection_reason = "human_slot_required_but_unavailable"
            self._emit("agent.assignment.rejected", event)
            return False

        # Accepted
        self.status = "accepted"
        self.current_mission_id = event.get("mission_id")
        self.current_task_id = event.get("task_id")
        self._emit("agent.assignment.accepted", event)
        return True

    def execute(self, event: dict) -> dict:
        """Execute the assigned task (mock-only in MVP).

        Raises:
            RuntimeError: If agent hasn't accepted an assignment
        """
        if self.status != "accepted":
            raise RuntimeError(f"Agent {self.agent_id} cannot execute: status is '{self.status}', not 'accepted'")

        self.status = "running"
        self._emit("agent.task.started", event)

        started = time.monotonic()
        time.sleep(0.01)

        result = {
            "status": "completed",
            "task_id": event.get("task_id"),
            "output": {
                "mock": True,
                "agent_id": self.agent_id,
                "capability": event.get("requested_capability"),
                "message": f"Task {event.get('task_id')} completed successfully (mock)",
            },
            "latency_ms": int((time.monotonic() - started) * 1000),
        }

        self.status = "completed"
        self._emit("agent.task.completed", event, result)
        return result

    def reset(self) -> None:
        """Reset agent to idle for next assignment."""
        self.status = "idle"
        self.current_mission_id = None
        self.current_task_id = None
        self.last_rejection_reason = None

    def report(self) -> dict:
        """Return agent status report."""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "status": self.status,
            "capabilities": self.capabilities,
            "execution_mode": self.execution_mode,
            "current_mission_id": self.current_mission_id,
            "current_task_id": self.current_task_id,
            "history": list(self._history),
        }

    def flush_events(self) -> list[dict]:
        """Return and clear the event buffer (for test verification)."""
        events = list(self._events)
        self._events.clear()
        return events

    def _emit(self, event_type: str, assignment: dict, result: dict | None = None) -> None:
        """Emit a lifecycle event to internal buffer."""
        envelope = {
            "event_id": f"evt-{uuid.uuid4().hex[:8]}",
            "event_type": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": {
                "service": "runtime_agent",
                "version": "0.1.0",
                "instance": self.agent_id,
            },
            "correlation_id": assignment.get("correlation_id", ""),
            "mission_id": assignment.get("mission_id"),
            "severity": "warn" if "failed" in event_type or "rejected" in event_type else "info",
            "status": "ok" if "completed" in event_type or "accepted" in event_type or "started" in event_type else "failed",
            "trace_id": None,
            "payload": {
                "agent_id": self.agent_id,
                "task_id": assignment.get("task_id"),
                "result": result,
                "rejection_reason": self.last_rejection_reason if "rejected" in event_type else None,
            },
        }
        self._events.append(envelope)
        self._history.append({
            "event_type": event_type,
            "timestamp": envelope["timestamp"],
        })


class AgentRegistry:
    """Registry of RuntimeAgents. Finds candidates by capability."""

    def __init__(self):
        self._agents: dict[str, RuntimeAgent] = {}

    def register(self, agent: RuntimeAgent) -> None:
        self._agents[agent.agent_id] = agent

    def unregister(self, agent_id: str) -> None:
        self._agents.pop(agent_id, None)

    def find_candidates(self, capability_id: str) -> list[RuntimeAgent]:
        """Find agents that have the requested capability."""
        return [a for a in self._agents.values() if capability_id in a.capabilities]

    def get(self, agent_id: str) -> RuntimeAgent | None:
        return self._agents.get(agent_id)

    def list_all(self) -> list[dict]:
        return [a.report() for a in self._agents.values()]
