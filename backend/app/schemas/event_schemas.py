"""Pydantic response models for /events endpoints."""
from pydantic import BaseModel


class HeartbeatInfo(BaseModel):
    running: bool
    interval: int
    count: int


class ListenerInfo(BaseModel):
    running: bool
    channels: list[str]
    events_received: int
    ring_buffer_size: int
    ring_buffer_max: int


class RedisInfo(BaseModel):
    host: str
    port: int


class EventBridgeStatusResponse(BaseModel):
    status: str
    heartbeat: HeartbeatInfo
    listener: ListenerInfo
    redis: RedisInfo
    last_error: str | None = None


class EventBridgeEventsResponse(BaseModel):
    count: int
    events: list[dict]


class EventBridgeStartResponse(BaseModel):
    status: str
    detail: str = ""
