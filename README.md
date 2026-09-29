# ORCA 2.0 • Oceanic Risk Calculation & Advisory Platform

> **Theme:** Disaster Management  
> **Organization:** ISRO / INCOIS Collaboration  
> **Project Title:** ORCA (Oceanic Risk Calculation & Advisory)  

---

## 🌊 Overview

**ORCA 2.0** is an enterprise-grade full-stack marine intelligence and coastal disaster management platform designed to protect maritime lives, artisanal fishermen, and commercial navigation across the Indian Ocean, Arabian Sea, and Bay of Bengal.

The platform bridges real-time oceanographic and atmospheric data from official government agencies—including the **India Meteorological Department (IMD)**, the **Indian National Centre for Ocean Information Services (INCOIS)**, and **ISRO Earth Observation satellites**—delivering actionable risk intelligence, dynamic weather bulletins, automated alert lifecycles, and multi-agent AI navigational guidance.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Data Sources
        IMD[IMD Sea Area Bulletins & RSMC]
        INCOIS[INCOIS ERDDAP & PFZ Advisories]
        ECMWF[Open-Meteo Marine / ECMWF Wave Model]
        SAT[ISRO Oceansat-3 & NavIC Constellation]
    end

    subgraph ORCA Backend (Python FastAPI)
        SCHED[Background Data Refresh Scheduler]
        ENGINE[Central Live Alert Engine]
        ROUTER[Safe Nautical Route Engine]
        COORDINATOR[7-Agent ORCA AI Coordinator]
        DB[(SQLite / PostgreSQL)]
    end

    subgraph ORCA Frontend (React + Vite + Tailwind/Glass)
        DASH[Maritime Dashboard]
        ALERTS[Live Alert Central]
        GIS[Thermal GIS Ocean Map]
        PFZ_UI[PFZ Advisory Explorer]
        ROUTES_UI[Nautical Route Risk Analyzer]
        BULLETIN_UI[Daily Marine Bulletin]
        CHAT_UI[Multi-Agent AI Assistant]
    end

    IMD --> SCHED
    INCOIS --> SCHED
    ECMWF --> SCHED
    SAT --> SCHED

    SCHED --> ENGINE
    SCHED --> DB
    ENGINE --> DB
    ROUTER --> DB
    COORDINATOR --> DB

    DB --> DASH
    ENGINE --> ALERTS
    DB --> GIS
    DB --> PFZ_UI
    ROUTER --> ROUTES_UI
    DB --> BULLETIN_UI
    COORDINATOR --> CHAT_UI
```

---

## ⚡ Key Capabilities & Implemented Modules

### 1. Dynamic System Clock & IST Timestamp Separation
- **Elimination of Hardcoded Dates:** Completely eradicated outdated static dates (e.g., `27 Sep 2026`) across all dashboards, bulletins, telemetry charts, and map layers.
- **Dynamic Clock:** Real-time Indian Standard Time (`Asia/Kolkata`, UTC+5:30) system clock with second-by-second updates.
- **Strict Timestamp Provenance:** Distinctly isolates:
  1. *Current System Time* (`timestamp_ist`)
  2. *Data Ingest Retrieval Time* (`retrieval_time`)
  3. *Official Issuing Authority Time* (`issue_time`)
  4. *Forecast Validity Window* (`valid_from` to `valid_until`)

### 2. Central Live Alert Engine
- **Lifecycle State Machine:** Automatically transitions alerts between `ACTIVE`, `UPDATED`, `EXPIRED`, and `CANCELLED`.
- **Deduplication:** Uses official identifiers (`IMD-RED-DEPR-BOB`, `INCOIS-SWL-KER-01`) and hash-based fingerprinting to eliminate duplicate notifications.
- **Dynamic Expiration:** Automatically detects when alert validity has lapsed and moves alerts to history without requiring a server reboot.
- **In-App Notification Stream:** Centralized polling and real-time banner alerts.

### 3. Official Marine Data Integration
- **IMD Sea Area Bulletins:** Live scraper and parser for Bay of Bengal (ACWC Kolkata, Basin #1) and Arabian Sea (ACWC Mumbai, Basin #2). Extracts synoptic situations, sea condition ratings, wind Beaufort vectors, and gale warnings.
- **IMD RSMC Cyclone Outlook:** Real-time synoptic tracking of low pressure systems, depressions, and cyclogenesis probabilities.
- **INCOIS PFZ Advisories:** Potential Fishing Zones with Sea Surface Temperature (SST), Chlorophyll-a concentrations ($mg/m^3$), bearing, and target pelagic fish species.
- **High-Resolution Ocean Telemetry:** Live wave height ($H_s$), swell period, wind speed, pressure, and risk scoring across all 12 coastal sectors of peninsular India.

### 4. 7-Agent ORCA AI Coordinator
When users inquire about voyage feasibility (e.g., *"Is it safe to fish near Kochi tomorrow?"*), 7 specialized agents collaborate:
1. **Planner Agent:** Decomposes nautical query, coordinates target sector, and maps operational criteria.
2. **Weather Agent:** Evaluates IMD barometric pressure, wind gusts, and synoptic cyclonic trends.
3. **Ocean Agent:** Evaluates significant wave height, primary swell surge, and SST.
4. **PFZ Agent:** Evaluates bio-optical plumes, distance offshore, and target fishery potential.
5. **GIS Agent:** Verifies EEZ boundaries, bathymetric draft clearance, and marine sanctuary buffers.
6. **Risk Agent:** Computes composite quantitative hazard index (0-100) and assigns warning tier.
7. **Decision Agent:** Synthesizes actionable operational directive adhering to safety standards.

### 5. Safe Route Calculation Engine
- Computes Great Circle Haversine nautical distance (in Nautical Miles).
- Interpolates intermediate navigational waypoints.
- Scans route corridors against active IMD cyclonic danger cones and INCOIS Kallakkadal surge warnings.
- Computes estimated transit duration based on vessel type and draft limits.

---

## 📡 Official Data Source Integration Matrix

| Data Provider | Data Products | Integration Status | Data Provenance | Access Requirements |
| :--- | :--- | :---: | :---: | :--- |
| **IMD Mausam** | Sea Area Bulletins (BoB & Arabian Sea), RSMC Tropical Cyclone Outlook | **OPERATIONAL (LIVE)** | `LIVE` | Public HTTP Endpoints |
| **INCOIS ERDDAP** | Moored Buoy Network, ARGO Floats, Sea Surface Temperature | **OPERATIONAL (LIVE)** | `LIVE` / `CACHED` | Public ERDDAP Portal |
| **INCOIS Multilingual** | Potential Fishing Zones (PFZ) & Chlorophyll Plumes | **OPERATIONAL (LIVE)** | `LIVE` | Official PFZ Bulletin Feeds |
| **Open-Meteo / ECMWF** | 12-Sector Marine Wave, Swell, and Surface Wind vectors | **OPERATIONAL (LIVE)** | `LIVE` | Public High-Res API |
| **ISRO MOSDAC / SAC** | Oceansat-3 OCM & INSAT-3D/3DR Earth Observation Products | **CATALOG RECOGNIZED** | `OFFICIAL_CATALOG` | Requires SAC/ISRO Institutional User Credentials or VPN Uplink |
| **NavIC S-Band** | Emergency Safety-of-Life Coastal Broadcast System | **SIMULATED UPLINK** | `SIMULATED_UPLINK` | Requires Physical NavIC Receiver / MSS Transponder Terminal |

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18.0 or later) & **npm**
- **Python** (v3.10 or later, Python 3.14 compatible)
- **Git**

---

### Step 1: Clone and Configure Environment

```bash
git clone https://github.com/rahulsri18/Orca.git
cd Orca

# Copy environment configuration
cp .env.example .env
```

Review `.env` and configure optional keys (e.g., `GEMINI_API_KEY` for natural language conversational enhancement).

---

### Step 2: Backend Setup & Execution

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations and start FastAPI server
python app/main.py
```
*The FastAPI backend will start on `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

---

### Step 3: Frontend Setup & Execution

Open a new terminal window in the project root:

```bash
# Install frontend dependencies
npm install

# Start Vite development server (proxies /api to http://localhost:8000)
npm run dev
```
*The frontend will launch at `http://localhost:5173`.*

---

### Step 4: Run the Complete Test Suite

The automated test suite verifies date conversions, HTML parsing, alert engine lifecycles, route hazards, multi-agent AI execution, and all API endpoints:

```bash
python -m pytest backend/tests/ -v
```

**Test Coverage:**
- `test_date_utils.py`: IST offset (+5:30), dynamic date strings, validity windows, past expiration.
- `test_alert_engine.py`: Alert creation, updates, status transitions (CANCELLED/EXPIRED), deduplication.
- `test_imd_service.py`: HTML bulletin table parsing, synoptic extraction, fallback resilience.
- `test_marine_weather_service.py`: 12 coastal sector telemetry, automated #1 riskiest sector ranking.
- `test_incois_safe_route.py`: PFZ zones, Haversine nautical distance (NM), waypoint generation, hazard alerts.
- `test_orca_ai_coordinator.py`: 7-agent coordinator, evidence gathering, safety disclaimers.
- `test_api_endpoints.py`: Full REST API suite (Health, Time, Sources, Marine, Alerts, Bulletins, Routes, AI).

---

## 🌐 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/system/health` | `GET` | Health check, uptime, and background scheduler status |
| `/api/system/time` | `GET` | Current IST system time and UTC ISO timestamps |
| `/api/system/sources` | `GET` | Operational reachability, latency, and access levels of all providers |
| `/api/alerts/active` | `GET` | All currently active official alerts (supports `?severity=` filter) |
| `/api/alerts/summary` | `GET` | Categorized alert count (Critical, High, Moderate) |
| `/api/alerts/create` | `POST` | Programmatically register new warning bulletin |
| `/api/alerts/{id}/status` | `PUT` | Update alert status (`CANCELLED`, `EXPIRED`, `ACTIVE`) |
| `/api/marine/current` | `GET` | 12-sector coastal telemetry, wave parameters, and riskiest sector |
| `/api/bulletins/daily` | `GET` | Comprehensive daily bulletin with IMD synoptic situation & safe harbors |
| `/api/pfz/active` | `GET` | Active INCOIS Potential Fishing Zones with SST & chlorophyll data |
| `/api/routes/analyze` | `POST` | Nautical corridor route risk, distance, waypoints, and weather hazards |
| `/api/ai/query` | `POST` | Multi-agent reasoning pipeline query with supporting evidence |
| `/api/satellite/products` | `GET` | Earth observation satellite inventory and access classifications |

---

## 🔒 Safety Disclaimer

> **IMPORTANT MARITIME SAFETY NOTICE:**  
> ORCA 2.0 generates advisories and risk estimations based on available numerical meteorological models, satellite observations, and official bulletins. Ocean weather and sea conditions are inherently chaotic and subject to rapid localized fluctuations.  
> **ORCA 2.0 does not guarantee 100% route safety, cyclone prevention, or fishing yield.** Masters, vessel skippers, and fishermen must strictly maintain continuous watch on **VHF Channel 16** and adhere to instructions from the **Indian Coast Guard (ICG)** and **State Coastal Police**.
