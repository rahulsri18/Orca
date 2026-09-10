import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function ConfidenceBadge({ score = 90, size = 'md', className = '' }) {
  const { t } = useLanguage();
  const isHighConfidence = score >= 85;

  const config = isHighConfidence
    ? {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        bar: 'bg-emerald-600',
        icon: CheckCircle2,
        labelKey: 'highConfidence',
        fallback: 'High Confidence'
      }
    : {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        bar: 'bg-amber-500',
        icon: AlertCircle,
        labelKey: 'moderateConfidence',
        fallback: 'Moderate Confidence'
      };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-lg border font-medium ${config.bg} ${sizeClasses[size]} ${className}`}>
      <Icon className="w-3.5 h-3.5 text-current shrink-0" />
      <span>{score}% {t(config.labelKey, config.fallback)}</span>
    </span>
  );
}
