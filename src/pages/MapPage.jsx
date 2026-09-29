import React, { useState, useRef } from 'react';
import { MapWidget } from '../components/map/MapWidget';
import { useLanguage } from '../context/LanguageContext';
import { COASTAL_REGIONS } from '../data/coastalRegions';
import {
  Layers,
  MapPin,
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Anchor,
  Globe,
  Search,
  Crosshair,
  Ruler,
  AlertOctagon,
  Fish,
  Waves,
  Wind,
  ShieldAlert,
  CloudLightning,
  Navigation,
  Eye,
  EyeOff,
  X,
  Thermometer,
  Flame,
  Info,
  Activity,
  Gauge
} from 'lucide-react';

export function MapPage({
  highlightedCoordinates = null,
  onAskOrca = null,
  onPlotRoute = null
}) {
  const { t } = useLanguage();

  const [activeLayers, setActiveLayers] = useState({
    regions: true,
    pfz: true,
    sst: true,
    chlorophyll: true,
    waves: true,
    wind: true,
    cyclone: true,
    lightning: true,
    tides: false,
    protected: true,
    vessels: true,
    boundaries: true
  });

  // Thermal Vision State - DEFAULT FALSE (Standard marine map is default)
  const [thermalVision, setThermalVision] = useState(false);
  const [thermalPreset, setThermalPreset] = useState('all'); // 'all' | 'cyclone' | 'wind' | 'sst'
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  const [thermalProbeData, setThermalProbeData] = useState({
    lat: 19.2,
    lng: 67.5,
    sst: 30.8,
    cloudTopTemp: -82.4,
    windKt: 50,
    windDir: '285° WNW',
    category: 'CYCLONE ASNA CONVECTIVE EYEWALL (Violent Cyclone Core)'
  });

  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(highlightedCoordinates || null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorCoords, setCursorCoords] = useState('15°00.00\'N, 078°30.00\'E');
  
  const getDynamicIstTimestamp = () => {
    const d = new Date();
    const dateFormatted = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${dateFormatted} • ${timeFormatted} IST`;
  };

  // Right Context Panel selected object (default: Cyclone ASNA or active region)
  const [selectedEntity, setSelectedEntity] = useState({
    type: 'cyclone',
    title: 'CYCLONE ASNA (THERMAL EYE)',
    category: 'Tropical Cyclonic Storm (INSAT-3D IR)',
    wind: '50 kt (Gale / Storm Force)',
    pressure: '988 hPa',
    updated: getDynamicIstTimestamp(),
    coordinates: [19.2, 67.5],
    status: 'HIGH RISK / LEVEL 3',
    threat: 'White-hot convective eyewall (-82.4°C) with 3.8m swells across Saurashtra & Konkan coasts.'
  });

  const sliderRef = useRef(null);

  const handleToggleLayer = (layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleSelectRegion = (region) => {
    setSelectedRegionId(region.id);
    setCurrentCoords([...region.coordinates]);
    setSelectedEntity({
      type: 'region',
      title: region.name,
      category: `${region.state} Sector`,
      wind: '18-24 kt WSW',
      pressure: '1008 hPa',
      updated: getDynamicIstTimestamp(),
      coordinates: region.coordinates,
      status: `${region.riskLevel} (${region.riskScore}/100)`,
      threat: `Wave state: ${region.waveState} • Ports: ${region.harbors.slice(0, 3).join(', ')}`
    });
  };

  const handleLocateVessel = () => {
    setCurrentCoords([9.9312, 76.2673]);
    setSelectedEntity({
      type: 'vessel',
      title: 'MATSYA-01 (YOU)',
      category: 'Mechanized Deep-Sea Trawler (18m LOA)',
      wind: '28 kt SW',
      pressure: '1004 hPa',
      updated: getDynamicIstTimestamp(),
      coordinates: [9.9312, 76.2673],
      status: 'UNDERWAY (11.2 kts)',
      threat: 'Heading 245° WSW towards Munambam lee corridor. 18.5 NM from Kochi Harbor.'
    });
  };

  const handleThermalProbe = (data) => {
    setThermalProbeData(data);
    setCursorCoords(`${data.lat.toFixed(2)}°N, ${data.lng.toFixed(2)}°E`);
  };

  const handleToggleThermalVision = () => {
    const nextState = !thermalVision;
    setThermalVision(nextState);
    if (nextState) {
      setIsLegendOpen(true);
    }
  };

  const handleZoneSelect = (entity) => {
    setSelectedEntity(entity);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  // Filtered regions for search
  const filteredRegions = searchQuery.trim()
    ? COASTAL_REGIONS.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.harbors.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // GIS Categorized Layers
  const layerCategories = [
    {
      name: 'OCEANOGRAPHY',
      layers: [
        { id: 'pfz', name: 'Potential Fishing Zones (PFZ)', icon: Fish, color: '#1F9D72' },
        { id: 'sst', name: 'Sea Surface Temp (SST Fronts)', icon: Globe, color: '#D96B3B' },
        { id: 'chlorophyll', name: 'Chlorophyll-a Plumes', icon: Layers, color: '#0F8B8D' },
        { id: 'waves', name: 'Wave Swell Sea State', icon: Waves, color: '#0D5C7A' },
        { id: 'wind', name: 'Wind Velocity Vectors', icon: Wind, color: '#2EAFD0' },
      ]
    },
    {
      name: 'METEOROLOGICAL HAZARDS',
      layers: [
        { id: 'cyclone', name: 'Cyclone ASNA Track & Danger Cone', icon: AlertOctagon, color: '#C93C4B' },
        { id: 'lightning', name: 'Convective Lightning Clusters', icon: CloudLightning, color: '#D89B24' },
      ]
    },
    {
      name: 'MARITIME NAVIGATION',
      layers: [
        { id: 'vessels', name: 'AIS Fleet & User Vessel (Matsya-01)', icon: Navigation, color: '#0EA5E9' },
        { id: 'boundaries', name: '12nm Territorial Waters & EEZ', icon: ShieldAlert, color: '#8B5CF6' },
        { id: 'protected', name: 'Marine Protected Areas & Coral Shoals', icon: Anchor, color: '#D97706' },
        { id: 'regions', name: 'Coastal Maritime Sectors (Pan-India)', icon: Compass, color: '#0284C7' },
      ]
    }
  ];

  return (
    <div className="relative flex flex-col h-[calc(100vh-100px)] min-h-[620px] rounded-lg overflow-hidden border border-[#D1DCE5] bg-[#071A2B] shadow-marine select-none">
      {/* 1. TOP MAP TOOLBAR (Tactical Operational Header & Thermal Vision Controls) */}
      <div className="bg-[#0B2942] border-b border-[#18476F] px-3 py-2 flex items-center justify-between gap-2.5 text-xs z-30 shrink-0 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsLayerDrawerOpen(!isLayerDrawerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
              isLayerDrawerOpen
                ? 'bg-[#0D5C7A] text-white border border-[#2EAFD0]'
                : 'bg-[#071A2B] hover:bg-[#0F3456] text-slate-200 border border-[#18476F]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#2EAFD0]" />
            <span>LAYERS ({activeCount}/12)</span>
          </button>

          {/* THERMAL VISION PRIMARY TOGGLE */}
          <div className="flex items-center bg-[#071A2B] p-0.5 rounded border border-[#18476F]">
            <button
              type="button"
              onClick={handleToggleThermalVision}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-extrabold transition-all ${
                thermalVision
                  ? 'bg-gradient-to-r from-purple-700 via-red-600 to-amber-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.6)] border border-amber-300/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#0F3456]'
              }`}
              title="Toggle High-Contrast Thermal Infrared (INSAT-3D / Wind Velocity / SST Fuel)"
            >
              <Flame className={`w-3.5 h-3.5 ${thermalVision ? 'text-yellow-300 animate-pulse' : 'text-slate-400'}`} />
              <span>THERMAL VISION: {thermalVision ? 'ON' : 'OFF'}</span>
            </button>

            {/* Thermal Sub-Presets */}
            {thermalVision && (
              <div className="hidden sm:flex items-center gap-1 pl-1.5 pr-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setThermalPreset('all')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    thermalPreset === 'all'
                      ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ALL
                </button>
                <button
                  type="button"
                  onClick={() => setThermalPreset('cyclone')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    thermalPreset === 'cyclone'
                      ? 'bg-purple-500/25 text-purple-300 font-bold border border-purple-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌀 CYCLONE
                </button>
                <button
                  type="button"
                  onClick={() => setThermalPreset('wind')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    thermalPreset === 'wind'
                      ? 'bg-red-500/25 text-red-300 font-bold border border-red-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💨 WIND
                </button>
                <button
                  type="button"
                  onClick={() => setThermalPreset('sst')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    thermalPreset === 'sst'
                      ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌊 SST
                </button>
              </div>
            )}
          </div>

          {/* Coordinate Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#071A2B] border border-[#18476F] font-mono text-[11px] text-slate-300">
            <Crosshair className="w-3.5 h-3.5 text-[#2EAFD0]" />
            <span className="text-slate-500">PROBE:</span>
            <span className="text-cyan-300 font-bold">{cursorCoords}</span>
          </div>

          {/* Location Quick Search with Autocomplete */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#071A2B] border border-[#18476F] text-slate-300">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search port or sector..."
                className="bg-transparent text-xs text-white placeholder:text-slate-500 w-36 outline-none font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {filteredRegions.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#0B2942] border border-[#18476F] rounded shadow-2xl z-[600] max-h-56 overflow-y-auto font-mono text-xs">
                {filteredRegions.map(reg => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      handleSelectRegion(reg);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#18476F] text-slate-200 border-b border-[#18476F]/50 flex items-center justify-between"
                  >
                    <span>{reg.name}</span>
                    <span className="text-[10px] text-cyan-400">{reg.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {/* Thermal Legend Toggle */}
          <button
            type="button"
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
              isLegendOpen
                ? 'bg-[#0D5C7A] text-cyan-200 border-cyan-400/50'
                : 'bg-[#071A2B] hover:bg-[#0F3456] text-slate-300 border-[#18476F]'
            }`}
            title="Toggle Thermal Scale Legend"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">SCALE</span>
          </button>

          <button
            type="button"
            onClick={handleLocateVessel}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#071A2B] hover:bg-[#0F3456] text-slate-200 border border-[#18476F] transition-colors"
            title="Locate Matsya-01 Vessel GPS"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">VESSEL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentCoords([19.2, 67.5]);
              setSelectedEntity({
                type: 'cyclone',
                title: 'CYCLONE ASNA (THERMAL EYE)',
                category: 'Tropical Cyclonic Storm (INSAT-3D IR)',
                wind: '50 kt (Gale / Storm Force)',
                pressure: '988 hPa',
                updated: getDynamicIstTimestamp(),
                coordinates: [19.2, 67.5],
                status: 'HIGH RISK / LEVEL 3',
                threat: 'Convective cloud tops -82.4°C with 3.8m swells across Gujarat & Maharashtra offshore.'
              });
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-600/60 transition-colors"
            title="Focus Cyclone ASNA Eyewall"
          >
            <span className="text-xs">🌀</span>
            <span className="hidden sm:inline font-bold">ASNA EYE</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Overlays */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Leaflet Map Widget */}
        <div className="w-full h-full">
          <MapWidget
            activeLayers={activeLayers}
            highlightedCoordinates={currentCoords || highlightedCoordinates}
            onAskOrca={onAskOrca}
            thermalVision={thermalVision}
            thermalPreset={thermalPreset}
            onThermalProbe={handleThermalProbe}
            onZoneSelect={handleZoneSelect}
          />
        </div>

        {/* 2. LEFT: COLLAPSIBLE GIS LAYER DRAWER */}
        {isLayerDrawerOpen && (
          <div className="absolute top-2 left-2 bottom-16 z-[500] w-72 bg-[#0B2942]/95 backdrop-blur-md border border-[#18476F] rounded-lg shadow-modal flex flex-col overflow-hidden text-slate-200">
            <div className="bg-[#071A2B] px-3 py-2 border-b border-[#18476F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2EAFD0]" />
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                  GIS Layer Controls
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLayerDrawerOpen(false)}
                className="p-1 hover:bg-[#18476F] rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-3.5 text-xs font-mono">
              {layerCategories.map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    {cat.name}
                  </div>
                  <div className="space-y-0.5">
                    {cat.layers.map(layer => {
                      const isActive = !!activeLayers[layer.id];
                      const Icon = layer.icon;

                      return (
                        <div
                          key={layer.id}
                          onClick={() => handleToggleLayer(layer.id)}
                          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                            isActive ? 'bg-[#071A2B] text-white border border-[#18476F]' : 'text-slate-400 hover:bg-[#071A2B]/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                            <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate text-[11px]">{layer.name}</span>
                          </div>

                          <button
                            type="button"
                            className="p-0.5 text-slate-400 hover:text-white shrink-0 ml-1"
                          >
                            {isActive ? <Eye className="w-3.5 h-3.5 text-[#2EAFD0]" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-[#18476F] bg-[#071A2B] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>SOURCES: ISRO / INCOIS</span>
              <button
                type="button"
                onClick={() => {
                  const updated = {};
                  Object.keys(activeLayers).forEach(k => { updated[k] = true; });
                  setActiveLayers(updated);
                }}
                className="text-[#2EAFD0] hover:underline font-bold"
              >
                ENABLE ALL
              </button>
            </div>
          </div>
        )}

        {/* 3. FLOATING THERMAL TELEMETRY PROBE HUD (Real-time Live Radar Cursor Probe) */}
        {thermalVision && (
          <div className="absolute left-3 bottom-3 z-[450] max-w-sm sm:max-w-md w-full bg-[#071A2B]/95 backdrop-blur-md border border-cyan-500/40 rounded-lg shadow-2xl p-2.5 font-mono text-slate-200 transition-all">
            <div className="flex items-center justify-between border-b border-[#18476F] pb-1.5 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  THERMAL VISION TELEMETRY HUD
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-400">{thermalProbeData.lat.toFixed(2)}°N, {thermalProbeData.lng.toFixed(2)}°E</span>
                <button
                  type="button"
                  onClick={() => setIsHudMinimized(!isHudMinimized)}
                  className="p-0.5 hover:bg-[#18476F] rounded text-slate-400 hover:text-white"
                >
                  {isHudMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {!isHudMinimized && (
              <div className="space-y-2">
                {/* 3 Metrics Cards */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {/* Cloud Top IR */}
                  <div className="p-1.5 rounded bg-[#0B2942] border border-[#18476F]">
                    <span className="text-[9px] text-slate-400 block">CLOUD TOP IR</span>
                    <span className={`text-xs font-black ${
                      thermalProbeData.cloudTopTemp < -70 ? 'text-purple-300' :
                      thermalProbeData.cloudTopTemp < -50 ? 'text-red-400' :
                      thermalProbeData.cloudTopTemp < -30 ? 'text-amber-400' : 'text-cyan-300'
                    }`}>
                      {thermalProbeData.cloudTopTemp.toFixed(1)}°C
                    </span>
                    <span className="text-[8px] text-slate-400 block truncate">
                      {thermalProbeData.cloudTopTemp < -70 ? 'White Core' :
                       thermalProbeData.cloudTopTemp < -50 ? 'Gale Front' : 'Marine Cloud'}
                    </span>
                  </div>

                  {/* Wind Velocity */}
                  <div className="p-1.5 rounded bg-[#0B2942] border border-[#18476F]">
                    <span className="text-[9px] text-slate-400 block">WIND VELOCITY</span>
                    <span className={`text-xs font-black ${
                      thermalProbeData.windKt >= 40 ? 'text-purple-300' :
                      thermalProbeData.windKt >= 28 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {thermalProbeData.windKt} kt
                    </span>
                    <span className="text-[8px] text-slate-400 block truncate">
                      {thermalProbeData.windDir}
                    </span>
                  </div>

                  {/* SST Energy */}
                  <div className="p-1.5 rounded bg-[#0B2942] border border-[#18476F]">
                    <span className="text-[9px] text-slate-400 block">SST HEAT FUEL</span>
                    <span className={`text-xs font-black ${
                      thermalProbeData.sst >= 30.5 ? 'text-rose-400' : 'text-amber-300'
                    }`}>
                      {thermalProbeData.sst.toFixed(1)}°C
                    </span>
                    <span className="text-[8px] text-slate-400 block truncate">
                      {thermalProbeData.sst >= 30.5 ? 'Cyclone Pool' : 'Normal Sea'}
                    </span>
                  </div>
                </div>

                {/* Status description */}
                <div className="p-1.5 rounded bg-black/40 border border-[#18476F] flex items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-300 truncate">{thermalProbeData.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onAskOrca) {
                        onAskOrca(`Analyze real-time thermal conditions at ${thermalProbeData.lat}°N, ${thermalProbeData.lng}°E: Cloud Top ${thermalProbeData.cloudTopTemp}°C, Wind ${thermalProbeData.windKt} kt, SST ${thermalProbeData.sst}°C. Category: ${thermalProbeData.category}`);
                      }
                    }}
                    className="shrink-0 px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-cyan-200" />
                    <span>ORCA AI</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. THERMAL COLOR SCALE / DVORAK SPECTRUM LEGEND (Floating Top-Right) */}
        {thermalVision && isLegendOpen && (
          <div className="absolute top-2 right-2 sm:right-3 z-[420] w-64 sm:w-72 bg-[#071A2B]/95 backdrop-blur-md border border-[#18476F] rounded-lg shadow-2xl p-2.5 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-[#18476F] pb-1.5 mb-2">
              <span className="font-bold text-[11px] text-white flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                INSAT-3D THERMAL IR SPECTRUM
              </span>
              <button
                type="button"
                onClick={() => setIsLegendOpen(false)}
                className="p-0.5 hover:bg-[#18476F] rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-[10px]">
              {/* Cloud-Top Infrared Temperature Scale */}
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-bold block mb-1">
                  Cloud-Top Brightness Temp (°C)
                </span>
                <div className="h-3 rounded flex overflow-hidden border border-white/20">
                  <div className="flex-1 bg-white" title="-85°C (White-Hot Eyewall)" />
                  <div className="flex-1 bg-purple-600" title="-75°C (Convective Core)" />
                  <div className="flex-1 bg-red-600" title="-60°C (Gale Squall)" />
                  <div className="flex-1 bg-orange-500" title="-45°C (Rainband)" />
                  <div className="flex-1 bg-amber-500" title="-30°C (Cirrus Outflow)" />
                  <div className="flex-1 bg-blue-600" title="0°C (Ocean Surface)" />
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 mt-0.5 font-mono">
                  <span>-85°C Core</span>
                  <span>-60°C Gale</span>
                  <span>-30°C</span>
                  <span>0°C Sea</span>
                </div>
              </div>

              {/* Thermal Wind Velocity Scale */}
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-bold block mb-1">
                  Wind Velocity Intensity (knots)
                </span>
                <div className="h-3 rounded flex overflow-hidden border border-white/20">
                  <div className="flex-1 bg-emerald-600" title="10-18 kt (Breeze)" />
                  <div className="flex-1 bg-amber-500" title="19-24 kt (Moderate)" />
                  <div className="flex-1 bg-orange-600" title="25-33 kt (Squall)" />
                  <div className="flex-1 bg-red-600" title="34-47 kt (Gale)" />
                  <div className="flex-1 bg-purple-700" title="48+ kt (Storm / Cyclone)" />
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 mt-0.5 font-mono">
                  <span>10 kt</span>
                  <span>25 kt</span>
                  <span>34 kt (Gale)</span>
                  <span>50+ kt</span>
                </div>
              </div>

              {/* Quick Identification Keys */}
              <div className="pt-1 border-t border-[#18476F]/60 grid grid-cols-2 gap-1 text-[9px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-white shrink-0" />
                  <span className="truncate">Cyclone Eyewall</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                  <span className="truncate">Gale Surge Field</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="truncate">Squall Corridor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-amber-300 shrink-0" />
                  <span className="truncate">SST Fuel &gt;30°C</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. RIGHT: CONTEXT PANEL (Appears on Object Selection) */}
        {selectedEntity && (
          <div className="absolute top-14 right-2 sm:right-3 z-[400] w-72 sm:w-80 bg-[#0B2942]/95 backdrop-blur-md border border-[#18476F] rounded-lg shadow-modal p-3.5 text-slate-200 text-xs font-mono space-y-2.5">
            <div className="flex items-start justify-between border-b border-[#18476F] pb-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  SELECTED OBJECT
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {selectedEntity.title}
                </h3>
                <span className="text-[11px] text-[#2EAFD0]">{selectedEntity.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="p-1 hover:bg-[#18476F] rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-1.5 rounded bg-[#071A2B] border border-[#18476F]">
                <span className="text-slate-500 block text-[9px]">WIND STATE:</span>
                <span className="font-bold text-white">{selectedEntity.wind}</span>
              </div>
              <div className="p-1.5 rounded bg-[#071A2B] border border-[#18476F]">
                <span className="text-slate-500 block text-[9px]">BAROMETER:</span>
                <span className="font-bold text-white">{selectedEntity.pressure}</span>
              </div>
              <div className="p-1.5 rounded bg-[#071A2B] border border-[#18476F]">
                <span className="text-slate-500 block text-[9px]">COORDINATES:</span>
                <span className="font-bold text-cyan-300">
                  {selectedEntity.coordinates[0]}°N, {selectedEntity.coordinates[1]}°E
                </span>
              </div>
              <div className="p-1.5 rounded bg-[#071A2B] border border-[#18476F]">
                <span className="text-slate-500 block text-[9px]">STATUS:</span>
                <span className="font-bold text-[#D96B3B]">{selectedEntity.status}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-[#071A2B] p-2 rounded border border-[#18476F]">
              {selectedEntity.threat}
            </p>

            <div className="pt-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (onAskOrca) {
                    onAskOrca(`Assess marine hazard conditions, wind vectors, and safety advice for ${selectedEntity.title} at ${selectedEntity.coordinates[0]}N, ${selectedEntity.coordinates[1]}E`);
                  }
                }}
                className="flex-1 py-1.5 rounded bg-[#0F8B8D] hover:bg-[#0D5C7A] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Ask ORCA AI</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentCoords([...selectedEntity.coordinates])}
                className="px-2.5 py-1.5 rounded bg-[#071A2B] hover:bg-[#18476F] text-slate-200 border border-[#18476F] font-bold text-xs transition-colors"
              >
                Focus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. BOTTOM: COMPACT COASTAL SECTOR SELECTOR DOCK */}
      <div className="bg-[#0B2942] border-t border-[#18476F] px-3 py-1.5 flex items-center justify-between gap-2 text-xs z-30 shrink-0">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
          <Anchor className="w-3.5 h-3.5 text-[#2EAFD0]" />
          <span className="hidden sm:inline">SECTORS:</span>
        </div>

        {/* Scroll Buttons */}
        <button
          type="button"
          onClick={() => scrollSlider('left')}
          className="p-1 rounded bg-[#071A2B] hover:bg-[#18476F] text-slate-300 shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Sector Chips Rail */}
        <div
          ref={sliderRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5"
        >
          {COASTAL_REGIONS.map(reg => {
            const isSelected = selectedRegionId === reg.id;
            const isHigh = reg.riskLevel === 'HIGH';

            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleSelectRegion(reg)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-[#0F8B8D] text-white font-bold border border-cyan-400/50'
                    : 'bg-[#071A2B] hover:bg-[#18476F] text-slate-300 border border-[#18476F]'
                }`}
              >
                <span>{reg.name.split(' ')[0]}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-[#D96B3B]' : 'bg-[#1F9D72]'}`} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollSlider('right')}
          className="p-1 rounded bg-[#071A2B] hover:bg-[#18476F] text-slate-300 shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
