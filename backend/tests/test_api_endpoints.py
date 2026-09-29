import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_system_health():
    response = client.get("/api/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "system_time_ist" in data
    assert "scheduler" in data

def test_system_time():
    response = client.get("/api/system/time")
    assert response.status_code == 200
    data = response.json()
    assert "date_str" in data
    assert "time_str" in data
    assert "timestamp_ist" in data
    assert "Asia/Kolkata" in data["timezone"]

def test_system_sources():
    response = client.get("/api/system/sources")
    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert data["total_monitored_sources"] >= 4
    source_ids = [s["id"] for s in data["sources"]]
    assert "imd" in source_ids
    assert "incois" in source_ids
    assert "isro_mosdac" in source_ids

def test_get_active_alerts():
    response = client.get("/api/alerts/active")
    assert response.status_code == 200
    alerts = response.json()
    assert isinstance(alerts, list)
    assert len(alerts) >= 1
    assert "id" in alerts[0]
    assert "severity" in alerts[0]

def test_get_alerts_summary():
    response = client.get("/api/alerts/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_active" in data
    assert "critical_count" in data
    assert "alerts" in data

def test_create_and_update_alert():
    new_alert = {
        "id": "API-TEST-ALERT",
        "title": "Squall Surge in Gulf of Mannar",
        "issuing_authority": "IMD ACWC Chennai",
        "source_url": "https://mausam.imd.gov.in",
        "affected_region": "Gulf of Mannar",
        "category": "WIND_GALE",
        "severity": "HIGH",
        "status": "ACTIVE",
        "issue_time": "28 Sep 2026 • 20:00 IST",
        "valid_from": "28 Sep 2026 • 20:00 IST",
        "valid_until": "29 Sep 2026 • 20:00 IST",
        "description": "High wind squalls 45-55 kmph.",
        "action_directive": "Avoid inshore netting.",
        "is_official": True,
        "data_provenance": "LIVE"
    }
    create_res = client.post("/api/alerts/create", json=new_alert)
    assert create_res.status_code == 200
    assert create_res.json()["id"] == "API-TEST-ALERT"

    # Status update
    update_res = client.put("/api/alerts/API-TEST-ALERT/status?status=CANCELLED")
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "CANCELLED"

def test_get_marine_current():
    response = client.get("/api/marine/current")
    assert response.status_code == 200
    data = response.json()
    assert "system_time_ist" in data
    assert "sectors" in data
    assert len(data["sectors"]) == 12
    assert "most_riskiest_sector" in data

def test_get_daily_bulletin():
    response = client.get("/api/bulletins/daily?port=Kochi Fishing Harbor")
    assert response.status_code == 200
    data = response.json()
    assert "system_date_ist" in data
    assert "rsmc_bulletin" in data
    assert "bay_of_bengal_bulletin" in data
    assert "arabian_sea_bulletin" in data
    assert "safe_harbors" in data

def test_get_active_pfz():
    response = client.get("/api/pfz/active")
    assert response.status_code == 200
    data = response.json()
    assert "zones" in data
    assert isinstance(data["zones"], list)
    assert len(data["zones"]) >= 4
    assert "chlorophyll_mg_m3" in data["zones"][0]

def test_analyze_route():
    payload = {
        "origin_name": "Kochi Harbor",
        "origin_lat": 9.93,
        "origin_lng": 76.26,
        "destination_name": "Munambam",
        "destination_lat": 10.18,
        "destination_lng": 76.16,
        "vessel_type": "Mechanized Trawler",
        "vessel_draft_m": 2.5
    }
    response = client.post("/api/routes/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["origin"] == "Kochi Harbor"
    assert data["total_distance_nm"] > 0
    assert "waypoints" in data
    assert "risk_level" in data

def test_ai_query():
    payload = {
        "query": "What are current wave conditions near Kochi?",
        "user_location": "Kochi, Kerala",
        "coordinates": [9.93, 76.26],
        "language": "en"
    }
    response = client.post("/api/ai/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "synthesized_answer" in data
    assert "agent_findings" in data
    assert len(data["agent_findings"]) == 7
    assert "evidence_sources" in data
    assert "disclaimer" in data

def test_satellite_products():
    response = client.get("/api/satellite/products")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert len(data["products"]) >= 3
    assert "access_classification" in data
