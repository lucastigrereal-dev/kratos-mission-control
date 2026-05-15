import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.live_event_service import build_live_payload

router = APIRouter(tags=["live"])


@router.get("/live/snapshot")
def snapshot():
    return build_live_payload()


@router.get("/live/stream")
async def stream():
    async def event_stream():
        while True:
            payload = build_live_payload()
            yield f"data: {json.dumps(payload)}\n\n"
            await asyncio.sleep(5.0)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
