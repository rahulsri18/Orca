import React from 'react';
import { Radio, Database, ShieldCheck, Clock, Satellite } from 'lucide-react';

export function BottomStatusBar() {
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <footer className="hidden md:flex items-center justify-between h-7 px-4 bg-[#051422] border-t border-[#0B2942] text-[10px] font-mono text-slate-400 select-none shrink-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D72]" />
          <span className="text-slate-500">SYSTEM:</span>
          <span className="font-bold text-[#1F9D72]">OPERATIONAL</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500">DATA UPDATED:</span>
          <span className="text-slate-200 font-semibold">{currentTime} IST</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-slate-500">GPS:</span>
          <span className="text-[#1F9D72] font-bold">DGPS ACTIVE (8m CEP)</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Satellite className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-500">SATELLITE:</span>
          <span className="text-cyan-300 font-bold">NAVIC S-BAND AVAILABLE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-slate-500">TELEMETRY SOURCES:</span>
          <span className="text-slate-300 font-semibold">INCOIS / IMD / ISRO SAC</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="text-slate-400">
          <span>ORCA MARITIME HQ</span>
        </div>
      </div>
    </footer>
  );
}
