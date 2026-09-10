import React from 'react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function AgentNode({ agent, status = 'waiting', findings = null, durationMs = null, isParallel = false }) {
  const { t } = useLanguage();
  const IconComponent = Icons[agent.icon] || Icons.Cpu;

  const statusConfigs = {
    waiting: {
      border: 'border-slate-200 bg-slate-50/70 text-slate-400',
      iconBox: 'bg-slate-200 text-slate-500',
      badge: 'bg-slate-100 text-slate-500',
      statusText: t('waitingForUpstream', 'Waiting for upstream pipeline...'),
      glow: ''
    },
    active: {
      border: 'border-sky-400 bg-sky-50/90 text-sky-950 shadow-md ring-2 ring-sky-300',
      iconBox: 'bg-ocean-deep text-sky-300',
      badge: 'bg-sky-100 text-sky-800 animate-pulse',
      statusText: t('executingQuery', 'Executing multi-parametric query...'),
      glow: 'animate-agent-active'
    },
    completed: {
      border: 'border-emerald-300 bg-emerald-50/60 text-slate-900',
      iconBox: 'bg-emerald-700 text-white',
      badge: 'bg-emerald-100 text-emerald-800',
      statusText: t('telemetryValidated', 'Telemetry validated'),
      glow: ''
    }
  };

  const cfg = statusConfigs[status] || statusConfigs.waiting;

  return (
    <div className={`relative rounded-xl border p-3.5 transition-all duration-300 ${cfg.border} ${cfg.glow} ${isParallel ? 'bg-gradient-to-b from-white to-slate-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg transition-colors ${cfg.iconBox}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs md:text-sm text-slate-900">{t(agent.name)}</span>
              {agent.badge && (
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {agent.badge}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-tight">
              {t(agent.role)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {status === 'active' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full animate-pulse">
              <Icons.Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>{t('processing', 'PROCESSING')}</span>
            </span>
          )}
          {status === 'completed' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <Icons.CheckCircle2 className="w-2.5 h-2.5" />
              <span>{durationMs ? `${durationMs}ms` : t('ready', 'READY')}</span>
            </span>
          )}
          {status === 'waiting' && (
            <span className="text-[10px] font-medium text-slate-400">
              {t('standby', 'STANDBY')}
            </span>
          )}
        </div>
      </div>

      {findings ? (
        <div className="mt-2.5 text-xs text-slate-700 bg-white/90 border border-slate-200/80 rounded-lg p-2 font-mono leading-relaxed">
          <span className="text-ocean-teal font-semibold font-sans mr-1.5">{t('finding', 'Finding:')}</span>
          {t(findings)}
        </div>
      ) : status === 'active' ? (
        <div className="mt-2.5 text-xs text-sky-700 bg-sky-100/50 rounded-lg p-2 italic flex items-center gap-2">
          <Icons.Radio className="w-3.5 h-3.5 animate-spin text-sky-600 shrink-0" />
          <span>{t('ingestingFeed', 'Ingesting coastal satellite feed & Doppler returns...')}</span>
        </div>
      ) : null}
    </div>
  );
}
