"""CapabilityRecord dataclass with validation."""
from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
import yaml

VALID_DOMAINS = {
    "kratos", "akasha", "omnis", "gringotts",
    "mission_control", "publisher_os", "cross_cutting", "external",
}
VALID_TYPES = {
    "route", "hook", "agent", "skill", "collector", "service", "script",
    "external", "workflow", "adapter", "repo_lego", "schema", "dashboard",
    "command", "event", "memory_source", "governor", "prompt_pack",
}
VALID_LAYERS = {
    "interface", "transport", "application", "domain", "infrastructure",
    "memory", "orchestration", "governance", "observability", "automation",
    "content", "external",
}
VALID_STATUSES = {
    "planned", "candidate", "active", "degraded", "deprecated", "archived", "banned",
}
VALID_EVIDENCE_LEVELS = {"CONFIRMED", "HYPOTHESIS", "DOC_ONLY", "UNKNOWN"}
VALID_RISK_LEVELS = {"low", "medium", "high", "critical"}
VALID_SYNC_MODES = {"sync", "async", "stream", "batch"}

REQUIRED_TOP_KEYS = {
    "id", "name", "domain", "type", "layer", "status", "version",
    "description", "exposes", "contract", "evidence", "risk",
    "governance", "lifecycle", "quality", "fingerprint",
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
