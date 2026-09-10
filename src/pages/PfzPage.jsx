import React, { useState } from 'react';
import { MOCK_PFZ } from '../data/mockPfz';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { Fish, Sparkles, MapPin, Compass, Thermometer, Waves, Filter, ArrowUpRight, Search } from 'lucide-react';

export function PfzPage({ onAskOrca = null, onNavigateToMap = null }) {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPfz = MOCK_PFZ.filter(pfz => {
    const matchesRegion = selectedRegion === 'ALL' || pfz.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch = pfz.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pfz.primarySpecies.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-ocean-deep text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Fish className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{t('pfzPageTitle', 'Potential Fishing Zones (PFZ) Advisory')}</h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  INCOIS / ISRO Oceansat-3
                </span>
              </div>
              <p className="text-xs md:text-sm text-emerald-100/80 mt-1">
                {t('pfzPageSub', 'Real-time ocean color & sea surface temperature front convergence. Maximizing catch per unit effort while maintaining vessel safety.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <span className="font-semibold text-emerald-200">{t('satellitePassLabel', 'Satellite Pass')}:</span>
            <span>Oceansat-3 OCM-3 (06:30 IST)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('pfzSearchPlaceholder', 'Search by zone name or target fish species (e.g., Tuna, Mackerel)...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs md:text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('region', 'Region')}:</span>
          </span>
          {['ALL', 'Andhra', 'Kerala', 'Tamil Nadu', 'Maharashtra', 'Gujarat'].map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                selectedRegion === reg
                  ? 'bg-ocean-deep text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reg === 'ALL' ? t('allCoasts', 'All Coasts') : reg}
            </button>
          ))}
        </div>
      </div>

      {/* PFZ Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPfz.map((pfz) => {
          const isHigh = pfz.riskLevel === 'HIGH';
          const isMed = pfz.riskLevel === 'MEDIUM';

          return (
            <div
              key={pfz.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${
                isHigh ? 'border-rose-200 bg-rose-50/20' : isMed ? 'border-amber-200' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal">
                      {t(pfz.region)}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {t(pfz.zoneName)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pfz.distanceNm} nm {t('offshoreRegion', 'offshore')} • {t('bearing', 'Bearing')}: {pfz.bearing}</span>
                    </div>
                  </div>
                  <RiskBadge level={pfz.riskLevel} size="sm" />
                </div>

                {/* Suitability Index Metric */}
                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">{t('suitability', 'Fishing Suitability Score')}</span>
                    <span className={`font-mono font-bold ${isHigh ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {pfz.suitabilityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${pfz.suitabilityScore}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {t('currentRisk', 'Risk')}: <strong className={isHigh ? 'text-rose-700' : 'text-slate-800'}>{pfz.safeWindow}</strong>
                  </div>
                </div>

                {/* Oceanographic Parameters */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">{t('sst', 'SST Temperature')}</span>
                    <span className="font-bold text-slate-800">{pfz.sstCelsius}°C</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">{t('chlorophyll', 'Chlorophyll Density')}</span>
                    <span className="font-bold text-emerald-800">{pfz.chlorophyllMgM3} mg/m³</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">{t('waveHeight', 'Wave Swell')}</span>
                    <span className="font-bold text-slate-800">{pfz.waveForecast}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">{t('depth', 'Ocean Depth')}</span>
                    <span className="font-bold text-slate-800">{pfz.depthMeters} m</span>
                  </div>
                </div>

                {/* Target species tags */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('targetSpecies', 'Target Species')}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pfz.primarySpecies.map((sp, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-medium border border-sky-100">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {onAskOrca && (
                  <button
                    type="button"
                    onClick={() => onAskOrca(pfz)}
                    className="w-full py-2 px-3 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ocean-cyan" />
                    <span>{t('askOrcaPfz', 'Ask ORCA Safety Analysis')}</span>
                  </button>
                )}

                {onNavigateToMap && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMap(pfz.coordinates, pfz.zoneName)}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('highlightMap', 'View on Map')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
