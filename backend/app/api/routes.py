from fastapi import APIRouter
from backend.app.schemas.routes import RouteAnalyzeRequest, RouteAnalyzeResponse
from backend.app.services.safe_route_service import SafeRouteService

router = APIRouter(prefix="/api/routes", tags=["Safe Maritime Navigation"])

@router.post("/analyze", response_model=RouteAnalyzeResponse)
async def analyze_marine_route(req: RouteAnalyzeRequest):
    """Calculates nautical distance, intermediate waypoints, and hazard risks along route."""
    return SafeRouteService.analyze_route(
        origin_name=req.origin_name,
        origin_lat=req.origin_lat,
        origin_lng=req.origin_lng,
        dest_name=req.destination_name,
        dest_lat=req.destination_lat,
        dest_lng=req.destination_lng,
        vessel_type=req.vessel_type or "Mechanized Trawler",
        draft_m=req.vessel_draft_m or 2.5
    )
