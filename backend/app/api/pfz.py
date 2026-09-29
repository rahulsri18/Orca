from fastapi import APIRouter
from backend.app.schemas.pfz import PfzResponse
from backend.app.services.incois_service import IncoisService
from backend.app.services.date_utils import get_current_ist_timestamp

router = APIRouter(prefix="/api/pfz", tags=["Potential Fishing Zones"])

@router.get("/active", response_model=PfzResponse)
async def get_active_pfz_advisories():
    """Returns active INCOIS PFZ zones with SST, chlorophyll concentration, and bearing from harbor."""
    zones = await IncoisService.get_active_pfz_zones()
    prime_count = sum(1 for z in zones if z.get("potential_rating") == "PRIME")
    return {
        "system_time_ist": get_current_ist_timestamp(),
        "total_zones": len(zones),
        "prime_zones": prime_count,
        "zones": zones
    }
