from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from backend.app.database import Base

class PfzZone(Base):
    __tablename__ = "pfz_zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_code = Column(String(50), index=True)
    zone_name = Column(String(100))
    state = Column(String(50))
    base_harbor = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    depth_m = Column(Integer)
    distance_nm = Column(Float)
    bearing_deg = Column(Integer)
    sst_c = Column(Float)
    chlorophyll_mg_m3 = Column(Float)
    potential_rating = Column(String(20), default="PRIME")  # PRIME, HIGH, MODERATE
    confidence_score = Column(Integer, default=90)
    target_species = Column(String(200))
    valid_until = Column(String(50))
    source_name = Column(String(150), default="INCOIS Potential Fishing Zone (PFZ) Advisory")
    data_provenance = Column(String(20), default="LIVE")
