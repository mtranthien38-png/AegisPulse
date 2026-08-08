from fastapi import APIRouter

from app.core.config import settings
from app.services import workflow_steps

router = APIRouter()


@router.get("/")
async def workflow() -> dict:
    return {
        "steps": workflow_steps(),
        "contract": {
            "address": settings.CONTRACT_ADDRESS,
            "network": "studionet",
            "read_methods": ["get_alert"],
            "write_methods": ["register_asset", "score_alert", "open_incident"],
        },
    }
