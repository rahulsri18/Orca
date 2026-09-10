import React, { useState } from 'react';
import { SATELLITE_PRODUCTS } from '../data/mockSatellites';
import { useLanguage } from '../context/LanguageContext';
import { Satellite, Layers, Radio, Globe, CheckCircle2, ShieldCheck, Eye, Cpu } from 'lucide-react';

export function SatellitePage() {
  const { t } = useLanguage();
  const [selectedProductId, setSelectedProductId] = useState(SATELLITE_PRODUCTS[0].id);
  const currentProduct = SATELLITE_PRODUCTS.find(p => p.id === selectedProductId) || SATELLITE_PRODUCTS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-ocean-deep to-ocean-navy text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Satellite className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{t('satellitePageTitle', 'Earth Observation Satellite Products')}</h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  ISRO Space Applications Centre (SAC)
                </span>
              </div>
              <p className="text-xs md:text-sm text-sky-100/80 mt-1">
                {t('satellitePageSub', 'Calibrated spaceborne sensors: Oceansat-3 OCM bio-optics, INSAT-3DR thermal infrared, and synthetic aperture altimetry.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-200 font-semibold">{t('nrscDownlinkNode', 'NRSC Downlink Node:')}</span>
            <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg">{t('shadnagarLocked', 'Shadnagar (100% Locked)')}</span>
          </div>
        </div>
      </div>

      {/* Product Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SATELLITE_PRODUCTS.map(prod => {
          const isSelected = prod.id === selectedProductId;
          return (
            <div
              key={prod.id}
              onClick={() => setSelectedProductId(prod.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-ocean-teal shadow-md ring-2 ring-sky-100'
                  : 'bg-white/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-ocean-teal">
                  {prod.mission}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-ocean-teal" />}
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                {t(prod.productName)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('sensor', 'Sensor:')} <strong>{prod.sensor}</strong>
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t('spatialResolution', 'Res')}: {prod.resolution}</span>
                <span className="text-emerald-700 font-semibold">{prod.qualityIndex}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Satellite Product Telemetry & Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Metadata & Parameters */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-teal block mb-1">
              {t('activeSensorTelemetry', 'Active Sensor Telemetry')}
            </span>
            <h2 className="text-xl font-bold text-slate-900">{t(currentProduct.productName)}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('payloadId', 'Payload ID')}: {currentProduct.id} • {currentProduct.mission}</p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {t(currentProduct.description)}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">{t('orbitAltitude', 'Orbit & Altitude')}</span>
              <span className="font-bold text-slate-800">{currentProduct.orbitType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">{t('latestOverpassTime', 'Latest Overpass Time')}</span>
              <span className="font-bold text-slate-800">{currentProduct.passTime}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">{t('spatialResolution', 'Spatial Resolution')}</span>
              <span className="font-bold text-slate-800">{currentProduct.resolution}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">{t('cloudObscuration', 'Cloud Obscuration')}</span>
              <span className="font-bold text-slate-800">{currentProduct.cloudCoverPercent}% Cloud Mask</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">{t('spectralChannels', 'Spectral Channels')}</span>
              <span className="font-bold text-slate-800">{currentProduct.spectralBands}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">{t('groundProcessingStation', 'Ground Processing Station')}</span>
              <span className="font-bold text-slate-800">{currentProduct.groundStation}</span>
            </div>
          </div>
        </div>

        {/* Right: Earth Observation Pseudo-Raster Viewer */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 text-white rounded-2xl p-4 border border-slate-800 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 z-10">
            <div className="flex items-center gap-2 text-xs">
              <Globe className="w-4 h-4 text-ocean-cyan" />
              <span className="font-bold text-sky-200">{t('sensorRasterPreview', 'Sensor Raster Preview')}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {t('level2Georeferenced', 'Level-2 Georeferenced')}
            </span>
          </div>

          {/* Raster Graphic Simulation */}
          <div className="relative h-60 w-full rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
            {selectedProductId === 'OCM3-L2-CHL' && (
              <div className="w-full h-full bg-gradient-to-tr from-blue-900 via-teal-700 to-emerald-500 flex flex-col items-center justify-center text-center p-4">
                <div className="w-28 h-28 rounded-full border-4 border-emerald-300/40 animate-ping opacity-25 absolute" />
                <Layers className="w-10 h-10 text-emerald-200 mb-2" />
                <span className="font-bold text-sm">{t('chlorophyllPlumeMapping', 'Chlorophyll-a Plume Mapping')}</span>
                <span className="text-xs text-emerald-100/80 font-mono mt-1">High Upwelling Eddy Zone</span>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] bg-black/50 backdrop-blur px-2 py-1 rounded">
                  <span>0.1 mg/m³ (Oligotrophic)</span>
                  <span>➔</span>
                  <span>2.5 mg/m³ (Eutrophic)</span>
                </div>
              </div>
            )}

            {selectedProductId === 'INSAT3DR-TIR-SST' && (
              <div className="w-full h-full bg-gradient-to-tr from-sky-950 via-amber-700 to-rose-600 flex flex-col items-center justify-center text-center p-4">
                <div className="w-32 h-32 rounded-full border-2 border-rose-300/30 animate-pulse absolute" />
                <Satellite className="w-10 h-10 text-rose-200 mb-2" />
                <span className="font-bold text-sm">{t('thermalRadiometer', 'Thermal Infrared Radiometer')}</span>
                <span className="text-xs text-rose-100/80 font-mono mt-1">Cyclone Heat Potential &gt;85 kJ/cm²</span>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] bg-black/50 backdrop-blur px-2 py-1 rounded">
                  <span>26.0°C (Cold Core)</span>
                  <span>➔</span>
                  <span>30.5°C (Warm Pool)</span>
                </div>
              </div>
            )}

            {selectedProductId === 'SENTINEL3-SRAL-WAVE' && (
              <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-blue-900 to-indigo-700 flex flex-col items-center justify-center text-center p-4">
                <Radio className="w-10 h-10 text-sky-300 mb-2 animate-pulse" />
                <span className="font-bold text-sm">{t('radarAltimetry', 'Dual-Frequency Radar Altimetry')}</span>
                <span className="text-xs text-sky-200/80 font-mono mt-1">Direct Nadir Altimeter Swath</span>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] bg-black/50 backdrop-blur px-2 py-1 rounded">
                  <span>0.5m (Calm)</span>
                  <span>➔</span>
                  <span>4.2m (Extreme Swell)</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t('colorIndex', 'Color Index:')} {currentProduct.paletteType}</span>
            <span className="text-sky-300 font-mono">{t('isroBhuvanGis', 'ISRO Bhuvan GIS Compatible')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
