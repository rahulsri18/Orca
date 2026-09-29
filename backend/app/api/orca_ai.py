from fastapi import APIRouter
from backend.app.schemas.chat import AiQueryRequest, AiQueryResponse
from backend.app.services.orca_ai_coordinator import OrcaAiCoordinator

router = APIRouter(prefix="/api/ai", tags=["ORCA Multi-Agent AI"])

@router.post("/query", response_model=AiQueryResponse)
async def query_orca_ai(req: AiQueryRequest):
    """Processes natural language query using specialized multi-agent pipeline grounded in live data."""
    return await OrcaAiCoordinator.process_query(
        query=req.query,
        user_location=req.user_location or "Kochi, Kerala",
        coordinates=req.coordinates or [9.93, 76.26],
        language=req.language or "en"
    )
