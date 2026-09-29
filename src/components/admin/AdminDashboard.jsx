import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Anchor,
  Compass,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  Eye,
  LogOut,
  Radio,
  MapPin,
  Ship,
  Phone,
  Key,
  Printer,
  X,
  FileCheck2,
  UserCheck
} from 'lucide-react';

export function AdminDashboard() {
  const { currentUser, allUsers, stats, verifyUser, deleteUser, logout } = useAuth();

  const [activeRoleTab, setActiveRoleTab] = useState('all'); // 'all' | 'fisherman' | 'authority' | 'operator' | 'researcher'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState('all'); // 'all' | 'verified' | 'pending'
  const [selectedUserDossier, setSelectedUserDossier] = useState(null);

  // Filtered list
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Role match
      if (activeRoleTab !== 'all' && u.role !== activeRoleTab) return false;

      // Verification filter
      if (filterVerified === 'verified' && !u.isVerified) return false;
      if (filterVerified === 'pending' && u.isVerified) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.realCraftReg && u.realCraftReg.toLowerCase().includes(q)) ||
        (u.serviceId && u.serviceId.toLowerCase().includes(q)) ||
        (u.scientistId && u.scientistId.toLowerCase().includes(q)) ||
        (u.vesselName && u.vesselName.toLowerCase().includes(q)) ||
        (u.homePort && u.homePort.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q))
      );
    });
  }, [allUsers, activeRoleTab, filterVerified, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Role', 'Full Name', 'Email', 'Phone', 'Vessel/Station', 'Reg/Service ID', 'Home Port', 'Verified', 'Last Login'];
    const rows = filteredUsers.map(u => [
      u.id,
      u.role,
      `"${u.fullName || ''}"`,
      u.email,
      u.phone || '',
      `"${u.vesselName || u.organization || u.portAuthority || u.institution || ''}"`,
      u.realCraftReg || u.serviceId || u.scientistId || '',
      `"${u.homePort || ''}"`,
      u.isVerified ? 'VERIFIED' : 'PENDING',
      `"${u.lastLogin || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ORCA_Maritime_Roster_${activeRoleTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'fisherman':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            <Anchor className="w-3 h-3" /> FISHERMAN
          </span>
        );
      case 'authority':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
            <ShieldAlert className="w-3 h-3" /> AUTHORITY
          </span>
        );
      case 'operator':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
            <Compass className="w-3 h-3" /> OPERATOR
          </span>
        );
      case 'researcher':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            <Activity className="w-3 h-3" /> RESEARCHER
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
            <Shield className="w-3 h-3" /> ADMIN
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP COMMAND COCKPIT BANNER */}
      <div className="bg-[#071A2B] text-white p-4 sm:p-5 border border-[#0B2942] rounded-none shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded bg-[#0B2942] border border-[#C93C4B] flex items-center justify-center text-[#C93C4B] shrink-0 shadow-inner">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-mono font-black text-sm sm:text-base md:text-lg uppercase tracking-wide text-white">
                ORCA MARITIME COMMAND & ROSTER ADMINISTRATION
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#C93C4B]/20 text-rose-300 border border-rose-500/50 text-[10px] font-mono font-bold">
                LEVEL-5 TS CLEARANCE
              </span>
            </div>
            <p className="text-xs text-cyan-200/80 font-sans mt-0.5">
              Logged in as <strong className="text-white">{currentUser?.fullName}</strong> ({currentUser?.designation}) • Station: <span className="font-mono text-cyan-300">{currentUser?.stationId}</span>
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0B2942] hover:bg-[#0D5C7A] text-white text-xs font-mono font-bold border border-[#0D5C7A] transition-colors cursor-pointer"
            title="Export filtered roster to CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">EXPORT CSV</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C93C4B] hover:bg-[#A82B3A] text-white text-xs font-mono font-bold border border-rose-400/50 transition-colors cursor-pointer"
            title="End Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* 2. STATISTICAL KPI TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 bg-white border border-[#D1DCE5] rounded">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
            TOTAL PERSONNEL
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-0.5">
            {stats.total}
          </div>
          <div className="text-[10px] font-mono text-[#1F9D72] mt-0.5">Across All 4 Roles</div>
        </div>

        <div className="p-3 bg-white border border-[#D1DCE5] rounded">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
            FISHING FLEET
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#0D5C7A] mt-0.5">
            {stats.fishermen}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">RealCraft Tracked</div>
        </div>

        <div className="p-3 bg-white border border-[#D1DCE5] rounded">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
            DISASTER AUTHORITIES
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#C93C4B] mt-0.5">
            {stats.authorities}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">NDMA / MRCC EOCs</div>
        </div>

        <div className="p-3 bg-white border border-[#D1DCE5] rounded">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
            PORT VTS & RESEARCH
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#1C7293] mt-0.5">
            {stats.operators + stats.researchers}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Harbors & Survey Ships</div>
        </div>

        <div className="p-3 bg-white border border-[#D1DCE5] rounded col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
            GOVT VERIFIED RATIO
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#1F9D72] mt-0.5">
            {stats.verifiedPercent}%
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">{stats.verified} Verified • {stats.pending} Pending</div>
        </div>
      </div>

      {/* 3. ROLE-WISE TABS (ORGANIZED, NEVER A MESS) */}
      <div className="bg-white border border-[#D1DCE5] rounded overflow-hidden shadow-xs">
        {/* Role Segment Tabs */}
        <div className="flex border-b border-[#D1DCE5] bg-[#F4F7F8] overflow-x-auto text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => setActiveRoleTab('all')}
            className={`py-3 px-4 border-r border-[#D1DCE5] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeRoleTab === 'all'
                ? 'bg-white text-[#071A2B] border-b-2 border-b-[#071A2B]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EAF0F3]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>ALL PERSONNEL ({allUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('fisherman')}
            className={`py-3 px-4 border-r border-[#D1DCE5] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeRoleTab === 'fisherman'
                ? 'bg-white text-[#0D5C7A] border-b-2 border-b-[#0D5C7A]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EAF0F3]'
            }`}
          >
            <Anchor className="w-3.5 h-3.5 text-[#0D5C7A]" />
            <span>FISHERMEN & VESSELS ({stats.fishermen})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('authority')}
            className={`py-3 px-4 border-r border-[#D1DCE5] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeRoleTab === 'authority'
                ? 'bg-white text-[#C93C4B] border-b-2 border-b-[#C93C4B]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EAF0F3]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C93C4B]" />
            <span>DISASTER AUTHORITIES ({stats.authorities})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('operator')}
            className={`py-3 px-4 border-r border-[#D1DCE5] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeRoleTab === 'operator'
                ? 'bg-white text-[#1C7293] border-b-2 border-b-[#1C7293]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EAF0F3]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#1C7293]" />
            <span>PORT OPERATORS ({stats.operators})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('researcher')}
            className={`py-3 px-4 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeRoleTab === 'researcher'
                ? 'bg-white text-[#059669] border-b-2 border-b-[#059669]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EAF0F3]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#059669]" />
            <span>OCEAN RESEARCHERS ({stats.researchers})</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 bg-white border-b border-[#D1DCE5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, vessel reg, service ID, home port, phone..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded text-xs font-sans text-slate-900 focus:outline-none focus:border-[#0D5C7A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">STATUS:</span>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2.5 py-1 text-xs font-mono text-slate-800 focus:outline-none"
            >
              <option value="all">All Records ({filteredUsers.length})</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Validation</option>
            </select>
          </div>
        </div>

        {/* 4. STRUCTURED ROLE-WISE PERSONNEL TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-[#071A2B] text-white border-b border-[#0B2942] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Personnel / Officer</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Vessel / Station / Agency</th>
                <th className="py-2.5 px-3">Registration / Service ID</th>
                <th className="py-2.5 px-3">Home Port / Location</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1DCE5] text-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No registered maritime personnel match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F4F7F8] transition-colors">
                    {/* Personnel */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#0B2942] text-cyan-300 font-mono text-[10px] flex items-center justify-center font-bold">
                          {user.avatarInitials || 'IN'}
                        </span>
                        <div>
                          <div className="truncate max-w-[180px]">{user.fullName}</div>
                          <div className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Vessel / Station / Agency */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900 truncate max-w-[200px]">
                        {user.vesselName || user.organization || user.portAuthority || user.institution || 'HQ Authority'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">
                        {user.designation || (user.crewCount ? `Crew: ${user.crewCount} personnel` : 'Officer in Command')}
                      </div>
                    </td>

                    {/* Registration / Service ID */}
                    <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {user.realCraftReg || user.serviceId || user.scientistId || user.pilotageLicense || 'GOI-NMSA-ADMIN'}
                      </div>
                      {user.navicTransponderId && (
                        <div className="text-[10px] text-cyan-700">
                          NavIC: {user.navicTransponderId}
                        </div>
                      )}
                    </td>

                    {/* Home Port */}
                    <td className="py-2.5 px-3 text-[11px] truncate max-w-[180px]">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3 h-3 text-[#0D5C7A] shrink-0" />
                        <span className="truncate">{user.homePort || 'Indian Coastal EEZ'}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Active: {user.lastLogin || 'Recent'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" /> PENDING
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUserDossier(user)}
                          className="p-1.5 rounded bg-[#F4F7F8] hover:bg-[#EAF0F3] text-slate-700 border border-[#D1DCE5] transition-colors"
                          title="View Full Government Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => verifyUser(user.id, !user.isVerified)}
                            className={`p-1.5 rounded border transition-colors ${
                              user.isVerified
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                            }`}
                            title={user.isVerified ? "Revoke Verification" : "Verify RealCraft Credential"}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete maritime personnel record for ${user.fullName}?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition-colors"
                            title="Remove Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. USER DOSSIER MODAL */}
      {selectedUserDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-none border border-[#0B2942] shadow-2xl overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="bg-[#071A2B] text-white p-4 flex items-center justify-between border-b border-[#0B2942]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-cyan-300" />
                <h3 className="font-mono font-bold text-sm uppercase tracking-wide">
                  OFFICIAL MARITIME DOSSIER: {selectedUserDossier.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDossier(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Card Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D1DCE5]">
                <div>
                  <div className="text-base font-bold text-slate-900">{selectedUserDossier.fullName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">System ID: {selectedUserDossier.id}</div>
                </div>
                <div>{getRoleBadge(selectedUserDossier.role)}</div>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">PRIMARY REGISTRATION</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {selectedUserDossier.realCraftReg || selectedUserDossier.serviceId || selectedUserDossier.scientistId || 'OFFICIAL DIRECT ACCESS'}
                  </span>
                </div>

                <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">CONTACT PHONE</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {selectedUserDossier.phone || 'VHF Maritime Channel 16'}
                  </span>
                </div>

                <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">HOME PORT / HARBOR</span>
                  <span className="font-medium text-slate-900 text-xs">
                    {selectedUserDossier.homePort || 'Indian EEZ Waters'}
                  </span>
                </div>

                <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">VERIFICATION AGENCY</span>
                  <span className="font-medium text-slate-900 text-xs">
                    {selectedUserDossier.verificationAgency || 'RealCraft National Marine Registry'}
                  </span>
                </div>

                {selectedUserDossier.vesselName && (
                  <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">VESSEL NAME & HULL</span>
                    <span className="font-medium text-slate-900 text-xs">
                      {selectedUserDossier.vesselName} ({selectedUserDossier.hullType || 'Motorized Craft'})
                    </span>
                  </div>
                )}

                {selectedUserDossier.navicTransponderId && (
                  <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">NAVIC TRANSPONDER ID</span>
                    <span className="font-mono font-bold text-cyan-800 text-xs">
                      {selectedUserDossier.navicTransponderId} (S-Band Direct)
                    </span>
                  </div>
                )}

                {selectedUserDossier.mmsi && (
                  <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">MMSI NUMBER</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {selectedUserDossier.mmsi}
                    </span>
                  </div>
                )}

                {selectedUserDossier.crewCount && (
                  <div className="p-2.5 bg-[#F4F7F8] border border-[#D1DCE5] rounded">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">SAFETY COMPLIANCE</span>
                    <span className="font-medium text-slate-900 text-xs">
                      Crew: {selectedUserDossier.crewCount} personnel • Life Jackets: {selectedUserDossier.lifeJacketCount || selectedUserDossier.crewCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Banner */}
              <div className={`p-3 rounded border text-xs flex items-center justify-between ${
                selectedUserDossier.isVerified
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">
                    {selectedUserDossier.isVerified ? 'CREDENTIAL STATUS: GOVT VERIFIED & ACTIVE' : 'CREDENTIAL STATUS: PENDING REALCRAFT INSPECTION'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">Validity: {selectedUserDossier.validTill || 'Permanent'}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#F4F7F8] border-t border-[#D1DCE5] flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-[#D1DCE5] text-xs font-mono font-bold text-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT OFFICIAL PASS</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUserDossier(null)}
                className="px-4 py-1.5 bg-[#071A2B] hover:bg-[#0B2942] text-white text-xs font-mono font-bold rounded"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
