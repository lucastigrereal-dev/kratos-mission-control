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
    loop = asyncio.get_event_loop()

    async def event_stream():
        while True:
            # build_live_payload is sync + uses ThreadPoolExecutor internally.
            # run_in_executor prevents it from blocking the async event loop.
            payload = await loop.run_in_executor(None, build_live_payload)
            yield f"data: {json.dumps(payload)}\n\n"
            await asyncio.sleep(5.0)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
