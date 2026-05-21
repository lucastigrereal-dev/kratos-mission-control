"""Governance Runtime tests — SAFE passes, DANGER blocks, HUMAN_SLOT enforced."""
import pytest
from app.services.governance_runtime import classify_action, validate_mission_action, ActionLevel


class TestClassifyAction:
    def test_safe_read_actions(self):
        for action in ["read", "get_status", "health_check", "query_projects", "fetch_data"]:
            result = classify_action(action)
            assert result["level"] == ActionLevel.SAFE, f"{action} should be SAFE"
            assert result["allowed"] is True
            assert result["requires_human_slot"] is False

    def test_safe_audit_inspect(self):
        for action in ["audit_logs", "inspect_config", "validate_schema", "report_generate"]:
            result = classify_action(action)
            assert result["level"] == ActionLevel.SAFE

    def test_danger_blocked_by_default(self):
        result = classify_action("delete_project")
        assert result["level"] == ActionLevel.DANGER
        assert result["allowed"] is False
        assert "dry_run" in result["reason"].lower()

    def test_danger_allowed_in_dry_run(self):
        result = classify_action("delete_project", {"dry_run": True})
        assert result["level"] == ActionLevel.DANGER
        assert result["allowed"] is True
        assert result["dry_run"] is True

    def test_danger_allowed_when_approved(self):
        result = classify_action("delete_project", {"approved": True})
        assert result["level"] == ActionLevel.DANGER
        assert result["allowed"] is True

    def test_human_slot_always_blocked(self):
        for action in ["deploy_production", "publish_social", "drop_table_users"]:
            result = classify_action(action)
            assert result["level"] == ActionLevel.REQUIRES_HUMAN_SLOT
            assert result["allowed"] is False
            assert result["requires_human_slot"] is True

    def test_human_slot_blocked_even_dry_run(self):
        result = classify_action("publish_social_post", {"dry_run": True})
        assert result["level"] == ActionLevel.REQUIRES_HUMAN_SLOT
        assert result["allowed"] is False

    def test_human_slot_blocked_even_approved(self):
        result = classify_action("deploy_prod", {"approved": True})
        assert result["level"] == ActionLevel.REQUIRES_HUMAN_SLOT
        assert result["allowed"] is False

    def test_ambiguous_writing_action(self):
        """Actions that match both SAFE and DANGER patterns resolve to SAFE."""
        result = classify_action("read_write_report")
        assert result["level"] == ActionLevel.SAFE

    def test_write_actions_are_danger(self):
        for action in ["write_config", "update_setting", "insert_record"]:
            result = classify_action(action)
            assert result["level"] == ActionLevel.DANGER


class TestValidateMissionAction:
    def test_mission_context_present(self):
        result = validate_mission_action("test-mission-001", "read")
        assert result["mission_id"] == "test-mission-001"
        assert "governance_mode" in result

    def test_mission_danger_blocked(self):
        result = validate_mission_action("test-mission-002", "delete")
        assert result["allowed"] is False
        assert result["level"] == ActionLevel.DANGER
