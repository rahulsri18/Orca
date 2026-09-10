import React, { useState } from 'react';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ExplainabilityPanel } from '../xai/ExplainabilityPanel';
import { useLanguage } from '../../context/LanguageContext';
import { speakAdvisory, stopSpeech, playMarineWarningHorn } from '../../lib/audioService';
import { Sparkles, MapPin, Database, ChevronDown, ChevronUp, Waves, Wind, Thermometer, Eye, Award, Volume2 } from 'lucide-react';

export function RecommendationCard({
  scenario,
  onHighlightMap = null
}) {
  const { currentLang, t } = useLanguage();
  const [showXai, setShowXai] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!scenario) return null;

  const {
    headline,
    riskLevel,
    riskScore,
    confidenceScore,
    recommendation,
    conditionsSummary = {},
    sources = [],
    targetZone,
    coordinates
  } = scenario;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* Risk Header Strip */}
      <div className={`p-4 border-b ${
        riskLevel === 'HIGH' ? 'bg-rose-50/90 border-rose-200' :
        riskLevel === 'MEDIUM' ? 'bg-amber-50/90 border-amber-200' :
        'bg-emerald-50/90 border-emerald-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${
              riskLevel === 'HIGH' ? 'text-rose-600' : riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
            }`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t('multiAgentSynthesis', 'ORCA Multi-Agent Synthesis')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <RiskBadge level={riskLevel} score={riskScore} size="sm" />
            <ConfidenceBadge score={confidenceScore} size="sm" />
          </div>
        </div>

        <h3 className="mt-2 text-base md:text-lg font-bold text-slate-900 leading-snug">
          {headline}
        </h3>
        {targetZone && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
            <MapPin className="w-3.5 h-3.5 text-ocean-teal" />
            <span>{t('targetSector', 'Target Sector')}: <strong>{targetZone}</strong></span>
          </div>
        )}
      </div>

      {/* Main Advisory Narrative */}
      <div className="p-4 md:p-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          {recommendation}
        </p>

        {/* Supporting Marine Conditions Matrix */}
        {conditionsSummary && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {t('keySensorTelemetry', 'Key Sensor Telemetry (Ground Truth)')}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {conditionsSummary.waveHeight && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                    <Waves className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t('waveHeight', 'Significant Waves')}</span>
                  </div>
                  <div className="font-bold text-slate-900">{conditionsSummary.waveHeight}</div>
                </div>
              )}

              {conditionsSummary.windSpeed && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                    <Wind className="w-3.5 h-3.5 text-ocean-teal" />
                    <span>{t('windSpeed', 'Wind & Gusts')}</span>
                  </div>
                  <div className="font-bold text-slate-900">{conditionsSummary.windSpeed}</div>
                </div>
              )}

              {conditionsSummary.sst && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('sst', 'SST Temp')}</span>
                  </div>
                  <div className="font-bold text-slate-900">{conditionsSummary.sst}</div>
                </div>
              )}

              {conditionsSummary.visibility && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t('visibility', 'Visibility')}</span>
                  </div>
                  <div className="font-bold text-slate-900">{conditionsSummary.visibility}</div>
                </div>
              )}

              {conditionsSummary.tide && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] text-slate-500 mb-0.5">🌊 {t('tideTiming', 'Tide Timing')}</div>
                  <div className="font-bold text-slate-900 truncate">{conditionsSummary.tide}</div>
                </div>
              )}

              {conditionsSummary.lightning && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] text-slate-500 mb-0.5">⚡ {t('lightningActivity', 'Lightning Activity')}</div>
                  <div className="font-bold text-slate-900 truncate">{conditionsSummary.lightning}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data Sources Verified Strip */}
        {sources && sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-ocean-teal" />
              <span>{t('dataSources', 'Sensors Verified')}: {sources.map(s => s.name).join(', ')}</span>
            </div>
          </div>
        )}

        {/* Interactive Action Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowXai(!showXai)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Award className="w-4 h-4 text-ocean-teal" />
              <span>{showXai ? t('hideReasoning', 'Hide Reasoning (XAI)') : t('evidence', 'Explain Reasoning (XAI)')}</span>
              {showXai ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Voice Audio Readout Button */}
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeech();
                  setIsSpeaking(false);
                } else {
                  setIsSpeaking(true);
                  speakAdvisory(recommendation, currentLang);
                  setTimeout(() => setIsSpeaking(false), 12000);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSpeaking
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                  : 'bg-sky-50 hover:bg-sky-100 text-ocean-deep border border-sky-200'
              }`}
              title="Read aloud in selected coastal language"
            >
              <Volume2 className="w-4 h-4 text-ocean-teal" />
              <span>{isSpeaking ? t('muteSpeech', 'Mute Speech') : t('listenVoice', 'Listen Voice')}</span>
            </button>

            {/* Marine Horn Alarm Button for High Risk */}
            {riskLevel === 'HIGH' && (
              <button
                type="button"
                onClick={playMarineWarningHorn}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200"
                title="Test authentic coastal marine foghorn alert"
              >
                <span>📢 {t('hornBtn', 'Horn')}</span>
              </button>
            )}
          </div>

          {onHighlightMap && coordinates && (
            <button
              type="button"
              onClick={() => onHighlightMap(coordinates, targetZone)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-ocean-cyan" />
              <span>{t('highlightMap', 'View & Highlight on Marine Map')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Explainable AI Panel */}
      {showXai && (
        <div className="p-4 bg-slate-50/60 border-t border-slate-200">
          <ExplainabilityPanel scenario={scenario} onClose={() => setShowXai(false)} />
        </div>
      )}
    </div>
  );
}
