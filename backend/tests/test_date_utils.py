import pytest
from datetime import datetime, timezone, timedelta
from backend.app.services.date_utils import (
    IST,
    get_current_ist_datetime,
    get_current_ist_date_str,
    get_current_ist_time_str,
    get_current_ist_timestamp,
    get_iso_now,
    calculate_validity_window,
    is_date_expired,
)

def test_ist_timezone_offset():
    """Verify IST timezone is exactly UTC +5 hours and 30 minutes."""
    assert IST.utcoffset(None) == timedelta(hours=5, minutes=30)
    now_ist = get_current_ist_datetime()
    assert now_ist.tzinfo == IST

def test_dynamic_date_strings():
    """Verify generated date strings contain current year and valid formatting."""
    now_ist = get_current_ist_datetime()
    date_str = get_current_ist_date_str()
    time_str = get_current_ist_time_str()
    timestamp_str = get_current_ist_timestamp()

    assert str(now_ist.year) in date_str
    assert "IST" in time_str
    assert "IST" in timestamp_str
    assert "•" in timestamp_str

def test_validity_window():
    """Verify calculate_validity_window creates an interval ahead in time."""
    start_str, end_str = calculate_validity_window(hours_ahead=48)
    assert "IST" in start_str
    assert "IST" in end_str
    assert start_str != end_str

def test_is_date_expired():
    """Verify is_date_expired detects past dates and preserves future dates."""
    past_date = "01 Jan 2020 • 12:00 IST"
    future_date = "31 Dec 2035 • 23:59 IST"
    
    assert is_date_expired(past_date) is True
    assert is_date_expired(future_date) is False
    assert is_date_expired("invalid-date-format") is False
