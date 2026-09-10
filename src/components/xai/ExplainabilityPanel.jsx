import React from 'react';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Info, Database, Layers, CheckCircle2, Award, Clock } from 'lucide-react';

export function ExplainabilityPanel({ scenario, onClose = null }) {
  const { t } = useLanguage();
  if (!scenario) return null;

  const {
    headline,
    riskLevel,
    riskScore,
    confidenceScore,
    explainability,
    sources = [],
    conditionsSummary = {}
  } = scenario;

  const conf = explainability?.confidenceBreakdown || {
    overall: confidenceScore || 92,
    dataFreshness: 96,
    sensorConsensus: 92,
    modelCertainty: 90
  };

  const riskWeights = explainability?.riskWeights || [
    { factor: "Swell & Wave Surge", weight: 40, impact: "Critical vessel instability risk" },
    { factor: "Wind Speed & Squall Potential", weight: 30, impact: "Navigation and steering hazard" },
    { factor: "Lightning Proximity", weight: 20, impact: "Atmospheric discharge threat" },
    { factor: "Shallow Bathymetry Interaction", weight: 10, impact: "Harbor bar wave shoaling" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-deep via-ocean-medium to-ocean-navy text-white p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Award className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold">{t('xaiTitle', 'Explainable AI (XAI) Reasoning Audit')}</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  {t('isroStandards', 'ISRO SIH26176 Standards')}
                </span>
              </div>
              <p className="text-xs text-sky-100/80">
                {t('xaiSubtitle', 'Transparent multi-agent verification, confidence attribution, and sensor telemetry provenance')}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              {t('close', 'Close')}
            </button>
          )}
        </div>

        {/* Quick Decision Strip */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-sky-200">{t('recommendation', 'Recommendation')}:</span>
            <span className="font-semibold text-white">{t(headline)}</span>
          </div>
          <div className="flex items-center gap-2">
            <RiskBadge level={riskLevel} score={riskScore} size="sm" />
            <ConfidenceBadge score={confidenceScore} size="sm" />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Section 1: Confidence Decomposition Meter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('confidenceDecompTitle', 'Confidence Decomposition Meter')} (Overall: {conf.overall}%)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{t('dataFreshness', 'Data Freshness')}</span>
                <span className="font-mono text-emerald-700">{conf.dataFreshness}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${conf.dataFreshness}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t('freshnessDesc', 'Satellite & radar telemetry refreshed <15 mins ago')}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{t('sensorConsensus', 'Sensor Consensus')}</span>
                <span className="font-mono text-sky-700">{conf.sensorConsensus}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-600 h-full rounded-full" style={{ width: `${conf.sensorConsensus}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t('consensusDesc', 'INCOIS buoys & IMD Doppler radar cross-correlated')}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{t('modelCertainty', 'Model Certainty')}</span>
                <span className="font-mono text-ocean-teal">{conf.modelCertainty}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-ocean-teal h-full rounded-full" style={{ width: `${conf.modelCertainty}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t('certaintyDesc', 'High ensemble stability across hydrodynamic models')}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Weighted Risk Factors Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>{t('riskDriversTitle', 'Key Contributing Risk Drivers (Weighted Sensitivity)')}</span>
          </h4>

          <div className="space-y-2.5">
            {riskWeights.map((rw, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>{t(rw.factor)}</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    {t('weight', 'Weight')}: {rw.weight}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full ${
                      riskLevel === 'HIGH' ? 'bg-rose-500' : riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${rw.weight * 2}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{t(rw.impact)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Sensor Provenance & Verification */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-ocean-teal" />
            <span>{t('provenanceTitle', 'Data Provenance & Observation Timestamps')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sources.map((src, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-sm text-xs">
                <div>
                  <div className="font-bold text-slate-800">{t(src.name)}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">{t('payloadId', 'Payload ID')}: {src.id}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{t(src.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
