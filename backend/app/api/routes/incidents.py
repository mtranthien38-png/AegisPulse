from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_incidents() -> list[dict]:
    return [
        {
            "id": "inc_1",
            "title": "Validator drift detected",
            "status": "triaged",
            "priority": "p1",
            "owner": "oncall",
            "asset": "Validator Node A",
            "next_step": "isolate",
        },
        {
            "id": "inc_2",
            "title": "RPC gateway instability",
            "status": "investigating",
            "priority": "p2",
            "owner": "platform",
            "asset": "RPC Gateway",
            "next_step": "gather_evidence",
        }
    ]
