import React from 'react';
import { 
  AlertOctagon, 
  Wind, 
  Waves, 
  Compass, 
  MapPin, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ImdTropicalAlertBanner({
  onNavigateToAlerts = null,
  onNavigateToMap = null,
  onAskOrca = null,
  onOpenBulletin = null
}) {
  const { t } = useLanguage();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST';

  const cycloneData = {
    name: 'CYCLONE ASNA',
    basin: 'Arabian Sea',
    date: dateStr,
    time: timeStr,
    pressure: '988 hPa',
    wind: '28 kt',
    gust: '35 kt',
    alertLevel: 'HIGH ALERT',
    coordinates: [19.2, 67.5]
  };

  return (
    <div className="w-full bg-[#0B2942] border border-[#D96B3B]/60 rounded-lg p-2.5 sm:px-4 sm:py-2.5 text-white shadow-subtle flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 select-none">
      {/* Left: Tactical Weather Bullet */}
      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C93C4B] text-white font-mono font-bold text-[11px] tracking-wider shrink-0 animate-pulse">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{cycloneData.alertLevel}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#071A2B] border border-[#18476F] font-mono text-cyan-300 font-bold text-[11px] shrink-0">
          <Calendar className="w-3 h-3 text-cyan-400" />
          <span>{cycloneData.date} • {cycloneData.time}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-extrabold text-white tracking-tight font-mono text-sm">
            {cycloneData.name}
          </span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium text-[11px]">
            {cycloneData.basin}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 pl-1">
          <span className="px-1.5 py-0.5 rounded bg-[#071A2B] border border-[#18476F]">
            PRESS: <strong className="text-white">{cycloneData.pressure}</strong>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#071A2B] border border-[#18476F]">
            WIND: <strong className="text-[#D96B3B]">{cycloneData.wind}</strong> (GUST {cycloneData.gust})
          </span>
        </div>
      </div>

      {/* Right: Operational Actions */}
      <div className="flex items-center gap-1.5 text-xs font-mono shrink-0 flex-wrap">
        {onNavigateToMap && (
          <button
            type="button"
            onClick={() => onNavigateToMap(cycloneData.coordinates, cycloneData.name)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#071A2B] hover:bg-[#0D5C7A] text-slate-200 hover:text-white border border-[#18476F] transition-colors"
            title="View Cyclone Center and Warning Radii on Map"
          >
            <Compass className="w-3.5 h-3.5 text-[#2EAFD0]" />
            <span>View Track</span>
          </button>
        )}

        {onNavigateToAlerts && (
          <button
            type="button"
            onClick={onNavigateToAlerts}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#071A2B] hover:bg-[#0D5C7A] text-slate-200 hover:text-white border border-[#18476F] transition-colors"
            title="Read Official IMD Synoptic Warning"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#D96B3B]" />
            <span>Read Warning</span>
          </button>
        )}

        {onAskOrca && (
          <button
            type="button"
            onClick={() => onAskOrca(`Is Cyclone ASNA approaching my vessel and when will gale winds subside?`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0F8B8D] hover:bg-[#0D5C7A] text-white font-bold transition-colors"
            title="Evaluate Cyclone Threat with ORCA AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Ask ORCA</span>
          </button>
        )}

        {onOpenBulletin && (
          <button
            type="button"
            onClick={() => onOpenBulletin('Kochi Fishing Harbor')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#071A2B] hover:bg-[#0D5C7A] text-slate-300 hover:text-white border border-[#18476F] transition-colors"
            title="Open Printable Marine Safety Bulletin"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Open Bulletin</span>
          </button>
        )}
      </div>
    </div>
  );
}
