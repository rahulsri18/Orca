import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RecommendationCard } from './RecommendationCard';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ExplainabilityPanel } from '../xai/ExplainabilityPanel';
import { useLanguage } from '../../context/LanguageContext';
import { speakAdvisory, stopSpeech, playMarineWarningHorn } from '../../lib/audioService';
import {
  User,
  Sparkles,
  Volume2,
  VolumeX,
  MapPin,
  Waves,
  Wind,
  Thermometer,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Award,
  AlertTriangle
} from 'lucide-react';

export function ChatBubble({
  message,
  onHighlightMap = null,
  onSendQuery = null
}) {
  const isUser = message.sender === 'user';
  const { currentLang, t } = useLanguage();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showXai, setShowXai] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 my-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-xl bg-ocean-deep text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md border border-ocean-navy">
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.text}</p>
          <span className="text-[10px] text-sky-200/70 block text-right mt-1 font-mono">
            {message.timestamp || 'Just now'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Handle Speech Toggle
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const speechText = message.text || message.scenario?.recommendation || message.scenario?.headline || '';
      setIsSpeaking(true);
      speakAdvisory(speechText, currentLang, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCopy = () => {
    const textToCopy = message.text || message.scenario?.recommendation || '';
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scenario = message.scenario;
  const hasTelemetry = scenario && (scenario.riskLevel || scenario.conditionsSummary);
  const riskLevel = scenario?.riskLevel || 'LOW';

  return (
    <div className="flex justify-start gap-2.5 my-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ORCA Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ocean-deep via-ocean-medium to-ocean-teal text-white flex items-center justify-center shrink-0 shadow-sm mt-1 ring-2 ring-ocean-teal/30">
        <Sparkles className="w-4 h-4 text-sky-200" />
      </div>

      <div className="max-w-3xl flex-1 min-w-0 space-y-2">
        {/* Header Strip with Agent Name, Verification Tag, and Voice Button */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-ocean-deep font-sans">{t('orcaAiCardTitle', 'ORCA Multi-Agent Assistant')}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
              {t('isroIncoisVerified', 'ISRO / INCOIS Verified')}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              {message.timestamp || 'Just now'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Copy message to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Listen Audio Voice Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                  : 'bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-ocean-deep border border-slate-200'
              }`}
              title="Listen to conversational speech"
            >
              {isSpeaking ? <VolumeX className="w-3 h-3 text-amber-700" /> : <Volume2 className="w-3 h-3 text-ocean-teal" />}
              <span className="text-[11px]">{isSpeaking ? t('mute', 'Mute') : t('listen', 'Listen')}</span>
            </button>
          </div>
        </div>

        {/* Primary Conversational Dialogue Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-4 text-slate-800 shadow-sm transition-all hover:border-slate-300">
          <MarkdownRenderer content={message.text || scenario?.recommendation || "Advisory processed."} />

          {/* Quick Risk Indicator Strip if available */}
          {hasTelemetry && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <RiskBadge level={riskLevel} score={scenario.riskScore} size="sm" />
                {scenario.confidenceScore && (
                  <ConfidenceBadge score={scenario.confidenceScore} size="sm" />
                )}
                {scenario.targetZone && (
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-ocean-teal" />
                    <span>{scenario.targetZone}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Expand Telemetry Toggle */}
                <button
                  onClick={() => setShowTelemetry(!showTelemetry)}
                  className="text-xs font-semibold text-ocean-teal hover:underline flex items-center gap-1"
                >
                  <span>{showTelemetry ? t('hideTelemetry', 'Hide Sensor Telemetry') : t('viewTelemetry', 'View Sensor Telemetry')}</span>
                  {showTelemetry ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {/* Direct Map Inspection Link (Optional, never forced) */}
                {onHighlightMap && scenario.coordinates && (
                  <button
                    onClick={() => onHighlightMap(scenario.coordinates, scenario.targetZone)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-ocean-deep text-xs font-bold border border-sky-200 transition-colors"
                    title="Open GIS map focused on this zone"
                  >
                    <MapPin className="w-3 h-3 text-ocean-teal" />
                    <span>{t('inspectOnMap', 'Inspect on Map')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Expandable Sensor Telemetry & XAI Details */}
        {hasTelemetry && showTelemetry && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {t('incoisSensorTruth', 'INCOIS & ISRO Sensor Ground Truth')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowXai(!showXai)}
                  className="text-xs text-ocean-teal font-semibold hover:underline flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-ocean-teal" />
                  <span>{showXai ? t('hideXaiWeights', 'Hide XAI Weights') : t('evidence', 'Explain Reasoning (XAI)')}</span>
                </button>

                {riskLevel === 'HIGH' && (
                  <button
                    onClick={playMarineWarningHorn}
                    className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold hover:bg-rose-200 border border-rose-300"
                    title="Play coastal foghorn alert"
                  >
                    📢 {t('foghornBtn', 'Foghorn')}
                  </button>
                )}
              </div>
            </div>

            {/* Conditions Grid */}
            {scenario.conditionsSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {scenario.conditionsSummary.waveHeight && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                      <Waves className="w-3 h-3 text-sky-600" />
                      <span>{t('waveHeight', 'Waves / Swell')}</span>
                    </div>
                    <div className="font-bold text-slate-900">{scenario.conditionsSummary.waveHeight}</div>
                  </div>
                )}

                {scenario.conditionsSummary.windSpeed && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                      <Wind className="w-3 h-3 text-ocean-teal" />
                      <span>{t('windSpeed', 'Wind Velocity')}</span>
                    </div>
                    <div className="font-bold text-slate-900">{scenario.conditionsSummary.windSpeed}</div>
                  </div>
                )}

                {scenario.conditionsSummary.sst && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                      <Thermometer className="w-3 h-3 text-amber-600" />
                      <span>{t('sst', 'SST Temperature')}</span>
                    </div>
                    <div className="font-bold text-slate-900">{scenario.conditionsSummary.sst}</div>
                  </div>
                )}

                {scenario.conditionsSummary.tide && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 mb-0.5">🌊 {t('tide', 'Tidal Phase')}</div>
                    <div className="font-bold text-slate-900 truncate">{scenario.conditionsSummary.tide}</div>
                  </div>
                )}

                {scenario.conditionsSummary.visibility && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 mb-0.5">👁️ {t('visibility', 'Visibility')}</div>
                    <div className="font-bold text-slate-900 truncate">{scenario.conditionsSummary.visibility}</div>
                  </div>
                )}

                {scenario.conditionsSummary.lightning && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 mb-0.5">⚡ {t('squallLightning', 'Squall / Lightning')}</div>
                    <div className="font-bold text-slate-900 truncate">{scenario.conditionsSummary.lightning}</div>
                  </div>
                )}
              </div>
            )}

            {/* XAI Explainability Drawer */}
            {showXai && (
              <div className="pt-2 border-t border-slate-200">
                <ExplainabilityPanel scenario={scenario} onClose={() => setShowXai(false)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
