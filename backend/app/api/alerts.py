from fastapi import APIRouter, Query
from typing import Optional, List
from backend.app.schemas.alert import AlertBase, AlertSummaryResponse
from backend.app.services.alert_engine import AlertEngine

router = APIRouter(prefix="/api/alerts", tags=["Marine Hazards & Alerts"])

@router.get("/active", response_model=List[AlertBase])
async def get_active_alerts(severity: Optional[str] = Query(None, description="Filter by severity: CRITICAL, HIGH, MODERATE, LOW")):
    """Returns all currently active official government alerts and advisories."""
    return AlertEngine.get_active_alerts(severity_filter=severity)

@router.get("/summary", response_model=AlertSummaryResponse)
async def get_alerts_summary():
    """Returns counts and categorization of all active alerts."""
    return AlertEngine.get_summary()

@router.get("/history", response_model=List[AlertBase])
async def get_alerts_history():
    """Returns previous and updated alert audit history."""
    return AlertEngine.get_alert_history()

@router.post("/create", response_model=AlertBase)
async def create_alert(alert: AlertBase):
    """Registers a new alert or updates an existing alert in the central alert engine."""
    return AlertEngine.register_alert(alert.model_dump())

@router.put("/{alert_id}/status")
async def update_alert_status(alert_id: str, status: str = Query(..., description="ACTIVE, UPDATED, CANCELLED, EXPIRED")):
    """Updates the status of an alert (e.g. CANCELLED, EXPIRED)."""
    updated = AlertEngine.update_alert_status(alert_id, status)
    if not updated:
        return {"status": "NOT_FOUND", "alert_id": alert_id}
    return updated
