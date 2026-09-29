import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Compass, MessageSquare, ShieldAlert, User } from 'lucide-react';

export function MobileBottomNav({ activeTab, onTabChange, alertCount = 0 }) {
  const { t } = useLanguage();

  const bottomItems = [
    { id: 'dashboard', label: t('home', 'Dashboard'), icon: LayoutDashboard },
    { id: 'map', label: t('map', 'Map'), icon: Compass },
    { id: 'chat', label: t('chat', 'AI'), icon: MessageSquare },
    { id: 'alerts', label: t('alerts', 'Alerts'), icon: ShieldAlert, badge: alertCount },
    { id: 'profile', label: t('profile', 'Profile'), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071A2B] border-t border-[#0B2942] text-slate-300 shadow-modal select-none">
      <div className="grid grid-cols-5 h-14">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
                isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2EAFD0]' : 'text-slate-400'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D96B3B] text-[8px] font-mono font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono leading-tight truncate px-1">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-[2px] bg-[#0F8B8D] rounded-t" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
