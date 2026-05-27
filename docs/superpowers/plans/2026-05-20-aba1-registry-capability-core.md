# ABA 1 — Registry & Capability Core Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 10-file spec into functional code: YAML schema validator, duplicate detection engine, and registry directory structure — all with TDD.

**Architecture:** Two Python scripts with full test coverage. `validate_capability_registry.py` validates YAML capability records against `capability.schema.yaml`. `detect_capability_duplicates.py` implements the 5 fingerprint rules from `CAPABILITY_DUPLICATE_DETECTION.md` with similarity scoring. Both scripts follow the KRATOS backend patterns (Python 3.11+, pytest, explicit errors).

**Tech Stack:** Python 3.11+, pytest, PyYAML, difflib (stdlib), pathlib (stdlib)

**Spec reference:** `reports/blitzkrieg/registry_capability_core/`

---

## File Structure

```
backend/
├── app/
│   └── registry/                          # NEW — registry module
│       ├── __init__.py
│       ├── schema.py                      # CapabilityRecord dataclass + deserialize
│       ├── validator.py                   # Schema validation engine
│       └── dedup.py                       # Duplicate detection engine
├── registry/                              # NEW — capability records
│   └── capabilities/
│       ├── kratos.live.stream.yaml
│       ├── kratos.checkpoint.store.yaml
│       ├── akasha.memory.search.yaml
│       ├── omnis.crew.execute.yaml
│       ├── gringotts.cost.track.yaml
│       ├── publisher_os.content.produce.yaml
│       ├── cross_cutting.token.enforcer.yaml
│       ├── external.github.status.yaml
│       └── mission_control.health.aggregate.yaml
└── tests/
    └── registry/                          # NEW — registry tests
        ├── __init__.py
        ├── test_validator.py              # Schema validation tests
        ├── test_dedup.py                  # Duplicate detection tests
        └── conftest.py                    # Shared fixtures
```

---

## Chunk 1: Foundation — Directory Structure + Schema Data Class

### Task 1: Create registry module scaffolding

**Files:**
- Create: `backend/app/registry/__init__.py`
- Create: `backend/tests/registry/__init__.py`
- Create: `backend/tests/registry/conftest.py`

- [ ] **Step 1: Create directories**

```bash
mkdir -p backend/app/registry
mkdir -p backend/tests/registry
mkdir -p backend/registry/capabilities
```

- [ ] **Step 2: Create `backend/app/registry/__init__.py`**

```python
"""Capability Registry — OMNISVERSO graph-node model."""
```

- [ ] **Step 3: Create `backend/tests/registry/__init__.py`**

```python
"""Tests for Capability Registry module."""
```

- [ ] **Step 4: Create `backend/tests/registry/conftest.py` with shared fixtures**

```python
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
            "sync_mode": "sync"
        },
        "evidence": {
            "level": "CONFIRMED",
            "tests": ["tests/test_fixture.py"],
            "health_endpoint": None,
            "reports": []
        },
        "risk": {
            "level": "low",
            "reasons": ["test_only"],
            "requires_human_slot": False
        },
        "governance": {
            "owner": "kratos",
            "allowed_tools": [],
            "forbidden_tools": ["secrets"],
            "approval_required_for": []
        },
        "lifecycle": {
            "created_at": None,
            "updated_at": None,
            "approved_by": None,
            "replaces": None,
            "replaced_by": None,
            "deprecation_reason": None
        },
        "quality": {
            "tests": [],
            "health_checks": [],
            "verification_command": None
        },
        "fingerprint": {
            "structural_keys": ["domain", "type", "layer", "contract.output"]
        }
    }
```

- [ ] **Step 5: Commit**

```bash
git add backend/app/registry/ backend/tests/registry/
git commit -m "feat(registry): scaffold registry module + test fixtures"
```

### Task 2: Create CapabilityRecord dataclass + deserializer

**Files:**
- Create: `backend/app/registry/schema.py`
- Create: `backend/tests/registry/test_schema.py`

- [ ] **Step 1: Write the failing test**

```python
# backend/tests/registry/test_schema.py
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
            "fingerprint": {"structural_keys": ["domain", "type"]}
        }
        f = tmp_path / "test.yaml"
        f.write_text(yaml.dump(data))
        record = deserialize_capability(str(f))
        assert record.id == "test.yaml.cap"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_schema.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.registry.schema'`

- [ ] **Step 3: Implement `schema.py`**

```python
"""CapabilityRecord dataclass with validation."""
from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
import yaml

VALID_DOMAINS = {
    "kratos", "akasha", "omnis", "gringotts",
    "mission_control", "publisher_os", "cross_cutting", "external"
}
VALID_TYPES = {
    "route", "hook", "agent", "skill", "collector", "service", "script",
    "external", "workflow", "adapter", "repo_lego", "schema", "dashboard",
    "command", "event", "memory_source", "governor", "prompt_pack"
}
VALID_LAYERS = {
    "interface", "transport", "application", "domain", "infrastructure",
    "memory", "orchestration", "governance", "observability", "automation",
    "content", "external"
}
VALID_STATUSES = {
    "planned", "candidate", "active", "degraded", "deprecated", "archived", "banned"
}
VALID_EVIDENCE_LEVELS = {"CONFIRMED", "HYPOTHESIS", "DOC_ONLY", "UNKNOWN"}
VALID_RISK_LEVELS = {"low", "medium", "high", "critical"}
VALID_SYNC_MODES = {"sync", "async", "stream", "batch"}

REQUIRED_TOP_KEYS = {
    "id", "name", "domain", "type", "layer", "status", "version",
    "description", "exposes", "contract", "evidence", "risk",
    "governance", "lifecycle", "quality", "fingerprint"
}


@dataclass
class CapabilityRecord:
    id: str
    name: str
    domain: str
    type: str  # noqa: A003
    layer: str
    status: str
    version: str
    description: str
    depends_on: list[str] = field(default_factory=list)
    exposes: dict = field(default_factory=lambda: {"routes": [], "events": [], "commands": [], "artifacts": []})
    contract: dict = field(default_factory=dict)
    evidence: dict = field(default_factory=dict)
    risk: dict = field(default_factory=dict)
    governance: dict = field(default_factory=dict)
    lifecycle: dict = field(default_factory=dict)
    quality: dict = field(default_factory=dict)
    fingerprint: dict = field(default_factory=dict)

    @property
    def evidence_level(self) -> str:
        return self.evidence.get("level", "UNKNOWN")

    @classmethod
    def from_dict(cls, data: dict) -> "CapabilityRecord":
        missing = REQUIRED_TOP_KEYS - set(data.keys())
        if missing:
            raise ValueError(f"Missing required field(s): {missing}")

        if data["domain"] not in VALID_DOMAINS:
            raise ValueError(f"Invalid domain: {data['domain']}. Must be one of {VALID_DOMAINS}")
        if data["type"] not in VALID_TYPES:
            raise ValueError(f"Invalid type: {data['type']}. Must be one of {VALID_TYPES}")
        if data["layer"] not in VALID_LAYERS:
            raise ValueError(f"Invalid layer: {data['layer']}. Must be one of {VALID_LAYERS}")
        if data["status"] not in VALID_STATUSES:
            raise ValueError(f"Invalid status: {data['status']}. Must be one of {VALID_STATUSES}")

        evidence = data.get("evidence", {})
        level = evidence.get("level", "UNKNOWN")
        if level not in VALID_EVIDENCE_LEVELS:
            raise ValueError(f"Invalid evidence level: {level}. Must be one of {VALID_EVIDENCE_LEVELS}")

        if data["status"] == "active" and level != "CONFIRMED":
            raise ValueError(f"Capability with status 'active' requires evidence level CONFIRMED, got {level}")

        risk = data.get("risk", {})
        risk_level = risk.get("level", "low")
        if risk_level not in VALID_RISK_LEVELS:
            raise ValueError(f"Invalid risk level: {risk_level}")

        contract = data.get("contract", {})
        sync_mode = contract.get("sync_mode", "sync")
        if sync_mode not in VALID_SYNC_MODES:
            raise ValueError(f"Invalid sync_mode: {sync_mode}")

        return cls(
            id=data["id"],
            name=data["name"],
            domain=data["domain"],
            type=data["type"],
            layer=data["layer"],
            status=data["status"],
            version=data.get("version", "0.1.0"),
            description=data["description"],
            depends_on=data.get("depends_on", []),
            exposes=data.get("exposes", {}),
            contract=contract,
            evidence=evidence,
            risk=risk,
            governance=data.get("governance", {}),
            lifecycle=data.get("lifecycle", {}),
            quality=data.get("quality", {}),
            fingerprint=data.get("fingerprint", {}),
        )


def deserialize_capability(path: str | Path) -> CapabilityRecord:
    path = Path(path)
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"YAML file {path} must contain a mapping, got {type(data)}")
    return CapabilityRecord.from_dict(data)


def load_capabilities(directory: str | Path) -> list[CapabilityRecord]:
    directory = Path(directory)
    if not directory.is_dir():
        raise FileNotFoundError(f"Directory not found: {directory}")
    records = []
    for yaml_file in sorted(directory.glob("*.yaml")):
        records.append(deserialize_capability(yaml_file))
    return records
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_schema.py -v`
Expected: 7 PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/registry/schema.py backend/tests/registry/test_schema.py
git commit -m "feat(registry): CapabilityRecord dataclass with validation + deserializer"
```

---

## Chunk 2: YAML Schema Validator

### Task 3: Implement validate_capability_registry.py

**Files:**
- Create: `backend/app/registry/validator.py`
- Create: `backend/tests/registry/test_validator.py`

- [ ] **Step 1: Write the failing test**

```python
# backend/tests/registry/test_validator.py
import pytest
from pathlib import Path
from app.registry.schema import deserialize_capability
from app.registry.validator import Validator, ValidationResult

class TestValidator:
    def test_valid_capability_passes(self, valid_capability):
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is True
        assert len(result.errors) == 0

    def test_empty_depends_on_is_valid(self, valid_capability):
        valid_capability["depends_on"] = []
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is True

    def test_id_format_invalid(self, valid_capability):
        valid_capability["id"] = "badformat"
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is False
        assert any("id format" in e.lower() for e in result.errors)

    def test_id_mismatches_domain(self, valid_capability):
        valid_capability["id"] = "akasha.something.test"
        # domain is "kratos" but id says "akasha"
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is False
        assert any("domain" in e.lower() for e in result.errors)

    def test_banned_status_no_dependents_check(self, valid_capability):
        valid_capability["status"] = "banned"
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is True  # banned is valid structurally

    def test_candidate_with_hypothesis_is_valid(self, valid_capability):
        valid_capability["status"] = "candidate"
        valid_capability["evidence"]["level"] = "HYPOTHESIS"
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is True

    def test_deprecated_needs_replaced_by(self, valid_capability):
        valid_capability["status"] = "deprecated"
        from app.registry.schema import CapabilityRecord
        record = CapabilityRecord.from_dict(valid_capability)
        validator = Validator()
        result = validator.validate(record)
        assert result.valid is False
        assert any("replaced_by" in e.lower() for e in result.errors)

    def test_validate_directory(self, tmp_path, valid_capability):
        import yaml
        (tmp_path / "cap1.yaml").write_text(yaml.dump(valid_capability))
        valid_capability2 = dict(valid_capability)
        valid_capability2["id"] = "kratos.test.second"
        (tmp_path / "cap2.yaml").write_text(yaml.dump(valid_capability2))
        validator = Validator()
        results = validator.validate_directory(str(tmp_path))
        assert len(results) == 2
        assert all(r.valid for r in results)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_validator.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: Implement `validator.py`**

```python
"""Capability schema validator."""
from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
from app.registry.schema import CapabilityRecord, load_capabilities


@dataclass
class ValidationResult:
    capability_id: str
    valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


class Validator:
    def validate(self, record: CapabilityRecord) -> ValidationResult:
        errors = []
        warnings = []

        parts = record.id.split(".")
        if len(parts) < 3:
            errors.append(f"Invalid id format: '{record.id}' — expected 'domain.component.name'")
        elif parts[0] != record.domain:
            errors.append(f"ID domain '{parts[0]}' does not match domain field '{record.domain}'")

        if record.status == "active" and record.evidence_level != "CONFIRMED":
            errors.append(f"Status 'active' requires CONFIRMED evidence, got {record.evidence_level}")

        if record.status == "deprecated" and not record.lifecycle.get("replaced_by"):
            errors.append("Status 'deprecated' requires 'replaced_by' in lifecycle")

        if record.status == "deprecated" and not record.lifecycle.get("deprecation_reason"):
            warnings.append("Status 'deprecated' should include 'deprecation_reason'")

        if record.evidence_level == "UNKNOWN":
            warnings.append(f"Capability '{record.id}' has UNKNOWN evidence — should not be used in runtime")

        if record.evidence_level == "CONFIRMED":
            has_evidence = any([
                record.evidence.get("tests"),
                record.evidence.get("health_endpoint"),
                record.evidence.get("files"),
                record.evidence.get("reports"),
                record.quality.get("verification_command"),
            ])
            if not has_evidence:
                errors.append("CONFIRMED evidence requires at least one: test, health_endpoint, file, report, or verification_command")

        for dep in record.depends_on:
            if dep == record.id:
                errors.append(f"Self-referencing depends_on: '{dep}'")

        gov = record.governance
        if gov.get("forbidden_tools") and gov.get("allowed_tools"):
            intersection = set(gov["forbidden_tools"]) & set(gov["allowed_tools"])
            if intersection:
                errors.append(f"Tools in both allowed and forbidden: {intersection}")

        return ValidationResult(
            capability_id=record.id,
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
        )

    def validate_directory(self, directory: str | Path) -> list[ValidationResult]:
        records = load_capacities(directory)
        return [self.validate(r) for r in records]

    def validate_all(self, records: list[CapabilityRecord]) -> list[ValidationResult]:
        return [self.validate(r) for r in records]
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_validator.py -v`
Expected: 8 PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/registry/validator.py backend/tests/registry/test_validator.py
git commit -m "feat(registry): schema validator with lifecycle + evidence gates"
```

---

## Chunk 3: Duplicate Detection Engine

### Task 4: Implement detect_capability_duplicates.py

**Files:**
- Create: `backend/app/registry/dedup.py`
- Create: `backend/tests/registry/test_dedup.py`

- [ ] **Step 1: Write the failing test**

```python
# backend/tests/registry/test_dedup.py
import pytest
from app.registry.schema import CapabilityRecord
from app.registry.dedup import DuplicateDetector, SimilarityResult, compute_similarity

class TestDuplicateDetector:
    @pytest.fixture
    def base(self, valid_capability):
        return CapabilityRecord.from_dict(valid_capability)

    @pytest.fixture
    def similar(self, valid_capability):
        data = dict(valid_capability)
        data["id"] = "kratos.test.similar"
        data["name"] = "Similar Fixture"
        return CapabilityRecord.from_dict(data)

    def test_exact_id_blocked(self, base):
        detector = DuplicateDetector([base])
        results = detector.check(base)
        assert len(results) > 0
        assert any(r.block for r in results)
        assert any(r.rule == "R1_EXACT_ID" for r in results)

    def test_different_id_passes(self, base, similar):
        detector = DuplicateDetector([base])
        results = detector.check(similar)
        assert not any(r.block for r in results)

    def test_r2_domain_type_exposes_overlap(self, base, similar):
        # same domain, same type, same exposes.routes
        detector = DuplicateDetector([base])
        results = detector.check(similar)
        r2_matches = [r for r in results if r.rule == "R2_DOMAIN_TYPE_EXPOSES"]
        assert len(r2_matches) > 0
        assert not any(r.block for r in r2_matches)  # R2 is FLAG, not block

    def test_r3_contract_output_route_match_blocks(self, base, similar):
        # same contract.output + same route = CRITICAL
        detector = DuplicateDetector([base])
        results = detector.check(similar)
        r3_matches = [r for r in results if r.rule == "R3_CONTRACT_OUTPUT_ROUTE"]
        assert len(r3_matches) > 0
        assert any(r.block for r in r3_matches)

    def test_different_output_passes(self, base, similar):
        similar.contract["output"] = "different.schema.json"
        detector = DuplicateDetector([base])
        results = detector.check(similar)
        r3_matches = [r for r in results if r.rule == "R3_CONTRACT_OUTPUT_ROUTE"]
        assert len(r3_matches) == 0

    def test_similarity_score_perfect_match(self, base):
        score = compute_similarity(base, base)
        assert score >= 90

    def test_similarity_score_different_domain(self, base, similar):
        similar.domain = "akasha"
        score = compute_similarity(base, similar)
        assert score < 60  # domain is 30 points

    def test_cross_domain_route_overlap_detected(self, base, similar):
        similar.domain = "akasha"
        similar.id = "akasha.test.similar"
        detector = DuplicateDetector([base])
        results = detector.check(similar)
        assert any(r.rule == "R5_CROSS_DOMAIN_ROUTE_OVERLAP" for r in results)

    def test_self_check_skipped(self, base):
        detector = DuplicateDetector([base])
        results = detector.check(base)
        r1 = [r for r in results if r.rule == "R1_EXACT_ID"]
        assert len(r1) == 1  # detects itself as exact match
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_dedup.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: Implement `dedup.py`**

```python
"""Capability duplicate detection engine."""
from __future__ import annotations
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from app.registry.schema import CapabilityRecord


@dataclass
class SimilarityResult:
    existing_id: str
    new_id: str
    rule: str
    score: float
    block: bool
    reason: str


class DuplicateDetector:
    def __init__(self, existing: list[CapabilityRecord]):
        self.existing = existing

    def check(self, new: CapabilityRecord) -> list[SimilarityResult]:
        results = []
        for existing in self.existing:
            results.extend(self._compare(existing, new))
        return results

    def _compare(self, existing: CapabilityRecord, new: CapabilityRecord) -> list[SimilarityResult]:
        results = []

        # R1: Exact ID collision
        if existing.id == new.id:
            results.append(SimilarityResult(
                existing_id=existing.id, new_id=new.id,
                rule="R1_EXACT_ID", score=100.0, block=True,
                reason=f"Exact ID collision: '{new.id}' already registered."
            ))
            return results

        # R2: Domain + Type + Exposes overlap (FLAG, not block)
        if existing.domain == new.domain and existing.type == new.type:
            route_overlap = set(existing.exposes.get("routes", [])) & set(new.exposes.get("routes", []))
            event_overlap = set(existing.exposes.get("events", [])) & set(new.exposes.get("events", []))
            command_overlap = set(existing.exposes.get("commands", [])) & set(new.exposes.get("commands", []))
            if route_overlap or event_overlap or command_overlap:
                results.append(SimilarityResult(
                    existing_id=existing.id, new_id=new.id,
                    rule="R2_DOMAIN_TYPE_EXPOSES", score=70.0, block=False,
                    reason=f"Same domain+type with overlapping exposes. Routes: {route_overlap}, Events: {event_overlap}, Commands: {command_overlap}"
                ))

        # R3: Contract output + route/event match (BLOCK)
        if (existing.contract.get("output") == new.contract.get("output")
                and existing.contract.get("output") is not None):
            route_overlap = set(existing.exposes.get("routes", [])) & set(new.exposes.get("routes", []))
            event_overlap = set(existing.exposes.get("events", [])) & set(new.exposes.get("events", []))
            if route_overlap or event_overlap:
                results.append(SimilarityResult(
                    existing_id=existing.id, new_id=new.id,
                    rule="R3_CONTRACT_OUTPUT_ROUTE", score=85.0, block=True,
                    reason=f"Same contract output '{existing.contract['output']}' on overlapping routes/events."
                ))

        # R4: Similar description (FLAG for human review)
        similarity = SequenceMatcher(None, existing.description, new.description).ratio()
        if similarity > 0.7 and existing.domain == new.domain:
            results.append(SimilarityResult(
                existing_id=existing.id, new_id=new.id,
                rule="R4_SIMILAR_DESCRIPTION", score=similarity * 60, block=False,
                reason=f"Descriptions are {similarity:.0%} similar in same domain."
            ))

        # R5: Cross-domain route overlap
        if existing.domain != new.domain:
            route_overlap = set(existing.exposes.get("routes", [])) & set(new.exposes.get("routes", []))
            if route_overlap:
                results.append(SimilarityResult(
                    existing_id=existing.id, new_id=new.id,
                    rule="R5_CROSS_DOMAIN_ROUTE_OVERLAP", score=60.0, block=False,
                    reason=f"Same routes {route_overlap} registered in different domains: {existing.domain} vs {new.domain}"
                ))

        # Similarity score
        score = compute_similarity(existing, new)
        if score >= 60:
            results.append(SimilarityResult(
                existing_id=existing.id, new_id=new.id,
                rule="R_SIMILARITY_SCORE", score=score, block=(score >= 60),
                reason=f"Structural similarity score {score} exceeds threshold 60."
            ))

        return results


def compute_similarity(a: CapabilityRecord, b: CapabilityRecord) -> float:
    score = 0.0
    if a.domain == b.domain:
        score += 30
    if a.type == b.type:
        score += 25
    if a.layer == b.layer:
        score += 20

    a_routes = set(a.exposes.get("routes", []))
    b_routes = set(b.exposes.get("routes", []))
    if a_routes & b_routes:
        score += 15

    a_events = set(a.exposes.get("events", []))
    b_events = set(b.exposes.get("events", []))
    if a_events & b_events:
        score += 15

    a_cmds = set(a.exposes.get("commands", []))
    b_cmds = set(b.exposes.get("commands", []))
    if a_cmds & b_cmds:
        score += 10

    if a.contract.get("output") == b.contract.get("output") and a.contract.get("output") is not None:
        score += 10
    if a.contract.get("input") == b.contract.get("input") and a.contract.get("input") is not None:
        score += 10

    # Bonus for same depends_on set
    if set(a.depends_on) == set(b.depends_on) and len(a.depends_on) > 0:
        score += 10

    return min(score, 100.0)
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_dedup.py -v`
Expected: 10 PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/registry/dedup.py backend/tests/registry/test_dedup.py
git commit -m "feat(registry): duplicate detection engine with 5 rules + similarity scoring"
```

---

## Chunk 4: Registry Seed + Integration

### Task 5: Extract seed YAML files from example

**Files:**
- Create: `backend/registry/capabilities/kratos.live.stream.yaml`
- Create: `backend/registry/capabilities/kratos.checkpoint.store.yaml`
- Create: `backend/registry/capabilities/akasha.memory.search.yaml`
- Create: `backend/registry/capabilities/omnis.crew.execute.yaml`
- Create: `backend/registry/capabilities/gringotts.cost.track.yaml`
- Create: `backend/registry/capabilities/publisher_os.content.produce.yaml`
- Create: `backend/registry/capabilities/cross_cutting.token.enforcer.yaml`
- Create: `backend/registry/capabilities/external.github.status.yaml`
- Create: `backend/registry/capabilities/mission_control.health.aggregate.yaml`

- [ ] **Step 1: Extract each capability from `capability_registry_seed.example.yaml` into individual files**

Each YAML file is a single capability, named `{id}.yaml`. Content is the individual entry from the seed file.

Example — `kratos.live.stream.yaml`:
```yaml
id: "kratos.live.stream"
name: "Live Stream SSE"
domain: kratos
type: service
layer: transport
status: active
version: "0.1.0"
description: "Stream SSE de snapshots live para o KRATOS cockpit."
depends_on:
  - "kratos.live.cache"
exposes:
  routes:
    - "/live/stream"
  events:
    - "live.snapshot"
  commands: []
  artifacts: []
contract:
  input: null
  output: "live.snapshot.schema.json"
  side_effects:
    - "read_runtime_state"
  sync_mode: stream
evidence:
  level: CONFIRMED
  tests:
    - "tests/test_live.py"
  health_endpoint: "/health/live"
  files: []
  reports: []
risk:
  level: medium
  reasons:
    - "runtime_surface"
    - "streaming_endpoint"
  requires_human_slot: false
governance:
  owner: kratos
  allowed_tools: []
  forbidden_tools:
    - "secrets"
    - "production_write"
  approval_required_for:
    - "production_deploy"
lifecycle:
  created_at: null
  updated_at: null
  approved_by: null
  replaces: null
  replaced_by: null
  deprecation_reason: null
quality:
  tests: []
  health_checks: []
  verification_command: null
fingerprint:
  structural_keys:
    - "domain"
    - "type"
    - "layer"
    - "contract.output"
    - "exposes.routes"
    - "exposes.events"
```

- [ ] **Step 2: Write integration test that loads + validates + dedups all seed files**

```python
# backend/tests/registry/test_integration.py
import pytest
from app.registry.schema import load_capabilities
from app.registry.validator import Validator
from app.registry.dedup import DuplicateDetector

class TestRegistryIntegration:
    @pytest.fixture
    def seed_path(self):
        from pathlib import Path
        return Path(__file__).parent.parent.parent / "registry" / "capabilities"

    def test_all_seed_files_load_and_validate(self, seed_path):
        records = load_capabilities(seed_path)
        assert len(records) >= 8
        validator = Validator()
        for record in records:
            result = validator.validate(record)
            assert result.valid, f"{record.id}: {result.errors}"

    def test_no_duplicates_in_seed(self, seed_path):
        records = load_capabilities(seed_path)
        detector = DuplicateDetector([])
        for i, new in enumerate(records):
            existing = records[:i]
            detector.existing = existing
            results = detector.check(new)
            blocks = [r for r in results if r.block]
            assert len(blocks) == 0, f"Blocking duplicate: {blocks}"

    def test_unique_ids_in_seed(self, seed_path):
        records = load_capabilities(seed_path)
        ids = [r.id for r in records]
        assert len(ids) == len(set(ids)), f"Duplicate IDs: {[id for id in ids if ids.count(id) > 1]}"

    def test_all_active_have_confirmed_evidence(self, seed_path):
        records = load_capabilities(seed_path)
        for r in records:
            if r.status == "active":
                assert r.evidence_level == "CONFIRMED", f"{r.id} is active but evidence is {r.evidence_level}"
```

- [ ] **Step 3: Run integration tests**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/test_integration.py -v`
Expected: 4 PASS (with 9 seed files loaded)

- [ ] **Step 4: Run all registry tests**

Run: `cd kratos-mission-control/backend && python -m pytest tests/registry/ -v`
Expected: 29 PASS (7 schema + 8 validator + 10 dedup + 4 integration)

- [ ] **Step 5: Commit**

```bash
git add backend/registry/ backend/tests/registry/test_integration.py
git commit -m "feat(registry): seed 9 capability files + integration tests"
```

---

## Chunk 5: CLI Entry Point

### Task 6: Add CLI script for validate + dedup

**Files:**
- Create: `backend/scripts/validate_registry.py`

- [ ] **Step 1: Create CLI script**

```python
#!/usr/bin/env python3
"""Capability Registry CLI — validate and detect duplicates."""
import argparse
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.registry.schema import load_capabilities
from app.registry.validator import Validator
from app.registry.dedup import DuplicateDetector


def main():
    parser = argparse.ArgumentParser(description="OMNISVERSO Capability Registry Validator")
    parser.add_argument("directory", help="Path to capabilities directory")
    parser.add_argument("--check-duplicates", action="store_true", help="Run duplicate detection")
    parser.add_argument("--check-dependencies", action="store_true", help="Validate dependency references")
    args = parser.parse_args()

    directory = Path(args.directory)
    if not directory.is_dir():
        print(f"ERROR: Directory not found: {directory}", file=sys.stderr)
        sys.exit(1)

    records = load_capabilities(directory)
    print(f"Loaded {len(records)} capabilities from {directory}")

    validator = Validator()
    errors = 0
    warnings = 0

    for record in records:
        result = validator.validate(record)
        if not result.valid:
            errors += len(result.errors)
            print(f"FAIL {record.id}:")
            for e in result.errors:
                print(f"  ERROR: {e}")
        if result.warnings:
            warnings += len(result.warnings)
            for w in result.warnings:
                print(f"  WARN: {w}")
        if result.valid and not result.warnings:
            print(f"OK   {record.id}")

    if args.check_duplicates:
        print("\n--- Duplicate Detection ---")
        detector = DuplicateDetector([])
        dup_errors = 0
        for i, new in enumerate(records):
            detector.existing = records[:i]
            results = detector.check(new)
            for r in results:
                if r.block:
                    dup_errors += 1
                    print(f"BLOCK {new.id}: [{r.rule}] {r.reason}")
                else:
                    print(f"FLAG  {new.id}: [{r.rule}] {r.reason}")
        if dup_errors > 0:
            print(f"\n{dup_errors} blocking duplicate(s) found.")
            sys.exit(1)

    if args.check_dependencies:
        print("\n--- Dependency Check ---")
        all_ids = {r.id for r in records}
        dep_errors = 0
        for r in records:
            for dep in r.depends_on:
                if dep not in all_ids:
                    dep_errors += 1
                    print(f"MISSING_DEP {r.id} depends on '{dep}' which is not in registry")
        if dep_errors > 0:
            print(f"\n{dep_errors} missing dependency/dependencies found.")

    print(f"\nDone. {len(records)} capabilities, {errors} error(s), {warnings} warning(s).")
    if errors > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run CLI against seed directory**

Run: `cd kratos-mission-control/backend && python scripts/validate_registry.py registry/capabilities --check-duplicates --check-dependencies`
Expected: All 9 seed files pass, no duplicates, no missing deps

- [ ] **Step 3: Commit**

```bash
git add backend/scripts/validate_registry.py
git commit -m "feat(registry): CLI script — validate + dedup + dependency check"
```

---

## Final Verification

- [ ] Run full test suite: `cd kratos-mission-control/backend && python -m pytest tests/registry/ -v`
- [ ] Run CLI: `python scripts/validate_registry.py registry/capabilities --check-duplicates --check-dependencies`
- [ ] Run `git status` to confirm only new files, no source repo modifications outside `backend/app/registry/`, `backend/registry/`, `backend/scripts/`, `backend/tests/registry/`
