from fastapi import APIRouter
from backend.app.config import settings
from backend.app.services.date_utils import (
    get_current_ist_datetime,
    get_current_ist_date_str,
    get_current_ist_time_str,
    get_current_ist_timestamp,
    get_iso_now
)
from backend.app.services.source_status_service import SourceStatusService
from backend.app.services.scheduler import DataRefreshScheduler

router = APIRouter(prefix="/api/system", tags=["System & Health"])

@router.get("/health")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "system_time_ist": get_current_ist_timestamp(),
        "utc_time": get_iso_now(),
        "scheduler": DataRefreshScheduler.get_status()
    }

@router.get("/time")
async def get_system_time():
    """Returns dynamic Indian Standard Time (IST) and UTC clock."""
    now_ist = get_current_ist_datetime()
    return {
        "date_str": get_current_ist_date_str(),
        "time_str": get_current_ist_time_str(),
        "timestamp_ist": get_current_ist_timestamp(),
        "iso_utc": get_iso_now(),
        "year": now_ist.year,
        "month": now_ist.month,
        "day": now_ist.day,
        "hour": now_ist.hour,
        "minute": now_ist.minute,
        "second": now_ist.second,
        "timezone": "Asia/Kolkata (IST, UTC+5:30)"
    }

@router.get("/sources")
async def get_source_status():
    """Returns live connection status, latencies, and official access levels for all providers."""
    return await SourceStatusService.get_all_sources_status()

@router.post("/refresh")
async def trigger_manual_refresh():
    """Triggers an immediate background data refresh cycle."""
    await DataRefreshScheduler.run_refresh_cycle()
    return {
        "status": "REFRESH_TRIGGERED",
        "timestamp_ist": get_current_ist_timestamp()
    }
