import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export function RiskBadge({ level = 'LOW', score = null, size = 'md', className = '' }) {
  const { t } = useLanguage();
  const norm = String(level).toUpperCase();
  
  const isCritical = norm === 'CRITICAL' || norm === 'EXTREME';
  const isHigh = norm === 'HIGH' || norm === 'DANGER' || norm === 'SEVERE';
  const isCaution = norm === 'MEDIUM' || norm === 'CAUTION' || norm === 'MODERATE' || norm === 'WARNING';

  let config = {
    bg: 'bg-[#E8F6F1] border-[#A8DFC9] text-[#177F5B]',
    dot: 'bg-[#1F9D72]',
    icon: ShieldCheck,
    labelKey: 'safeLowRisk',
    fallback: 'SAFE'
  };

  if (isCritical) {
    config = {
      bg: 'bg-[#FBECEE] border-[#F2ADB6] text-[#C93C4B]',
      dot: 'bg-[#C93C4B]',
      icon: Flame,
      labelKey: 'criticalDanger',
      fallback: 'CRITICAL DANGER'
    };
  } else if (isHigh) {
    config = {
      bg: 'bg-[#FCEFE9] border-[#F6C2AB] text-[#BD5022]',
      dot: 'bg-[#D96B3B]',
      icon: AlertOctagon,
      labelKey: 'highRiskDanger',
      fallback: 'HIGH RISK'
    };
  } else if (isCaution) {
    config = {
      bg: 'bg-[#FBF5E8] border-[#F2D69E] text-[#9E6E10]',
      dot: 'bg-[#D89B24]',
      icon: AlertTriangle,
      labelKey: 'moderateCaution',
      fallback: 'CAUTION'
    };
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-mono font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded border tracking-tight ${config.bg} ${sizeClasses[size]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span className="uppercase font-bold tracking-wider">{t(config.labelKey, config.fallback)}</span>
      {score !== null && (
        <span className="ml-1 px-1 py-0.2 bg-white/80 rounded font-mono text-[11px] font-bold border border-current/20">
          {score}/100
        </span>
      )}
    </span>
  );
}
