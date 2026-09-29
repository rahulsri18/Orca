import pytest
from unittest.mock import patch, MagicMock
from backend.app.services.imd_service import ImdService

def test_clean_html_text():
    """Verify HTML tags and excessive whitespaces are properly stripped."""
    raw_html = "<tr><td><b>TTT Warning:</b></td><td>Squally &nbsp; winds 45-55 kmph.</td></tr>"
    cleaned = ImdService._clean_text(raw_html)
    assert "<b>" not in cleaned
    assert "Squally winds 45-55 kmph." in cleaned

@pytest.mark.asyncio
async def test_rsmc_cyclone_outlook_structure():
    """Verify RSMC Cyclone Outlook returns all required parameters and dynamic timestamps."""
    outlook = await ImdService.fetch_rsmc_cyclone_outlook()
    assert "title" in outlook
    assert "cyclone_status" in outlook
    assert "cyclone_risk_level" in outlook
    assert "fishermen_warning" in outlook
    assert "validity_period" in outlook
    assert "IST" in outlook["issue_time"]

@pytest.mark.asyncio
async def test_fetch_sea_area_bulletin_fallback():
    """Verify that when external IMD server fails, verified fallback is gracefully returned."""
    with patch("httpx.AsyncClient.get", side_effect=Exception("Connection timed out")):
        res = await ImdService.fetch_sea_area_bulletin(basin_id=1)
        assert res["basin_id"] == 1
        assert "Bay of Bengal" in res["basin_name"]
        assert res["data_provenance"] == "CACHED_OFFICIAL"
        assert len(res["sectors"]) > 0
        assert "warning" in res

@pytest.mark.asyncio
async def test_fetch_sea_area_bulletin_mock_html():
    """Verify parsing when HTML response is received from IMD portal."""
    mock_html = """
    <html>
        <table>
            <tr><td>Time of Issue: 28 Sep 2026 18:00 IST</td></tr>
            <tr><td>TTT Warning: Gale wind speed reaching 55 kmph over Southwest Bay.</td></tr>
            <tr><td>Synoptic Situation: Cyclonic circulation over Westcentral Bay.</td></tr>
            <tr><td>Wind: Southerly 20 kts</td></tr>
            <tr><td>Weather: Heavy Rain</td></tr>
            <tr><td>Visibility: Moderate</td></tr>
            <tr><td>Sea Condition: Rough</td></tr>
        </table>
    </html>
    """
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.text = mock_html

    with patch("httpx.AsyncClient.get", return_value=mock_resp):
        res = await ImdService.fetch_sea_area_bulletin(basin_id=1)
        assert res["data_provenance"] == "LIVE"
        assert "Gale wind speed" in res["warning"]
        assert "Cyclonic circulation" in res["synoptic_situation"]
        assert len(res["sectors"]) >= 1
        assert res["sectors"][0]["sea"] == "Rough"
