import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export function RiskBadge({ level = 'LOW', score = null, size = 'md', className = '' }) {
  const { t } = useLanguage();
  const norm = String(level).toUpperCase();
  const isHigh = norm === 'HIGH' || norm === 'DANGER' || norm === 'SEVERE';
  const isMedium = norm === 'MEDIUM' || norm === 'CAUTION' || norm === 'MODERATE';

  let config = {
    bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    dot: 'bg-emerald-600',
    icon: ShieldCheck,
    labelKey: 'safeLowRisk',
    fallback: 'SAFE / LOW RISK'
  };

  if (isHigh) {
    config = {
      bg: 'bg-rose-50 border-rose-300 text-rose-800',
      dot: 'bg-rose-600 animate-ping',
      icon: AlertOctagon,
      labelKey: 'highRiskDanger',
      fallback: 'HIGH RISK / DANGER'
    };
  } else if (isMedium) {
    config = {
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      labelKey: 'moderateCaution',
      fallback: 'MODERATE CAUTION'
    };
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs md:text-sm px-3 py-1 gap-2 font-medium',
    lg: 'text-sm md:text-base px-4 py-1.5 gap-2.5 font-semibold'
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${sizeClasses[size]} ${className}`}>
      <span className="relative flex h-2 w-2">
        {isHigh && <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isHigh ? 'bg-rose-600' : isMedium ? 'bg-amber-500' : 'bg-emerald-600'}`} />
      </span>
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{t(config.labelKey, config.fallback)}</span>
      {score !== null && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded-md font-mono text-xs border border-current/20">
          {score}/100
        </span>
      )}
    </span>
  );
}
