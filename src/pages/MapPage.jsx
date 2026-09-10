import React, { useState, useRef } from 'react';
import { MapWidget } from '../components/map/MapWidget';
import { LayerControl, LAYER_DEFINITIONS } from '../components/map/LayerControl';
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
  Globe
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

  const [isLayerControlOpen, setIsLayerControlOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(highlightedCoordinates);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [isSliderExpanded, setIsSliderExpanded] = useState(true);

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
  };

  const handleSelectAllIndia = () => {
    setSelectedRegionId('all-india');
    setCurrentCoords([12.5, 78.5]);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  return (
    <div className="relative flex flex-col h-[calc(100vh-140px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-marine bg-slate-100">
      {/* Top Map Control Toolbar */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 max-w-[85vw]">
        {/* Layer drawer toggle button */}
        <button
          onClick={() => setIsLayerControlOpen(!isLayerControlOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-bold shadow-lg border border-ocean-navy transition-all"
        >
          <Layers className="w-4 h-4 text-ocean-cyan" />
          <span>{t('marineGisLayers', 'Layers')} ({activeCount}/{LAYER_DEFINITIONS.length})</span>
        </button>

        {/* Selected Region Status Pill */}
        {selectedRegionId && selectedRegionId !== 'all-india' && (
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-medium">Focused Sector:</span>
            <strong className="text-slate-900 font-bold">
              {COASTAL_REGIONS.find(r => r.id === selectedRegionId)?.name || selectedRegionId}
            </strong>
            <button
              onClick={handleSelectAllIndia}
              className="ml-1 text-[10px] text-ocean-teal hover:underline font-semibold"
            >
              Reset View
            </button>
          </div>
        )}
      </div>

      {/* Floating Layer Control Drawer */}
      <LayerControl
        isOpen={isLayerControlOpen}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        onClose={() => setIsLayerControlOpen(false)}
      />

      {/* Map Widget Instance */}
      <div className="flex-1 w-full h-full">
        <MapWidget
          activeLayers={activeLayers}
          highlightedCoordinates={currentCoords || highlightedCoordinates}
          onAskOrca={onAskOrca}
        />
      </div>

      {/* Floating Sliding Coastal Region Selector Dock at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] md:left-6 md:right-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-none transition-all">
        {/* Dock Header Bar with Collapse / Expand Toggle */}
        <div className="pointer-events-auto mb-1.5 flex items-center gap-2">
          <button
            onClick={() => setIsSliderExpanded(!isSliderExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-deep/95 hover:bg-ocean-navy backdrop-blur-md text-white text-xs font-bold shadow-lg border border-ocean-cyan/30 transition-all active:scale-95"
          >
            <Anchor className="w-3.5 h-3.5 text-ocean-cyan" />
            <span>Coastal Maritime Regions (12 Sectors • 7,516 km)</span>
            {isSliderExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-sky-300" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-sky-300" />
            )}
          </button>
        </div>

        {/* Sliding Carousel Rail */}
        {isSliderExpanded && (
          <div className="pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-2xl p-2 md:p-2.5 shadow-2xl border border-slate-200/90 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollSlider('left')}
              className="p-1.5 md:p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-ocean-deep transition-all shrink-0 active:scale-90"
              title="Slide Left"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={sliderRef}
              className="flex items-center gap-2.5 overflow-x-auto scroll-smooth py-1 px-1 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Pan-India Reset Card */}
              <button
                type="button"
                onClick={handleSelectAllIndia}
                className={`shrink-0 text-left p-2.5 rounded-xl border transition-all cursor-pointer min-w-[150px] max-w-[160px] flex flex-col justify-between ${
                  selectedRegionId === 'all-india'
                    ? 'bg-sky-50 border-ocean-teal ring-2 ring-ocean-teal/40 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">🇮🇳</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                    NATIONAL
                  </span>
                </div>
                <div className="font-extrabold text-xs text-slate-900 truncate">Pan-India View</div>
                <div className="text-[10px] text-slate-500 mt-0.5">7,516 km Coastline</div>
              </button>

              {/* Individual Coastal Region Cards */}
              {COASTAL_REGIONS.map((region) => {
                const isSelected = selectedRegionId === region.id;
                const isHigh = region.riskLevel === 'HIGH';
                const isMed = region.riskLevel === 'MEDIUM';
                const badgeColor = isHigh
                  ? 'bg-rose-100 text-rose-800'
                  : isMed
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800';

                return (
                  <div
                    key={region.id}
                    onClick={() => handleSelectRegion(region)}
                    className={`shrink-0 text-left p-2.5 rounded-xl border transition-all cursor-pointer min-w-[210px] max-w-[220px] flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-50/90 border-ocean-teal ring-2 ring-ocean-teal shadow-md'
                        : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-ocean-teal uppercase truncate">
                          {region.state}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${badgeColor}`}>
                          {region.riskLevel}
                        </span>
                      </div>

                      <div className="font-extrabold text-xs text-slate-900 truncate leading-snug">
                        {region.name}
                      </div>

                      <div className="text-[10px] text-slate-500 mt-0.5 flex justify-between">
                        <span>Coast: {region.coastlineKm}</span>
                        <span>Waves: {region.waveState.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 truncate max-w-[120px]">
                        {region.harbors[0]}
                      </span>
                      <span className="font-bold text-ocean-teal flex items-center gap-0.5 hover:underline">
                        <span>Fly to</span>
                        <MapPin className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollSlider('right')}
              className="p-1.5 md:p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-ocean-deep transition-all shrink-0 active:scale-90"
              title="Slide Right"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
