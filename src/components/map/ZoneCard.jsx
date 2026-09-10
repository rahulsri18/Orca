import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RiskBadge } from '../common/RiskBadge';
import { Sparkles, Navigation, Waves, Wind, Thermometer, Fish, AlertTriangle } from 'lucide-react';

export function ZoneCard({
  zone,
  onAskOrca = null,
  onPlotRoute = null,
  compact = false
}) {
  const { t } = useLanguage();
  if (!zone) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden text-slate-800 ${compact ? 'w-64 p-3' : 'w-72 md:w-80 p-4'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal">
            {zone.type ? t(zone.type) : 'Marine Spatial Sector'}
          </span>
          <h4 className="font-bold text-sm text-slate-900 leading-tight">
            {zone.name ? t(zone.name) : (zone.zoneName ? t(zone.zoneName) : 'Offshore Sector')}
          </h4>
          <p className="text-[11px] text-slate-500">{zone.region ? t(zone.region) : 'Indian EEZ'}</p>
        </div>
        <RiskBadge level={zone.riskLevel || 'LOW'} size="sm" />
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 my-3 text-xs">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
            <Waves className="w-3.5 h-3.5 text-sky-600" />
            <span>{t('waveHeight', 'Wave Swell')}</span>
          </div>
          <span className="font-bold text-slate-800">{zone.waveForecast || zone.waveHeight || '1.2m'}</span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('sst', 'SST Temp')}</span>
          </div>
          <span className="font-bold text-slate-800">{zone.sstCelsius ? `${zone.sstCelsius}°C` : '28.2°C'}</span>
        </div>

        {zone.chlorophyllMgM3 && (
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
              <Fish className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('chlorophyll', 'Chlorophyll-a')}</span>
            </div>
            <span className="font-bold text-slate-800">{zone.chlorophyllMgM3} mg/m³</span>
          </div>
        )}

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
            <Wind className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('windSpeed', 'Wind / Breeze')}</span>
          </div>
          <span className="font-bold text-slate-800">{zone.windForecast || '12 kts'}</span>
        </div>
      </div>

      {zone.alertWarning && (
        <div className="p-2 mb-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>{t(zone.alertWarning)}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-1.5 pt-1">
        {onAskOrca && (
          <button
            type="button"
            onClick={() => onAskOrca(zone)}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-ocean-deep to-ocean-medium hover:from-ocean-navy hover:to-ocean-deep text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-ocean-cyan" />
            <span>{t('askOrcaSafety', 'Ask ORCA About This Zone')}</span>
          </button>
        )}

        {onPlotRoute && (
          <button
            type="button"
            onClick={() => onPlotRoute(zone)}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t('plotSafeCorridor', 'Plot Safe Navigation Path')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
