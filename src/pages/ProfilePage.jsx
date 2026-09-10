import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { RoleModeSwitcher } from '../components/common/RoleModeSwitcher';
import { getStoredGeminiKey, setStoredGeminiKey, testGeminiKey } from '../services/geminiService';
import {
  getStoredUserProfile,
  saveStoredUserProfile,
  simulateGovtVerification,
  DEFAULT_PROFILES
} from '../services/profileService';
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
  Award,
  Key,
  QrCode,
  Printer,
  RefreshCw,
  ExternalLink,
  Users,
  Compass,
  AlertCircle,
  FileCheck2,
  HardDrive
} from 'lucide-react';

export function ProfilePage() {
  const { role, currentRole } = useRole();
  const { currentLang, setCurrentLang, languages, t } = useLanguage();

  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(() => getStoredUserProfile(role));
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());
  const [apiKeyStatus, setApiKeyStatus] = useState(null);

  // Sync profile when role changes
  useEffect(() => {
    setProfile(getStoredUserProfile(role));
  }, [role]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleGovtVerify = async () => {
    setIsVerifying(true);
    const res = await simulateGovtVerification(profile.realCraftReg || profile.serviceId);
    setIsVerifying(false);
    setVerificationResult(res);
    handleInputChange('isGovtVerified', true);
  };

  const handlePrintPass = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ocean-deep via-ocean-navy to-ocean-medium text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <User className="w-6 h-6 text-ocean-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-mono">
                  GOVT. OF INDIA • REALCRAFT CERTIFIED
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {t('profilePageTitle', 'Maritime Identity & Vessel Authentication Center')}
              </h1>
              <p className="text-xs md:text-sm text-sky-100/80 mt-0.5 max-w-2xl">
                {t('profilePageSub', 'Official Seafarer Registry, RealCraft vessel credentials, biometric validation, and NavIC S-band hardware authentication.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NavIC S-Band: LOCKED</span>
            </span>
          </div>
        </div>
      </div>

      {/* Official Government Digital Maritime Smart Pass / ID Card Preview */}
      <div className="bg-gradient-to-br from-slate-900 via-ocean-deep to-slate-950 text-white rounded-2xl p-6 shadow-2xl border-2 border-amber-400/40 relative overflow-hidden print:border-none print:shadow-none print:m-0">
        {/* Decorative holographic security stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 via-emerald-400 to-amber-400" />
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🇮🇳
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                GOVERNMENT OF INDIA • MINISTRY OF FISHERIES & ISRO
              </div>
              <h2 className="text-base md:text-lg font-black tracking-wide text-white flex items-center gap-2">
                <span>NATIONAL SEAFARER DIGITAL SMART PASS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED</span>
                </span>
              </h2>
              <div className="text-[11px] text-slate-300">
                National Marine Fishing Regulation Authority (MFRA) • RealCraft Registry ID: <strong className="font-mono text-white">{profile.realCraftReg || profile.serviceId}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handlePrintPass}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print ID Card</span>
            </button>
            <button
              type="button"
              onClick={handleGovtVerify}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying...' : 'Re-Verify NIC'}</span>
            </button>
          </div>
        </div>

        {/* Card Body with Photo, Details, and QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 items-center">
          {/* Avatar / Photo */}
          <div className="md:col-span-3 flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-ocean-teal to-sky-400 p-1 shadow-lg relative mb-2">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                {role === 'fisherman' ? '👨‍✈️' : role === 'authority' ? '👮‍♂️' : role === 'operator' ? '⚓' : '🔬'}
              </div>
              <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 border-2 border-slate-900" title="Aadhaar e-KYC Verified">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>
            <div className="font-bold text-sm text-white">{profile.fullName}</div>
            <div className="text-[10px] text-amber-300/90 font-mono mt-0.5 uppercase tracking-wider">{t(currentRole.title)}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Aadhaar: {profile.aadhaarMasked || 'GOV-VERIFIED'}</div>
          </div>

          {/* Credentials Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {role === 'fisherman' ? 'Vessel Name & Call Sign' : 'Designation / Command'}
              </span>
              <span className="font-bold text-white text-xs mt-0.5 block truncate">
                {role === 'fisherman' ? `${profile.vesselName}` : `${profile.designation}`}
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                {role === 'fisherman' ? `Call Sign: ${profile.callSign}` : `Org: ${profile.organization || profile.institution || profile.portAuthority}`}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {role === 'fisherman' ? 'RealCraft National Reg' : 'Service / License ID'}
              </span>
              <span className="font-bold font-mono text-white text-xs mt-0.5 block truncate">
                {profile.realCraftReg || profile.serviceId || profile.pilotageLicense || profile.scientistId}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                ● Active on Roster
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {role === 'fisherman' ? 'NavIC S-Band Hardware ID' : 'Command / Station Sector'}
              </span>
              <span className="font-bold font-mono text-sky-200 text-xs mt-0.5 block truncate">
                {profile.navicTransponderId || profile.commandSector || profile.vtsStationId || profile.researchSector}
              </span>
              <span className="text-[10px] text-slate-400">
                {role === 'fisherman' ? `MMSI: ${profile.mmsi}` : 'Direct Link Active'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Home Port / Operational Base</span>
              <span className="font-bold text-white text-xs mt-0.5 block truncate">
                {profile.homePort || profile.stationId || profile.portAuthority || 'Kochi Headquarters'}
              </span>
              <span className="text-[10px] text-slate-400">
                Valid till: <strong className="text-amber-300">{profile.validTill}</strong>
              </span>
            </div>
          </div>

          {/* RealCraft Verification QR Code & Security Stamp */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 border border-white/15 text-center">
            <div className="bg-white p-2 rounded-lg shadow-md mb-2">
              <QrCode className="w-14 h-14 text-slate-900" />
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>NIC SECURE TOKEN</span>
            </div>
            <div className="text-[9px] text-slate-300 font-mono mt-0.5 truncate max-w-[140px]">
              {verificationResult ? verificationResult.token : 'GOI-RC-881924'}
            </div>
          </div>
        </div>

        {/* Verification Success Toast Notification */}
        {verificationResult && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Govt. Handshake Confirmed:</strong> {verificationResult.status} via {verificationResult.agency}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">
              {new Date(verificationResult.timestamp).toLocaleTimeString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Role Switcher Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{t('maritimePersona', 'Maritime Operational Persona')}</h2>
            <span className="text-xs font-semibold text-ocean-teal uppercase">{t('active', 'Active')}: {t(currentRole.title)}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('personaExpl', 'Switching your persona reorganizes dashboard tiles, alert priorities, and agent recommendations tailored to your maritime mission.')}
          </p>
        </div>

        <RoleModeSwitcher />
      </div>

      {/* Profile Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Specific Role-Based Maritime Credentials Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-ocean-teal" />
              <h3 className="font-bold text-sm text-slate-800">
                {role === 'fisherman' && 'Vessel & RealCraft Government Registration Details'}
                {role === 'authority' && 'Disaster Management Service & Command Credentials'}
                {role === 'operator' && 'VTS Station & DG Shipping Pilotage Credentials'}
                {role === 'researcher' && 'Scientific Institution & Research Vessel Affiliation'}
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-sky-50 text-ocean-deep px-2.5 py-1 rounded-lg border border-sky-200 font-bold">
              MFRA STANDARDIZED
            </span>
          </div>

          {/* Fields for Fisherman Persona */}
          {role === 'fisherman' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Master Captain / Tindal Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vessel Name & Registration</label>
                <input
                  type="text"
                  value={profile.vesselName}
                  onChange={(e) => handleInputChange('vesselName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">RealCraft National Reg. ID</label>
                <input
                  type="text"
                  value={profile.realCraftReg}
                  onChange={(e) => handleInputChange('realCraftReg', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NavIC S-Band Transponder UUID</label>
                <input
                  type="text"
                  value={profile.navicTransponderId}
                  onChange={(e) => handleInputChange('navicTransponderId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">MMSI Identifier (IMO / ITU)</label>
                <input
                  type="text"
                  value={profile.mmsi}
                  onChange={(e) => handleInputChange('mmsi', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fishermen Biometric ID (MoFAH&D)</label>
                <input
                  type="text"
                  value={profile.biometricId}
                  onChange={(e) => handleInputChange('biometricId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Hull Category & Length</label>
                <input
                  type="text"
                  value={profile.hullType}
                  onChange={(e) => handleInputChange('hullType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Engine Propulsion (HP & Make)</label>
                <input
                  type="text"
                  value={profile.engineHp}
                  onChange={(e) => handleInputChange('engineHp', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registered Onboard Crew Count</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={profile.crewCount}
                  onChange={(e) => handleInputChange('crewCount', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Life Jackets (PFD) Onboard</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={profile.lifeJacketCount}
                  onChange={(e) => handleInputChange('lifeJacketCount', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fuel Capacity & Endurance</label>
                <input
                  type="text"
                  value={`${profile.fuelLiters} Liters (${profile.fuelEnduranceHours} Hours Endurance)`}
                  onChange={(e) => handleInputChange('fuelEnduranceHours', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Coastal Fisheries Co-operative</label>
                <input
                  type="text"
                  value={profile.cooperative}
                  onChange={(e) => handleInputChange('cooperative', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div className="md:col-span-3">
                <label className="font-semibold text-slate-700 block mb-1">Registered Home Port & Anchorage</label>
                <input
                  type="text"
                  value={profile.homePort}
                  onChange={(e) => handleInputChange('homePort', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>
            </div>
          )}

          {/* Fields for Disaster Authority Persona */}
          {role === 'authority' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Commanding Officer Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Service / Badge ID</label>
                <input
                  type="text"
                  value={profile.serviceId}
                  onChange={(e) => handleInputChange('serviceId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designation & Operational Role</label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Organization / Agency</label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Maritime Command Sector</label>
                <input
                  type="text"
                  value={profile.commandSector}
                  onChange={(e) => handleInputChange('commandSector', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clearance Level & Directives Authority</label>
                <input
                  type="text"
                  value={profile.clearanceLevel}
                  onChange={(e) => handleInputChange('clearanceLevel', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-rose-700 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>
            </div>
          )}

          {/* Fields for Maritime Operator Persona */}
          {role === 'operator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">VTS Master / Controller Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">VTS Station & Console ID</label>
                <input
                  type="text"
                  value={profile.vtsStationId}
                  onChange={(e) => handleInputChange('vtsStationId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Port Authority / Harbor Directorate</label>
                <input
                  type="text"
                  value={profile.portAuthority}
                  onChange={(e) => handleInputChange('portAuthority', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">DG Shipping Pilotage License Number</label>
                <input
                  type="text"
                  value={profile.pilotageLicense}
                  onChange={(e) => handleInputChange('pilotageLicense', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>
            </div>
          )}

          {/* Fields for Researcher Persona */}
          {role === 'researcher' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Principal Scientist Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scientific ID / Institutional Roll</label>
                <input
                  type="text"
                  value={profile.scientistId}
                  onChange={(e) => handleInputChange('scientistId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Affiliated Oceanographic Institution</label>
                <input
                  type="text"
                  value={profile.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Research Vessel (ORV)</label>
                <input
                  type="text"
                  value={profile.researchVessel}
                  onChange={(e) => handleInputChange('researchVessel', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                />
              </div>
            </div>
          )}
        </div>

        {/* Registered Crew Manifest for Fishermen */}
        {role === 'fisherman' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-ocean-teal" />
                <h3 className="font-bold text-sm text-slate-800">Coast Guard SAR Crew Manifest (4 Registered Seafarers)</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● e-KYC VERIFIED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                    <th className="pb-2">Crew Member</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Biometric ID</th>
                    <th className="pb-2">Blood Group</th>
                    <th className="pb-2">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 font-bold text-slate-900">1. Murugan Sundaram</td>
                    <td className="py-2 text-ocean-teal font-semibold">Skipper / Tindal</td>
                    <td className="py-2 font-mono text-slate-600">IN-BIO-KER-8819</td>
                    <td className="py-2 font-bold text-rose-600">O +ve</td>
                    <td className="py-2 text-slate-600">+91 98470 12345</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-900">2. Anthony Joseph</td>
                    <td className="py-2 text-slate-600 font-medium">Engine Mechanic</td>
                    <td className="py-2 font-mono text-slate-600">IN-BIO-KER-8820</td>
                    <td className="py-2 font-bold text-rose-600">B +ve</td>
                    <td className="py-2 text-slate-600">+91 94471 23456</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-900">3. Rajesh K. Velayudhan</td>
                    <td className="py-2 text-slate-600 font-medium">Net Deckhand</td>
                    <td className="py-2 font-mono text-slate-600">IN-BIO-KER-8821</td>
                    <td className="py-2 font-bold text-rose-600">A +ve</td>
                    <td className="py-2 text-slate-600">+91 98472 34567</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-900">4. Sivadasan Nair</td>
                    <td className="py-2 text-slate-600 font-medium">Net Deckhand</td>
                    <td className="py-2 font-mono text-slate-600">IN-BIO-KER-8822</td>
                    <td className="py-2 font-bold text-rose-600">AB +ve</td>
                    <td className="py-2 text-slate-600">+91 94473 45678</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Regional Language Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-ocean-teal" />
            <h3 className="font-bold text-sm text-slate-800">{t('coastalLanguageHeading', 'Coastal Language & Voice Interface')}</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
            {languages.map((l) => {
              const isSelected = l.code === currentLang;
              return (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => setCurrentLang(l.code)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-ocean-teal text-ocean-deep shadow-xs font-bold ring-2 ring-ocean-teal/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xl mb-1">{l.flag}</div>
                  <div className="text-xs">{l.native}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{l.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coastal Safety Alerts & Emergency Broadcast */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Bell className="w-4 h-4 text-ocean-teal" />
            <h3 className="font-bold text-sm text-slate-800">{t('alertChannelsHeading', 'Alert Dispatch & Telemetry Channels')}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">{t('emergencySmsLabel', 'Emergency SMS Coastal Broadcast')}</span>
                <span className="text-slate-500">{t('emergencySmsDesc', 'Receive red alert cyclone and swell warnings via regional cell towers even when offline')}</span>
              </div>
              <input
                type="checkbox"
                checked={profile.smsAlerts}
                onChange={(e) => handleInputChange('smsAlerts', e.target.checked)}
                className="w-4 h-4 rounded text-ocean-teal focus:ring-ocean-teal"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">{t('audioSirenLabel', 'Audio Siren / Voice Readout')}</span>
                <span className="text-slate-500">{t('audioSirenDesc', 'Play spoken audio synthesized warning in selected local dialect')}</span>
              </div>
              <input
                type="checkbox"
                checked={profile.audioHornAlerts}
                onChange={(e) => handleInputChange('audioHornAlerts', e.target.checked)}
                className="w-4 h-4 rounded text-ocean-teal focus:ring-ocean-teal"
              />
            </label>
          </div>
        </div>

        {/* AI Engine & Backend API Keys Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-ocean-teal" />
              <h3 className="font-bold text-sm text-slate-800">{t('aiEngineConfig', 'AI Engine & Live API Configuration (SIH26176)')}</h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              geminiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {geminiKey ? t('liveGeminiEngine', '● LIVE GEMINI ENGINE') : t('scenarioMode', '○ HIGH-FIDELITY SCENARIO MODE')}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              {t('geminiDesc', 'Connect your Google Gemini API key to enable live, real-time multi-agent reasoning for any dynamic maritime question during your presentation.')}
            </p>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('geminiKeyLabel', 'Google Gemini API Key (VITE_GEMINI_API_KEY)')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Paste your Gemini API Key here (AIzaSy...)"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-teal text-xs"
                />
                <button
                  type="button"
                  onClick={async () => {
                    setApiKeyStatus('Testing connection...');
                    const res = await testGeminiKey(geminiKey);
                    if (res.valid) {
                      setStoredGeminiKey(geminiKey);
                      setApiKeyStatus('Success! Google Gemini live engine is connected & ready.');
                    } else {
                      setApiKeyStatus(`Error: ${res.error || 'Connection failed'}`);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white font-bold whitespace-nowrap shadow-xs transition-colors"
                >
                  {t('testAndConnect', 'Test & Connect')}
                </button>
              </div>
            </div>

            {apiKeyStatus && (
              <div className={`p-2.5 rounded-lg font-medium text-[11px] ${
                apiKeyStatus.startsWith('Success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                apiKeyStatus.startsWith('Error') ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                'bg-sky-50 text-sky-800'
              }`}>
                {apiKeyStatus}
              </div>
            )}
          </div>
        </div>

        {/* Save button and status */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>{t('settingsSaved', 'Settings & credentials authenticated and synced locally!')}</span>
            </span>
          )}
          {!saved && <div />}

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Authenticate Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
