from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class BulletinBase(BaseModel):
    bulletin_type: str
    title: str
    issuing_agency: str
    issue_time: str
    validity_period: str
    synoptic_situation: Optional[str] = None
    warnings: Optional[str] = None
    source_reference: Optional[str] = None
    data_provenance: str = "LIVE"

class BulletinOut(BulletinBase):
    id: int
    retrieval_time: datetime
    details_json: Optional[str] = None

    class Config:
        from_attributes = True

class DailyBulletinResponse(BaseModel):
    system_date_ist: str
    system_time_ist: str
    port: str
    cyclone_alert_level: str
    rsmc_bulletin: Optional[BulletinBase] = None
    bay_of_bengal_bulletin: Optional[BulletinBase] = None
    arabian_sea_bulletin: Optional[BulletinBase] = None
    prime_pfz: Optional[Dict[str, Any]] = None
    safe_harbors: List[str]
    disclaimer: str
