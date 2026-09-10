import React from 'react';
import { Terminal, ShieldCheck, Database, Radio } from 'lucide-react';

export function AgentLogStream({ logs = [], isRunning = false }) {
  return (
    <div className="bg-slate-950 text-emerald-400 rounded-xl p-3.5 border border-slate-800 font-mono text-[11px] shadow-inner max-h-56 overflow-y-auto">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-slate-300">ORCA Multi-Agent Telemetry Bus (SIH26176)</span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 animate-pulse">
              <Radio className="w-3 h-3 animate-spin" />
              <span>SYNCING WEBSOCKET / ROS</span>
            </span>
          ) : (
            <span className="text-[10px] text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>PIPELINE CONVERGED</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 text-slate-300">
        {logs.map((log, idx) => (
          <div key={idx} className="leading-tight flex items-start gap-2">
            <span className="text-slate-500 select-none text-[10px] shrink-0">[{log.time || '10:42:01'}]</span>
            <span className={`px-1 py-0.2 rounded text-[10px] font-bold shrink-0 ${
              log.agent === 'Planner' ? 'bg-sky-900 text-sky-300' :
              log.agent === 'Ocean' ? 'bg-cyan-900 text-cyan-300' :
              log.agent === 'Weather' ? 'bg-blue-900 text-blue-300' :
              log.agent === 'Geo' ? 'bg-teal-900 text-teal-300' :
              log.agent === 'Risk' ? 'bg-amber-900 text-amber-300' : 'bg-emerald-900 text-emerald-300'
            }`}>
              {log.agent}
            </span>
            <span className="text-slate-300 break-words">{log.message}</span>
          </div>
        ))}
        {isRunning && (
          <div className="text-sky-400 animate-pulse pt-1 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-3 bg-sky-400 animate-pulse" />
            <span>Agent cluster synthesizing sensor data packets...</span>
          </div>
        )}
      </div>
    </div>
  );
}
