import React, { useState, useRef, useEffect } from 'react';
import { LanguageToggle } from '../common/LanguageToggle';
import { RoleModeSwitcher } from '../common/RoleModeSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { useConnectivity } from '../../context/ConnectivityContext';
import { Sparkles, Bell, MapPin, Radio, Shield, Wifi, Satellite, Database, FileText, ChevronDown, Check, AlertOctagon } from 'lucide-react';

export function Header({
  activeAlertCount = 3,
  onNavigateTab,
  selectedPort = 'Kochi Coast',
  onOpenBulletin = null,
  onOpenSos = null
}) {
  const { t } = useLanguage();
  const { mode, setMode, currentMode, packetCount, CONNECTIVITY_MODES } = useConnectivity();
  const [showConnMenu, setShowConnMenu] = useState(false);
  const connMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (connMenuRef.current && !connMenuRef.current.contains(e.target)) {
        setShowConnMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-ocean-deep border-b border-ocean-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & ISRO SIH tag */}
        <div
          onClick={() => onNavigateTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-medium to-ocean-teal flex items-center justify-center shadow-md border border-white/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🐬</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-white font-sans">
                ORCA
              </span>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30">
                SIH26176
              </span>
            </div>
            <p className="text-[10px] text-sky-200/80 font-medium tracking-wide hidden sm:block">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Center-Left: Connectivity Mode Switcher (4G vs NavIC vs Offline) */}
        <div className="relative" ref={connMenuRef}>
          <button
            onClick={() => setShowConnMenu(!showConnMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-ocean-navy/90 hover:bg-ocean-navy border border-sky-400/20 text-xs font-semibold shadow-xs transition-all"
            title="Switch Connectivity Mode (4G / NavIC Satellite / Offline)"
          >
            {mode === '4g' && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            {mode === 'navic' && <Satellite className="w-3.5 h-3.5 text-sky-300 animate-pulse" />}
            {mode === 'offline' && <Database className="w-3.5 h-3.5 text-amber-400" />}

            <span className="hidden md:inline font-mono">{currentMode.badge}</span>
            <ChevronDown className="w-3 h-3 text-slate-300" />
          </button>

          {showConnMenu && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-slate-800">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                {t('coastalTelemetryUplinkMode', 'Coastal Telemetry Uplink Mode')}
              </div>

              {CONNECTIVITY_MODES.map((cm) => {
                const isSelected = cm.id === mode;
                return (
                  <button
                    key={cm.id}
                    onClick={() => {
                      setMode(cm.id);
                      setShowConnMenu(false);
                    }}
                    className={`w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors ${
                      isSelected ? 'bg-sky-50 border-l-4 border-ocean-teal' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {cm.id === '4g' && <Wifi className="w-4 h-4 text-emerald-600" />}
                      {cm.id === 'navic' && <Satellite className="w-4 h-4 text-sky-600" />}
                      {cm.id === 'offline' && <Database className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{t(cm.label)}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-ocean-teal" />}
                      </div>
                      <div className="text-[10px] text-slate-500">{t(cm.subtitle)}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t(cm.description)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: Live Coastal Port Selector / Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-ocean-navy/80 px-3 py-1.5 rounded-xl border border-sky-400/20 text-xs">
          <MapPin className="w-3.5 h-3.5 text-ocean-cyan" />
          <span className="text-slate-300">{t('portKochi')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-1" />
          <span className="text-[10px] text-rose-300 font-semibold font-mono">{t('redAlertSwell')}</span>
        </div>

        {/* Right Actions: SOS Trigger, Daily Bulletin, Role Switcher, Language Toggle, Notification Bell */}
        <div className="flex items-center gap-2">
          {/* Emergency SOS Distress Trigger */}
          {onOpenSos && (
            <button
              type="button"
              onClick={onOpenSos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 text-white text-xs font-black shadow-md border border-rose-400/50 animate-pulse active:scale-95 transition-all"
              title="Emergency SOS Distress Beacon (Works Offline)"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-white" />
              <span>{t('sos')}</span>
            </button>
          )}

          {/* Daily Bulletin Action */}
          {onOpenBulletin && (
            <button
              onClick={onOpenBulletin}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20"
              title="View & Print Official Daily Safety Bulletin"
            >
              <FileText className="w-3.5 h-3.5 text-sky-300" />
              <span>{t('dailyBulletin')}</span>
            </button>
          )}

          {/* Role Mode Switcher (Compact Dropdown) */}
          <RoleModeSwitcher compact={true} />

          {/* Multilingual Selector */}
          <LanguageToggle variant="header" />

          {/* Notification Alert Bell */}
          <button
            type="button"
            onClick={() => onNavigateTab('alerts')}
            className="relative p-2 rounded-xl bg-ocean-navy/80 hover:bg-ocean-navy text-sky-200 hover:text-white border border-sky-400/20 transition-colors"
            title="Marine Safety Warnings"
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {activeAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
