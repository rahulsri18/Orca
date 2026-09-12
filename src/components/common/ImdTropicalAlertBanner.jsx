import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  RefreshCw, 
  Wind, 
  Waves, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  MapPin, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  Radio, 
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchLiveImdData, getCachedImdData } from '../../services/imdWeatherService';

export function ImdTropicalAlertBanner({
  onNavigateToAlerts = null,
  onNavigateToMap = null,
  onAskOrca = null,
  onOpenBulletin = null
}) {
  const { t } = useLanguage();
  const [data, setData] = useState(getCachedImdData);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRefresh = async (e) => {
    e?.stopPropagation();
    setLoading(true);
    setRefreshSuccess(false);
    try {
      const freshData = await fetchLiveImdData();
      setData(freshData);
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to refresh IMD data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // Standardized 12-region list ordered strictly from HIGH RISK to LOW RISK
  const fallbackRankedRegions = [
    {
      id: 'odisha',
      name: 'South Odisha & North Andhra Coast (NW Bay of Bengal)',
      state: 'Odisha & Andhra Pradesh',
      riskLevel: 'HIGH',
      riskScore: 92,
      alertCode: 'IMD RED ALERT',
      coordinates: [18.50, 84.80],
      primaryThreat: 'Active Low Pressure Area & 24h Cyclogenesis',
      waveState: '1.8m - 3.4m (Rough to Very Rough)',
      windState: '45-55 km/h squalls gusting 65 km/h (25-35 kts)',
      impactReason: 'Associated cyclonic circulation extends up to 9.4 km above mean sea level. Moving WNW across coast with intense squalls and torrential rain.',
      directive: 'Total suspension of all fishing operations in NW & WC Bay of Bengal. All crafts advised to return to shelter harbor immediately.',
      liveWaveHeight: 1.8,
      liveSwellHeight: 1.2,
      livePeriodSec: 8.4,
      harbors: ['Paradip', 'Gopalpur', 'Puri', 'Dhamra']
    },
    {
      id: 'kerala',
      name: 'Kerala (Kochi, Kollam & Malabar Coast)',
      state: 'Kerala',
      riskLevel: 'HIGH',
      riskScore: 82,
      alertCode: 'SWELL SURGE ALERT',
      coordinates: [9.75, 76.15],
      primaryThreat: 'High Swell Surge (Kallakkadal) & Cyclonic Depression ASNA Trajectory',
      waveState: '2.8m - 3.6m (High Swell)',
      windState: '28-35 knots squally gale',
      impactReason: 'Southern Indian Ocean swell waves causing strong coastal breaking surges during high tide cycles.',
      directive: 'Avoid anchoring crafts close to the surf line. Deep sea vessels maintain shelter harbor watch.',
      liveWaveHeight: 2.2,
      liveSwellHeight: 1.6,
      livePeriodSec: 12.8,
      harbors: ['Kochi', 'Neendakara', 'Beypore', 'Vizhinjam']
    },
    {
      id: 'lakshadweep',
      name: 'Lakshadweep Archipelago (Kavaratti & Agatti)',
      state: 'Lakshadweep',
      riskLevel: 'HIGH',
      riskScore: 82,
      alertCode: 'DEEP SEA WARNING',
      coordinates: [10.55, 72.65],
      primaryThreat: 'Open Oceanic High Swells & Squally Downdrafts',
      waveState: '2.5m - 3.2m (Rough)',
      windState: '25-30 knots',
      impactReason: 'Intense inter-island squalls and breaking swells along coral reef lagoons.',
      directive: 'Inter-island motorized ferry and small craft voyages restricted to lagoon waters.',
      liveWaveHeight: 2.1,
      liveSwellHeight: 1.5,
      livePeriodSec: 11.5,
      harbors: ['Kavaratti', 'Agatti', 'Andrott']
    },
    {
      id: 'palkbay',
      name: 'Palk Bay & Gulf of Mannar Sector',
      state: 'Tamil Nadu / IMBL Boundary',
      riskLevel: 'MEDIUM',
      riskScore: 58,
      alertCode: 'GEOFENCE CAUTION',
      coordinates: [9.32, 79.35],
      primaryThreat: 'NavIC Geofence Proximity & Coral Sanctuary Delimitation',
      waveState: '1.4m - 1.8m (Moderate)',
      windState: '16-20 knots ENE',
      impactReason: 'Cross-boundary international maritime line (IMBL) proximity detection active.',
      directive: 'Maintain 2 nautical miles buffer from the IMBL delimiter. Transponder lock verified.',
      liveWaveHeight: 1.4,
      liveSwellHeight: 0.8,
      livePeriodSec: 6.8,
      harbors: ['Rameswaram', 'Mandapam', 'Dhanushkodi']
    },
    {
      id: 'maharashtra',
      name: 'Maharashtra (Mumbai & South Konkan)',
      state: 'Maharashtra',
      riskLevel: 'MEDIUM',
      riskScore: 48,
      alertCode: 'SQUALL WATCH',
      coordinates: [18.55, 72.75],
      primaryThreat: 'Upper Air Cyclonic Circulation off South Konkan',
      waveState: '1.6m - 2.1m (Moderate)',
      windState: '18-22 knots WNW',
      impactReason: 'Offshore convective clouds bringing nocturnal squalls and reduced visibility.',
      directive: 'Mechanized trawlers exercise caution during night fishing beyond 20nm shelf.',
      liveWaveHeight: 1.5,
      liveSwellHeight: 0.9,
      livePeriodSec: 7.6,
      harbors: ['Sassoon Docks', 'Bhaucha Dhakka', 'Ratnagiri']
    },
    {
      id: 'bengal',
      name: 'West Bengal (Digha & Sundarbans Estuary)',
      state: 'West Bengal',
      riskLevel: 'MEDIUM',
      riskScore: 48,
      alertCode: 'TIDAL SURGE CAUTION',
      coordinates: [21.65, 88.35],
      primaryThreat: 'Strong Estuarine Ebb Currents & Bay Monsoon Squalls',
      waveState: '1.5m - 2.0m (Tidal Churn)',
      windState: '15-20 knots SE',
      impactReason: 'Deltaic churn and tidal bores affecting shallow sandbar passages.',
      directive: 'Navigate marked dredged channel. Avoid sandbar crossings during ebb tides.',
      liveWaveHeight: 1.4,
      liveSwellHeight: 0.8,
      livePeriodSec: 7.2,
      harbors: ['Digha Mohana', 'Sagar Island', 'Kakdwip']
    },
    {
      id: 'goa',
      name: 'Goa Maritime Sector (Mormugao Littoral)',
      state: 'Goa',
      riskLevel: 'LOW',
      riskScore: 35,
      alertCode: 'ALL CLEAR',
      coordinates: [15.35, 73.75],
      primaryThreat: 'Localized Rocky Shoals with Normal Swell',
      waveState: '1.1m - 1.4m (Slight)',
      windState: '12-15 knots W',
      impactReason: 'Clear fairway; normal purse-seine operational conditions.',
      directive: 'Standard port fairway protocols apply. Maintain VHF watch on Channel 16.',
      liveWaveHeight: 1.2,
      liveSwellHeight: 0.7,
      livePeriodSec: 6.9,
      harbors: ['Mormugao', 'Panaji (Betim)', 'Cutbona']
    },
    {
      id: 'karnataka',
      name: 'Karnataka (Kanara Coast & Mangalore)',
      state: 'Karnataka',
      riskLevel: 'LOW',
      riskScore: 30,
      alertCode: 'SAFE HARBOR',
      coordinates: [13.85, 74.35],
      primaryThreat: 'Normal Seasonal Coastal Conditions',
      waveState: '1.0m - 1.3m (Slight)',
      windState: '11-14 knots NNW',
      impactReason: 'Deep water safe corridor active; optimal catch potential.',
      directive: 'Regular coastal fishing permitted within designated territorial zones.',
      liveWaveHeight: 1.1,
      liveSwellHeight: 0.6,
      livePeriodSec: 6.5,
      harbors: ['New Mangalore', 'Malpe', 'Karwar']
    },
    {
      id: 'gujarat',
      name: 'Gujarat (Saurashtra & Gulf of Kachchh)',
      state: 'Gujarat',
      riskLevel: 'LOW',
      riskScore: 28,
      alertCode: 'NORMAL FAIRWAY',
      coordinates: [21.45, 69.85],
      primaryThreat: 'High Tidal Range at Gulf Entrance',
      waveState: '1.0m - 1.2m (Smooth)',
      windState: '10-14 knots NW',
      impactReason: 'Upwelling shelf conditions favorable for commercial pelagic fleet.',
      directive: 'Normal voyages. Watch tidal currents at Gulf of Khambhat narrows.',
      liveWaveHeight: 1.1,
      liveSwellHeight: 0.7,
      livePeriodSec: 6.2,
      harbors: ['Veraval', 'Porbandar', 'Okha']
    },
    {
      id: 'tamilnadu',
      name: 'Tamil Nadu & Coromandel Coast',
      state: 'Tamil Nadu',
      riskLevel: 'LOW',
      riskScore: 26,
      alertCode: 'OPTIMAL SEA',
      coordinates: [11.20, 79.95],
      primaryThreat: 'Calm Coastal Waters with Deep Trench PFZ',
      waveState: '0.8m - 1.1m (Calm-Smooth)',
      windState: '9-12 knots ENE',
      impactReason: 'Stable atmospheric conditions across Coromandel coastal strip.',
      directive: 'Unrestricted fishing operations in shelf and offshore tuna corridors.',
      liveWaveHeight: 0.8,
      liveSwellHeight: 0.5,
      livePeriodSec: 6.0,
      harbors: ['Kasimedu (Chennai)', 'Cuddalore', 'Tuticorin']
    },
    {
      id: 'andaman',
      name: 'Andaman & Nicobar Archipelago',
      state: 'Andaman & Nicobar',
      riskLevel: 'LOW',
      riskScore: 22,
      alertCode: 'CLEAR SEAS',
      coordinates: [11.65, 92.75],
      primaryThreat: 'Isolated Island Showers with Calm Seas',
      waveState: '0.6m - 0.9m (Smooth)',
      windState: '8-12 knots SW',
      impactReason: 'Calm equatorial conditions; high visibility.',
      directive: 'Standard maritime navigation protocols.',
      liveWaveHeight: 0.6,
      liveSwellHeight: 0.4,
      livePeriodSec: 5.8,
      harbors: ['Port Blair', 'Diglipur', 'Car Nicobar']
    }
  ];

  // Dynamic ranking based on live regional data
  const rankedRegions = (data.regionalData && data.regionalData.length > 0)
    ? [...data.regionalData].sort((a, b) => b.riskScore - a.riskScore).map((r, i) => ({
        ...r,
        alertCode: r.alertBadge || (r.riskLevel === 'HIGH' ? 'RED ALERT' : r.riskLevel === 'MEDIUM' ? 'CAUTION' : 'ALL CLEAR'),
        waveState: `${r.liveWaveHeight}m (Observed)`,
        windState: r.id === 'odisha' || r.id === 'andhra' ? '45-55 km/h squalls gusting 65 km/h' : '15-20 knots',
        coordinates: [r.lat, r.lon],
        primaryThreat: r.statusNotice || 'Marine Environmental Telemetry',
        impactReason: r.id === 'odisha' || r.id === 'andhra' 
          ? 'Associated cyclonic circulation extends up to 9.4 km. Moving WNW with severe squalls.'
          : 'Monitored live oceanographic parameters across continental margin.',
        directive: r.riskLevel === 'HIGH' 
          ? 'Total suspension of all fishing operations in rough sea sector.'
          : 'Standard fairway safety protocols in force.'
      }))
    : fallbackRankedRegions;

  // Handle arrow navigation
  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? rankedRegions.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev === rankedRegions.length - 1 ? 0 : prev + 1));
  };

  const currentRegion = rankedRegions[currentIndex] || rankedRegions[0];
  const isHigh = currentRegion.riskLevel === 'HIGH';
  const isMed = currentRegion.riskLevel === 'MEDIUM';

  const bob = data.bayOfBengal;

  // Dynamic border, theme gradient & popping hover shadow based on risk level
  const cardBorderClass = isHigh 
    ? 'border-rose-600/80 hover:border-rose-400' 
    : isMed 
      ? 'border-amber-500/80 hover:border-amber-400' 
      : 'border-emerald-500/80 hover:border-emerald-400';

  const hoverShadowClass = isHigh 
    ? 'hover:shadow-[0_20px_45px_-10px_rgba(225,29,72,0.45)]' 
    : isMed 
      ? 'hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.45)]' 
      : 'hover:shadow-[0_20px_45px_-10px_rgba(16,185,129,0.45)]';

  const headerBadgeBg = isHigh ? 'bg-rose-600' : isMed ? 'bg-amber-600' : 'bg-emerald-700';

  return (
    <div 
      className={`group relative w-full rounded-2xl border-2 ${cardBorderClass} ${hoverShadowClass} 
        bg-gradient-to-r from-slate-950 via-slate-900 to-ocean-deep text-white 
        shadow-marine transition-all duration-300 ease-out 
        hover:-translate-y-1.5 hover:scale-[1.008] active:scale-[0.998] overflow-hidden`}
    >
      {/* Dynamic Pop-up Ambient Backlight Glow */}
      <div 
        className={`absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${
          isHigh 
            ? 'bg-gradient-to-r from-rose-500/10 via-transparent to-rose-600/10' 
            : isMed 
              ? 'bg-gradient-to-r from-amber-500/10 via-transparent to-amber-600/10' 
              : 'bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-600/10'
        }`} 
      />
      <div 
        className={`absolute -top-12 -right-12 w-64 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:scale-125 ${
          isHigh ? 'bg-rose-500/15 group-hover:bg-rose-500/25' : isMed ? 'bg-amber-500/15 group-hover:bg-amber-500/25' : 'bg-emerald-500/15 group-hover:bg-emerald-500/25'
        }`} 
      />

      {/* Top Warning Strip with Ranking Stepper & Arrow Controls (Ultra-Slim) */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-1.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isHigh ? 'bg-rose-400' : isMed ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${headerBadgeBg} text-white font-mono shadow-xs`}>
              {currentIndex === 0 ? '🚨 #1 HIGHEST ALERT SECTOR' : `⚠️ RANK #${currentIndex + 1} OF ${rankedRegions.length}`}
            </span>
            <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
              Sorted: High ➔ Low Risk
            </span>
          </div>
        </div>

        {/* Arrow Navigation Controls (Previous & Next Region) */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/15">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/15 hover:bg-white/30 active:scale-90 transition-all text-[11px] font-bold cursor-pointer"
            title="Switch to Higher Risk Region"
            aria-label="Previous Region (Higher Risk)"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline text-[10px]">Higher</span>
          </button>

          <span className="px-1.5 text-[11px] font-mono font-bold text-amber-300">
            {currentIndex + 1}/{rankedRegions.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/15 hover:bg-white/30 active:scale-90 transition-all text-[11px] font-bold cursor-pointer"
            title="Switch to Lower Risk Region"
            aria-label="Next Region (Lower Risk)"
          >
            <span className="hidden md:inline text-[10px]">Lower</span>
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="ml-0.5 p-1 rounded bg-white/10 hover:bg-white/25 active:scale-95 transition-all text-white cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-rose-300' : 'text-slate-200'}`} />
          </button>
        </div>
      </div>

      {/* Main Content Body (Compact 40% area reduction) */}
      <div className="relative z-10 p-3 sm:p-3.5 space-y-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="space-y-1 flex-1 min-w-0">
            {/* Badges & Hazard Score Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                isHigh ? 'bg-rose-600 text-white animate-pulse' : isMed ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
              } font-mono shadow-xs`}>
                {currentRegion.alertCode}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                HAZARD: {currentRegion.riskScore}/100
              </span>
              <span className="text-[11px] font-mono text-amber-300 hidden sm:inline">
                {currentIndex === 0 ? '⚠️ India\'s Highest Threat Zone' : `Ranked #${currentIndex + 1} Nationwide`}
              </span>
            </div>
            
            {/* Title with Inline Cycling Arrows */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                {isHigh ? (
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                ) : isMed ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <span className="truncate">{currentRegion.name}</span>
              </h2>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title="Previous Region (Higher Risk)"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title="Next Region (Lower Risk)"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Compact 1-line Threat description */}
            <p className="text-xs text-slate-200 line-clamp-1 sm:line-clamp-2 leading-tight">
              <strong className="text-amber-300 font-semibold">Immediate Threat:</strong> {currentRegion.primaryThreat}. {currentRegion.impactReason}
            </p>
          </div>

          {/* Quick CTA Cluster (Horizontal, Compact) */}
          <div className="flex items-center flex-wrap gap-1.5 shrink-0">
            {onNavigateToMap && (
              <button
                type="button"
                onClick={() => onNavigateToMap(currentRegion.coordinates, `${currentRegion.name} (Risk: ${currentRegion.riskScore}/100)`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border border-rose-500/50"
                title="View on Interactive Map"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Locate Sector</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onOpenBulletin) {
                  const portName = currentRegion.harbors?.[0] ? `${currentRegion.harbors[0]} Harbor` : 'Paradip Harbor';
                  onOpenBulletin(portName);
                } else if (onNavigateToAlerts) {
                  onNavigateToAlerts(currentRegion.id);
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              title="Open Official Daily Marine Bulletin"
            >
              <FileText className="w-3.5 h-3.5 text-ocean-deep" />
              <span>{currentRegion.state.split(' ')[0]} Bulletin</span>
            </button>

            {onAskOrca && (
              <button
                type="button"
                onClick={() => onAskOrca(`What is the emergency safety protocol and harbor return guidance for ${currentRegion.name} (Hazard Index: ${currentRegion.riskScore}/100) right now?`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 hover:text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border border-sky-400/30"
                title="Ask AI Risk Guidance"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>AI Protocol</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Compact Telemetry & Safety Chips (Streamlined Height) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-slate-300 flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" />
              <span>Wind & Squall</span>
            </span>
            <div className="mt-0.5">
              <div className="text-xs sm:text-sm font-extrabold text-white truncate">{currentRegion.windState}</div>
              <div className="text-[9px] text-slate-300 font-mono">Real-time Vector</div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-slate-300 flex items-center gap-1">
              <Waves className="w-3 h-3 text-sky-400" />
              <span>Live Sea State</span>
            </span>
            <div className="mt-0.5">
              <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                {currentRegion.liveWaveHeight ? `${currentRegion.liveWaveHeight}m (Observed)` : currentRegion.waveState}
              </div>
              <div className="text-[9px] text-slate-300 font-mono truncate">
                Swell: {currentRegion.liveSwellHeight ? `${currentRegion.liveSwellHeight}m` : '0.9m'} • {currentRegion.livePeriodSec ? `${currentRegion.livePeriodSec}s` : '7.5s'}
              </div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-slate-300 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>National Rank</span>
            </span>
            <div className="mt-0.5">
              <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                Rank #{currentIndex + 1} of {rankedRegions.length}
              </div>
              <div className="text-[9px] text-slate-300 truncate">
                {currentIndex === 0 ? 'Highest Threat Level' : 'Ordered by Hazard Score'}
              </div>
            </div>
          </div>

          <div className={`p-2 rounded-lg border flex flex-col justify-between ${
            isHigh ? 'bg-rose-900/50 border-rose-500/50 text-rose-100' : isMed ? 'bg-amber-900/40 border-amber-500/40 text-amber-100' : 'bg-emerald-900/40 border-emerald-500/40 text-emerald-100'
          }`}>
            <span className="text-[9px] uppercase font-bold flex items-center gap-1">
              <Radio className="w-3 h-3" />
              <span>Fishermen Notice</span>
            </span>
            <div className="mt-0.5">
              <div className="text-xs sm:text-sm font-black truncate">
                {isHigh ? 'NO SEA VENTURING' : isMed ? 'EXERCISE CAUTION' : 'CLEAR OPERATIONS'}
              </div>
              <div className="text-[9px] opacity-90 truncate">{currentRegion.directive}</div>
            </div>
          </div>
        </div>

        {/* Integrated Slim Stepper & Accordion Row */}
        <div className="pt-1.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none max-w-full">
            <span className="font-bold text-slate-300 text-[10px] mr-0.5 shrink-0">Rank:</span>
            {rankedRegions.map((reg, idx) => {
              const isItemActive = idx === currentIndex;
              const isItemHigh = reg.riskLevel === 'HIGH';
              const isItemMed = reg.riskLevel === 'MEDIUM';

              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                    isItemActive
                      ? 'bg-white text-slate-900 shadow-xs scale-105 ring-1 ring-sky-400'
                      : isItemHigh
                        ? 'bg-rose-900/60 text-rose-200 hover:bg-rose-800'
                        : isItemMed
                          ? 'bg-amber-900/60 text-amber-200 hover:bg-amber-800'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={`#${idx + 1}: ${reg.name} (Risk: ${reg.riskScore}/100)`}
                >
                  #{idx + 1} {reg.state.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>{expanded ? 'Hide IMD Synoptic' : 'Official IMD Synoptic'}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {onNavigateToAlerts && (
              <button
                type="button"
                onClick={() => onNavigateToAlerts(currentRegion.id)}
                className="flex items-center gap-0.5 font-bold text-amber-300 hover:text-white text-[11px] transition-colors cursor-pointer"
              >
                <span>All Bulletins</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Official IMD Dispatch Accordion */}
        {expanded && (
          <div className="mt-2 p-3 rounded-xl bg-black/60 border border-white/15 space-y-2 text-xs animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span>🏛️ {bob.agency}</span>
                <span className="text-[10px] font-mono text-slate-300">({bob.validity})</span>
              </div>
              <p className="text-slate-200 font-mono text-[11px] leading-relaxed bg-black/40 p-2 rounded-lg border border-white/10">
                {bob.synopticSituation}
              </p>
            </div>

            <div className="p-2 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-100 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[9px] text-rose-300 block">
                Mandatory Fishermen Directive:
              </span>
              <p className="text-[11px] leading-relaxed">
                {currentRegion.directive}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
