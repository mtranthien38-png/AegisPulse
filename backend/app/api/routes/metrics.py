from fastapi import APIRouter

router = APIRouter()


@router.get("/overview")
async def overview() -> dict:
    return {
        "monitored_assets": 12,
        "open_alerts": 3,
        "active_incidents": 1,
        "mean_time_to_ack_minutes": 4.8,
    }

