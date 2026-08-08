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
        }
    ]

