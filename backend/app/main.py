import asyncio
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.database import init_db
from backend.app.services.scheduler import DataRefreshScheduler
from backend.app.api.marine import router as marine_router
from backend.app.api.alerts import router as alerts_router
from backend.app.api.bulletins import router as bulletins_router
from backend.app.api.pfz import router as pfz_router
from backend.app.api.routes import router as routes_router
from backend.app.api.orca_ai import router as orca_ai_router
from backend.app.api.satellite import router as satellite_router
from backend.app.api.system import router as system_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database tables and start background refresh loop
    logger.info("Initializing ORCA 2.0 Database and Services...")
    try:
        init_db()
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Database init warning: {e}")

    # Launch background scheduler task
    scheduler_task = asyncio.create_task(DataRefreshScheduler.start_background_loop())
    
    yield

    # Shutdown
    logger.info("Shutting down ORCA 2.0 backend...")
    DataRefreshScheduler.stop()
    scheduler_task.cancel()
    try:
        await scheduler_task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-Stack Marine Intelligence Platform integrating official INCOIS & IMD data products for ISRO.",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits localhost dev & network testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "An internal error occurred in the ORCA marine intelligence service.",
            "path": request.url.path
        }
    )

# Include API Routers
app.include_router(marine_router)
app.include_router(alerts_router)
app.include_router(bulletins_router)
app.include_router(pfz_router)
app.include_router(routes_router)
app.include_router(orca_ai_router)
app.include_router(satellite_router)
app.include_router(system_router)

@app.get("/api")
async def api_root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "documentation": "/docs",
        "health": "/api/system/health"
    }

# Production: If static frontend build exists in dist/, serve it seamlessly from the root
dist_dir = Path(__file__).resolve().parent.parent.parent / "dist"
if dist_dir.exists() and (dist_dir / "index.html").exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "OPERATIONAL",
            "documentation": "/docs",
            "health": "/api/system/health"
        }
