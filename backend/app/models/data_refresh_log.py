from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.app.database import Base

class DataRefreshLog(Base):
    __tablename__ = "data_refresh_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(100), index=True)
    sync_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="SUCCESS")  # SUCCESS, PARTIAL, FAILED
    records_updated = Column(Integer, default=0)
    response_time_ms = Column(Integer, default=0)
    message = Column(String(255), nullable=True)
    provenance = Column(String(20), default="LIVE")
