import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import * as Icons from 'lucide-react';

export function StatCard({
  title,
  value,
  subtext,
  iconName = 'Activity',
  trend = null,
  status = 'normal',
  badge = null,
  className = '',
  onClick = null
}) {
  const { t } = useLanguage();
  const IconComponent = Icons[iconName] || Icons.Activity;

  const statusStyles = {
    normal: 'border-slate-200 hover:border-slate-300 bg-white',
    safe: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300',
    warning: 'border-amber-200 bg-amber-50/40 hover:border-amber-300',
    danger: 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
  };

  const iconColors = {
    normal: 'text-ocean-medium bg-ocean-light',
    safe: 'text-emerald-700 bg-emerald-100',
    warning: 'text-amber-700 bg-amber-100',
    danger: 'text-rose-700 bg-rose-100'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border transition-all duration-200 shadow-sm ${statusStyles[status] || statusStyles.normal} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t(title)}
        </span>
        <div className={`p-2 rounded-lg ${iconColors[status] || iconColors.normal}`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {t(badge)}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
          <span>{t(subtext)}</span>
          {trend && (
            <span className={`font-medium ${trend.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
