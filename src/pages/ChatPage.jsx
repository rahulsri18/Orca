import React from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Cpu, Radio, ShieldCheck, MapPin } from 'lucide-react';
import { AGENT_ROSTER } from '../data/mockAgents';

export function ChatPage({
  onHighlightMap,
  initialQuery = null
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[640px]">
      {/* Left 8 cols: Main Full-Height Chat Interface */}
      <div className="lg:col-span-8 h-full">
        <ChatInterface
          onHighlightMap={onHighlightMap}
          initialQuery={initialQuery}
          className="h-full"
        />
      </div>

      {/* Right 4 cols: Multi-Agent Collective Roster & Live Buoy Telemetry */}
      <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 h-full overflow-y-auto">
        {/* Agent Collective Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-ocean-teal" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {t('autonomousAgentCollective', 'Autonomous Agent Collective')}
            </h3>
          </div>

          <div className="space-y-2.5">
            {AGENT_ROSTER.map(agent => (
              <div key={agent.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: agent.color }} />
                <div>
                  <div className="font-bold text-slate-900">{agent.name}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{t(agent.role)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Coastal Buoy Telemetry Status */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex-1">
          <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-100">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {t('connectedGroundStations', 'Connected Ground Stations')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200">
              <div>
                <span className="font-bold text-emerald-950 block">INCOIS Moored Buoy #AD02</span>
                <span className="text-[11px] text-emerald-700">SW Arabian Sea (9.5°N, 75.8°E)</span>
              </div>
              <span className="font-mono font-bold text-emerald-800">3.4m Swell</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-sky-50 border border-sky-200">
              <div>
                <span className="font-bold text-sky-950 block">IMD Doppler Radar (KOC)</span>
                <span className="text-[11px] text-sky-700">Kochi Port Station</span>
              </div>
              <span className="font-mono font-bold text-sky-800">28 kts Gale</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">ISRO Oceansat-3 OCM-3</span>
                <span className="text-[11px] text-slate-500">Orbit 4421 Bio-Optical Matrix</span>
              </div>
              <span className="font-mono font-bold text-ocean-teal">98.2% Valid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
