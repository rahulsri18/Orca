import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  Fish, 
  ShieldAlert, 
  Navigation as NavigationIcon, 
  Activity, 
  Satellite, 
  User,
  ShieldCheck,
  Radio
} from 'lucide-react';

export function Sidebar({ activeTab, onTabChange, alertCount = 0 }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('home', 'Dashboard (Home)'), icon: LayoutDashboard },
    { id: 'map', label: t('map', 'Marine Map (GIS)'), icon: Compass, badge: 'MAP' },
    { id: 'chat', label: t('chat', 'AI Assistant (Help)'), icon: MessageSquare, badge: 'VOICE' },
    { id: 'pfz', label: t('pfz', 'PFZ (Fish Zones)'), icon: Fish, badge: 'FISH' },
    { id: 'alerts', label: t('alerts', 'Safety Alerts (Storms)'), icon: ShieldAlert, count: alertCount },
    { id: 'routes', label: t('routes', 'Safe Routes (Calm Path)'), icon: NavigationIcon },
    { id: 'analytics', label: t('analytics', 'Sea Analytics'), icon: Activity },
    { id: 'satellites', label: t('satellites', 'Satellites (Space)'), icon: Satellite },
    { id: 'profile', label: t('profile', 'Vessel & Captain'), icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-56 bg-[#071A2B] border-r border-[#0B2942] shrink-0 select-none">
      {/* Station Context Header */}
      <div className="px-3.5 py-2.5 border-b border-[#0B2942] text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span>NAVIGATION CONSOLE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D72]" />
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-2 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors duration-150 text-left font-medium ${
                isActive
                  ? 'bg-[#0B2942] text-white border-l-4 border-[#0F8B8D] font-bold shadow-xs'
                  : 'text-slate-300 hover:bg-[#0B2942]/60 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2EAFD0]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.count > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#D96B3B] text-white shrink-0">
                  {item.count}
                </span>
              )}

              {item.badge && !item.count && (
                <span className={`text-[9px] font-mono px-1 py-0.2 rounded shrink-0 uppercase ${
                  isActive ? 'bg-[#0D5C7A] text-cyan-200' : 'bg-[#0B2942] text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Station Status Box */}
      <div className="p-3 border-t border-[#0B2942] bg-[#051422] text-[10px] font-mono text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">STATION ID:</span>
          <span className="text-slate-300 font-bold">ORCA-INCOIS-01</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">BASE PROTOCOL:</span>
          <span className="text-cyan-300 font-semibold">NMEA 0183 v4.1</span>
        </div>
      </div>
    </aside>
  );
}
