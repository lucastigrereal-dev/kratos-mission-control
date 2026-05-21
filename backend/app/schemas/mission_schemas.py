"""Pydantic response models for /mission endpoints."""
from pydantic import BaseModel, Field


class DriftInfo(BaseModel):
    state: str
    severity: str
    minutes_out_of_focus: int = 0
    reason: str = ""
    recovery_action: dict | None = None
    should_suggest_checkpoint: bool = False


class LensMission(BaseModel):
    title: str
    project: str
    focus_state: str | None = None
    focus_drift_minutes: int = 0
    confidence: float = 0.0
    drift: DriftInfo | None = None


class LensNextAction(BaseModel):
    title: str
    rationale: str = ""
    priority: str = "medium"
    source: str = "fallback"
    cta_label: str = ""


class DoNotDoItem(BaseModel):
    title: str
    reason: str
    severity: str


class RiskItem(BaseModel):
    title: str
    severity: str
    entity: str
    reason: str
    suggested_action: str


class DeadlineItem(BaseModel):
    title: str
    project_id: str | None = None
    severity: str = "warning"
    due_at: str | None = None


class LensCheckpoint(BaseModel):
    available: bool
    label: str
    last_checkpoint_at: str | None = None
    resume_hint: str = ""


class LensSystemPulse(BaseModel):
    status: str
    live_status: str = ""
    degraded_count: int = 0
    critical_count: int = 0


class LensMentorSummary(BaseModel):
    text: str
    tone: str
    urgency: str = "medium"


class LensCheckpointSuggestion(BaseModel):
    should_suggest: bool
    severity: str = "none"
    reason: str = ""
    trigger: dict | None = None
    suggested_checkpoint: str | None = None
    cooldown: dict | None = None


class MissionLensData(BaseModel):
    current_mission: LensMission
    next_action: LensNextAction
    do_not_do: list[DoNotDoItem] = []
    risks: list[RiskItem] = []
    deadlines: list[DeadlineItem] = []
    checkpoint: LensCheckpoint
    system_pulse: LensSystemPulse
    mentor_summary: LensMentorSummary
    checkpoint_suggestion: LensCheckpointSuggestion


class MissionLensResponse(BaseModel):
    contract_version: str = "mission_lens.v1"
    source: str
    collector_status: str
    generated_at: str | None = None
    stale_after_ms: int | None = None
    data: MissionLensData


class MissionCurrentProject(BaseModel):
    id: str
    name: str


class MissionCurrentMission(BaseModel):
    id: str
    title: str


class MissionCurrentResponse(BaseModel):
    current_project: MissionCurrentProject | dict
    current_mission: MissionCurrentMission | dict
    focus_state: str


class MissionTaskItem(BaseModel):
    task_id: str | None = None
    status: str | None = None
    capability: str | None = None
    description: str | None = None


class MissionStatusResponse(BaseModel):
    mission_id: str
    status: str
    tasks: list[MissionTaskItem] = []
    task_count: int = 0


class MissionTimelineEvent(BaseModel):
    event_type: str | None = None
    timestamp: str | None = None
    event_id: str | None = None


class MissionReplayResponse(BaseModel):
    mission_id: str
    status: str
    timeline: list[MissionTimelineEvent] = []
    event_count: int = 0
