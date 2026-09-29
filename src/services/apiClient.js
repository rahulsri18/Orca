/**
 * apiClient.js
 * Official API client connecting ORCA 2.0 frontend to the FastAPI backend.
 * Provides unified, verified access to live marine telemetry, IMD bulletins,
 * INCOIS PFZ zones, alert lifecycle management, and multi-agent AI query engine.
 */

const API_BASE_URL = ''; // Proxied via Vite to http://localhost:8000

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: options.signal || AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      throw new Error(`API ${endpoint} responded with HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[ORCA API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

// 1. Current Marine Telemetry
export async function getCurrentMarineConditions() {
  return await fetchApi('/api/marine/current');
}

// 2. Active Government Marine Hazards & Alerts
export async function getActiveAlerts(severity = null) {
  const query = severity ? `?severity=${encodeURIComponent(severity)}` : '';
  return await fetchApi(`/api/alerts/active${query}`);
}

export async function getAlertsSummary() {
  return await fetchApi('/api/alerts/summary');
}

// 3. Official Daily Marine Bulletins (IMD RSMC & Coastal ACWC)
export async function getDailyBulletin(port = 'Kochi Fishing Harbor, Kerala') {
  return await fetchApi(`/api/bulletins/daily?port=${encodeURIComponent(port)}`);
}

// 4. INCOIS Potential Fishing Zones (PFZ)
export async function getActivePfzZones() {
  return await fetchApi('/api/pfz/active');
}

// 5. Safe Nautical Routes
export async function analyzeRoute(routePayload) {
  return await fetchApi('/api/routes/analyze', {
    method: 'POST',
    body: JSON.stringify(routePayload)
  });
}

// 6. ORCA Multi-Agent AI
export async function queryOrcaAi(queryPayload) {
  return await fetchApi('/api/ai/query', {
    method: 'POST',
    body: JSON.stringify(queryPayload)
  });
}

// 7. Satellite Products & Earth Observation Status
export async function getSatelliteStatus() {
  return await fetchApi('/api/satellite/status');
}

// 8. Official Source Integration Status & Health
export async function getSourceStatus() {
  return await fetchApi('/api/system/sources');
}

// 9. Dynamic System Time (IST & UTC)
export async function getSystemTime() {
  return await fetchApi('/api/system/time');
}
