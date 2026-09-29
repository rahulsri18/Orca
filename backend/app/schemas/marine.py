from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MarineObservationBase(BaseModel):
    sector_id: str
    sector_name: str
    state: str
    latitude: float
    longitude: float
    wave_height_m: float
    swell_height_m: float
    wind_wave_height_m: float
    wave_period_s: float
    wave_direction_deg: float
    wind_speed_kt: float
    wind_direction_deg: float
    wind_gusts_kt: float
    surface_temp_c: float
    surface_pressure_hpa: float
    risk_score: int
    risk_level: str
    status_notice: Optional[str] = None
    source_name: str
    observation_time: str
    data_provenance: str

class MarineObservationOut(MarineObservationBase):
    id: int
    retrieval_time: datetime

    class Config:
        from_attributes = True

class CurrentMarineResponse(BaseModel):
    system_time_ist: str
    retrieval_time_utc: str
    data_freshness: str  # LIVE, RECENT, STALE, DEMO
    most_riskiest_sector: MarineObservationBase
    sectors: List[MarineObservationBase]
