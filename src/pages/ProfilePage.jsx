import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { MaritimeAuthPortal } from '../components/auth/MaritimeAuthPortal';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { RoleModeSwitcher } from '../components/common/RoleModeSwitcher';
import { getStoredGeminiKey, setStoredGeminiKey, testGeminiKey } from '../services/geminiService';
import { simulateGovtVerification } from '../services/profileService';
import {
  User,
  Anchor,
  Shield,
  ShieldCheck,
  Radio,
  Globe,
  Bell,
  Check,
  Save,
  Key,
  QrCode,
  Printer,
  RefreshCw,
  Users,
  Ship,
  Compass,
  FileCheck2,
  Cpu,
  CheckCircle2,
  HardDrive,
  LogOut,
  AlertTriangle,
  Lock,
  Activity
} from 'lucide-react';

export function ProfilePage() {
  const { currentUser, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
  const { role, setRole, currentRole } = useRole();
  const { currentLang, setCurrentLang, languages, t } = useLanguage();

  const oceanBgStyle = {
    backgroundImage: `linear-gradient(rgba(7, 26, 43, 0.74), rgba(4, 16, 28, 0.88)), url('/jordan-allen-walters-j8QUs2P-_Rs-unsplash.jpg')`
  };

  // If user is unauthenticated, show the secure authentication & registration portal centered with cinematic ocean background
  if (!isAuthenticated) {
    return (
      <div 
        className="relative -m-3 sm:-m-5 lg:-m-6 min-h-[calc(100vh-80px)] p-3 sm:p-5 lg:p-6 bg-cover bg-center bg-no-repeat bg-fixed flex flex-col justify-center items-center"
        style={oceanBgStyle}
      >
        <div className="w-full max-w-5xl mx-auto">
          <MaritimeAuthPortal />
        </div>
      </div>
    );
  }

  // If user is authenticated as Admin, show the exclusive Admin Command Dashboard with ocean backdrop
  if (isAdmin) {
    return (
      <div 
        className="relative -m-3 sm:-m-5 lg:-m-6 min-h-[calc(100vh-80px)] p-3 sm:p-5 lg:p-6 bg-cover bg-center bg-no-repeat bg-fixed"
        style={oceanBgStyle}
      >
        <div className="max-w-7xl mx-auto">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  // Authenticated Standard User (Fisherman, Authority, Operator, Researcher)
  return (
    <div 
      className="relative -m-3 sm:-m-5 lg:-m-6 min-h-[calc(100vh-80px)] p-3 sm:p-5 lg:p-6 bg-cover bg-center bg-no-repeat bg-fixed"
      style={oceanBgStyle}
    >
      <div className="max-w-7xl mx-auto">
        <AuthenticatedUserProfile />
      </div>
    </div>
  );
}

function AuthenticatedUserProfile() {
  const { currentUser, logout, updateProfile } = useAuth();
  const { role, currentRole } = useRole();
  const { currentLang, setCurrentLang, languages, t } = useLanguage();

  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(() => ({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    vesselName: currentUser?.vesselName || currentUser?.organization || currentUser?.portAuthority || currentUser?.institution || '',
    realCraftReg: currentUser?.realCraftReg || currentUser?.serviceId || currentUser?.scientistId || currentUser?.pilotageLicense || '',
    mmsi: currentUser?.mmsi || '',
    navicTransponderId: currentUser?.navicTransponderId || '',
    homePort: currentUser?.homePort || '',
    commChannel: 'VHF Ch 16 / NavIC S-Band',
    cooperative: currentUser?.cooperative || '',
    crewCount: currentUser?.crewCount || '',
    lifeJacketCount: currentUser?.lifeJacketCount || '',
    hullType: currentUser?.hullType || '',
    isGovtVerified: currentUser?.isVerified !== undefined ? currentUser.isVerified : false,
    validTill: currentUser?.validTill || '',
    smsAlerts: true,
    audioHornAlerts: true,
    lowBandwidthMode: false
  }));

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());
  const [apiKeyStatus, setApiKeyStatus] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        vesselName: currentUser.vesselName || currentUser.organization || currentUser.portAuthority || currentUser.institution || prev.vesselName,
        realCraftReg: currentUser.realCraftReg || currentUser.serviceId || currentUser.scientistId || currentUser.pilotageLicense || prev.realCraftReg,
        mmsi: currentUser.mmsi || prev.mmsi,
        navicTransponderId: currentUser.navicTransponderId || prev.navicTransponderId,
        homePort: currentUser.homePort || prev.homePort,
        cooperative: currentUser.cooperative || prev.cooperative,
        crewCount: currentUser.crewCount || prev.crewCount,
        isGovtVerified: currentUser.isVerified !== undefined ? currentUser.isVerified : prev.isGovtVerified,
        validTill: currentUser.validTill || prev.validTill
      }));
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleGovtVerify = async () => {
    setIsVerifying(true);
    const res = await simulateGovtVerification(profile.realCraftReg || profile.serviceId);
    setIsVerifying(false);
    setVerificationResult(res);
    handleInputChange('isGovtVerified', true);
    updateProfile({ isVerified: true });
  };

  const handlePrintPass = () => {
    window.print();
  };

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'fisherman': return <Anchor className="w-6 h-6 text-[#0F8B8D]" />;
      case 'authority': return <Shield className="w-6 h-6 text-[#C93C4B]" />;
      case 'operator': return <Compass className="w-6 h-6 text-[#1C7293]" />;
      case 'researcher': return <Activity className="w-6 h-6 text-[#059669]" />;
      default: return <User className="w-6 h-6 text-[#0F8B8D]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* TOP: Authenticated Personnel & Vessel Banner */}
      <div className="bg-[#071A2B] text-white p-4 border border-[#0B2942] rounded-none flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#0B2942] border border-[#0D5C7A] flex items-center justify-center">
            {getRoleIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#0F8B8D] uppercase font-bold">
                AUTHENTICATED MARITIME IDENTITY
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1F9D72]/20 text-[#1F9D72] border border-[#1F9D72]/40 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{profile.isGovtVerified ? 'GOVT VERIFIED' : 'PENDING INSPECTION'}</span>
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-white uppercase mt-0.5">
              {profile.fullName} • {currentRole?.title || 'Officer'}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-0.5">
              <span>Station / Vessel: <strong className="text-white">{profile.vesselName}</strong></span>
              <span className="text-slate-500">•</span>
              <span>Registration ID: <strong className="text-white">{profile.realCraftReg}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrintPass}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2942] hover:bg-[#0D5C7A] text-slate-200 hover:text-white border border-[#0D5C7A] text-xs font-mono transition-colors cursor-pointer"
            title="Print Official Maritime Pass"
          >
            <Printer className="w-3.5 h-3.5 text-[#0F8B8D]" />
            <span className="hidden sm:inline">PRINT CREDENTIAL</span>
          </button>

          <button
            type="button"
            onClick={handleGovtVerify}
            disabled={isVerifying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D5C7A] hover:bg-[#0F8B8D] text-white border border-[#0F8B8D] text-xs font-mono font-bold transition-colors disabled:opacity-50 cursor-pointer"
            title="Sync with RealCraft NIC Portal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'VERIFYING...' : 'SYNC REGISTRY'}</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C93C4B] hover:bg-[#A82B3A] text-white border border-rose-400/50 text-xs font-mono font-bold transition-colors cursor-pointer"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* MAIN: Two-Column Security & Vessel Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT (~5 cols): Digital Vessel Credential (Clean Navy Security-Card Style) */}
        <div className="lg:col-span-5 bg-[#071A2B] border border-[#0B2942] p-5 text-white flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xs">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0F8B8D]" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-[#0B2942] pb-3">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                MARITIME REGULATORY AUTHORITY
              </div>
              <h2 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                <span>DIGITAL MARITIME CREDENTIAL</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1F9D72]/20 text-[#1F9D72] border border-[#1F9D72]/40 font-bold">
                ACTIVE ROSTER
              </span>
            </div>
          </div>

          {/* Card Body: Key Fields */}
          <div className="space-y-2.5 font-mono text-xs">
            <div className="bg-[#0B2942]/60 p-2.5 border border-[#0D5C7A]/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase">Personnel:</span>
              <span className="font-bold text-white text-right">{profile.fullName}</span>
            </div>

            <div className="bg-[#0B2942]/60 p-2.5 border border-[#0D5C7A]/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase">Vessel / Unit:</span>
              <span className="font-bold text-[#0F8B8D] text-right">{profile.vesselName}</span>
            </div>

            <div className="bg-[#0B2942]/60 p-2.5 border border-[#0D5C7A]/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase">Reg / Service ID:</span>
              <span className="font-bold text-white text-right">{profile.realCraftReg}</span>
            </div>

            <div className="bg-[#0B2942]/60 p-2.5 border border-[#0D5C7A]/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase">NavIC S-Band:</span>
              <span className="font-bold text-cyan-300 text-right">{profile.navicTransponderId}</span>
            </div>

            <div className="bg-[#0B2942]/60 p-2.5 border border-[#0D5C7A]/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase">Home Harbor:</span>
              <span className="font-semibold text-slate-200 text-right truncate max-w-[200px]">{profile.homePort}</span>
            </div>

            <div className="bg-[#0B2942]/60 p-2.5 border border-[#0D5C7A]/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase">Emergency Channel:</span>
              <span className="font-bold text-[#0F8B8D] text-right">{profile.commChannel}</span>
            </div>
          </div>

          {/* Bottom Security Token & QR */}
          <div className="pt-3 border-t border-[#0B2942] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white p-1 border border-slate-300">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-[10px] font-mono">
                <div className="text-slate-400">AUTHENTICATED REALCRAFT TOKEN</div>
                <div className="text-white font-bold">{verificationResult ? verificationResult.token : 'GOI-RC-881924'}</div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-400">
              VALID TILL: <strong className="text-amber-400">{profile.validTill}</strong>
            </div>
          </div>
        </div>

        {/* RIGHT (~7 cols): Authentication Status & Operational Vessel Details */}
        <div className="lg:col-span-7 space-y-4">
          {/* AUTHENTICATION STATUS (Top of Right Panel) */}
          <div className="bg-white border border-[#D1DCE5] p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAF0F3] mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0D5C7A]" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  AUTHENTICATION STATUS
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">LIVE TELEMETRY CHECK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#F4F7F8] border border-slate-200 rounded">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Identity</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#1F9D72]" />
                  <span className="text-xs font-mono font-bold text-[#1F9D72]">VERIFIED</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Biometric e-KYC Pass</span>
              </div>

              <div className="p-3 bg-[#F4F7F8] border border-slate-200 rounded">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Vessel Registry</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#1F9D72]" />
                  <span className="text-xs font-mono font-bold text-[#1F9D72]">CONNECTED</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">RealCraft Database Sync</span>
              </div>

              <div className="p-3 bg-[#F4F7F8] border border-slate-200 rounded">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">NavIC S-Band</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#2EAFD0]" />
                  <span className="text-xs font-mono font-bold text-[#2EAFD0]">AUTHENTICATED</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Direct Satellite Uplink</span>
              </div>
            </div>
          </div>

          {/* EDITABLE PROFILE FORM (Persisted in AuthContext & LocalStorage) */}
          <form onSubmit={handleSave} className="bg-white border border-[#D1DCE5] p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAF0F3]">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#0D5C7A]" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  OPERATIONAL PARAMETERS & CONTACTS
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">SAVED LOCALLY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-[#F4F7F8] border border-[#D1DCE5] rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0D5C7A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  CONTACT PHONE
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-[#F4F7F8] border border-[#D1DCE5] rounded px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0D5C7A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  VESSEL / UNIT NAME
                </label>
                <input
                  type="text"
                  value={profile.vesselName}
                  onChange={(e) => handleInputChange('vesselName', e.target.value)}
                  className="w-full bg-[#F4F7F8] border border-[#D1DCE5] rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0D5C7A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  HOME PORT / HARBOR
                </label>
                <input
                  type="text"
                  value={profile.homePort}
                  onChange={(e) => handleInputChange('homePort', e.target.value)}
                  className="w-full bg-[#F4F7F8] border border-[#D1DCE5] rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0D5C7A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EAF0F3]">
              {saved ? (
                <span className="text-xs font-mono text-[#1F9D72] font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  CHANGES SAVED PERSISTENTLY
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">
                  Keep details accurate for emergency Coast Guard coordination.
                </span>
              )}

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#071A2B] hover:bg-[#0B2942] text-white text-xs font-mono font-bold rounded border border-[#0D5C7A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-cyan-300" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </form>

          {/* HARDWARE SAFETY CHECKLIST */}
          <div className="bg-white border border-[#D1DCE5] p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#EAF0F3]">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                MANDATORY SAFETY PROTOCOLS ON BOARD
              </span>
              <span className="text-[10px] font-mono text-[#1F9D72] font-bold">100% COMPLIANT</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-[#F4F7F8] border border-[#D1DCE5] rounded text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D72] shrink-0" />
                <span>Life Jackets (x{profile.lifeJacketCount || 6})</span>
              </div>
              <div className="p-2 bg-[#F4F7F8] border border-[#D1DCE5] rounded text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D72] shrink-0" />
                <span>VHF Marine Radio</span>
              </div>
              <div className="p-2 bg-[#F4F7F8] border border-[#D1DCE5] rounded text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D72] shrink-0" />
                <span>NavIC Distress SOS</span>
              </div>
              <div className="p-2 bg-[#F4F7F8] border border-[#D1DCE5] rounded text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D72] shrink-0" />
                <span>EPIRB Satellite Beacon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
