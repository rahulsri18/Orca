import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Compass, MessageSquare, Fish, ShieldAlert, Navigation as NavigationIcon, Activity, Satellite, User } from 'lucide-react';

export function Navigation({ activeTab, onTabChange }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('home'), icon: LayoutDashboard },
    { id: 'map', label: t('map'), icon: Compass },
    { id: 'chat', label: t('chat'), icon: MessageSquare, badge: t('aiCollectiveBadge', 'AI Collective') },
    { id: 'pfz', label: t('pfz'), icon: Fish },
    { id: 'alerts', label: t('alerts'), icon: ShieldAlert, badgeAlert: true },
    { id: 'routes', label: t('routes'), icon: NavigationIcon },
    { id: 'analytics', label: t('analytics'), icon: Activity },
    { id: 'satellites', label: t('satellites'), icon: Satellite },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="hidden md:block bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-ocean-deep text-white shadow-sm'
                    : 'text-slate-600 hover:text-ocean-deep hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-ocean-cyan' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                    isActive ? 'bg-sky-400/20 text-sky-200' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.badgeAlert && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
