from pydantic import BaseModel
from typing import Optional, List

class PfzZoneBase(BaseModel):
    zone_code: str
    zone_name: str
    state: str
    base_harbor: str
    latitude: float
    longitude: float
    depth_m: int
    distance_nm: float
    bearing_deg: int
    sst_c: float
    chlorophyll_mg_m3: float
    potential_rating: str
    confidence_score: int
    target_species: str
    valid_until: str
    source_name: str
    data_provenance: str

class PfzResponse(BaseModel):
    system_time_ist: str
    total_zones: int
    prime_zones: int
    zones: List[PfzZoneBase]
