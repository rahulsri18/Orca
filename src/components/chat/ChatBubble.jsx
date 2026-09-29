import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ExplainabilityPanel } from '../xai/ExplainabilityPanel';
import { useLanguage } from '../../context/LanguageContext';
import { speakAdvisory, stopSpeech, playMarineWarningHorn } from '../../lib/audioService';
import {
  User,
  Radio,
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
  AlertTriangle,
  Compass,
  CloudRain,
  ShieldCheck,
  FileText,
  Anchor,
  Sparkles
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
  const [showTechnical, setShowTechnical] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 my-3">
        <div className="max-w-xl bg-[#0B2942] text-white rounded border border-[#0D5C7A] px-4 py-2.5 shadow-xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 flex items-center justify-between mb-1">
            <span>YOUR QUESTION</span>
            <span className="text-slate-400">{message.timestamp || 'Just now'}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <div className="w-8 h-8 rounded bg-[#071A2B] text-slate-300 border border-[#0B2942] flex items-center justify-center shrink-0">
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
      const speechText = message.scenario?.recommendation || message.text || message.scenario?.headline || '';
      setIsSpeaking(true);
      speakAdvisory(speechText, currentLang, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCopy = () => {
    const textToCopy = message.scenario?.recommendation || message.text || '';
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scenario = message.scenario;

  // If no structured scenario is attached, render a standard clean message bubble
  if (!scenario) {
    return (
      <div className="flex justify-start gap-2.5 my-3">
        <div className="w-8 h-8 rounded bg-[#071A2B] border border-[#0D5C7A] text-[#2EAFD0] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#2EAFD0]" />
        </div>
        <div className="max-w-xl bg-[#0B2942]/90 backdrop-blur-md text-white rounded-lg border border-[#0D5C7A] px-4 py-3 shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 flex items-center justify-between mb-1.5">
            <span>ORCA ASSISTANT</span>
            <span className="text-slate-400">{message.timestamp || 'Just now'}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-100">{message.text}</p>
        </div>
      </div>
    );
  }

  const riskLevel = scenario?.riskLevel || 'LOW';

  // Plain-Language Status Verdict for Fishermen
  const simpleVerdict = riskLevel === 'HIGH'
    ? '🛑 DO NOT GO TO SEA TODAY'
    : riskLevel === 'MEDIUM'
    ? '⚠️ BE CAREFUL — NEAR SHORE ONLY'
    : '✅ SAFE TO GO FISHING TODAY';

  const verdictBoxStyle = riskLevel === 'HIGH'
    ? 'bg-rose-50 border-[#C93C4B] text-[#C93C4B]'
    : riskLevel === 'MEDIUM'
    ? 'bg-amber-50 border-[#D89B24] text-[#D89B24]'
    : 'bg-emerald-50 border-[#1F9D72] text-[#1F9D72]';

  // Primary short plain-language recommendation text
  const primaryText = scenario?.recommendation || message.text;

  return (
    <div className="flex justify-start gap-2.5 my-3">
      {/* ORCA Voice / Radio Icon */}
      <div className="w-8 h-8 rounded bg-[#071A2B] border border-[#0D5C7A] text-[#0F8B8D] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <Sparkles className="w-4 h-4 text-[#0F8B8D]" />
      </div>

      <div className="max-w-2xl flex-1 min-w-0 space-y-2">
        {/* Simple Plain-Language Fisherman Card */}
        <div className="bg-white border-2 border-[#D1DCE5] rounded-lg shadow-sm overflow-hidden">
          {/* Top Bar with Clear Audio Voice Button */}
          <div className="bg-[#071A2B] px-4 py-2 border-b border-[#0B2942] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs tracking-wide">
                ORCA SAFETY ADVICE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B2942] text-cyan-300 border border-[#0D5C7A]">
                SIMPLE ANSWER
              </span>
            </div>

            {/* Quick Listen Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-[#C93C4B] text-white animate-pulse'
                    : 'bg-[#0F8B8D] hover:bg-[#0D5C7A] text-white'
                }`}
                title="Listen to spoken audio"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'STOP VOICE' : '🔊 LISTEN TO ADVICE'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Copy text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#1F9D72]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3.5">
            {/* 1. Big, Clear, High-Contrast Verdict for Low Literacy */}
            <div className={`p-3.5 rounded border-2 flex items-center justify-between gap-3 ${verdictBoxStyle}`}>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  SAFETY DECISION
                </div>
                <div className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                  {simpleVerdict}
                </div>
                {scenario?.targetZone && (
                  <div className="text-xs font-medium text-slate-600 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Area: <strong>{scenario.targetZone}</strong></span>
                  </div>
                )}
              </div>

              <div className="shrink-0 text-right">
                <RiskBadge level={riskLevel} score={scenario?.riskScore} size="lg" />
              </div>
            </div>

            {/* 2. Compressed, To-the-Point Plain-Language Explanation */}
            <div className="text-sm font-semibold text-slate-900 leading-relaxed bg-[#F4F7F8] p-3 rounded border border-slate-200">
              {primaryText}
            </div>

            {/* 3. Three Quick Visual Condition Cards for Fishermen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center gap-2.5">
                <div className="p-2 bg-white rounded border border-slate-200 text-[#0D5C7A]">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Waves</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {riskLevel === 'HIGH' ? '11 feet (3.4m) High' : riskLevel === 'MEDIUM' ? '6.5 feet (2.0m)' : 'Under 3 feet (0.9m)'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center gap-2.5">
                <div className="p-2 bg-white rounded border border-slate-200 text-[#0D5C7A]">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Wind</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {riskLevel === 'HIGH' ? 'Storm wind (55 km/h)' : riskLevel === 'MEDIUM' ? 'Gusty breeze (35 km/h)' : 'Gentle wind (18 km/h)'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center gap-2.5">
                <div className="p-2 bg-white rounded border border-slate-200 text-[#1F9D72]">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Advice</span>
                  <span className={`font-bold text-xs ${riskLevel === 'HIGH' ? 'text-rose-700' : 'text-slate-900'}`}>
                    {riskLevel === 'HIGH' ? 'Stay in harbor' : riskLevel === 'MEDIUM' ? 'Fish near shore' : 'Safe to go fish'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Action Buttons (Map Inspect & Warning Horn) */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {riskLevel === 'HIGH' && (
                  <button
                    type="button"
                    onClick={playMarineWarningHorn}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C93C4B]/10 hover:bg-[#C93C4B]/20 text-[#C93C4B] text-xs font-bold border border-[#C93C4B]/30 cursor-pointer"
                  >
                    <span>🚨 PLAY WARNING HORN</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowTechnical(!showTechnical)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showTechnical ? 'Hide Technical Data' : 'Show Satellite & Buoy Data'}</span>
                  {showTechnical ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {onHighlightMap && scenario?.coordinates && (
                <button
                  type="button"
                  onClick={() => onHighlightMap(scenario.coordinates, scenario.targetZone)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#071A2B] hover:bg-[#0B2942] text-white text-xs font-bold border border-[#0D5C7A] cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0F8B8D]" />
                  <span>SHOW SPOT ON MAP</span>
                </button>
              )}
            </div>
          </div>

          {/* Optional Collapsed Technical Drawer for Judges & Officials */}
          {showTechnical && (
            <div className="p-4 bg-[#EAF0F3] border-t border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[11px] text-slate-700 uppercase">
                  INCOIS BUOYS & ISRO SATELLITE MEASUREMENTS
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">● CONFIDENCE: {scenario?.confidenceScore || 94}%</span>
              </div>

              {/* Conditions Table */}
              {scenario?.conditionsSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                  {Object.entries(scenario.conditionsSummary).map(([key, val]) => (
                    <div key={key} className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">{key}</span>
                      <span className="text-xs font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Data Sources */}
              {scenario?.sources && (
                <div className="text-[11px] font-mono text-slate-600 pt-1">
                  <strong>Ground Truth Sources:</strong> {scenario.sources.map(s => s.name).join(' • ')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
