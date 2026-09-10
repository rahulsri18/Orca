import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Compass, Sparkles, ShieldAlert, User } from 'lucide-react';

export function MobileBottomNav({ activeTab, onTabChange, alertCount = 0 }) {
  const { t } = useLanguage();

  const bottomItems = [
    { id: 'dashboard', label: t('home'), icon: LayoutDashboard },
    { id: 'map', label: t('map'), icon: Compass },
    { id: 'chat', label: t('chat'), icon: Sparkles, isAi: true },
    { id: 'alerts', label: t('alerts'), icon: ShieldAlert, badge: alertCount },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-ocean-deep font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.isAi ? (
                <div className={`p-1.5 rounded-xl shadow-xs transition-transform ${
                  isActive ? 'bg-ocean-deep text-ocean-cyan scale-110' : 'bg-slate-100 text-ocean-teal'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-ocean-teal' : 'text-slate-400'}`} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] leading-tight truncate px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
