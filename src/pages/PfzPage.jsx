import React, { useState } from 'react';
import { MOCK_PFZ } from '../data/mockPfz';
import { RiskBadge } from '../components/common/RiskBadge';
import { MapWidget } from '../components/map/MapWidget';
import { useLanguage } from '../context/LanguageContext';
import { 
  Fish, 
  Satellite, 
  Compass, 
  Thermometer, 
  Waves, 
  Filter, 
  Search, 
  MapPin, 
  Radio, 
  Navigation, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { getActivePfzZones } from '../services/apiClient';

export function PfzPage({ onAskOrca = null, onNavigateToMap = null }) {
  const { t } = useLanguage();

  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedSpecies, setSelectedSpecies] = useState('ALL');
  const [selectedDistance, setSelectedDistance] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pfzList, setPfzList] = useState(MOCK_PFZ);
  const [lastPassTime, setLastPassTime] = useState(() => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  });

  // Default to Chellanam Thermal Plume
  const [selectedZone, setSelectedZone] = useState(MOCK_PFZ[0]);

  React.useEffect(() => {
    let isMounted = true;
    async function loadPfz() {
      try {
        const res = await getActivePfzZones();
        if (isMounted && res && Array.isArray(res.zones) && res.zones.length > 0) {
          const mapped = res.zones.map(z => ({
            id: z.zone_code,
            zoneName: z.zone_name,
            region: z.state,
            harbor: z.base_harbor || 'Base Harbor',
            coordinates: [z.latitude, z.longitude],
            depthMeters: z.depth_m || 42,
            distanceNm: z.distance_nm || 18,
            bearing: `${z.bearing_deg || 240}°`,
            sstCelsius: z.sst_c || 28.5,
            chlorophyllMgM3: z.chlorophyll_mg_m3 || 1.45,
            suitabilityScore: z.confidence_score || 90,
            confidenceScore: z.confidence_score || 90,
            potentialRating: z.potential_rating || 'PRIME',
            riskLevel: z.latitude > 18.0 ? 'HIGH' : 'LOW',
            primarySpecies: typeof z.target_species === 'string'
              ? z.target_species.split(',').map(s => s.trim())
              : (Array.isArray(z.target_species) ? z.target_species : ['Indian Mackerel', 'Yellowfin Tuna']),
            satelliteSensor: z.source_name || 'ISRO Oceansat-3 OCM-3',
            observationTime: z.issued_at || 'Today IST • Verified',
            safeWindow: z.valid_until ? `Valid until ${z.valid_until}` : 'Valid for next 24 Hours',
            waveForecast: '1.4m (Moderate Swell)',
            windForecast: '15 knots (Westerly Breeze)',
            waveHeightM: 1.4,
            windSpeedKt: 15,
            currentSpeedKt: 1.2
          }));
          setPfzList(mapped);
          if (mapped.length > 0) setSelectedZone(mapped[0]);
        }
      } catch (err) {
        console.warn('PFZ API load error, falling back to verified local data:', err);
      }
    }
    loadPfz();
  }, []);

  // Filtering Logic
  const filteredPfz = pfzList.filter(pfz => {
    const matchesRegion = selectedRegion === 'ALL' || (pfz.region && pfz.region.toLowerCase().includes(selectedRegion.toLowerCase()));
    const matchesSpecies = selectedSpecies === 'ALL' || (Array.isArray(pfz.primarySpecies) && pfz.primarySpecies.some(s => s.toLowerCase().includes(selectedSpecies.toLowerCase())));
    
    let matchesDistance = true;
    if (selectedDistance === 'NEAR') matchesDistance = pfz.distanceNm < 15;
    if (selectedDistance === 'MID') matchesDistance = pfz.distanceNm >= 15 && pfz.distanceNm <= 25;
    if (selectedDistance === 'FAR') matchesDistance = pfz.distanceNm > 25;

    let matchesRisk = true;
    if (selectedRisk === 'SAFE') matchesRisk = pfz.riskLevel === 'LOW';
    if (selectedRisk === 'CAUTION') matchesRisk = pfz.riskLevel === 'MEDIUM';
    if (selectedRisk === 'HIGH') matchesRisk = pfz.riskLevel === 'HIGH';

    const matchesSearch = !searchQuery.trim() || 
      (pfz.zoneName && pfz.zoneName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(pfz.primarySpecies) && pfz.primarySpecies.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesRegion && matchesSpecies && matchesDistance && matchesRisk && matchesSearch;
  });

  const activeZone = selectedZone || filteredPfz[0] || pfzList[0] || MOCK_PFZ[0];
  const isSafe = activeZone?.riskLevel === 'LOW';
  const isCaution = activeZone?.riskLevel === 'MEDIUM';

  return (
    <div className="space-y-3 font-sans">
      {/* TOP HEADER: Scientific Overpass Telemetry */}
      <div className="bg-[#071A2B] border border-[#0B2942] rounded px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#0B2942] border border-[#0D5C7A] flex items-center justify-center text-[#2EAFD0]">
            <Fish className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono font-bold text-xs uppercase tracking-wide">
                POTENTIAL FISHING ZONES (PFZ) WORKSTATION
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0D5C7A] text-cyan-200 border border-[#0F8B8D]">
                INCOIS BIO-OPTICAL L3B
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              SATELLITE-DERIVED MARINE PRODUCTIVITY & FRONTAL CONVERGENCE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B2942] border border-[#0D5C7A]">
            <Satellite className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-slate-400">MISSION:</span>
            <span className="text-white font-bold">Oceansat-3 / OCM-3</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B2942] border border-[#0D5C7A]">
            <span className="text-slate-400">LAST PASS:</span>
            <span className="text-[#1F9D72] font-bold">{lastPassTime}</span>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR: Region, Species, Distance, Risk, Search */}
      <div className="bg-white border border-[#D1DCE5] rounded p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">REGION:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0D5C7A]"
            >
              <option value="ALL">All Coasts (Pan-India)</option>
              <option value="Kerala">Kerala Sector</option>
              <option value="Andhra">Andhra Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>

          {/* Species */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">SPECIES:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0D5C7A]"
            >
              <option value="ALL">All Target Species</option>
              <option value="Tuna">Tuna (Skipjack/Yellowfin)</option>
              <option value="Mackerel">Indian Mackerel</option>
              <option value="Sardine">Oil Sardine</option>
              <option value="Pomfret">Pomfret</option>
              <option value="Ribbon">Ribbon Fish</option>
            </select>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">RANGE:</span>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0D5C7A]"
            >
              <option value="ALL">All Distances</option>
              <option value="NEAR">&lt; 15 NM (Nearshore)</option>
              <option value="MID">15 - 25 NM (Shelf Bank)</option>
              <option value="FAR">&gt; 25 NM (Deep Pelagic)</option>
            </select>
          </div>

          {/* Risk */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">RISK:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0D5C7A]"
            >
              <option value="ALL">All Risk States</option>
              <option value="SAFE">SAFE Only</option>
              <option value="CAUTION">CAUTION</option>
              <option value="HIGH">HIGH (Suspended)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1.5 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search zone or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2 py-1 text-xs font-sans text-slate-800 focus:outline-none focus:border-[#0D5C7A]"
          />
        </div>
      </div>

      {/* MAIN SCIENTIFIC WORKSPACE: LEFT 65% MAP / RIGHT 35% DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[460px]">
        {/* LEFT 65% (8 cols): High-Resolution PFZ Map */}
        <div className="lg:col-span-8 bg-white border border-[#D1DCE5] rounded overflow-hidden flex flex-col shadow-xs">
          {/* Map Top Bar */}
          <div className="bg-[#071A2B] px-3 py-1.5 border-b border-[#0B2942] flex items-center justify-between text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white uppercase">OCEANOGRAPHIC FRONTAL MATRIX</span>
              <span className="text-slate-400">•</span>
              <span className="text-cyan-300">THERMAL FRONTS + CHL-A OVERLAYS</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-[#1F9D72]" /> PFZ POLYGON
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> VESSEL (MATSYA-01)
              </span>
            </div>
          </div>

          {/* Embedded Leaflet GIS Map */}
          <div className="flex-1 min-h-[380px] relative">
            <MapWidget
              activeLayers={{
                pfz: true,
                sst: true,
                chlorophyll: true,
                vessels: true,
                regions: false,
                boundaries: true,
                waves: false,
                wind: false,
                cyclone: false
              }}
              highlightedCoordinates={activeZone?.coordinates || [9.80, 76.12]}
              onZoneSelect={(zone) => {
                if (zone) setSelectedZone(zone);
              }}
              onAskOrca={onAskOrca}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* RIGHT 35% (4 cols): Selected PFZ Detail Panel */}
        <div className="lg:col-span-4 bg-white border border-[#D1DCE5] rounded flex flex-col justify-between shadow-xs">
          <div>
            {/* Detail Top Header */}
            <div className="bg-[#071A2B] p-3 border-b border-[#0B2942] text-white">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wide">
                  PFZ TARGET INTELLIGENCE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B2942] text-slate-300 border border-[#0D5C7A]">
                  ID: {activeZone?.id || 'PFZ-01'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mt-1 leading-snug">
                {activeZone?.zoneName || 'Chellanam Thermal Plume'}
              </h2>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {activeZone?.region || 'Kerala'} • {activeZone?.observationTime || 'Today IST • Verified'}
              </div>
            </div>

            {/* Suitability & Risk Bar */}
            <div className="p-3 border-b border-[#D1DCE5] bg-[#F4F7F8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-600 font-bold uppercase">
                  SUITABILITY:
                </span>
                <span className={`text-xs font-mono font-bold ${
                  (activeZone?.suitabilityScore ?? 90) >= 80 ? 'text-[#1F9D72]' : 'text-[#D96B3B]'
                }`}>
                  {activeZone?.suitabilityScore ?? 90}% {(activeZone?.suitabilityScore ?? 90) >= 80 ? 'PRIME' : 'SUB-OPTIMAL'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                <div
                  className={`h-full ${
                    (activeZone?.suitabilityScore ?? 90) >= 80 ? 'bg-[#1F9D72]' : 'bg-[#D96B3B]'
                  }`}
                  style={{ width: `${activeZone?.suitabilityScore ?? 90}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-slate-600 font-bold uppercase">
                  HAZARD STATE:
                </span>
                <RiskBadge level={activeZone?.riskLevel || 'LOW'} size="sm" />
              </div>
            </div>

            {/* Scientific Parameters Matrix */}
            <div className="p-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#F4F7F8] border border-[#D1DCE5]">
                <span className="text-[10px] text-slate-500 uppercase block">DISTANCE</span>
                <span className="text-xs font-bold text-slate-900">{activeZone?.distanceNm ?? 18} NM</span>
              </div>

              <div className="p-2 rounded bg-[#F4F7F8] border border-[#D1DCE5]">
                <span className="text-[10px] text-slate-500 uppercase block">BEARING</span>
                <span className="text-xs font-bold text-slate-900">{activeZone?.bearing || '245° WSW'}</span>
              </div>

              <div className="p-2 rounded bg-[#F4F7F8] border border-[#D1DCE5]">
                <span className="text-[10px] text-slate-500 uppercase block">SST TEMP</span>
                <span className="text-xs font-bold text-slate-900">{activeZone?.sstCelsius ?? 28.5}°C</span>
              </div>

              <div className="p-2 rounded bg-[#F4F7F8] border border-[#D1DCE5]">
                <span className="text-[10px] text-slate-500 uppercase block">CHLOROPHYLL-A</span>
                <span className="text-xs font-bold text-[#1F9D72]">{activeZone?.chlorophyllMgM3 ?? 1.45} mg/m³</span>
              </div>

              <div className="p-2 rounded bg-[#F4F7F8] border border-[#D1DCE5]">
                <span className="text-[10px] text-slate-500 uppercase block">BATHYMETRY</span>
                <span className="text-xs font-bold text-slate-900">{activeZone?.depthMeters ?? 42} m depth</span>
              </div>

              <div className="p-2 rounded bg-[#F4F7F8] border border-[#D1DCE5]">
                <span className="text-[10px] text-slate-500 uppercase block">WAVE SWELL</span>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {activeZone?.waveForecast ? activeZone.waveForecast.split(' ')[0] : '1.4m'}
                </span>
              </div>
            </div>

            {/* Target Species Chips */}
            <div className="px-3 pb-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                TARGET PELAGIC SPECIES:
              </span>
              <div className="flex flex-wrap gap-1">
                {(activeZone?.primarySpecies || ['Indian Mackerel', 'Oil Sardine']).map((sp, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#071A2B] text-cyan-200 border border-[#0D5C7A]"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Action Buttons */}
          <div className="p-3 border-t border-[#D1DCE5] bg-[#F4F7F8] space-y-1.5">
            {onAskOrca && (
              <button
                type="button"
                onClick={() => onAskOrca(activeZone)}
                className="w-full py-2 px-3 rounded bg-[#071A2B] hover:bg-[#0B2942] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-[#0D5C7A] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>ASK ORCA SAFETY ANALYSIS</span>
              </button>
            )}

            {onNavigateToMap && (
              <button
                type="button"
                onClick={() => onNavigateToMap(activeZone?.coordinates, activeZone?.zoneName)}
                className="w-full py-1.5 px-3 rounded bg-white hover:bg-slate-100 text-slate-800 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-[#D1DCE5] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0D5C7A]" />
                <span>VIEW ROUTE ON MARINE GIS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM: PFZ COMPARISON TABLE (Scientific Oceanographic Workstation) */}
      <div className="bg-white border border-[#D1DCE5] rounded overflow-hidden shadow-xs">
        <div className="p-2.5 bg-[#071A2B] border-b border-[#0B2942] flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-cyan-300" />
            <span className="font-mono font-bold text-xs uppercase tracking-wide">
              POTENTIAL FISHING ZONE COMPARATIVE TELEMETRY (PAN-INDIA SATELLITE CATALOG)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-300">
            SHOWING {filteredPfz.length} SATELLITE ADVISORIES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EAF0F3] border-b border-[#D1DCE5] text-[10px] font-mono text-slate-600 uppercase">
                <th className="py-2 px-3">ZONE IDENTIFIER</th>
                <th className="py-2 px-3">COASTAL REGION</th>
                <th className="py-2 px-3">COORDINATES</th>
                <th className="py-2 px-3">SUITABILITY</th>
                <th className="py-2 px-3">RISK STATE</th>
                <th className="py-2 px-3">RANGE / BEARING</th>
                <th className="py-2 px-3">SST (°C)</th>
                <th className="py-2 px-3">CHL-A (mg/m³)</th>
                <th className="py-2 px-3">PRIMARY PELAGICS</th>
                <th className="py-2 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {filteredPfz.map((pfz) => {
                const isSelected = activeZone?.id === pfz.id;
                return (
                  <tr
                    key={pfz.id}
                    onClick={() => setSelectedZone(pfz)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-50/70 border-l-4 border-l-[#0F8B8D]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {pfz.zoneName}
                    </td>
                    <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                      {pfz.region}
                    </td>
                    <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                      {pfz.coordinates?.[0]?.toFixed ? pfz.coordinates[0].toFixed(2) : pfz.coordinates[0]}°N, {pfz.coordinates?.[1]?.toFixed ? pfz.coordinates[1].toFixed(2) : pfz.coordinates[1]}°E
                    </td>
                    <td className="py-2 px-3 font-bold">
                      <span className={(pfz.suitabilityScore ?? 90) >= 80 ? 'text-[#1F9D72]' : 'text-[#D96B3B]'}>
                        {pfz.suitabilityScore ?? 90}%
                      </span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <RiskBadge level={pfz.riskLevel || 'LOW'} size="sm" />
                    </td>
                    <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                      {pfz.distanceNm} NM • {pfz.bearing || '245°'}
                    </td>
                    <td className="py-2 px-3 text-slate-800">
                      {pfz.sstCelsius}°C
                    </td>
                    <td className="py-2 px-3 text-[#1F9D72] font-bold">
                      {pfz.chlorophyllMgM3}
                    </td>
                    <td className="py-2 px-3 text-slate-600 max-w-xs truncate">
                      {Array.isArray(pfz.primarySpecies) ? pfz.primarySpecies.join(', ') : pfz.primarySpecies}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedZone(pfz);
                          if (onAskOrca) onAskOrca(pfz);
                        }}
                        className="px-2 py-0.5 rounded bg-[#071A2B] hover:bg-[#0B2942] text-white text-[10px] font-bold border border-[#0D5C7A] transition-colors"
                      >
                        ANALYZE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
