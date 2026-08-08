from fastapi import APIRouter

router = APIRouter()


@router.get("/overview")
async def overview() -> dict:
    return {
        "monitored_assets": 12,
        "open_alerts": 3,
        "active_incidents": 1,
        "mean_time_to_ack_minutes": 4.8,
        "mean_time_to_resolve_hours": 1.7,
        "false_positive_rate": 0.08,
        "automation_coverage": 0.63,
    }
