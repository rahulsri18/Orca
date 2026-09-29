from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.app.database import Base

class Bulletin(Base):
    __tablename__ = "bulletins"

    id = Column(Integer, primary_key=True, index=True)
    bulletin_type = Column(String(50), index=True)  # IMD_BOB, IMD_ARABIAN, RSMC_TROPICAL, DAILY_BULLETIN
    title = Column(String(255))
    issuing_agency = Column(String(150))
    issue_time = Column(String(50))
    validity_period = Column(String(100))
    retrieval_time = Column(DateTime, default=datetime.utcnow)
    
    synoptic_situation = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)
    details_json = Column(Text, nullable=True)
    source_reference = Column(String(255), nullable=True)
    data_provenance = Column(String(20), default="LIVE")  # LIVE, HISTORICAL, DEMO
