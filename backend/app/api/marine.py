from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.app.schemas.marine import CurrentMarineResponse
from backend.app.services.marine_weather_service import MarineWeatherService
from backend.app.services.date_utils import get_current_ist_timestamp

router = APIRouter(prefix="/api/marine", tags=["Marine Oceanography"])

@router.get("/current", response_model=CurrentMarineResponse)
async def get_current_marine_conditions():
    """Returns real-time sea states (waves, swell, period) and winds for all Indian coastal sectors."""
    data = await MarineWeatherService.fetch_all_sectors_telemetry()
    return data

@router.get("/sectors/{sector_id}")
async def get_sector_details(sector_id: str):
    """Returns telemetry for a specific coastal sector."""
    data = await MarineWeatherService.fetch_all_sectors_telemetry()
    for sector in data.get("sectors", []):
        if sector["sector_id"].lower() == sector_id.lower():
            return {
                "system_time_ist": get_current_ist_timestamp(),
                "sector": sector
            }
    raise HTTPException(status_code=404, detail=f"Sector '{sector_id}' not found")
