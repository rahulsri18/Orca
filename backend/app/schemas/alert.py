from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AlertBase(BaseModel):
    id: str
    title: str
    issuing_authority: str
    source_url: Optional[str] = None
    affected_region: str
    category: str
    severity: str
    status: str
    issue_time: str
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    description: str
    action_directive: str
    is_official: bool = True
    data_provenance: str = "LIVE"

class AlertOut(AlertBase):
    retrieval_time: datetime

    class Config:
        from_attributes = True

class AlertSummaryResponse(BaseModel):
    system_time_ist: str
    total_active: int
    critical_count: int
    high_count: int
    moderate_count: int
    alerts: List[AlertBase]
