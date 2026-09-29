import pytest
from unittest.mock import patch, MagicMock
from backend.app.services.marine_weather_service import MarineWeatherService, COASTAL_SECTORS

@pytest.mark.asyncio
async def test_all_coastal_sectors_definition():
    """Verify 12 Indian coastal sectors are fully defined with geographic coordinates."""
    assert len(COASTAL_SECTORS) == 12
    for s in COASTAL_SECTORS:
        assert "id" in s
        assert "name" in s
        assert "lat" in s
        assert "lon" in s
        assert "basin" in s

@pytest.mark.asyncio
async def test_fetch_all_sectors_telemetry_structure():
    """Verify marine telemetry structure, dynamic ranking, and risk scores."""
    result = await MarineWeatherService.fetch_all_sectors_telemetry()
    assert "system_time_ist" in result
    assert "sectors" in result
    assert len(result["sectors"]) == 12
    assert "most_riskiest_sector" in result
    
    # Check fields in each sector
    for sec in result["sectors"]:
        assert "sector_id" in sec
        assert "wave_height_m" in sec
        assert "wind_speed_kt" in sec
        assert "risk_score" in sec
        assert 0 <= sec["risk_score"] <= 100
        assert sec["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
        assert "status_notice" in sec

    # Verify descending sort order for risk scores
    scores = [s["risk_score"] for s in result["sectors"]]
    assert scores == sorted(scores, reverse=True)
    assert result["most_riskiest_sector"]["sector_id"] == result["sectors"][0]["sector_id"]

@pytest.mark.asyncio
async def test_marine_service_fallback_on_network_failure():
    """Verify marine service falls back safely when upstream APIs fail."""
    with patch("httpx.AsyncClient.get", side_effect=Exception("Timeout")):
        result = await MarineWeatherService.fetch_all_sectors_telemetry()
        assert len(result["sectors"]) == 12
        assert result["data_freshness"] == "CACHED"
