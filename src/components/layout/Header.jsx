import React, { useState, useRef, useEffect } from 'react';
import { LanguageToggle } from '../common/LanguageToggle';
import { RoleModeSwitcher } from '../common/RoleModeSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { useConnectivity } from '../../context/ConnectivityContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  MapPin, 
  Radio, 
  Wifi, 
  Satellite, 
  Database, 
  FileText, 
  ChevronDown, 
  Check, 
  AlertOctagon,
  Anchor,
  Compass,
  User
} from 'lucide-react';

export function Header({
  activeAlertCount = 3,
  onNavigateTab,
  selectedPort = 'Kochi Coast',
  onOpenBulletin = null,
  onOpenSos = null
}) {
  const { t } = useLanguage();
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const { mode, setMode, currentMode, CONNECTIVITY_MODES } = useConnectivity();
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
    <header className="sticky top-0 z-40 w-full bg-[#071A2B] border-b border-[#0B2942] text-slate-100 shadow-sm">
      <div className="w-full px-3 sm:px-5 h-[52px] flex items-center justify-between gap-3 text-xs">
        {/* Brand & Tactical Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => onNavigateTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="ORCA — Oceanic Risk Calculation & Advisory"
          >
            <div className="w-7 h-7 rounded bg-[#0D5C7A] text-white flex items-center justify-center font-bold text-sm border border-[#2EAFD0]/40">
              <Anchor className="w-4 h-4 text-cyan-300" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">
                ORCA
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#0B2942] text-cyan-300 border border-[#18476F]">
                ISRO • INCOIS
              </span>
            </div>
          </div>

          {/* Current Operational Location & Sector */}
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#0B2942] text-[11px] text-slate-300 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#2EAFD0]" />
            <span className="font-semibold text-white">{selectedPort}</span>
            <span className="text-slate-400 font-normal">09°55.8'N 076°14.2'E</span>
          </div>
        </div>

        {/* Global Operational Telemetry Indicators */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 text-[11px] font-mono">
          {/* GPS Telemetry */}
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#0B2942] border border-[#18476F] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D72]" />
            <span className="text-[10px] uppercase font-bold text-slate-400">GPS:</span>
            <span className="font-bold text-[#1F9D72]">ACTIVE</span>
          </div>

          {/* Internet / Connectivity Telemetry Menu */}
          <div className="relative" ref={connMenuRef}>
            <button
              onClick={() => setShowConnMenu(!showConnMenu)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0B2942] hover:bg-[#0F3456] border border-[#18476F] text-slate-300 transition-colors"
              title="Telemetry Uplink Mode"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                mode === '4g' ? 'bg-[#1F9D72]' :
                mode === 'navic' ? 'bg-[#2EAFD0] animate-pulse' : 'bg-[#D89B24]'
              }`} />
              <span className="text-[10px] uppercase font-bold text-slate-400">LINK:</span>
              <span className="font-bold text-slate-200 uppercase font-mono">{currentMode.badge}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showConnMenu && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-md bg-[#0B2942] shadow-modal border border-[#18476F] py-1.5 z-50 text-slate-200">
                <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-[#18476F]">
                  Select Telematics Channel
                </div>
                {CONNECTIVITY_MODES.map((cm) => (
                  <button
                    key={cm.id}
                    onClick={() => {
                      setMode(cm.id);
                      setShowConnMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      cm.id === mode ? 'bg-[#0D5C7A] text-white font-bold' : 'hover:bg-[#0F3456] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cm.id === '4g' && <Wifi className="w-3.5 h-3.5 text-[#1F9D72]" />}
                      {cm.id === 'navic' && <Satellite className="w-3.5 h-3.5 text-[#2EAFD0]" />}
                      {cm.id === 'offline' && <Database className="w-3.5 h-3.5 text-[#D89B24]" />}
                      <span>{t(cm.label)}</span>
                    </div>
                    {cm.id === mode && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Satellite S-band status */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded bg-[#0B2942] border border-[#18476F] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EAFD0]" />
            <span className="text-[10px] uppercase font-bold text-slate-400">SAT:</span>
            <span className="font-bold text-cyan-300">NAVIC S-BAND</span>
          </div>
        </div>

        {/* Right Section: Persona, Language, Alerts, SOS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Daily Bulletin Trigger */}
          {onOpenBulletin && (
            <button
              onClick={() => onOpenBulletin('Kochi Fishing Harbor')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#0B2942] hover:bg-[#0F3456] border border-[#18476F] text-slate-200 text-xs font-medium transition-colors"
              title="Official Daily Coastal Marine Safety Bulletin"
            >
              <FileText className="w-3.5 h-3.5 text-[#2EAFD0]" />
              <span className="hidden md:inline font-mono">{t('dailyBulletin', 'Daily Bulletin')}</span>
            </button>
          )}

          {/* User Persona Switcher */}
          <RoleModeSwitcher compact={true} />

          {/* Authenticated Identity or Sign In Quick Nav */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-colors cursor-pointer ${
                isAdmin 
                  ? 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/60 text-purple-200' 
                  : 'bg-[#0B2942] hover:bg-[#0D5C7A] border-[#18476F] text-slate-200'
              }`}
              title="View Authenticated Maritime Profile / Admin Console"
            >
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-400 animate-pulse' : 'bg-[#1F9D72]'}`} />
              <User className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden xl:inline truncate max-w-[120px]">
                {isAdmin ? 'ADMIN HQ' : currentUser?.fullName?.split(' ')[0] || 'PROFILE'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#0B2942] hover:bg-[#0D5C7A] border border-[#18476F] text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
              title="Sign in to Maritime Registry"
            >
              <User className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden xl:inline">SIGN IN</span>
            </button>
          )}

          {/* Language Selector */}
          <LanguageToggle variant="header" />

          {/* Alerts Notification Bell */}
          <button
            type="button"
            onClick={() => onNavigateTab('alerts')}
            className="relative p-1.5 rounded bg-[#0B2942] hover:bg-[#0F3456] text-slate-300 hover:text-white border border-[#18476F] transition-colors"
            title="Marine Safety Warnings"
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D96B3B] text-[9px] font-mono font-bold text-white">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* Mission-Critical Emergency SOS Button */}
          {onOpenSos && (
            <button
              type="button"
              onClick={onOpenSos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C93C4B] hover:bg-[#A82B3A] text-white text-xs font-bold font-mono tracking-wider transition-colors border border-red-400/50 shadow-sm active:scale-95 cursor-pointer ml-1"
              title="Emergency SOS Distress Console (100% Offline)"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-white" />
              <span>SOS</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
