import React, { useState, useEffect } from 'react';
import { SATELLITE_PRODUCTS, SATELLITE_DATA_LAYERS } from '../data/mockSatellites';
import { useLanguage } from '../context/LanguageContext';
import { getSatelliteStatus } from '../services/apiClient';
import {
  Satellite,
  Layers,
  Radio,
  Globe,
  CheckCircle2,
  Activity,
  HardDrive,
  Eye,
  Sliders,
  Crosshair,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';

export function SatellitePage() {
  const { t } = useLanguage();
  const [selectedMissionId, setSelectedMissionId] = useState(SATELLITE_PRODUCTS[0].id);
  const [selectedLayerId, setSelectedLayerId] = useState('Chlorophyll');
  const [rasterMode, setRasterMode] = useState('calibrated'); // calibrated | thermal_fronts | nadir_swath
  const [cursorPos, setCursorPos] = useState({ lat: '09°55.8\'N', lon: '076°14.2\'E', val: '1.42 mg/m³' });
  const [satelliteBackend, setSatelliteBackend] = useState(null);

  useEffect(() => {
    getSatelliteStatus()
      .then(data => setSatelliteBackend(data))
      .catch(err => console.warn('Satellite status load fallback:', err));
  }, []);

  const currentMission = SATELLITE_PRODUCTS.find(p => p.id === selectedMissionId) || SATELLITE_PRODUCTS[0];
  const currentLayer = SATELLITE_DATA_LAYERS.find(l => l.id === selectedLayerId) || SATELLITE_DATA_LAYERS[0];

  const handleRasterMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const lat = (13.5 - yRatio * 5.5).toFixed(2);
    const lon = (73.0 + xRatio * 5.0).toFixed(2);
    const valRange = currentLayer.max - currentLayer.min;
    const val = (currentLayer.min + (1 - yRatio) * valRange * (0.8 + xRatio * 0.4)).toFixed(2);

    setCursorPos({
      lat: `${lat}°N`,
      lon: `${lon}°E`,
      val: `${val} ${currentLayer.unit}`
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Remote Sensing Operations Banner */}
      <div className="bg-[#071A2B] text-white p-4 border border-[#0B2942] rounded-none flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0B2942] border border-[#0D5C7A] flex items-center justify-center text-[#0F8B8D]">
            <Satellite className="w-5 h-5 text-[#0F8B8D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#0F8B8D] uppercase font-bold">
                ISRO SPACE APPLICATIONS CENTRE • SAC / NRSC
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1F9D72]/20 text-[#1F9D72] border border-[#1F9D72]/40">
                LEVEL-2 GEORECTIFIED
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-white uppercase">
              {t('satellitePageTitle', 'Earth Observation Satellite Products & Spectral Laboratory')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">DOWNLINK NODE:</span>
            <span className="text-white font-bold bg-[#0B2942] px-2 py-0.5 border border-[#0D5C7A]">
              NRSC SHADNAGAR [100% LOCK]
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">INGEST:</span>
            <span className="text-[#1F9D72] font-bold">
              {satelliteBackend?.system_time_ist ? (satelliteBackend.system_time_ist.split('•')[1]?.trim() || satelliteBackend.system_time_ist) : `${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} IST`}
            </span>
          </div>
        </div>
      </div>

      {/* TOP: Satellite Mission Selector (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SATELLITE_PRODUCTS.map((prod) => {
          const isSelected = prod.id === selectedMissionId;
          return (
            <button
              key={prod.id}
              type="button"
              onClick={() => {
                setSelectedMissionId(prod.id);
                setSelectedLayerId(prod.primaryLayer);
              }}
              className={`p-3 text-left border transition-all relative ${
                isSelected
                  ? 'bg-[#071A2B] border-[#0F8B8D] text-white shadow-sm ring-1 ring-[#0F8B8D]'
                  : 'bg-white border-[#D1DCE5] text-slate-800 hover:border-[#0D5C7A] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                  isSelected ? 'text-[#0F8B8D]' : 'text-slate-500'
                }`}>
                  {prod.mission}
                </span>
                {isSelected ? (
                  <span className="w-2 h-2 rounded-full bg-[#0F8B8D] animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>
              <h3 className={`font-bold text-xs uppercase tracking-tight line-clamp-1 ${
                isSelected ? 'text-white' : 'text-slate-900'
              }`}>
                {prod.sensor}
              </h3>
              <p className={`text-[10px] font-mono mt-1 ${
                isSelected ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Orbit: {prod.altitude} • {prod.orbitType.split(' ')[0]}
              </p>
              <div className="mt-2 pt-1.5 border-t border-slate-200/20 flex items-center justify-between text-[9px] font-mono">
                <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>Pass: {prod.passTime.split(' ')[0]}</span>
                <span className={`font-bold ${isSelected ? 'text-[#1F9D72]' : 'text-emerald-700'}`}>
                  {prod.qualityIndex.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN: Large Satellite Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (~4 cols): Satellite Metadata */}
        <div className="lg:col-span-4 bg-white border border-[#D1DCE5] p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAF0F3]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0D5C7A] font-bold block">
                  TELEMETRY METADATA
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase">
                  {currentMission.mission} • {currentMission.sensor}
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                {currentMission.id}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2.5 p-2 bg-[#F4F7F8] border border-slate-200 font-mono text-[11px]">
              {currentMission.description}
            </p>

            {/* Spec Table */}
            <div className="mt-3 divide-y divide-slate-100 border border-slate-200 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Orbit Type:</span>
                <span className="font-mono font-bold text-slate-800">{currentMission.orbitType}</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Altitude:</span>
                <span className="font-mono font-bold text-slate-800">{currentMission.altitude}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Last Pass Time:</span>
                <span className="font-mono font-bold text-[#0D5C7A]">{currentMission.passTime}</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Cloud Mask:</span>
                <span className="font-mono font-bold text-slate-800">{currentMission.cloudCoverPercent}% Obscuration</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Spatial Resolution:</span>
                <span className="font-mono font-bold text-slate-800">{currentMission.spatialResolution}</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Spectral Bands:</span>
                <span className="font-mono text-[11px] text-slate-700 truncate max-w-[180px]">{currentMission.spectralBands}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Downlink Station:</span>
                <span className="font-mono text-emerald-700 font-bold text-[11px]">{currentMission.downlinkStatus}</span>
              </div>
            </div>
          </div>

          {/* Active Sensor Health */}
          <div className="p-3 bg-[#071A2B] text-white border border-[#0B2942]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#0F8B8D] uppercase font-bold mb-1">
              <span>RADIOMETER CALIBRATION</span>
              <span>100% NOMINAL</span>
            </div>
            <div className="w-full bg-[#0B2942] h-1.5 overflow-hidden">
              <div className="bg-[#1F9D72] h-full w-[98%]" />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1.5">
              <span>SN Ratio: 44.2 dB</span>
              <span>Geometric Accuracy: &lt;0.4 px</span>
            </div>
          </div>
        </div>

        {/* Right Column (~8 cols): Large False-Color Raster Visualization */}
        <div className="lg:col-span-8 bg-[#071A2B] border border-[#0B2942] p-4 text-white flex flex-col justify-between space-y-3 relative overflow-hidden">
          {/* Top Raster Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0B2942] pb-2 z-10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0F8B8D]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                SCENE: SE-ARABIAN-SEA-0907 • NADIR SWATH
              </span>
            </div>

            {/* Live Cursor Coordinate & Radiance Readout */}
            <div className="flex items-center gap-3 text-[10px] font-mono bg-[#0B2942] px-2.5 py-1 border border-[#0D5C7A]/50">
              <span className="text-slate-400">POS: <strong className="text-white">{cursorPos.lat}, {cursorPos.lon}</strong></span>
              <span className="text-slate-400">VAL: <strong className="text-[#0F8B8D]">{cursorPos.val}</strong></span>
            </div>

            {/* Raster Presentation Modes */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRasterMode('calibrated')}
                className={`px-2 py-0.5 text-[10px] font-mono border uppercase transition-colors ${
                  rasterMode === 'calibrated'
                    ? 'bg-[#0D5C7A] border-[#0F8B8D] text-white font-bold'
                    : 'bg-[#0B2942] border-[#0D5C7A]/40 text-slate-400 hover:text-white'
                }`}
              >
                Spectral Raster
              </button>
              <button
                type="button"
                onClick={() => setRasterMode('thermal_fronts')}
                className={`px-2 py-0.5 text-[10px] font-mono border uppercase transition-colors ${
                  rasterMode === 'thermal_fronts'
                    ? 'bg-[#0D5C7A] border-[#0F8B8D] text-white font-bold'
                    : 'bg-[#0B2942] border-[#0D5C7A]/40 text-slate-400 hover:text-white'
                }`}
              >
                Frontal Isolines
              </button>
            </div>
          </div>

          {/* Interactive Scientific False-Color Raster Canvas */}
          <div
            onMouseMove={handleRasterMouseMove}
            className="relative h-80 sm:h-96 w-full border border-[#0D5C7A]/40 overflow-hidden cursor-crosshair select-none bg-[#030B14]"
          >
            {/* Coordinate Grid Graticule (Lat/Long Ticks) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">14°00'N</div>
              <div className="absolute top-1/2 left-2 text-[9px] font-mono text-slate-400">11°30'N</div>
              <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400">09°00'N</div>
              <div className="absolute bottom-1 left-1/4 text-[9px] font-mono text-slate-400">73°30'E</div>
              <div className="absolute bottom-1 left-1/2 text-[9px] font-mono text-slate-400">75°00'E</div>
              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">76°30'E</div>

              {/* Grid Lines */}
              <div className="w-full h-px bg-white/10 absolute top-1/4" />
              <div className="w-full h-px bg-white/10 absolute top-1/2" />
              <div className="w-full h-px bg-white/10 absolute top-3/4" />
              <div className="h-full w-px bg-white/10 absolute left-1/4" />
              <div className="h-full w-px bg-white/10 absolute left-1/2" />
              <div className="h-full w-px bg-white/10 absolute left-3/4" />
            </div>

            {/* Scientific False Color Gradient Simulation Depending on Layer */}
            {selectedLayerId === 'Chlorophyll' && (
              <div className="w-full h-full relative">
                {/* Coastal ocean backdrop */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#031926] via-[#053246] to-[#0D5C7A]" />
                {/* Upwelling Chlorophyll Plume Eddy */}
                <div className="absolute top-16 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-600/60 via-teal-500/50 to-transparent blur-2xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-80 h-48 rounded-full bg-gradient-to-l from-emerald-500/70 via-[#0F8B8D]/60 to-transparent blur-3xl" />
                {/* Isolines if active */}
                {rasterMode === 'thermal_fronts' && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 120,40 Q 200,90 260,180 T 380,310" fill="none" stroke="#5EEAD4" strokeWidth="1.5" strokeDasharray="4 3" />
                    <path d="M 160,30 Q 240,80 300,160 T 420,290" fill="none" stroke="#2DD4BF" strokeWidth="1.5" />
                    <path d="M 200,20 Q 280,70 340,150 T 460,270" fill="none" stroke="#14B8A6" strokeWidth="1" />
                    <text x="270" y="160" fill="#5EEAD4" fontSize="9" fontFamily="monospace">1.8 mg/m³ FRONTAL THRESHOLD</text>
                  </svg>
                )}
                {/* Indian Coastline Outline */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-[#D1DCE5]/20 border-l border-white/40 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-300 transform -rotate-90 tracking-widest uppercase">
                    KERALA COASTLINE
                  </span>
                </div>
              </div>
            )}

            {selectedLayerId === 'SST' && (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0F8B8D]/40 via-[#D89B24]/50 to-[#C93C4B]/60" />
                {/* Coastal upwelling cold wedge */}
                <div className="absolute top-20 right-14 w-72 h-44 rounded-full bg-[#0D5C7A]/80 blur-2xl" />
                {/* Warm ocean pool */}
                <div className="absolute bottom-8 left-12 w-60 h-60 rounded-full bg-[#D96B3B]/60 blur-3xl animate-pulse" />
                {rasterMode === 'thermal_fronts' && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 80,100 Q 180,140 280,220 T 450,280" fill="none" stroke="#FDE047" strokeWidth="1.5" />
                    <path d="M 110,60 Q 220,120 320,180 T 480,240" fill="none" stroke="#FB923C" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="290" y="210" fill="#FDE047" fontSize="9" fontFamily="monospace">28.5°C SST THERMAL BOUNDARY</text>
                  </svg>
                )}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-[#D1DCE5]/20 border-l border-white/40 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-300 transform -rotate-90 tracking-widest uppercase">
                    KERALA COASTLINE
                  </span>
                </div>
              </div>
            )}

            {selectedLayerId === 'Turbidity' && (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#071A2B] via-[#0D5C7A] to-[#D89B24]/40" />
                {/* Estuarine sediment plume */}
                <div className="absolute bottom-4 right-12 w-80 h-36 bg-[#D89B24]/70 blur-2xl" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-[#D1DCE5]/20 border-l border-white/40 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-300 transform -rotate-90 tracking-widest uppercase">
                    ESTUARINE MOUTH
                  </span>
                </div>
              </div>
            )}

            {selectedLayerId === 'Wave Height' && (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#071A2B] via-[#0D5C7A]/60 to-[#581C87]/70" />
                {/* Nadir Altimeter Swath Track Line */}
                <div className="absolute top-0 bottom-0 left-1/3 w-12 bg-white/10 border-x border-dashed border-[#0F8B8D]/80 flex flex-col items-center justify-between py-2">
                  <span className="text-[8px] font-mono text-[#0F8B8D] uppercase font-bold">NADIR TRACK</span>
                  <span className="text-[8px] font-mono text-[#0F8B8D] uppercase font-bold">SRAL ALTIKA</span>
                </div>
                <div className="absolute bottom-12 right-24 p-2 bg-black/60 border border-purple-500/40 font-mono text-[10px] text-purple-200">
                  CYCLONIC SWELL PEAK: 3.8m @ 12.4s
                </div>
              </div>
            )}

            {selectedLayerId === 'Sea Surface Anomaly' && (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0F8B8D]/60 via-[#071A2B] to-[#EC4899]/50" />
                {/* Cold Core Cyclonic Eddy (Depression) */}
                <div className="absolute top-1/4 left-1/4 w-36 h-36 rounded-full border border-cyan-400/80 bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-cyan-200 font-bold">-18 cm SSHA (Cold Eddy)</span>
                </div>
                {/* Warm Core Anticyclonic Eddy */}
                <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full border border-pink-400/80 bg-pink-900/30 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-pink-200 font-bold">+22 cm SSHA (Warm Eddy)</span>
                </div>
              </div>
            )}

            {/* Target Crosshair & Ground Track */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
              <Crosshair className="w-8 h-8 text-[#0F8B8D]/80" />
            </div>

            {/* Bottom Scale & Footprint Watermark */}
            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 bg-[#071A2B]/85 px-2 py-1 border border-white/10 text-[9px] font-mono text-slate-300">
              <span className="w-8 h-1 bg-white inline-block" />
              <span>50 NM</span>
              <span className="text-slate-500">|</span>
              <span>1 px ≈ {currentMission.spatialResolution}</span>
            </div>
          </div>

          {/* Colorbar Gradient Scale */}
          <div className="bg-[#0B2942] p-2 border border-[#0D5C7A]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300 uppercase font-bold">
                {currentLayer.label} Scale ({currentLayer.unit}):
              </span>
              <span className="text-[10px] text-slate-400">{currentLayer.colorScheme}</span>
            </div>

            {/* Gradient Strip */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{currentLayer.min} {currentLayer.unit}</span>
              <div className="w-36 sm:w-48 h-2.5 rounded-none border border-white/20 bg-gradient-to-r from-blue-900 via-teal-500 via-amber-400 to-rose-600" />
              <span className="text-[10px] text-slate-400">{currentLayer.max} {currentLayer.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BELOW: Spectral Data Layers Selector Strip (5 Layers) */}
      <div className="bg-white border border-[#D1DCE5] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0D5C7A]" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              SELECT SPECTRAL DATA LAYER
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Source: {currentLayer.sensorSource}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SATELLITE_DATA_LAYERS.map((layer) => {
            const isLayerSelected = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setSelectedLayerId(layer.id)}
                className={`p-2.5 text-left border transition-all ${
                  isLayerSelected
                    ? 'bg-[#071A2B] border-[#0F8B8D] text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[11px] font-bold uppercase truncate ${
                    isLayerSelected ? 'text-white' : 'text-slate-900'
                  }`}>
                    {layer.label}
                  </span>
                  {isLayerSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8B8D] shrink-0" />}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isLayerSelected ? 'text-[#0F8B8D]' : 'text-[#0D5C7A]'}>
                    {layer.min} - {layer.max} {layer.unit}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-100">
          <strong>Physical Oceanographic Parameter:</strong> {currentLayer.description}
        </p>
      </div>
    </div>
  );
}
