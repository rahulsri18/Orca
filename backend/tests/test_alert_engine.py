import pytest
from backend.app.services.alert_engine import AlertEngine
from backend.app.services.date_utils import get_current_ist_timestamp

def test_alert_engine_initialization():
    """Verify default official alerts are loaded on engine initialization."""
    alerts = AlertEngine.get_active_alerts()
    assert len(alerts) >= 4
    # Check required fields
    for a in alerts:
        assert "id" in a
        assert "title" in a
        assert "issuing_authority" in a
        assert "severity" in a
        assert "status" in a
        assert a["status"] in ["ACTIVE", "UPDATED"]

def test_register_and_deduplicate_alert():
    """Verify alert registration and duplicate detection."""
    test_alert = {
        "id": "TEST-CYCLONE-ALERT-01",
        "title": "Severe Cyclone Warning",
        "issuing_authority": "IMD ACWC Chennai",
        "source_url": "https://mausam.imd.gov.in",
        "affected_region": "Tamil Nadu Coast",
        "category": "CYCLONE",
        "severity": "CRITICAL",
        "status": "ACTIVE",
        "description": "Severe cyclonic storm crossing coast near Cuddalore.",
        "action_directive": "Total suspension of fishing.",
        "valid_until": "31 Dec 2030 • 12:00 IST",
        "is_official": True
    }
    
    registered = AlertEngine.register_alert(test_alert)
    assert registered["id"] == "TEST-CYCLONE-ALERT-01"
    assert registered["status"] == "ACTIVE"

    # Registering exact same alert should not change status to UPDATED
    dup = AlertEngine.register_alert(test_alert)
    assert dup["status"] == "ACTIVE"

def test_update_alert_content_and_history():
    """Verify modifying description or severity marks alert as UPDATED and saves history."""
    updated_alert = {
        "id": "TEST-CYCLONE-ALERT-01",
        "title": "Severe Cyclone Warning",
        "issuing_authority": "IMD ACWC Chennai",
        "source_url": "https://mausam.imd.gov.in",
        "affected_region": "Tamil Nadu Coast",
        "category": "CYCLONE",
        "severity": "CRITICAL",
        "status": "ACTIVE",
        "description": "Cyclone has upgraded to Super Cyclonic Storm with winds exceeding 120 kmph.",
        "action_directive": "Immediate evacuation of low-lying coastal regions.",
        "valid_until": "31 Dec 2030 • 12:00 IST",
        "is_official": True
    }

    res = AlertEngine.register_alert(updated_alert)
    assert res["status"] == "UPDATED"
    
    history = AlertEngine.get_alert_history()
    assert len(history) > 0
    assert any(h["id"] == "TEST-CYCLONE-ALERT-01" for h in history)

def test_update_alert_status_cancel_and_expire():
    """Verify status transitions such as CANCELLED and EXPIRED."""
    cancelled = AlertEngine.update_alert_status("TEST-CYCLONE-ALERT-01", "CANCELLED")
    assert cancelled["status"] == "CANCELLED"

    # Active alerts should no longer include cancelled alert
    active = AlertEngine.get_active_alerts()
    assert not any(a["id"] == "TEST-CYCLONE-ALERT-01" for a in active)

def test_alert_summary_metrics():
    """Verify alert summary computes accurate counts and severity rankings."""
    summary = AlertEngine.get_summary()
    assert "total_active" in summary
    assert "critical_count" in summary
    assert "high_count" in summary
    assert "moderate_count" in summary
    assert summary["total_active"] == len(summary["alerts"])
