from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from backend.app.database import Base

class MarineObservation(Base):
    __tablename__ = "marine_observations"

    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(String(50), index=True)
    sector_name = Column(String(100))
    state = Column(String(50))
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Sea state parameters
    wave_height_m = Column(Float, default=1.2)
    swell_height_m = Column(Float, default=0.8)
    wind_wave_height_m = Column(Float, default=0.6)
    wave_period_s = Column(Float, default=7.5)
    wave_direction_deg = Column(Float, default=180.0)
    
    # Atmospheric / wind parameters
    wind_speed_kt = Column(Float, default=15.0)
    wind_direction_deg = Column(Float, default=270.0)
    wind_gusts_kt = Column(Float, default=20.0)
    surface_temp_c = Column(Float, default=28.5)
    surface_pressure_hpa = Column(Float, default=1008.0)
    
    # Calculated risk
    risk_score = Column(Integer, default=30)
    risk_level = Column(String(20), default="LOW")
    status_notice = Column(String(255))
    
    # Provenance and timestamps
    source_name = Column(String(100), default="Open-Meteo Marine / INCOIS Model")
    observation_time = Column(String(50))
    retrieval_time = Column(DateTime, default=datetime.utcnow)
    data_provenance = Column(String(20), default="LIVE")  # LIVE, HISTORICAL, DEMO, UNAVAILABLE
