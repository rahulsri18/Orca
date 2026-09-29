import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import List

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ORCA 2.0 - Oceanic Risk Calculation & Advisory"
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = "production"
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database (SQLite by default for zero-friction portability; PostgreSQL compatible)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./orca_marine.db")
    
    # Timeouts & Scheduling
    EXTERNAL_TIMEOUT_SECONDS: float = 12.0
    DATA_REFRESH_INTERVAL_SECONDS: int = 300  # 5 minutes
    STALE_THRESHOLD_HOURS: int = 6
    
    # AI Assistant configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or ""
    GEMINI_MODEL: str = "gemini-flash-latest"
    
    # Timezone & Geolocation
    TIMEZONE: str = "Asia/Kolkata"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
