from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_alerts() -> list[dict]:
    return [
        {
            "id": "alert_1",
            "title": "Heartbeat missed",
            "severity": "high",
            "confidence": 87,
        }
    ]

