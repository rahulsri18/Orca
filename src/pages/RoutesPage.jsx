import React, { useState } from 'react';
import { HARBORS, MOCK_ROUTES } from '../data/mockRoutes';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { Navigation, Compass, ShieldCheck, AlertTriangle, Fuel, Clock, Waves, ChevronRight, CheckCircle2 } from 'lucide-react';

export function RoutesPage({ onNavigateToMap = null }) {
  const { t } = useLanguage();
  const [selectedRouteKey, setSelectedRouteKey] = useState('MNG-KRW');
  const routeData = MOCK_ROUTES[selectedRouteKey] || MOCK_ROUTES['MNG-KRW'];

  const { directRoute, safeRoute, origin, destination } = routeData;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ocean-deep via-ocean-navy to-ocean-medium text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Compass className="w-6 h-6 text-ocean-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{t('routesPageTitle', 'ORCA Safe Route Navigation Engine')}</h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  Hydrodynamic Routing
                </span>
              </div>
              <p className="text-xs md:text-sm text-sky-100/80 mt-1">
                {t('routesPageSub', 'Dynamic vessel corridor optimization: Avoiding high breaking swells, submerged shoals, and restricted marine sanctuaries.')}
              </p>
            </div>
          </div>

          {/* Route selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-200 font-semibold">{t('activeSector', 'Active Sector')}:</span>
            <select
              value={selectedRouteKey}
              onChange={(e) => setSelectedRouteKey(e.target.value)}
              className="bg-ocean-navy border border-sky-400/30 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="MNG-KRW">Malpe / Mangalore ➔ Karwar Harbor</option>
              <option value="KOC-KLM">Kochi Port ➔ Kollam Outer Bank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison: Direct vs ORCA Safe Route */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Direct Route Card (Dangerous) */}
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            {t('hazardousDirectCourse', 'Hazardous Direct Course')}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold">{t('straightCompassCourse', 'Straight Compass Course')}</span>
              <h3 className="text-base font-bold text-slate-900">{origin} ➔ {destination}</h3>
            </div>
            <RiskBadge level={directRoute.riskLevel} score={directRoute.riskScore} size="sm" />
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t('severeWarning', 'Severe Warning')}:</span> {t(directRoute.riskWarning)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{t('distance', 'Distance')}</span>
              <span className="text-sm font-bold text-slate-800">{directRoute.distanceNm} nm</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{t('estTime', 'Est. Time')}</span>
              <span className="text-sm font-bold text-slate-800">{directRoute.estimatedHours} hrs</span>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-800">
              <span className="text-[11px] text-rose-600 block">{t('maxWave', 'Max Wave')}</span>
              <span className="text-sm font-bold">{directRoute.maxWaveHeight}m</span>
            </div>
          </div>

          {/* Segment breakdown */}
          {directRoute.segments && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('courseSegments', 'Course Segments')}</span>
              {directRoute.segments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700">{seg.from} ➔ {seg.to}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">{seg.wave}</span>
                    <RiskBadge level={seg.risk} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ORCA Safe Route Card (Recommended) */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-md space-y-4 relative overflow-hidden ring-2 ring-emerald-100">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t('orcaSafeRoute', 'ORCA Recommended Safe Route')}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-emerald-700 font-bold uppercase">{t('deepWaterCorridor', 'Optimized Deep-Water Corridor')}</span>
              <h3 className="text-base font-bold text-slate-900">{origin} ➔ {destination}</h3>
            </div>
            <RiskBadge level={safeRoute.riskLevel} score={safeRoute.riskScore} size="sm" />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t('evidence', 'Optimization Rationale')}:</span> {t(safeRoute.safetyBonus)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{t('distance', 'Safe Distance')}</span>
              <span className="text-sm font-bold text-slate-800">{safeRoute.distanceNm} nm</span>
              <span className="text-[10px] text-slate-400">{t('safeDetour', '(+4.4 nm safe detour)')}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{t('estTime', 'Est. Time')}</span>
              <span className="text-sm font-bold text-slate-800">{safeRoute.estimatedHours} hrs</span>
              <span className="text-[10px] text-emerald-600">{t('currentAssisted', '(current assisted)')}</span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-800">
              <span className="text-[11px] text-emerald-600 block">{t('maxWave', 'Max Wave')}</span>
              <span className="text-sm font-bold">{safeRoute.maxWaveHeight}m</span>
              <span className="text-[10px] text-emerald-600">{t('rollReduction', '(-52% roll reduction)')}</span>
            </div>
          </div>

          {/* Segment breakdown */}
          {safeRoute.segments && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('inspectSafeWaypoints', 'Safe Waypoints')}</span>
              {safeRoute.segments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-medium text-slate-800">{seg.from} ➔ {seg.to}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-700">{seg.wave}</span>
                    <RiskBadge level={seg.risk} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                alert(t('routeDispatchedAlert', "Safe route coordinates dispatched to NavIC transponder vessel unit!"));
              }}
              className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('broadcastNavicRoute', 'Broadcast to Vessel NavIC Transponder')}</span>
            </button>

            {onNavigateToMap && (
              <button
                type="button"
                onClick={onNavigateToMap}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                {t('inspectOnMap', 'Inspect Map')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
