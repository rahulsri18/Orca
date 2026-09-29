-- ==============================================================================
-- ORCA 2.0 Full-Stack Marine Intelligence Platform
-- Supabase PostgreSQL Schema Definition
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Marine Observations & Live Sector Telemetry
CREATE TABLE IF NOT EXISTS public.marine_observations (
    id SERIAL PRIMARY KEY,
    sector_id VARCHAR(50),
    sector_name VARCHAR(100),
    state VARCHAR(50),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    wave_height_m DOUBLE PRECISION DEFAULT 1.2,
    swell_height_m DOUBLE PRECISION DEFAULT 0.8,
    wind_wave_height_m DOUBLE PRECISION DEFAULT 0.6,
    wave_period_s DOUBLE PRECISION DEFAULT 7.5,
    wave_direction_deg DOUBLE PRECISION DEFAULT 180.0,
    wind_speed_kt DOUBLE PRECISION DEFAULT 15.0,
    wind_direction_deg DOUBLE PRECISION DEFAULT 270.0,
    wind_gusts_kt DOUBLE PRECISION DEFAULT 20.0,
    surface_temp_c DOUBLE PRECISION DEFAULT 28.5,
    surface_pressure_hpa DOUBLE PRECISION DEFAULT 1008.0,
    risk_score INTEGER DEFAULT 30,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    status_notice VARCHAR(255),
    source_name VARCHAR(100) DEFAULT 'Open-Meteo Marine / INCOIS Model',
    observation_time VARCHAR(50),
    retrieval_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    data_provenance VARCHAR(20) DEFAULT 'LIVE'
);

CREATE INDEX IF NOT EXISTS idx_marine_obs_sector_id ON public.marine_observations(sector_id);

-- 2. Marine Alerts & Warnings
CREATE TABLE IF NOT EXISTS public.alerts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(150) DEFAULT 'India Meteorological Department (IMD)',
    source_url VARCHAR(255),
    affected_region VARCHAR(150),
    category VARCHAR(50) DEFAULT 'WEATHER_WARNING',
    severity VARCHAR(20) DEFAULT 'HIGH',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    issue_time VARCHAR(50),
    valid_from VARCHAR(50),
    valid_until VARCHAR(50),
    retrieval_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    description TEXT,
    action_directive TEXT,
    is_official BOOLEAN DEFAULT TRUE,
    data_provenance VARCHAR(20) DEFAULT 'LIVE'
);

CREATE INDEX IF NOT EXISTS idx_alerts_region ON public.alerts(affected_region);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);

-- 3. Weather & Sea Area Bulletins
CREATE TABLE IF NOT EXISTS public.bulletins (
    id SERIAL PRIMARY KEY,
    bulletin_type VARCHAR(50),
    title VARCHAR(255),
    issuing_agency VARCHAR(150),
    issue_time VARCHAR(50),
    validity_period VARCHAR(100),
    retrieval_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    synoptic_situation TEXT,
    warnings TEXT,
    details_json TEXT,
    source_reference VARCHAR(255),
    data_provenance VARCHAR(20) DEFAULT 'LIVE'
);

CREATE INDEX IF NOT EXISTS idx_bulletins_type ON public.bulletins(bulletin_type);

-- 4. Potential Fishing Zones (PFZ)
CREATE TABLE IF NOT EXISTS public.pfz_zones (
    id SERIAL PRIMARY KEY,
    zone_code VARCHAR(50),
    zone_name VARCHAR(100),
    state VARCHAR(50),
    base_harbor VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    depth_m INTEGER,
    distance_nm DOUBLE PRECISION,
    bearing_deg INTEGER,
    sst_c DOUBLE PRECISION,
    chlorophyll_mg_m3 DOUBLE PRECISION,
    potential_rating VARCHAR(20) DEFAULT 'PRIME',
    confidence_score INTEGER DEFAULT 90,
    target_species VARCHAR(200),
    valid_until VARCHAR(50),
    source_name VARCHAR(150) DEFAULT 'INCOIS Potential Fishing Zone (PFZ) Advisory',
    data_provenance VARCHAR(20) DEFAULT 'LIVE'
);

CREATE INDEX IF NOT EXISTS idx_pfz_zone_code ON public.pfz_zones(zone_code);

-- 5. Data Refresh & Scheduler Logs
CREATE TABLE IF NOT EXISTS public.data_refresh_logs (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100),
    sync_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status VARCHAR(20) DEFAULT 'SUCCESS',
    records_updated INTEGER DEFAULT 0,
    response_time_ms INTEGER DEFAULT 0,
    message VARCHAR(255),
    provenance VARCHAR(20) DEFAULT 'LIVE'
);

CREATE INDEX IF NOT EXISTS idx_refresh_source ON public.data_refresh_logs(source_name);

-- Verification: List all created tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
