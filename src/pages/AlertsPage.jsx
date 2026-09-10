import React, { useState } from 'react';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { AlertOctagon, AlertTriangle, ShieldAlert, Bell, Radio, Filter, MapPin, Volume2, CheckCircle2 } from 'lucide-react';

export function AlertsPage({ onNavigateToMap = null, onAskOrca = null }) {
  const { t } = useLanguage();
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredAlerts = MOCK_ALERTS.filter(alt => {
    if (severityFilter === 'ALL') return true;
    return alt.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-ocean-deep text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{t('alertsPageTitle', 'Marine Hazard & Safety Broadcast Center')}</h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/30 animate-pulse">
                  {t('activeCoastalAlert', 'Active Coastal Alert')}
                </span>
              </div>
              <p className="text-xs md:text-sm text-rose-100/80 mt-1">
                {t('alertsPageSub', 'Multi-agency early warning feeds from IMD Cyclone Warning Centre, INCOIS Tsunami/Surge, and Coast Guard NavIC.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              alert(t('audioSirenBtn', 'Audio siren & NavIC coastal distress broadcast triggered for coastal stations!'));
            }}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Volume2 className="w-4 h-4 text-rose-200" />
            <span>{t('testAudioBroadcast', 'Test Audio Broadcast Horn')}</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t('filterSeverity', 'Filter Severity')}:</span>
          <div className="flex items-center gap-1.5">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  severityFilter === sev
                    ? sev === 'HIGH' ? 'bg-rose-700 text-white' :
                      sev === 'MEDIUM' ? 'bg-amber-600 text-white' :
                      sev === 'LOW' ? 'bg-emerald-700 text-white' :
                      'bg-ocean-deep text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev === 'ALL' ? t('allAlerts', 'All Alerts') : 
                 sev === 'HIGH' ? t('severeRed', 'Severe Red') : 
                 sev === 'MEDIUM' ? t('moderateCaution', 'Moderate Caution') : 
                 t('advisories', 'Advisories')}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium mr-2">
          {filteredAlerts.length} / {MOCK_ALERTS.length} {t('noticesCount', 'Notices')}
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isHigh = alert.severity === 'HIGH';
          const isMed = alert.severity === 'MEDIUM';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                isHigh ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' :
                isMed ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isHigh ? 'bg-rose-100 text-rose-700' :
                    isMed ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isHigh ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t(alert.category)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ID: {alert.id}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug mt-0.5">
                      {t(alert.title)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t('issuedBy', 'Issued by')}: <strong>{alert.issuedBy}</strong> • {alert.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge level={alert.severity} size="md" />
                </div>
              </div>

              {/* Body */}
              <div className="mt-3 space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {t(alert.summary)}
                </p>

                {/* Directive */}
                <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                  isHigh ? 'bg-rose-100/70 border-rose-200 text-rose-950 font-medium' :
                  isMed ? 'bg-amber-100/70 border-amber-200 text-amber-950' :
                  'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}>
                  <Radio className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider">{t('officialDirectives', 'Mandatory Maritime Directive')}: </span>
                    <span>{t(alert.actionRequired)}</span>
                  </div>
                </div>

                {/* Regions and Telemetry Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">{t('effectiveRange', 'Affected Sectors')}:</span>
                    <span className="font-medium text-slate-800">{alert.affectedRegions.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {alert.waveHeightMax && (
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                        {t('waveHeight', 'Waves')}: <strong>{alert.waveHeightMax}</strong>
                      </span>
                    )}
                    {alert.windSpeedMax && (
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                        {t('windSpeed', 'Wind')}: <strong>{alert.windSpeedMax}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                {onAskOrca && (
                  <button
                    type="button"
                    onClick={() => onAskOrca({ zoneName: alert.affectedRegions[0], name: alert.title })}
                    className="py-1.5 px-3 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    {t('askOrcaSafety', 'Consult ORCA on Safety Contingency')}
                  </button>
                )}

                {onNavigateToMap && alert.coordinates && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMap(alert.coordinates, alert.title)}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('viewDangerCone', 'View Danger Zone on Map')}</span>
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
