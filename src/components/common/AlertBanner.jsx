import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, X, ChevronRight, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function AlertBanner({ alert, onNavigateToAlerts = null }) {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

  if (!alert || dismissed) return null;

  const isHigh = alert.severity === 'HIGH';

  return (
    <div className={`w-full border-b px-4 py-2.5 transition-colors ${
      isHigh 
        ? 'bg-rose-900/95 text-white border-rose-700 shadow-md' 
        : 'bg-amber-800 text-amber-50 border-amber-700'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          {isHigh ? (
            <AlertOctagon className="w-4 h-4 text-rose-200 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />
          )}
          <span className="font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/25 text-[10px] shrink-0">
            {alert.severity} {t('alertLabel', 'ALERT')}
          </span>
          <p className="truncate font-medium">
            <span className="font-bold">{t(alert.title)}</span> — {t(alert.summary)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateToAlerts && (
            <button
              onClick={onNavigateToAlerts}
              className="inline-flex items-center gap-1 font-semibold text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md transition-colors"
            >
              <span>{t('viewPlan', 'View Response Plan')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
