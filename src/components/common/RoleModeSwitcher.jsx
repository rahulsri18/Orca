import React, { useState, useRef, useEffect } from 'react';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import * as Icons from 'lucide-react';

export function RoleModeSwitcher({ compact = false }) {
  const { role, setRole, currentRole, USER_ROLES } = useRole();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const IconComponent = Icons[currentRole.icon] || Icons.User;

  if (compact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ocean-navy text-sky-100 hover:bg-ocean-navy/80 border border-sky-400/30 text-xs font-semibold shadow-sm transition-all"
        >
          <IconComponent className="w-3.5 h-3.5 text-ocean-cyan" />
          <span className="hidden sm:inline">{t(currentRole.title)}</span>
          <Icons.ChevronDown className="w-3 h-3 text-sky-300" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              {t('activePersonaRole', 'Active Persona / Role')}
            </div>
            {USER_ROLES.map((r) => {
              const RIcon = Icons[r.icon] || Icons.User;
              const isSelected = r.id === role;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-sky-50 border-l-4 border-ocean-teal' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mt-0.5 ${isSelected ? 'bg-ocean-deep text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <RIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>{t(r.title)}</span>
                      {isSelected && <Icons.Check className="w-3.5 h-3.5 text-ocean-teal" />}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{t(r.subtitle)}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t(r.tagline)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Full segmented mode switcher for dashboard
  return (
    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80 overflow-x-auto">
      {USER_ROLES.map((r) => {
        const RIcon = Icons[r.icon] || Icons.User;
        const isSelected = r.id === role;
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-white text-ocean-deep shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <RIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-ocean-teal' : 'text-slate-400'}`} />
            <span>{t(r.title)}</span>
          </button>
        );
      })}
    </div>
  );
}
