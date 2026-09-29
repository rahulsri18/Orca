import asyncio
import logging
from datetime import datetime
from backend.app.config import settings
from backend.app.services.date_utils import get_current_ist_timestamp
from backend.app.services.marine_weather_service import MarineWeatherService
from backend.app.services.imd_service import ImdService
from backend.app.services.alert_engine import AlertEngine

logger = logging.getLogger(__name__)

class DataRefreshScheduler:
    _is_running = False
    _is_refreshing = False
    _last_refresh_time = None
    _refresh_count = 0

    @classmethod
    async def run_refresh_cycle(cls):
        """Executes one data refresh cycle with error isolation and backoff."""
        if cls._is_refreshing:
            logger.info("Refresh cycle already in progress, skipping duplicate run.")
            return

        cls._is_refreshing = True
        logger.info(f"Starting scheduled marine data refresh cycle #{cls._refresh_count + 1}...")

        try:
            # 1. Refresh live marine wave/wind telemetry for all 12 sectors
            await MarineWeatherService.fetch_all_sectors_telemetry()
            
            # 2. Refresh IMD bulletins
            bob_bulletin = await ImdService.fetch_sea_area_bulletin(1)
            arabian_bulletin = await ImdService.fetch_sea_area_bulletin(2)

            # 3. Synchronize new warnings into central alert engine
            if bob_bulletin.get("warning") and len(bob_bulletin["warning"]) > 10:
                AlertEngine.register_alert({
                    "id": "IMD-LIVE-BOB",
                    "title": f"IMD BAY OF BENGAL: {bob_bulletin['warning'][:60]}...",
                    "issuing_authority": "India Meteorological Department (ACWC Kolkata)",
                    "source_url": bob_bulletin["source_url"],
                    "affected_region": "Bay of Bengal Coastal Sectors",
                    "category": "WEATHER_WARNING",
                    "severity": "CRITICAL" if "depression" in bob_bulletin["warning"].lower() or "cyclone" in bob_bulletin["warning"].lower() else "HIGH",
                    "status": "ACTIVE",
                    "issue_time": bob_bulletin["issue_time"],
                    "valid_from": bob_bulletin["validity_period"].split("to")[0].strip() if "to" in bob_bulletin["validity_period"] else "",
                    "valid_until": bob_bulletin["validity_period"].split("to")[1].strip() if "to" in bob_bulletin["validity_period"] else "",
                    "description": bob_bulletin["synoptic_situation"] or bob_bulletin["warning"],
                    "action_directive": "Fishermen operating in northern and central Bay of Bengal advised to return to shelter harbor immediately.",
                    "is_official": True,
                    "data_provenance": bob_bulletin.get("data_provenance", "LIVE")
                })

            cls._last_refresh_time = get_current_ist_timestamp()
            cls._refresh_count += 1
            logger.info(f"Marine data refresh cycle #{cls._refresh_count} successfully completed at {cls._last_refresh_time}.")

        except Exception as e:
            logger.error(f"Error during marine data refresh cycle: {e}")
        finally:
            cls._is_refreshing = False

    @classmethod
    async def start_background_loop(cls):
        """Starts asynchronous background worker loop."""
        cls._is_running = True
        logger.info(f"DataRefreshScheduler started (interval: {settings.DATA_REFRESH_INTERVAL_SECONDS}s).")
        
        # Immediate first cycle
        await cls.run_refresh_cycle()

        while cls._is_running:
            try:
                await asyncio.sleep(settings.DATA_REFRESH_INTERVAL_SECONDS)
                if cls._is_running:
                    await cls.run_refresh_cycle()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Scheduler loop error: {e}")
                await asyncio.sleep(10)

    @classmethod
    def stop(cls):
        cls._is_running = False

    @classmethod
    def get_status(cls):
        return {
            "is_running": cls._is_running,
            "last_refresh_ist": cls._last_refresh_time or "Initializing...",
            "refresh_count": cls._refresh_count,
            "refresh_interval_seconds": settings.DATA_REFRESH_INTERVAL_SECONDS
        }
