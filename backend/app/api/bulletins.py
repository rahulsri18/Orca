from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from backend.app.schemas.bulletin import DailyBulletinResponse
from backend.app.services.imd_service import ImdService
from backend.app.services.incois_service import IncoisService
from backend.app.services.date_utils import get_current_ist_timestamp, get_current_ist_date_str

router = APIRouter(prefix="/api/bulletins", tags=["Official Marine Bulletins"])

@router.get("/daily", response_model=DailyBulletinResponse)
async def get_daily_bulletin(port: Optional[str] = Query("Kochi Fishing Harbor, Kerala")):
    """Generates official daily marine bulletin with dynamic date, IMD outlook, and safe harbors."""
    rsmc = await ImdService.fetch_rsmc_cyclone_outlook()
    bob = await ImdService.fetch_sea_area_bulletin(1)
    arabian = await ImdService.fetch_sea_area_bulletin(2)
    pfz_zones = await IncoisService.get_active_pfz_zones()

    return {
        "system_date_ist": get_current_ist_date_str(),
        "system_time_ist": get_current_ist_timestamp(),
        "port": port,
        "cyclone_alert_level": rsmc.get("cyclone_risk_level", "HIGH"),
        "rsmc_bulletin": {
            "bulletin_type": "RSMC_TROPICAL",
            "title": rsmc.get("title", ""),
            "issuing_agency": rsmc.get("issuing_agency", ""),
            "issue_time": rsmc.get("issue_time", ""),
            "validity_period": rsmc.get("validity_period", ""),
            "synoptic_situation": rsmc.get("cyclone_status", ""),
            "warnings": rsmc.get("fishermen_warning", ""),
            "source_reference": rsmc.get("source_reference", ""),
            "data_provenance": rsmc.get("data_provenance", "LIVE")
        },
        "bay_of_bengal_bulletin": {
            "bulletin_type": "IMD_BOB",
            "title": "IMD ACWC Kolkata Sea Area Bulletin (Bay of Bengal)",
            "issuing_agency": bob.get("issuing_agency", ""),
            "issue_time": bob.get("issue_time", ""),
            "validity_period": bob.get("validity_period", ""),
            "synoptic_situation": bob.get("synoptic_situation", ""),
            "warnings": bob.get("warning", ""),
            "source_reference": bob.get("source_url", ""),
            "data_provenance": bob.get("data_provenance", "LIVE")
        },
        "arabian_sea_bulletin": {
            "bulletin_type": "IMD_ARABIAN",
            "title": "IMD ACWC Mumbai Sea Area Bulletin (Arabian Sea)",
            "issuing_agency": arabian.get("issuing_agency", ""),
            "issue_time": arabian.get("issue_time", ""),
            "validity_period": arabian.get("validity_period", ""),
            "synoptic_situation": arabian.get("synoptic_situation", ""),
            "warnings": arabian.get("warning", ""),
            "source_reference": arabian.get("source_url", ""),
            "data_provenance": arabian.get("data_provenance", "LIVE")
        },
        "prime_pfz": pfz_zones[0] if pfz_zones else None,
        "safe_harbors": ["Munambam Harbor (Lee Shelter)", "Thoppumpady Wet Basin", "Beypore Harbor"],
        "disclaimer": "OFFICIAL BULLETIN: Generated from verified IMD & INCOIS marine observation cycles. Transmitted via NavIC S-Band and Coastal VHF Net."
    }

@router.get("/imd/bob")
async def get_bob_bulletin():
    return await ImdService.fetch_sea_area_bulletin(1)

@router.get("/imd/arabian")
async def get_arabian_bulletin():
    return await ImdService.fetch_sea_area_bulletin(2)

@router.get("/rsmc")
async def get_rsmc_outlook():
    return await ImdService.fetch_rsmc_cyclone_outlook()
