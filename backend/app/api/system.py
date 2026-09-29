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

@router.get("/db-status")
async def get_db_status():
    """Inspects active database connection and lists detected tables."""
    from sqlalchemy import inspect
    from backend.app.database import engine
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        db_type = "PostgreSQL (Supabase/Cloud)" if "postgres" in str(engine.url) else "SQLite (Local)"
        return {
            "status": "CONNECTED",
            "database_type": db_type,
            "database_host": engine.url.host or "local_disk",
            "tables_found": tables,
            "total_tables": len(tables),
            "expected_tables": ["marine_observations", "alerts", "bulletins", "pfz_zones", "data_refresh_logs"],
            "all_tables_present": all(t in tables for t in ["marine_observations", "alerts", "bulletins", "pfz_zones", "data_refresh_logs"])
        }
    except Exception as e:
        return {
            "status": "CONNECTION_FAILED",
            "error_detail": str(e),
            "hint": "Verify your DATABASE_URL in Render environment variables. Ensure sslmode=require and password are correct."
        }

@router.post("/init-db")
async def trigger_init_db():
    """Forces creation of all ORCA tables in the connected database."""
    from sqlalchemy import inspect
    from backend.app.database import engine, init_db
    try:
        init_db()
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        return {
            "status": "SUCCESS",
            "message": "All ORCA 2.0 tables created successfully in the connected database.",
            "tables": tables
        }
    except Exception as e:
        return {
            "status": "ERROR",
            "error_detail": str(e)
        }
