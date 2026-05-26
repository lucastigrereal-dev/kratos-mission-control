import pytest
from app.registry.schema import CapabilityRecord, deserialize_capability


class TestCapabilityRecord:
    def test_valid_record_from_dict(self, valid_capability):
        record = CapabilityRecord.from_dict(valid_capability)
        assert record.id == "kratos.test.fixture"
        assert record.domain == "kratos"
        assert record.type == "service"
        assert record.status == "active"
        assert record.evidence_level == "CONFIRMED"

    def test_missing_required_field_raises(self):
        with pytest.raises(ValueError, match="Missing required field"):
            CapabilityRecord.from_dict({"id": "test.id"})

    def test_invalid_domain_raises(self, valid_capability):
        valid_capability["domain"] = "invalid_domain"
        with pytest.raises(ValueError, match="Invalid domain"):
            CapabilityRecord.from_dict(valid_capability)

    def test_invalid_status_raises(self, valid_capability):
        valid_capability["status"] = "broken"
        with pytest.raises(ValueError, match="Invalid status"):
            CapabilityRecord.from_dict(valid_capability)

    def test_invalid_evidence_level_raises(self, valid_capability):
        valid_capability["evidence"]["level"] = "MAYBE"
        with pytest.raises(ValueError, match="Invalid evidence level"):
            CapabilityRecord.from_dict(valid_capability)

    def test_evidence_gate_active_requires_confirmed(self, valid_capability):
        valid_capability["evidence"]["level"] = "HYPOTHESIS"
        with pytest.raises(ValueError, match="active.*CONFIRMED"):
            CapabilityRecord.from_dict(valid_capability)

    def test_deserialize_yaml_file(self, tmp_path):
        import yaml

        data = {
            "id": "test.yaml.cap",
            "name": "YAML Test",
            "domain": "kratos",
            "type": "route",
            "layer": "transport",
            "status": "active",
            "version": "0.1.0",
            "description": "test",
            "exposes": {"routes": ["/yaml"], "events": [], "commands": [], "artifacts": []},
            "contract": {"input": None, "output": "y.schema", "side_effects": [], "sync_mode": "sync"},
            "evidence": {"level": "CONFIRMED", "tests": ["t.py"]},
            "risk": {"level": "low", "reasons": [], "requires_human_slot": False},
            "governance": {"owner": "kratos", "forbidden_tools": [], "approval_required_for": []},
            "lifecycle": {"created_at": None, "updated_at": None, "approved_by": None, "replaces": None, "replaced_by": None, "deprecation_reason": None},
            "quality": {"tests": [], "health_checks": [], "verification_command": None},
            "fingerprint": {"structural_keys": ["domain", "type"]},
        }
        f = tmp_path / "test.yaml"
        f.write_text(yaml.dump(data))
        record = deserialize_capability(str(f))
        assert record.id == "test.yaml.cap"

    def test_empty_depends_on_default(self, valid_capability):
        del valid_capability["depends_on"]
        record = CapabilityRecord.from_dict(valid_capability)
        assert record.depends_on == []
