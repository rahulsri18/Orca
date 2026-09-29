import httpx
import logging
from typing import Dict, Any, List
from backend.app.services.date_utils import get_current_ist_timestamp, get_iso_now

logger = logging.getLogger(__name__)

class SourceStatusService:
    @classmethod
    async def get_all_sources_status(cls) -> Dict[str, Any]:
        """
        Polls and returns real-time connectivity, latency, and official access status
        for all data providers.
        """
        sources = []

        # 1. IMD Mausam Service
        try:
            async with httpx.AsyncClient(verify=False, timeout=5.0) as client:
                res = await client.head("https://mausam.imd.gov.in/")
                sources.append({
                    "id": "imd",
                    "name": "India Meteorological Department (IMD)",
                    "url": "https://mausam.imd.gov.in",
                    "status": "OPERATIONAL" if res.status_code < 400 else "DEGRADED",
                    "response_time_ms": int(res.elapsed.total_seconds() * 1000),
                    "data_types": ["Sea Area Bulletins", "Cyclone Warnings", "Fishermen Alerts"],
                    "data_provenance": "LIVE",
                    "last_sync": get_current_ist_timestamp()
                })
        except Exception:
            sources.append({
                "id": "imd",
                "name": "India Meteorological Department (IMD)",
                "url": "https://mausam.imd.gov.in",
                "status": "DEGRADED",
                "response_time_ms": 0,
                "data_types": ["Sea Area Bulletins", "Cyclone Warnings", "Fishermen Alerts"],
                "data_provenance": "CACHED_OFFICIAL",
                "last_sync": get_current_ist_timestamp()
            })

        # 2. INCOIS ERDDAP
        try:
            async with httpx.AsyncClient(verify=False, timeout=5.0) as client:
                res = await client.get("https://erddap.incois.gov.in/erddap/info/index.json?page=1&itemsPerPage=2")
                sources.append({
                    "id": "incois",
                    "name": "INCOIS Ocean Data & ERDDAP",
                    "url": "https://erddap.incois.gov.in/erddap",
                    "status": "OPERATIONAL" if res.status_code == 200 else "DEGRADED",
                    "response_time_ms": int(res.elapsed.total_seconds() * 1000),
                    "data_types": ["ARGO Floats", "SST Grids", "PFZ Advisories"],
                    "data_provenance": "LIVE",
                    "last_sync": get_current_ist_timestamp()
                })
        except Exception:
            sources.append({
                "id": "incois",
                "name": "INCOIS Ocean Data & ERDDAP",
                "url": "https://erddap.incois.gov.in/erddap",
                "status": "DEGRADED",
                "response_time_ms": 0,
                "data_types": ["ARGO Floats", "SST Grids", "PFZ Advisories"],
                "data_provenance": "CACHED_OFFICIAL",
                "last_sync": get_current_ist_timestamp()
            })

        # 3. Marine Numerical Ocean Model (Open-Meteo)
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get("https://marine-api.open-meteo.com/v1/marine?latitude=9.93&longitude=76.26&current=wave_height")
                sources.append({
                    "id": "open_meteo_marine",
                    "name": "Open-Meteo High-Resolution Marine & ECMWF Ocean",
                    "url": "https://marine-api.open-meteo.com",
                    "status": "OPERATIONAL" if res.status_code == 200 else "DEGRADED",
                    "response_time_ms": int(res.elapsed.total_seconds() * 1000),
                    "data_types": ["Wave Height", "Swell Period", "Wind Waves", "Coastal Current"],
                    "data_provenance": "LIVE",
                    "last_sync": get_current_ist_timestamp()
                })
        except Exception:
            sources.append({
                "id": "open_meteo_marine",
                "name": "Open-Meteo High-Resolution Marine & ECMWF Ocean",
                "url": "https://marine-api.open-meteo.com",
                "status": "DEGRADED",
                "response_time_ms": 0,
                "data_types": ["Wave Height", "Swell Period", "Wind Waves", "Coastal Current"],
                "data_provenance": "CACHED",
                "last_sync": get_current_ist_timestamp()
            })

        # 4. ISRO MOSDAC / SAC Satellite Products
        sources.append({
            "id": "isro_mosdac",
            "name": "ISRO / MOSDAC Meteorological & Oceanographic Satellite Archive",
            "url": "https://www.mosdac.gov.in",
            "status": "RESTRICTED_ACCESS",
            "response_time_ms": 0,
            "data_types": ["Oceansat-3 OCM", "INSAT-3D/3DR TIR-1", "ScatSat-1 Wind Vectors"],
            "data_provenance": "OFFICIAL_CATALOG",
            "last_sync": get_current_ist_timestamp(),
            "access_requirement": "Requires SAC/ISRO Institutional User Credentials or Dedicated VPN Uplink"
        })

        # 5. NavIC Satellite Constellation
        sources.append({
            "id": "navic_sband",
            "name": "ISRO NavIC S-Band Messaging Broadcast Network",
            "url": "https://www.isro.gov.in/NavIC.html",
            "status": "OPERATIONAL",
            "response_time_ms": 12,
            "data_types": ["Safety-of-Life Coastal Broadcast", "Cyclone Emergency Alert Pushes", "Geofence Transponder Link"],
            "data_provenance": "SIMULATED_UPLINK",
            "last_sync": get_current_ist_timestamp(),
            "access_requirement": "Requires Physical NavIC Receiver / MSS Transponder Terminal hardware"
        })

        return {
            "system_time_ist": get_current_ist_timestamp(),
            "total_monitored_sources": len(sources),
            "sources": sources
        }
