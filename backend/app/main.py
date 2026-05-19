"""KRATOS Mission Control — FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="KRATOS Mission Control",
    description="Local-first operational cockpit",
    version="0.11.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8083", "http://127.0.0.1:8083"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and mount all routers
from app.routes.health import router as health_router
from app.routes.tasks import router as tasks_router
from app.routes.projects import router as projects_router
from app.routes.alerts import router as alerts_router
from app.routes.checkpoints import router as checkpoints_router
from app.routes.live import router as live_router
from app.routes.calendar import router as calendar_router
from app.routes.context import router as context_router
from app.routes.mentor import router as mentor_router
from app.routes.mission import router as mission_router
from app.routes.system import router as system_router
from app.routes.docker import router as docker_router
from app.routes.git import router as git_router
from app.routes.omnis import router as omnis_router
from app.routes.outputs import router as outputs_router
from app.routes.activity import router as activity_router
from app.routes.activitywatch import router as activitywatch_router
from app.routes.deadlines import router as deadlines_router
from app.routes.deliverables import router as deliverables_router
from app.routes.goals import router as goals_router
from app.routes.reminders import router as reminders_router
from app.routes.metrics import router as metrics_router
from app.routes.snapshots import router as snapshots_router
from app.routes.now import router as now_router
from app.routes.timeline import router as timeline_router
from app.routes.execution import router as execution_router
from app.routes.tabs import router as tabs_router
from app.routes.approvals import router as approvals_router
from app.routes.continuity import router as continuity_router
from app.routes.operational_truth import router as operational_truth_router

app.include_router(health_router)
app.include_router(tasks_router)
app.include_router(projects_router)
app.include_router(alerts_router)
app.include_router(checkpoints_router)
app.include_router(live_router)
app.include_router(calendar_router)
app.include_router(context_router)
app.include_router(mentor_router)
app.include_router(mission_router)
app.include_router(system_router)
app.include_router(docker_router)
app.include_router(git_router)
app.include_router(omnis_router)
app.include_router(outputs_router)
app.include_router(activity_router)
app.include_router(activitywatch_router)
app.include_router(deadlines_router)
app.include_router(deliverables_router)
app.include_router(goals_router)
app.include_router(reminders_router)
app.include_router(metrics_router)
app.include_router(snapshots_router)
app.include_router(now_router)
app.include_router(timeline_router)
app.include_router(execution_router)
app.include_router(tabs_router)
app.include_router(approvals_router)
app.include_router(continuity_router)
app.include_router(operational_truth_router)


@app.get("/")
def root():
    return {
        "name": "KRATOS Mission Control",
        "version": "0.11.0",
        "phase": "0.11 — Operational Truth Verifier",
        "endpoints": [
            "/health", "/now",
            "/projects", "/projects/{id}",
            "/system", "/docker", "/git",
            "/activity", "/tabs",
            "/checkpoints", "/timeline",
            "/outputs", "/alerts",
            "/omnis/status", "/omnis/summary",
            "/tasks", "/tasks/today", "/tasks/overdue", "/tasks/doing", "/tasks/unfinished",
            "/projects/{id}/goals",
            "/deliverables", "/deliverables/overdue",
            "/reminders", "/reminders/today",
            "/mentor/summary", "/mentor/next-action", "/mentor/unfinished",
            "/mentor/deadlines", "/mentor/focus", "/mentor/signals",
            "/snapshots", "/snapshots/{collector_name}",
            "/alerts/active", "/alerts/history", "/alerts/{id}",
            "/metrics/timeseries", "/metrics/summary",
            "/calendar/today", "/calendar/week", "/calendar/month",
            "/calendar/overdue", "/calendar/upcoming",
            "/execution/today", "/execution/week",
            "/deadlines", "/deadlines/overdue", "/deadlines/upcoming", "/deadlines/missing",
            "/activitywatch/status", "/activitywatch/buckets",
            "/activity/windows", "/activity/browser", "/activity/sessions",
            "/activity/context-switches",
            "/context/current", "/context/lost",
            "/context/project-guess", "/context/checkpoint",
            "/mentor/context-signals",
            "/operational-truth",
            "/live/stream", "/live/snapshot",
            "/mission/current", "/mission/lens",
            "/mentor/mission-brief",
        ],
    }
