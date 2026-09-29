from pydantic import BaseModel
from typing import List, Optional

class Waypoint(BaseModel):
    lat: float
    lng: float
    name: Optional[str] = None

class RouteAnalyzeRequest(BaseModel):
    origin_name: str
    origin_lat: float
    origin_lng: float
    destination_name: str
    destination_lat: float
    destination_lng: float
    vessel_draft_m: Optional[float] = 2.5
    vessel_type: Optional[str] = "Mechanized Trawler"

class RouteAnalyzeResponse(BaseModel):
    system_time_ist: str
    origin: str
    destination: str
    total_distance_nm: float
    estimated_duration_hours: float
    risk_level: str  # LOW, MEDIUM, HIGH, SEVERE
    risk_score: int
    maximum_wave_height_m: float
    maximum_wind_speed_kt: float
    hazards_encountered: List[str]
    waypoints: List[Waypoint]
    advisory: str
    data_provenance: str
