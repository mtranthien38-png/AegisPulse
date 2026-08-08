from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/")
async def overview() -> dict:
    return {
        "summary": {
            "monitored_assets": 12,
            "healthy_assets": 9,
            "degraded_assets": 2,
            "open_alerts": 4,
            "open_incidents": 2,
            "resolved_incidents": 17,
        },
        "contract": {
            "address": settings.CONTRACT_ADDRESS,
            "tx_hash": settings.CONTRACT_TX_HASH,
            "network": "studionet",
        },
        "risk_trend": [
            {"label": "Mon", "value": 18},
            {"label": "Tue", "value": 22},
            {"label": "Wed", "value": 21},
            {"label": "Thu", "value": 27},
            {"label": "Fri", "value": 30},
            {"label": "Sat", "value": 26},
        ],
    }
