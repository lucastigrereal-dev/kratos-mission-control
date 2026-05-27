import pytest
from pathlib import Path


@pytest.fixture
def registry_path():
    return Path(__file__).parent.parent.parent / "registry"


@pytest.fixture
def capabilities_path(registry_path):
    return registry_path / "capabilities"


@pytest.fixture
def valid_capability():
    return {
        "id": "kratos.test.fixture",
        "name": "Test Fixture Capability",
        "domain": "kratos",
        "type": "service",
        "layer": "transport",
        "status": "active",
        "version": "0.1.0",
        "description": "A minimal valid capability for testing.",
        "depends_on": [],
        "exposes": {"routes": ["/test"], "events": [], "commands": [], "artifacts": []},
        "contract": {
            "input": None,
            "output": "test.schema.json",
            "side_effects": [],
            "sync_mode": "sync",
        },
        "evidence": {
            "level": "CONFIRMED",
            "tests": ["tests/test_fixture.py"],
            "health_endpoint": None,
            "reports": [],
        },
        "risk": {
            "level": "low",
            "reasons": ["test_only"],
            "requires_human_slot": False,
        },
        "governance": {
            "owner": "kratos",
            "allowed_tools": [],
            "forbidden_tools": ["secrets"],
            "approval_required_for": [],
        },
        "lifecycle": {
            "created_at": None,
            "updated_at": None,
            "approved_by": None,
            "replaces": None,
            "replaced_by": None,
            "deprecation_reason": None,
        },
        "quality": {
            "tests": [],
            "health_checks": [],
            "verification_command": None,
        },
        "fingerprint": {
            "structural_keys": ["domain", "type", "layer", "contract.output"],
        },
    }
