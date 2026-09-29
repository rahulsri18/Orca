import pytest
from backend.app.services.incois_service import IncoisService, INCOIS_PFZ_SECTORS
from backend.app.services.safe_route_service import SafeRouteService, haversine_nm

@pytest.mark.asyncio
async def test_incois_pfz_zones():
    """Verify PFZ advisories contain oceanographic parameters and dynamic timestamps."""
    zones = await IncoisService.get_active_pfz_zones()
    assert len(zones) == len(INCOIS_PFZ_SECTORS)
    for z in zones:
        assert "zone_code" in z
        assert "sst_c" in z
        assert "chlorophyll_mg_m3" in z
        assert "confidence_score" in z
        assert "target_species" in z
        assert "valid_until" in z
        assert "IST" in z["issued_at"]

def test_haversine_nautical_miles():
    """Verify nautical distance calculation between known coastal coordinates."""
    # Kochi (9.93, 76.26) to Munambam (10.18, 76.16) is approx 16-17 NM
    dist = haversine_nm(9.93, 76.26, 10.18, 76.16)
    assert 14.0 <= dist <= 19.0

def test_safe_route_analysis_normal_corridor():
    """Verify safe route calculation with waypoint generation and advisory."""
    res = SafeRouteService.analyze_route(
        origin_name="Kochi Harbor",
        origin_lat=9.93,
        origin_lng=76.26,
        dest_name="Munambam Fishing Point",
        dest_lat=10.18,
        dest_lng=76.16,
        vessel_type="Mechanized Trawler"
    )
    assert res["origin"] == "Kochi Harbor"
    assert res["destination"] == "Munambam Fishing Point"
    assert res["total_distance_nm"] > 0
    assert len(res["waypoints"]) == 6
    assert "advisory" in res
    assert res["risk_level"] in ["LOW", "MEDIUM", "HIGH", "SEVERE"]

def test_safe_route_hazard_detection():
    """Verify route intersecting active cyclonic alert area triggers severe risk."""
    res = SafeRouteService.analyze_route(
        origin_name="Paradip Offshore, Odisha",
        origin_lat=20.08,
        origin_lng=86.82,
        dest_name="Dhamra Port, Bay of Bengal",
        dest_lat=20.80,
        dest_lng=87.05
    )
    assert res["risk_level"] == "SEVERE"
    assert res["risk_score"] >= 90
    assert any("CRITICAL" in h for h in res["hazards_encountered"])
