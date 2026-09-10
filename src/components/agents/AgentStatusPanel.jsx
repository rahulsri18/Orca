import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AGENT_ROSTER } from '../../data/mockAgents';
import { AgentNode } from './AgentNode';
import { AgentLogStream } from './AgentLogStream';
import { ArrowDown, GitFork, Cpu, Terminal, Sparkles } from 'lucide-react';

export function AgentStatusPanel({
  steps = [],
  activeStepIndex = -1,
  isSimulating = false,
  logs = [],
  className = ''
}) {
  const { t } = useLanguage();
  const [showLogs, setShowLogs] = useState(false);

  const getAgentStatus = (agentId) => {
    if (!isSimulating && steps.length === 0) return 'waiting';
    const step = steps.find(s => s.agentId === agentId);
    if (!step) return 'waiting';

    const stepIdx = steps.findIndex(s => s.agentId === agentId);
    if (isSimulating) {
      if (stepIdx < activeStepIndex) return 'completed';
      if (stepIdx === activeStepIndex) return 'active';
      // For parallel agents (ocean, weather, geo) when activeStepIndex is in the parallel phase
      if (activeStepIndex >= 1 && activeStepIndex <= 3 && (agentId === 'ocean' || agentId === 'weather' || agentId === 'geo')) {
        if (stepIdx <= activeStepIndex) return 'active';
      }
      return 'waiting';
    }
    return step.status || 'completed';
  };

  const getFindings = (agentId) => {
    const step = steps.find(s => s.agentId === agentId);
    return step ? step.findings : null;
  };

  const getDuration = (agentId) => {
    const step = steps.find(s => s.agentId === agentId);
    return step ? step.durationMs : null;
  };

  const plannerAgent = AGENT_ROSTER.find(a => a.id === 'planner');
  const oceanAgent = AGENT_ROSTER.find(a => a.id === 'ocean');
  const weatherAgent = AGENT_ROSTER.find(a => a.id === 'weather');
  const geoAgent = AGENT_ROSTER.find(a => a.id === 'geo');
  const riskAgent = AGENT_ROSTER.find(a => a.id === 'risk');
  const decisionAgent = AGENT_ROSTER.find(a => a.id === 'decision');

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-4 md:p-5 shadow-marine ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-100 text-ocean-deep">
            <Cpu className="w-4 h-4 text-ocean-teal" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{t('multiAgentIntel', 'Multi-Agent Collaborative Intelligence')}</span>
              {isSimulating && (
                <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  {t('simulatingPipeline', 'SIMULATING PIPELINE')}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {t('pipelineDesc', 'Parallel sensor ingestion → Probabilistic risk synthesis → Actionable marine advisory')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            showLogs
              ? 'bg-slate-900 text-emerald-400 border border-slate-800'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{showLogs ? t('hideTelemetryBus', 'Hide Telemetry Bus') : t('inspectTelemetryBus', 'Inspect Telemetry Bus')}</span>
        </button>
      </div>

      {/* Terminal logs drawer */}
      {showLogs && (
        <div className="mb-4">
          <AgentLogStream logs={logs} isRunning={isSimulating} />
        </div>
      )}

      {/* Stage 1: Planner Agent */}
      <div className="space-y-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <span>{t('phase1Decomp', 'Phase 1: Task Decomposition')}</span>
          </div>
          <AgentNode
            agent={plannerAgent}
            status={getAgentStatus('planner')}
            findings={getFindings('planner')}
            durationMs={getDuration('planner')}
          />
        </div>

        {/* Fork Connector */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-0.5 rounded-full border border-sky-200">
            <GitFork className="w-3.5 h-3.5 rotate-180 text-ocean-teal" />
            <span>{t('parallelIngestion', 'Parallel Autonomous Ingestion')}</span>
          </div>
        </div>

        {/* Stage 2: Parallel Agents (Ocean, Weather, Geo) */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {t('phase2Ingestion', 'Phase 2: Multi-Source Sensor Ingestion (Concurrent)')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <AgentNode
              agent={oceanAgent}
              status={getAgentStatus('ocean')}
              findings={getFindings('ocean')}
              durationMs={getDuration('ocean')}
              isParallel
            />
            <AgentNode
              agent={weatherAgent}
              status={getAgentStatus('weather')}
              findings={getFindings('weather')}
              durationMs={getDuration('weather')}
              isParallel
            />
            <AgentNode
              agent={geoAgent}
              status={getAgentStatus('geo')}
              findings={getFindings('geo')}
              durationMs={getDuration('geo')}
              isParallel
            />
          </div>
        </div>

        {/* Down Connector */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
            <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('multiParametricSynthesis', 'Multi-Parametric Synthesis')}</span>
          </div>
        </div>

        {/* Stage 3: Risk Agent */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {t('phase3Modeling', 'Phase 3: Probabilistic Marine Hazard Modeling')}
          </div>
          <AgentNode
            agent={riskAgent}
            status={getAgentStatus('risk')}
            findings={getFindings('risk')}
            durationMs={getDuration('risk')}
          />
        </div>

        {/* Down Connector */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('actionableAdvisory', 'Actionable Advisory Policy')}</span>
          </div>
        </div>

        {/* Stage 4: Decision / ORCA Agent */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {t('phase4Advisory', 'Phase 4: Synthesized Marine Safety Advisory')}
          </div>
          <AgentNode
            agent={decisionAgent}
            status={getAgentStatus('decision')}
            findings={getFindings('decision')}
            durationMs={getDuration('decision')}
          />
        </div>
      </div>
    </div>
  );
}
