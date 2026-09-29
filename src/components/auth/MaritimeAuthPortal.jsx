import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRole, USER_ROLES } from '../../context/RoleContext';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  Anchor,
  Compass,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Key,
  ArrowRight,
  FileCheck,
  Sparkles,
  LogIn,
  Eye,
  EyeOff,
  Fingerprint,
  Cpu,
  Check,
  Globe
} from 'lucide-react';

export function MaritimeAuthPortal({ onSuccessfulAuth = null }) {
  const { login, register } = useAuth();
  const { setRole } = useRole();

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login' | 'admin'
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Guarantee email/ID and password fields remain strictly unfilled on mount and tab switch
  useEffect(() => {
    setLoginId('');
    setLoginPassword('');
    setAdminEmail('');
    setAdminPassword('');
  }, [activeTab]);

  // Registration form state
  const [regRole, setRegRole] = useState('fisherman');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-specific fields
  const [vesselName, setVesselName] = useState('');
  const [realCraftReg, setRealCraftReg] = useState('');
  const [homePort, setHomePort] = useState('');
  const [cooperative, setCooperative] = useState('');
  const [crewCount, setCrewCount] = useState('');

  const [serviceId, setServiceId] = useState('');
  const [designation, setDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [commandSector, setCommandSector] = useState('');

  const [portAuthority, setPortAuthority] = useState('');
  const [vtsStationId, setVtsStationId] = useState('');
  const [pilotageLicense, setPilotageLicense] = useState('');

  const [institution, setInstitution] = useState('');
  const [scientistId, setScientistId] = useState('');
  const [researchVessel, setResearchVessel] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(loginId, loginPassword);
      setLoading(false);
      if (res.success) {
        if (res.user.role && res.user.role !== 'admin') {
          setRole(res.user.role);
        }
        if (onSuccessfulAuth) onSuccessfulAuth(res.user);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 350);
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(adminEmail, adminPassword);
      setLoading(false);
      if (res.success) {
        if (res.user.role === 'admin') {
          if (onSuccessfulAuth) onSuccessfulAuth(res.user);
        } else {
          setErrorMsg('The provided credentials do not have Maritime Administrator privileges.');
        }
      } else {
        setErrorMsg(res.error || 'Admin verification failed. Invalid administrator credentials.');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password entries.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const formData = {
      role: regRole,
      fullName: fullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      homePort: homePort.trim(),
      vesselName: vesselName.trim() || undefined,
      realCraftReg: realCraftReg.trim() || undefined,
      cooperative: cooperative.trim() || undefined,
      crewCount: Number(crewCount) || 1,
      serviceId: serviceId.trim() || undefined,
      designation: designation.trim() || undefined,
      organization: organization.trim() || undefined,
      commandSector: commandSector.trim() || undefined,
      portAuthority: portAuthority.trim() || undefined,
      vtsStationId: vtsStationId.trim() || undefined,
      pilotageLicense: pilotageLicense.trim() || undefined,
      institution: institution.trim() || undefined,
      scientistId: scientistId.trim() || undefined,
      researchVessel: researchVessel.trim() || undefined,
    };

    setTimeout(() => {
      const res = register(formData);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('Maritime digital identity successfully registered & credential issued!');
        setRole(regRole);
        if (onSuccessfulAuth) onSuccessfulAuth(res.user);
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    }, 400);
  };


  const roleMeta = {
    fisherman: {
      badge: 'PFZ + NavIC',
      activeBorder: 'border-[#2EAFD0]',
      activeBg: 'bg-[#0B3356]',
      color: 'text-[#2EAFD0]',
      icon: Anchor,
      field1Label: 'VESSEL NAME',
      field1Placeholder: 'Enter vessel name',
      field2Label: 'REALCRAFT REG ID',
      field2Placeholder: 'Enter RealCraft Reg ID',
      field3Label: 'CREW SIZE / COOP',
      field3Placeholder: 'Crew size & cooperative'
    },
    authority: {
      badge: 'Disaster HQ',
      activeBorder: 'border-[#FB7185]',
      activeBg: 'bg-[#2E1219]',
      color: 'text-[#FB7185]',
      icon: Shield,
      field1Label: 'OFFICIAL SERVICE ID',
      field1Placeholder: 'Enter Service ID',
      field2Label: 'RANK / DESIGNATION',
      field2Placeholder: 'Enter rank or designation',
      field3Label: 'MINISTRY / SECTOR',
      field3Placeholder: 'Ministry or Sector'
    },
    operator: {
      badge: 'VTS & Berthing',
      activeBorder: 'border-[#FBBF24]',
      activeBg: 'bg-[#2E1F0B]',
      color: 'text-[#FBBF24]',
      icon: Compass,
      field1Label: 'PORT AUTHORITY',
      field1Placeholder: 'Enter port authority / terminal',
      field2Label: 'VTS STATION ID',
      field2Placeholder: 'Enter VTS station ID',
      field3Label: 'PILOTAGE LICENSE',
      field3Placeholder: 'Pilotage license number'
    },
    researcher: {
      badge: 'INCOIS / Argo',
      activeBorder: 'border-[#34D399]',
      activeBg: 'bg-[#0B2E21]',
      color: 'text-[#34D399]',
      icon: Activity,
      field1Label: 'RESEARCH INSTITUTION',
      field1Placeholder: 'Enter institution',
      field2Label: 'SCIENTIST ID',
      field2Placeholder: 'Enter scientist ID',
      field3Label: 'RESEARCH VESSEL',
      field3Placeholder: 'Primary research vessel'
    }
  };

  const currentMeta = roleMeta[regRole] || roleMeta.fisherman;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Single-Screen Tactical Card with Glassmorphic Depth */}
      <div className="bg-[#071A2B]/95 backdrop-blur-md border border-[#18476F]/90 rounded-lg overflow-hidden shadow-2xl">
        
        {/* COMPACT TOP BAR: Brand + RealCraft/NavIC Status + Integrated Tab Switcher */}
        <div className="px-3 sm:px-4 py-2 border-b border-[#18476F] bg-[#0B2942]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#071A2B] border border-[#0D5C7A] flex items-center justify-center text-[#2EAFD0] shrink-0">
              <Fingerprint className="w-4 h-4 text-[#2EAFD0]" />
            </div>
            <div>
              <span className="font-mono font-bold text-xs sm:text-sm text-white tracking-wide uppercase">
                ORCA MARITIME IDENTITY GATEWAY
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-mono text-[#2EAFD0] bg-[#071A2B] px-1.5 py-0.2 rounded border border-[#0D5C7A]">
                REALCRAFT & NAVIC S-BAND ENCRYPTED
              </span>
            </div>
          </div>

          {/* Compact Pill Tab Controller */}
          <div className="flex items-center p-0.5 rounded bg-[#051422] border border-[#18476F] text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#0D5C7A] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#0B2942]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#2EAFD0]" />
              <span>NEW REGISTRATION</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#0F3456] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#0B2942]'
              }`}
            >
              <LogIn className="w-3 h-3 text-[#2EAFD0]" />
              <span>SIGN IN</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#991B1B] text-white shadow-xs'
                  : 'text-[#FB7185] hover:bg-[#2E1219]'
              }`}
            >
              <Lock className="w-3 h-3 text-[#FB7185]" />
              <span>ADMIN</span>
            </button>
          </div>
        </div>

        {/* COMPACT FEEDBACK NOTICES */}
        {errorMsg && (
          <div className="mx-3 mt-2 px-3 py-1.5 rounded bg-[#2E1219] border border-[#FB7185] text-[#FECDD3] text-xs flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
            <span className="font-medium font-sans">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-3 mt-2 px-3 py-1.5 rounded bg-[#0B2E21] border border-[#34D399] text-[#A7F3D0] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
            <span className="font-medium font-sans">{successMsg}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: COMPLETE SINGLE-SCREEN NEW REGISTRATION (Zero Scroll Required)
            ========================================================================= */}
        {activeTab === 'register' && (
          <div className="p-3 sm:p-4 space-y-3">
            
            {/* COMPACT ROW 1: Sleek 4-Role Selector Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {USER_ROLES.map((r) => {
                const isSelected = regRole === r.id;
                const meta = roleMeta[r.id] || roleMeta.fisherman;
                const RoleIcon = meta.icon;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegRole(r.id)}
                    className={`px-2.5 py-1.5 rounded border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? `${meta.activeBg} ${meta.activeBorder} shadow-inner`
                        : 'bg-[#0B2942] border-[#18476F] hover:bg-[#0F3456]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded flex items-center justify-center bg-[#071A2B] shrink-0 ${meta.color}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate leading-tight">{r.title}</div>
                        <div className={`text-[10px] font-mono truncate leading-tight ${meta.color}`}>{meta.badge}</div>
                      </div>
                    </div>

                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-[#2EAFD0] border-[#2EAFD0] text-[#071A2B]' : 'border-[#18476F]'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* COMPACT ROW 2: Balanced 3-Column Ergonomic Form Layout */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* COLUMN 1: Personal Identification */}
                <div className="bg-[#0B2942] border border-[#18476F] rounded p-3 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-[#2EAFD0] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#18476F] pb-1">
                    <User className="w-3 h-3 text-[#2EAFD0]" />
                    <span>1. SEAFARER IDENTITY</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      FULL NAME / TITLE <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name / title"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      OFFICIAL EMAIL <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Enter official email address"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      PHONE / CALLSIGN <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Enter phone number or callsign"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                    />
                  </div>
                </div>

                {/* COLUMN 2: Station & Role Regulatory Compliance */}
                <div className="bg-[#0B2942] border border-[#18476F] rounded p-3 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-[#2EAFD0] uppercase tracking-wider flex items-center justify-between border-b border-[#18476F] pb-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#2EAFD0]" />
                      <span>2. {regRole.toUpperCase()} COMPLIANCE</span>
                    </span>
                    <span className="text-[9px] font-mono text-[#2EAFD0]">REALCRAFT</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      HOME PORT / OPERATING BASE <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={homePort}
                      onChange={(e) => setHomePort(e.target.value)}
                      placeholder="Enter home port or operating base"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                    />
                  </div>

                  {/* Dynamic Role Input 1 */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      {currentMeta.field1Label} <span className="text-[#D96B3B]">*</span>
                    </label>
                    {regRole === 'fisherman' && (
                      <input
                        type="text"
                        required
                        value={vesselName}
                        onChange={(e) => setVesselName(e.target.value)}
                        placeholder={currentMeta.field1Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                      />
                    )}
                    {regRole === 'authority' && (
                      <input
                        type="text"
                        required
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        placeholder={currentMeta.field1Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-[#FB7185] placeholder-slate-500 focus:outline-none focus:border-[#FB7185]"
                      />
                    )}
                    {regRole === 'operator' && (
                      <input
                        type="text"
                        required
                        value={portAuthority}
                        onChange={(e) => setPortAuthority(e.target.value)}
                        placeholder={currentMeta.field1Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FBBF24]"
                      />
                    )}
                    {regRole === 'researcher' && (
                      <input
                        type="text"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder={currentMeta.field1Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#34D399]"
                      />
                    )}
                  </div>

                  {/* Dynamic Role Input 2 */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      {currentMeta.field2Label} <span className="text-[#D96B3B]">*</span>
                    </label>
                    {regRole === 'fisherman' && (
                      <input
                        type="text"
                        required
                        value={realCraftReg}
                        onChange={(e) => setRealCraftReg(e.target.value)}
                        placeholder={currentMeta.field2Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-[#2EAFD0] placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                      />
                    )}
                    {regRole === 'authority' && (
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder={currentMeta.field2Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FB7185]"
                      />
                    )}
                    {regRole === 'operator' && (
                      <input
                        type="text"
                        required
                        value={vtsStationId}
                        onChange={(e) => setVtsStationId(e.target.value)}
                        placeholder={currentMeta.field2Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-[#FBBF24] placeholder-slate-500 focus:outline-none focus:border-[#FBBF24]"
                      />
                    )}
                    {regRole === 'researcher' && (
                      <input
                        type="text"
                        required
                        value={scientistId}
                        onChange={(e) => setScientistId(e.target.value)}
                        placeholder={currentMeta.field2Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-[#34D399] placeholder-slate-500 focus:outline-none focus:border-[#34D399]"
                      />
                    )}
                  </div>
                </div>

                {/* COLUMN 3: Secondary Role Details & Security Passwords */}
                <div className="bg-[#0B2942] border border-[#18476F] rounded p-3 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-[#2EAFD0] uppercase tracking-wider flex items-center justify-between border-b border-[#18476F] pb-1">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-[#2EAFD0]" />
                      <span>3. ACCESS CREDENTIALS</span>
                    </span>
                    {regPassword && confirmPassword && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        regPassword === confirmPassword ? 'text-[#34D399] border-[#34D399]' : 'text-[#FB7185] border-[#FB7185]'
                      }`}>
                        {regPassword === confirmPassword ? '✓ MATCH' : '✕ NO MATCH'}
                      </span>
                    )}
                  </div>

                  {/* Dynamic Role Input 3 (Optional or secondary) */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                      {currentMeta.field3Label}
                    </label>
                    {regRole === 'fisherman' && (
                      <input
                        type="text"
                        value={cooperative}
                        onChange={(e) => setCooperative(e.target.value)}
                        placeholder={currentMeta.field3Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                      />
                    )}
                    {regRole === 'authority' && (
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={currentMeta.field3Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FB7185]"
                      />
                    )}
                    {regRole === 'operator' && (
                      <input
                        type="text"
                        value={pilotageLicense}
                        onChange={(e) => setPilotageLicense(e.target.value)}
                        placeholder={currentMeta.field3Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FBBF24]"
                      />
                    )}
                    {regRole === 'researcher' && (
                      <input
                        type="text"
                        value={researchVessel}
                        onChange={(e) => setResearchVessel(e.target.value)}
                        placeholder={currentMeta.field3Placeholder}
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#34D399]"
                      />
                    )}
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                        PASSWORD *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                        CONFIRM *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-[#051422] border border-[#18476F] rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPACT SUBMIT ACTION BAR */}
              <div className="pt-1 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[10px] font-mono text-slate-400">
                  By enrolling, you authorize official real-time NavIC transponder telemetry.
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#0F8B8D] hover:bg-[#0D5C7A] border border-[#2EAFD0]/60 shadow-sm transition-colors flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <FileCheck className="w-4 h-4 text-[#2EAFD0]" />
                  <span>{loading ? 'ENROLLING...' : 'COMPLETE REGISTRATION & ISSUE CREDENTIAL'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 2: COMPACT 2-COLUMN PERSONNEL SIGN IN (Zero Scroll Required)
            ========================================================================= */}
        {activeTab === 'login' && (
          <div className="p-3 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Left Column: Form */}
              <div className="bg-[#0B2942] border border-[#18476F] rounded p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#18476F] pb-2">
                  <User className="w-4 h-4 text-[#2EAFD0]" />
                  <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                    PERSONNEL SIGN IN
                  </span>
                </div>

                <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-3">
                  {/* Hidden decoy fields to trap and defuse browser credential autofill */}
                  <input
                    type="text"
                    name="orca_decoy_identity"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                  />
                  <input
                    type="password"
                    name="orca_decoy_pass"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="new-password"
                    style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                  />

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-1">
                      EMAIL / REALCRAFT REG / SERVICE ID <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="orca_user_entry_id"
                      id="orca_user_entry_id"
                      required
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readOnly')}
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Enter registered email or Service / RealCraft ID"
                      autoComplete="off"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-1">
                      PASSWORD <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="password"
                      name="orca_user_entry_pass"
                      id="orca_user_entry_pass"
                      autoComplete="new-password"
                      required
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readOnly')}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#2EAFD0]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 rounded text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#0F3456] hover:bg-[#0D5C7A] border border-[#2EAFD0]/60 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#2EAFD0]" />
                    <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER'}</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Official Security & Verification Guidelines */}
              <div className="bg-[#0B2942] border border-[#18476F] rounded p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#18476F] pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                  <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                    SECURITY & IDENTITY PROTOCOLS
                  </span>
                </div>

                <div className="space-y-2 text-xs font-sans text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-[#2EAFD0] font-mono font-bold">•</span>
                    <span>
                      <strong className="text-white">Unified Identifier:</strong> Authenticate using your registered Email, Official RealCraft Vessel ID, or Ministry Service Number.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2EAFD0] font-mono font-bold">•</span>
                    <span>
                      <strong className="text-white">Role Telemetry Sync:</strong> Once authenticated, tactical views and safety margins automatically align with your operational tier.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2EAFD0] font-mono font-bold">•</span>
                    <span>
                      <strong className="text-white">Encrypted Transit:</strong> All communication and emergency broadcasts are protected with SHA-256 session integrity.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#18476F]/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Need credentials?</span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[#2EAFD0] hover:text-white hover:underline cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <span>ENROLL HERE</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: COMPACT 2-COLUMN ADMIN SECURITY CLEARANCE (Zero Scroll Required)
            ========================================================================= */}
        {activeTab === 'admin' && (
          <div className="p-3 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Left Column: Terminal clearance info */}
              <div className="bg-[#2E1219] border border-[#FB7185]/60 rounded p-4 space-y-3">
                <div className="flex items-center gap-2 text-[#FB7185] font-mono font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>ADMINISTRATIVE COMMAND CLEARANCE</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  Restricted Level-5 TS clearance terminal. Direct interface for maritime fleet roster auditing, transponder compliance inspection, and strategic disaster overrides.
                </p>

                <div className="pt-2 border-t border-[#FB7185]/30 space-y-1.5 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-2 text-[#FB7185]">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-bold uppercase">Restricted Access Notice</span>
                  </div>
                  <p className="text-slate-400 leading-normal">
                    Administrative access requires an authorized government account and security access token. All access attempts and modifications are cryptographically audited.
                  </p>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="bg-[#0B2942] border border-[#18476F] rounded p-4 space-y-3">
                <form onSubmit={handleAdminLoginSubmit} autoComplete="off" className="space-y-3">
                  {/* Hidden decoy fields to trap and defuse browser credential autofill */}
                  <input
                    type="text"
                    name="orca_admin_decoy_id"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                  />
                  <input
                    type="password"
                    name="orca_admin_decoy_pass"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="new-password"
                    style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                  />

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-1">
                      ADMINISTRATOR EMAIL ID <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="orca_admin_entry_id"
                      id="orca_admin_entry_id"
                      required
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readOnly')}
                      autoComplete="off"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="Enter administrator email"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FB7185]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-1">
                      SECURITY ACCESS TOKEN <span className="text-[#D96B3B]">*</span>
                    </label>
                    <input
                      type="password"
                      name="orca_admin_entry_token"
                      id="orca_admin_entry_token"
                      autoComplete="new-password"
                      required
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readOnly')}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter security access token"
                      className="w-full bg-[#051422] border border-[#18476F] rounded px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FB7185]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 rounded text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#991B1B] hover:bg-[#7F1D1D] border border-[#FB7185]/60 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-white" />
                    <span>{loading ? 'VERIFYING...' : 'AUTHORIZE ADMIN SESSION'}</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
