import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import * as Icons from 'lucide-react';

export function StatCard({
  title,
  value,
  unit = '',
  subtext,
  iconName = 'Activity',
  trend = null,
  status = 'normal', // normal, safe, warning, danger
  badge = null,
  className = '',
  onClick = null
}) {
  const { t } = useLanguage();
  const IconComponent = Icons[iconName] || Icons.Activity;

  // Dedicated status indicator borders and subtle fills
  const statusStyles = {
    normal: 'border-[#D1DCE5] bg-white hover:border-[#0D5C7A]',
    safe: 'border-[#A8DFC9] bg-white hover:border-[#1F9D72]',
    warning: 'border-[#F2D69E] bg-white hover:border-[#D89B24]',
    danger: 'border-[#F6C2AB] bg-white hover:border-[#D96B3B]',
  };

  const statusStripColor = {
    normal: 'bg-[#0D5C7A]',
    safe: 'bg-[#1F9D72]',
    warning: 'bg-[#D89B24]',
    danger: 'bg-[#D96B3B]',
  };

  const statusLabel = {
    normal: 'NOMINAL',
    safe: 'SAFE',
    warning: 'WARNING',
    danger: 'DANGER',
  };

  // Extract unit if not passed explicitly but in value string (e.g. "3.4 meters" -> val: "3.4", unit: "m")
  let displayVal = value;
  let displayUnit = unit;
  if (!unit && typeof value === 'string') {
    const parts = value.split(' ');
    if (parts.length === 2 && !isNaN(parseFloat(parts[0]))) {
      displayVal = parts[0];
      displayUnit = parts[1];
    }
  }

  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg p-3.5 border transition-all duration-150 shadow-subtle ${statusStyles[status] || statusStyles.normal} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top accent indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-lg ${statusStripColor[status] || statusStripColor.normal}`} />

      <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-600 truncate">
          {t(title)}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
            status === 'danger' ? 'bg-[#FCEFE9] text-[#C05527]' :
            status === 'warning' ? 'bg-[#FBF5E8] text-[#9E6E10]' :
            status === 'safe' ? 'bg-[#E8F6F1] text-[#177F5B]' : 'bg-slate-100 text-slate-600'
          }`}>
            {statusLabel[status] || 'STATUS'}
          </span>
          <IconComponent className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {displayVal}
          </span>
          {displayUnit && (
            <span className="text-xs font-semibold text-slate-500 font-mono uppercase">
              {displayUnit}
            </span>
          )}
        </div>

        {trend && (
          <span className="text-[11px] font-mono text-slate-500 font-medium">
            {t(trend)}
          </span>
        )}
      </div>

      {subtext && (
        <div className="mt-1.5 text-[11px] text-slate-500 truncate flex items-center justify-between">
          <span>{t(subtext)}</span>
          {badge && (
            <span className="font-mono text-[10px] text-emerald-700 font-bold bg-[#E8F6F1] px-1 rounded">
              {t(badge)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
