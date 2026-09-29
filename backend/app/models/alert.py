from sqlalchemy import Column, String, DateTime, Boolean, Text
from datetime import datetime
from backend.app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    issuing_authority = Column(String(150), default="India Meteorological Department (IMD)")
    source_url = Column(String(255), nullable=True)
    affected_region = Column(String(150), index=True)
    category = Column(String(50), default="WEATHER_WARNING")
    severity = Column(String(20), default="HIGH")  # CRITICAL, HIGH, MODERATE, LOW
    status = Column(String(20), default="ACTIVE")    # ACTIVE, UPDATED, CANCELLED, EXPIRED
    
    # Separate timestamps as strictly requested
    issue_time = Column(String(50))      # e.g., '2026-09-28 18:00 IST'
    valid_from = Column(String(50))
    valid_until = Column(String(50))
    retrieval_time = Column(DateTime, default=datetime.utcnow)
    
    description = Column(Text)
    action_directive = Column(Text)
    is_official = Column(Boolean, default=True)
    data_provenance = Column(String(20), default="LIVE")  # LIVE, HISTORICAL, DEMO, SIMULATED
