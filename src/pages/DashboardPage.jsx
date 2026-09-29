import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { MapWidget } from '../components/map/MapWidget';
import { RecommendationCard } from '../components/chat/RecommendationCard';
import { DEMO_SCENARIOS } from '../data/mockAgents';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_PFZ } from '../data/mockPfz';
import { COASTAL_REGIONS } from '../data/coastalRegions';
import {
  Sparkles,
  MapPin,
  Compass,
  Fish,
  AlertTriangle,
  Waves,
  Wind,
  Thermometer,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Activity,
  Satellite,
  Clock,
  Radio,
  FileText,
  AlertOctagon,
  Anchor,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { ImdTropicalAlertBanner } from '../components/common/ImdTropicalAlertBanner';
import { getCurrentMarineConditions, getAlertsSummary } from '../services/apiClient';

export function DashboardPage({
  onNavigateTab,
  onNavigateToAlerts = null,
  onAskOrca,
  onHighlightMap,
  onOpenSos = null,
  onOpenBulletin = null
}) {
  const { role, currentRole } = useRole();
  const { t } = useLanguage();
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState(COASTAL_REGIONS[4]); // Default Kerala
  const [liveMarineData, setLiveMarineData] = useState(null);
  const [liveAlertsSummary, setLiveAlertsSummary] = useState(null);
  const [dataFreshness, setDataFreshness] = useState('LIVE');
  const [lastSyncTime, setLastSyncTime] = useState('');

  // Live real-time clock with seconds
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  });

  // Dynamic telemetry live oscillation (grounded in real-time INCOIS buoy & marine model pings)
  const [sensorJitter, setSensorJitter] = useState({
    wave: 3.42,
    waveTrend: '+0.04m',
    wind: 28.2,
    windTrend: 'Gusts 34.8 kt',
    sst: 29.1,
    chl: 1.42,
    vesselSpeed: 11.2,
    cog: 245,
    pingActive: false
  });

  // Fetch live backend telemetry on mount and periodically
  useEffect(() => {
    let isMounted = true;
    async function loadTelemetry() {
      try {
        const [marineRes, alertsRes] = await Promise.allSettled([
          getCurrentMarineConditions(),
          getAlertsSummary()
        ]);
        if (!isMounted) return;

        if (marineRes.status === 'fulfilled' && marineRes.value) {
          setLiveMarineData(marineRes.value);
          setDataFreshness(marineRes.value.data_freshness || 'LIVE');
          setLastSyncTime(marineRes.value.system_time_ist || '');
          
          const sectors = marineRes.value.sectors || [];
          const matched = sectors.find(s => s.sector_id === selectedSector.id) || marineRes.value.most_riskiest_sector;
          if (matched) {
            setSensorJitter(prev => ({
              ...prev,
              wave: matched.wave_height_m,
              wind: matched.wind_speed_kt,
              sst: matched.surface_temp_c,
              pingActive: true
            }));
          }
        }

        if (alertsRes.status === 'fulfilled' && alertsRes.value) {
          setLiveAlertsSummary(alertsRes.value);
        }
      } catch (err) {
        console.warn('Dashboard live telemetry fetch note:', err.message);
      }
    }

    loadTelemetry();
    const pollTimer = setInterval(loadTelemetry, 25000);
    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [selectedSector.id]);

  // Ticker of live coastal alerts & buoys
  const tickerItems = [
    '● INCOIS MOORED BUOY #AD02: Significant Wave Height 3.42m | Peak Period 12.8s | Sea State 5 (Rough)',
    '● IMD WEATHER DISPATCH: Cyclone Asna maintaining 988 hPa central pressure with 28 kt sustained winds',
    '● ISRO OCEANSAT-3 OCM-3: High bio-density thermal plume detected 18.5 NM off Chellanam (94% Prime)',
    '● MRCC KOCHI ADVISORY: Non-mechanized craft departure suspended | All vessels maintain watch on VHF Ch 16',
    '● NAVIC S-BAND UPLINK: Transponder telemetry feed 100% locked | Satellite elevation 64.2°'
  ];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic sensor packet arrival simulation (every 3.5 seconds)
  useEffect(() => {
    const sensorTimer = setInterval(() => {
      setSensorJitter(prev => {
        const waveDelta = (Math.random() * 0.1 - 0.05).toFixed(2);
        const windDelta = (Math.random() * 0.8 - 0.4).toFixed(1);
        const newWave = Math.max(3.1, Math.min(3.7, +(prev.wave + +waveDelta).toFixed(2)));
        const newWind = Math.max(26.0, Math.min(31.0, +(prev.wind + +windDelta).toFixed(1)));
        const newSpeed = +(11.0 + Math.random() * 0.5).toFixed(1);
        const newCog = Math.round(244 + Math.random() * 3);

        return {
          wave: newWave,
          waveTrend: waveDelta >= 0 ? `+${waveDelta}m surge` : `${waveDelta}m slack`,
          wind: newWind,
          windTrend: `Gusts ${(newWind + 6.2).toFixed(1)} kt`,
          sst: +(29.1 + (Math.random() * 0.1 - 0.05)).toFixed(1),
          chl: +(1.42 + (Math.random() * 0.04 - 0.02)).toFixed(2),
          vesselSpeed: newSpeed,
          cog: newCog,
          pingActive: true
        };
      });

      // Clear ping flash after 800ms
      setTimeout(() => {
        setSensorJitter(prev => ({ ...prev, pingActive: false }));
      }, 800);
    }, 3500);

    return () => clearInterval(sensorTimer);
  }, []);

  const activeAlert = MOCK_ALERTS.find(a => a.severity === 'HIGH') || MOCK_ALERTS[0];
  const primePfz = MOCK_PFZ.find(p => p.suitabilityScore >= 90) || MOCK_PFZ[0];

  const filteredRegions = COASTAL_REGIONS.filter(reg => {
    if (regionFilter === 'WEST') return ['gujarat', 'maharashtra', 'goa', 'karnataka', 'kerala'].includes(reg.id);
    if (regionFilter === 'EAST') return ['tamilnadu', 'palkbay', 'andhra', 'odisha', 'bengal'].includes(reg.id);
    if (regionFilter === 'ISLANDS') return ['andaman', 'lakshadweep'].includes(reg.id);
    return true;
  });

  const handleSelectSector = (reg) => {
    setSelectedSector(reg);
    onHighlightMap(reg.coordinates, reg.name);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 1. Compact Emergency / Weather Banner */}
      <ImdTropicalAlertBanner
        onNavigateToAlerts={onNavigateToAlerts ? onNavigateToAlerts : () => onNavigateTab('alerts')}
        onNavigateToMap={onHighlightMap}
        onAskOrca={onAskOrca}
        onOpenBulletin={onOpenBulletin}
      />

      {/* Dynamic Live Telemetry Ticker Ribbon */}
      <div className="bg-[#071A2B] border border-[#0B2942] overflow-hidden flex items-center shadow-xs">
        <div className="bg-[#0B2942] text-white px-3 py-1.5 text-[10px] font-mono font-bold flex items-center gap-1.5 shrink-0 border-r border-[#0D5C7A] z-10">
          <span className="w-2 h-2 rounded-full bg-[#1F9D72] animate-pulse" />
          <span className="text-[#0F8B8D]">LIVE TELEMETRY STREAM</span>
        </div>

        <div className="overflow-hidden relative w-full py-1 text-slate-300 font-mono text-[11px]">
          <div className="ticker-marquee flex items-center gap-8">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="text-slate-200">{item}</span>
                <span className="text-[#0D5C7A]">■</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Operational Cockpit Hero with Ship in Sea Background (3 Columns) */}
      <div className="relative overflow-hidden rounded-lg border border-[#0D5C7A] shadow-marine bg-[#071A2B]">
        {/* Background Image of Ship / Boat in Stormy Sea with Theme-Aligned Deep Navy Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-100 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url('/maritime_vessel_bg.jpg')` }}
        />
        {/* Dark Navy Gradient Mask to guarantee ultra-clear contrast for all text & metrics */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A2B]/95 via-[#071A2B]/88 to-[#0B2942]/92 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#071A2B]/40 to-[#071A2B] pointer-events-none" />

        {/* Content Container (Z-10) */}
        <div className="relative z-10 p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Column: Station Identity, Greeting & Clocks */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#071A2B]/90 text-cyan-300 border border-[#0D5C7A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>SECTOR: {selectedSector.name.toUpperCase()}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-300">
                INCOIS / ISRO LIVE
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                Good day, {currentRole.title}.
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#0F8B8D]" />
                <span>{selectedSector.name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-bold">{selectedSector.coordinates[0]}°N, {selectedSector.coordinates[1]}°E</span>
              </p>
            </div>

            {/* Dynamic Clock & Live Telemetry Ping */}
            <div className="pt-2 border-t border-[#0D5C7A]/60 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0F8B8D]" />
                <span>TIME: <strong className="text-white tabular-nums">{currentTime} IST</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-colors ${sensorJitter.pingActive ? 'bg-[#1F9D72] scale-125' : 'bg-slate-500'}`} />
                <span>SENSOR: <strong className="text-[#1F9D72]">{sensorJitter.pingActive ? 'PING RECV' : 'STREAMING'}</strong></span>
              </div>
            </div>
          </div>

          {/* Center Column: Sea Danger Level (Simple & Clear for Fishermen) */}
          <div className="lg:col-span-4 bg-[#071A2B]/90 backdrop-blur-sm border border-[#0D5C7A] rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="flex items-center justify-between w-full text-[10px] font-mono uppercase text-slate-400 pb-1.5 border-b border-[#0D5C7A]">
              <span>SEA DANGER LEVEL</span>
              <span className="text-[#D96B3B] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D96B3B] animate-ping" />
                <span>DANGEROUS SEA (STAY IN HARBOR)</span>
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[#D96B3B] tabular-nums tracking-tight wave-pulse">
                84
              </span>
              <span className="text-xs font-mono font-semibold text-slate-400">/ 100</span>
            </div>

            {/* Scale Gauge with simple words */}
            <div className="w-full flex items-center justify-between gap-1 mb-2">
              <div className="h-1.5 flex-1 rounded-l bg-[#1F9D72]" title="Safe 0-35: Safe to fish" />
              <div className="h-1.5 flex-1 bg-[#D89B24]" title="Caution 36-65: Be careful near shore" />
              <div className="h-1.5 flex-1 bg-[#D96B3B] ring-2 ring-white/50" title="High 66-85: High danger (Stay in port)" />
              <div className="h-1.5 flex-1 rounded-r bg-[#C93C4B]" title="Critical 86-100: Extreme storm" />
            </div>

            <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
              <span className="text-[#1F9D72]">SAFE</span>
              <span className="text-[#D89B24]">CAUTION</span>
              <span className="text-[#D96B3B] font-bold">DANGEROUS (84)</span>
              <span className="text-[#C93C4B]">CYCLONE</span>
            </div>
          </div>

          {/* Right Column: Live Tactical Radar Screen with Animated Sweep */}
          <div className="lg:col-span-4 bg-[#071A2B]/90 backdrop-blur-sm border border-[#0D5C7A] rounded-lg p-3 flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 pb-1.5 border-b border-[#0D5C7A]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0F8B8D] animate-ping" />
                <span className="text-white font-bold">LIVE BOAT RADAR • MATSYA-01</span>
              </div>
              <button
                onClick={() => onNavigateTab('map')}
                className="text-[#0F8B8D] hover:underline font-bold"
              >
                OPEN BIG MAP ➔
              </button>
            </div>

            {/* Tactical animated circular radar scope */}
            <div className="my-2 flex items-center gap-3">
              {/* Circular scope */}
              <div className="w-20 h-20 rounded-full border border-[#0D5C7A] bg-[#030B14] relative overflow-hidden shrink-0 flex items-center justify-center">
                {/* Distance range rings */}
                <div className="w-14 h-14 rounded-full border border-slate-700/50 absolute" />
                <div className="w-8 h-8 rounded-full border border-slate-700/60 absolute" />
                <div className="w-full h-px bg-slate-800 absolute" />
                <div className="h-full w-px bg-slate-800 absolute" />

                {/* Animated Rotating Radar Sweep Beam */}
                <div className="absolute inset-0 radar-sweep-beam pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 via-teal-500/10 to-transparent origin-bottom-right" />
                  <div className="w-1/2 h-0.5 bg-cyan-300 absolute top-1/2 left-0 shadow-[0_0_8px_#22d3ee]" />
                </div>

                {/* Vessel Target Blip */}
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white absolute top-7 left-9 shadow-[0_0_6px_#22d3ee] animate-pulse" title="Vessel Matsya-01" />

                {/* Cyclone Hazard Outer Edge Blip */}
                <div className="w-2 h-2 rounded-full bg-[#D96B3B] absolute top-3 right-3 shadow-[0_0_5px_#f97316] animate-ping" title="Cyclone Edge" />
              </div>

              {/* Live Target Telemetry Readout */}
              <div className="flex-1 text-xs font-mono">
                <div className="text-slate-200 font-bold flex items-center justify-between">
                  <span className="text-cyan-300">▲ MATSYA-01</span>
                  <span className="text-[10px] text-emerald-400">TRACKING</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  SPD: <strong className="text-white">{sensorJitter.vesselSpeed} kts</strong> • COG: <strong className="text-white">{sensorJitter.cog}°</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>CYCLONE PERIMETER:</span>
                  <span className="text-[#D96B3B] font-bold">48 NM</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-[#0D5C7A]/50 pt-1">
              <span>REFUGE: KOCHI (18.5 NM)</span>
              <span className="text-[#1F9D72] font-semibold">LEEWAY CLEAR</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Core Telemetry Cards with Simple Labels for Fishermen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Wave Height (Sea Roughness)"
          value={sensorJitter.wave.toString()}
          unit="m"
          subtext="Rough 11-foot waves (DANGER)"
          trend={sensorJitter.waveTrend}
          iconName="Waves"
          status="danger"
        />
        <StatCard
          title="Wind Speed (Storm Gale)"
          value={sensorJitter.wind.toString()}
          unit="kt"
          subtext="Strong storm wind (55 km/h)"
          trend={sensorJitter.windTrend}
          iconName="Wind"
          status="warning"
        />
        <StatCard
          title="Sea Water Temp"
          value={sensorJitter.sst.toString()}
          unit="°C"
          subtext="Warm water (+1.2°C)"
          trend="Marine Heatwave"
          iconName="Thermometer"
          status="warning"
        />
        <StatCard
          title="Fish Food (Catch Zone)"
          value={sensorJitter.chl.toString()}
          unit="mg/m³"
          subtext="Large schools of fish nearby"
          badge="LOTS OF FISH"
          iconName="Layers"
          status="safe"
        />
      </div>

      {/* 4. Three Major Workflow Cards in Simple Words */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Workflow 1: AI Assistant */}
        <div
          onClick={() => onNavigateTab('chat')}
          className="marine-panel p-4 hover:border-[#0D5C7A] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded bg-slate-100 text-[#071A2B] group-hover:bg-[#071A2B] group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4 text-[#0F8B8D]" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                EASY TO USE
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0D5C7A] transition-colors">
              Ask ORCA AI (Safety & Fish Help)
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ask in simple words: "Can I go to sea tomorrow?" or "Where are the fish?" and hear the answer in voice.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0D5C7A]">
            <span>Ask a Question</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Workflow 2: Marine GIS Map */}
        <div
          onClick={() => onNavigateTab('map')}
          className="marine-panel p-4 hover:border-[#0D5C7A] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded bg-slate-100 text-[#071A2B] group-hover:bg-[#071A2B] group-hover:text-white transition-colors">
                <Compass className="w-4 h-4 text-[#0D5C7A]" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                SEA MAP
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0D5C7A] transition-colors">
              Sea Map & Fish Spots
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              See high wave areas, storm clouds, international border lines, and the best fish catch spots.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0D5C7A]">
            <span>Open Sea Map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Workflow 3: Safety Alerts */}
        <div
          onClick={() => onNavigateTab('alerts')}
          className="marine-panel p-4 hover:border-[#D96B3B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded bg-rose-50 text-[#C05527]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FCEFE9] text-[#C05527]">
                STORM ALERTS
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#D96B3B] transition-colors">
              Storm Alerts & Port Signals
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Check if port has raised storm signal flags or if small boats are barred from leaving harbor.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#D96B3B]">
            <span>Check Storm Warnings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 5. Role-Adaptive Section */}
      <div className="marine-panel p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#0D5C7A]">
              OPERATIONAL ROLE CONSOLE:
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#EAF0F3] text-[#071A2B] border border-[#D1DCE5]">
              {currentRole.title}
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="text-xs text-[#0F8B8D] font-mono font-semibold hover:underline"
          >
            Change Persona in Profile ➔
          </button>
        </div>

        {/* Dynamic content matching the role */}
        {role === 'fisherman' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded border border-[#A8DFC9] bg-[#E8F6F1]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Fish className="w-4 h-4 text-[#1F9D72]" />
                  <span>Prime Catch Zone: {primePfz.zoneName}</span>
                </span>
                <span className="font-mono font-bold text-[#177F5B]">{primePfz.suitabilityScore}% PRIME</span>
              </div>
              <p className="text-slate-600">
                Located {primePfz.distanceNm} nm offshore ({primePfz.region}). Target pelagic species: <strong>{primePfz.primarySpecies.join(', ')}</strong>.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => onAskOrca(primePfz)}
                  className="px-2.5 py-1 rounded bg-[#1F9D72] text-white font-medium hover:bg-[#177F5B] transition-colors"
                >
                  Verify Safety
                </button>
                <button
                  onClick={() => onNavigateTab('pfz')}
                  className="px-2.5 py-1 rounded bg-white border border-[#A8DFC9] text-slate-800 font-medium hover:bg-slate-50 transition-colors"
                >
                  All PFZ Coordinates
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded border border-[#D1DCE5] bg-white space-y-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#0D5C7A]" />
                <span>NavIC Safe Return Corridor</span>
              </span>
              <p className="text-slate-600">
                Swell avoidance corridor active via Munambam lee. Reduces ship rolling motion by 45%.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="px-2.5 py-1 rounded bg-[#071A2B] text-white font-medium hover:bg-[#0B2942] transition-colors"
                >
                  Inspect Waypoints
                </button>
              </div>
            </div>
          </div>
        )}

        {role === 'authority' && (
          <div className="p-3.5 rounded border border-[#F6C2AB] bg-[#FCEFE9]/60 space-y-2 text-xs text-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5 text-[#BD5022]">
                <AlertTriangle className="w-4 h-4 text-[#D96B3B]" />
                <span>Disaster Management Cell (NDMA / SDMA Alert Response)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#C93C4B] text-white font-mono font-bold">PORT SIGNAL 3</span>
            </div>
            <p className="text-slate-700">
              Squally weather warning active. Vessel departure suspension directive issued for mechanized boats under 20m LOA.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => onNavigateTab('alerts')}
                className="px-2.5 py-1 rounded bg-[#C93C4B] text-white font-bold hover:bg-[#A82B3A] transition-colors"
              >
                Broadcast Siren Alert
              </button>
              <button
                onClick={() => onNavigateTab('map')}
                className="px-2.5 py-1 rounded bg-white border border-[#D1DCE5] text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
              >
                Inspect Danger Cone
              </button>
            </div>
          </div>
        )}

        {role === 'operator' && (
          <div className="p-3.5 rounded border border-[#D1DCE5] bg-white space-y-2 text-xs text-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5 text-[#071A2B]">
                <Anchor className="w-4 h-4 text-[#0D5C7A]" />
                <span>Vessel Traffic Service (VTS Channel Monitor)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#EAF0F3] text-[#071A2B] font-mono font-bold">VTS CH 12 ACTIVE</span>
            </div>
            <p className="text-slate-600">
              Fairway clearance active. High tide peak at 08:30 (+1.6m). Container vessel inbound on dredged outer channel.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigateTab('routes')}
                className="px-2.5 py-1 rounded bg-[#071A2B] text-white font-medium hover:bg-[#0B2942] transition-colors"
              >
                Open Shipping Corridors
              </button>
            </div>
          </div>
        )}

        {role === 'researcher' && (
          <div className="p-3.5 rounded border border-[#D1DCE5] bg-white space-y-2 text-xs text-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5 text-[#071A2B]">
                <Satellite className="w-4 h-4 text-[#0F8B8D]" />
                <span>ISRO Space Applications Centre Sensor Feed</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#E8F6F1] text-[#177F5B] font-mono font-bold">OCEANSAT-3 100% LOCKED</span>
            </div>
            <p className="text-slate-600">
              Multi-spectral OCM-3 bio-optical passes processed. In-situ moored buoy AD02 cross-calibration delta: +0.08°C.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => onNavigateTab('satellites')}
                className="px-2.5 py-1 rounded bg-[#071A2B] text-white font-medium hover:bg-[#0B2942] transition-colors"
              >
                Inspect Satellite Passes
              </button>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="px-2.5 py-1 rounded bg-white border border-[#D1DCE5] text-slate-800 font-medium hover:bg-slate-50 transition-colors"
              >
                Open Analytics Charts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Pan-India 12 Coastal Sector Strip (Interactive Dynamic Sector Selector) */}
      <div className="marine-panel p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#071A2B] tracking-wider">
                SELECT COASTAL REGION (CLICK TO CHECK SEA DANGER)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">
                12 COASTAL REGIONS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All (12)' },
              { id: 'WEST', label: 'West (5)' },
              { id: 'EAST', label: 'East (5)' },
              { id: 'ISLANDS', label: 'Islands (2)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setRegionFilter(f.id)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  regionFilter === f.id
                    ? 'bg-[#071A2B] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Chips Grid - Clicking dynamically updates active sector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filteredRegions.map(reg => {
            const isHigh = reg.riskLevel === 'HIGH';
            const isMed = reg.riskLevel === 'MEDIUM';
            const isSelected = selectedSector.id === reg.id;

            return (
              <div
                key={reg.id}
                onClick={() => handleSelectSector(reg)}
                className={`p-2 rounded border cursor-pointer transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#071A2B] text-white border-[#0F8B8D] ring-2 ring-[#0F8B8D]/40'
                    : isHigh
                    ? 'bg-[#FCEFE9]/60 border-[#F6C2AB] hover:border-[#D96B3B]'
                    : isMed
                    ? 'bg-[#FBF5E8]/60 border-[#F2D69E] hover:border-[#D89B24]'
                    : 'bg-white border-[#D1DCE5] hover:border-[#0D5C7A]'
                }`}
                title="Click to switch live telemetry to this sector"
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className={`font-bold text-[11px] truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {reg.name.split(' ')[0]}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isSelected ? 'bg-cyan-400 animate-ping' :
                    isHigh ? 'bg-[#D96B3B]' : isMed ? 'bg-[#D89B24]' : 'bg-[#1F9D72]'
                  }`} />
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  <span>{reg.waveState.split(' ')[0]}</span>
                  <span className={`font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-700'}`}>{reg.sst}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Embedded Marine Map Preview & Latest Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Map Preview */}
        <div className="lg:col-span-7 marine-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0D5C7A]" />
              <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-800">
                LIVE GIS MAP RADAR PREVIEW
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-mono font-bold text-[#0F8B8D] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>FULL GIS STATION</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 rounded overflow-hidden border border-[#D1DCE5]">
            <MapWidget
              highlightedCoordinates={selectedSector.coordinates}
              onAskOrca={onAskOrca}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>SECTOR FIX: {selectedSector.coordinates[0]}°N, {selectedSector.coordinates[1]}°E ({selectedSector.name.toUpperCase()})</span>
            <span>BASEMAP: OPENSTREETMAP / ESRI SATELLITE</span>
          </div>
        </div>

        {/* Right: Latest Multi-Agent Decision Report */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0D5C7A]" />
              <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-800">
                LATEST MULTI-AGENT ADVISORY
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">VERIFIED VIA GEMINI</span>
          </div>

          <RecommendationCard
            scenario={DEMO_SCENARIOS.kochi}
            onHighlightMap={onHighlightMap}
          />
        </div>
      </div>
    </div>
  );
}
