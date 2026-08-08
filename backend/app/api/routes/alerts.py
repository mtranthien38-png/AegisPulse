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
            "asset": "Validator Node A",
            "signal": "missed_heartbeat",
            "age_minutes": 8,
        }
        ,
        {
            "id": "alert_2",
            "title": "Latency spike detected",
            "severity": "medium",
            "confidence": 71,
            "asset": "RPC Gateway",
            "signal": "latency_spike",
            "age_minutes": 21,
        },
        {
            "id": "alert_3",
            "title": "Peer divergence warning",
            "severity": "high",
            "confidence": 83,
            "asset": "Bridge Watcher",
            "signal": "state_divergence",
            "age_minutes": 44,
        },
    ]
