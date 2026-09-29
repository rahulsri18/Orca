from datetime import datetime, timezone, timedelta
from typing import Tuple

IST = timezone(timedelta(hours=5, minutes=30))

def get_current_ist_datetime() -> datetime:
    """Returns current real datetime in Indian Standard Time (IST)."""
    return datetime.now(IST)

def get_current_ist_date_str() -> str:
    """Format: '28 Sep 2026' or dynamic today's date."""
    now = get_current_ist_datetime()
    return now.strftime("%d %b %Y")

def get_current_ist_time_str() -> str:
    """Format: '19:45:00 IST'."""
    now = get_current_ist_datetime()
    return now.strftime("%H:%M:%S IST")

def get_current_ist_timestamp() -> str:
    """Format: '28 Sep 2026 • 19:45 IST'."""
    now = get_current_ist_datetime()
    return now.strftime("%d %b %Y • %H:%M IST")

def get_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()

def calculate_validity_window(hours_ahead: int = 24) -> Tuple[str, str]:
    now = get_current_ist_datetime()
    start_str = now.strftime("%d %b %Y • %H:%M IST")
    end = now + timedelta(hours=hours_ahead)
    end_str = end.strftime("%d %b %Y • %H:%M IST")
    return start_str, end_str

def is_date_expired(date_str: str) -> bool:
    """Checks if a date string in format '%d %b %Y' or ISO is in the past."""
    try:
        now = get_current_ist_datetime()
        for fmt in ("%d %b %Y", "%d %b %Y • %H:%M IST", "%Y-%m-%d", "%Y-%m-%dT%H:%M:%S"):
            try:
                parsed = datetime.strptime(date_str.split("•")[0].strip(), fmt)
                if parsed.date() < now.date():
                    return True
                return False
            except ValueError:
                continue
    except Exception:
        pass
    return False
