import React, { useState, useEffect } from 'react';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Volume2, 
  FileText, 
  RefreshCw, 
  Wind, 
  Waves, 
  Compass, 
  Printer, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Anchor, 
  Clock, 
  Send, 
  Navigation, 
  Check,
  Calendar,
  Zap,
  Skull,
  Activity,
  Layers
} from 'lucide-react';
import { fetchLiveImdData, getCachedImdData } from '../services/imdWeatherService';
import { getActiveAlerts } from '../services/apiClient';

export function AlertsPage({ 
  onNavigateToMap = null, 
  onAskOrca = null, 
  onOpenBulletin = null,
  initialRegionFilter = 'ALL'
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'bulletin'
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL', 'RED_ALERTS', 'CAUTION', 'ADVISORY'
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL', 'OCEAN_WEATHER', 'SEISMIC', 'NAVIGATIONAL', 'SECURITY', 'LIGHTNING', 'ECOLOGICAL', 'PORT_CLOSURE'
  const [regionFilter, setRegionFilter] = useState(initialRegionFilter || 'ALL');
  const [imdData, setImdData] = useState(getCachedImdData);
  const [refreshing, setRefreshing] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [departureSuspended, setDepartureSuspended] = useState(false);
  const [alertsList, setAlertsList] = useState(MOCK_ALERTS);

  // Dynamic system clock in IST
  const now = new Date();
  const currentDateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTimeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' IST';

  useEffect(() => {
    let isMounted = true;
    async function loadLiveAlerts() {
      try {
        const live = await getActiveAlerts();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          const liveMapped = live.map(a => ({
            id: a.id,
            title: a.title,
            category: a.category,
            dangerType: a.category,
            severity: a.severity === 'CRITICAL' ? 'HIGH' : a.severity,
            date: a.issue_time?.split('•')[0]?.trim() || currentDateFormatted,
            time: a.issue_time?.split('•')[1]?.trim() || currentTimeFormatted,
            dateTime: a.issue_time || `${currentDateFormatted} • ${currentTimeFormatted}`,
            validUntil: a.valid_until || `Tomorrow • 18:00 IST`,
            issuedBy: a.issuing_authority,
            affectedRegions: [a.affected_region],
            coordinates: [18.50, 84.80],
            radiusKm: 180,
            windSpeedMax: '65 km/h',
            waveHeightMax: '3.8m',
            summary: a.description,
            actionRequired: a.action_directive,
            status: a.status,
            isRedAlert: a.severity === 'CRITICAL' || a.severity === 'HIGH'
          }));

          setAlertsList(prev => {
            const map = new Map();
            liveMapped.forEach(item => map.set(item.id, item));
            prev.forEach(item => { if (!map.has(item.id)) map.set(item.id, item); });
            return Array.from(map.values());
          });
        }
      } catch (err) {
        // Fallback gracefully to dynamic local alerts
      }
    }

    loadLiveAlerts();
    const pollTimer = setInterval(loadLiveAlerts, 20000); // Live background refresh
    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [currentDateFormatted, currentTimeFormatted]);

  useEffect(() => {
    if (initialRegionFilter) {
      setRegionFilter(initialRegionFilter);
    }
  }, [initialRegionFilter]);

  const handleRefreshImd = async () => {
    setRefreshing(true);
    try {
      const fresh = await fetchLiveImdData();
      setImdData(fresh);
    } catch (e) {
      console.warn('Failed refreshing IMD data:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefreshImd();
  }, []);

  // Filter alerts by severity, category, and region
  const filteredAlerts = alertsList.filter(alt => {
    // Severity Filter
    if (severityFilter === 'RED_ALERTS' && alt.severity !== 'HIGH') return false;
    if (severityFilter === 'SEVERE' && alt.severity !== 'HIGH') return false;
    if (severityFilter === 'CAUTION' && alt.severity !== 'MEDIUM') return false;
    if (severityFilter === 'ADVISORY' && alt.severity !== 'LOW') return false;

    // Category / Danger Type Filter
    if (categoryFilter !== 'ALL') {
      if (categoryFilter === 'OCEAN_WEATHER' && alt.dangerType !== 'OCEAN_WEATHER') return false;
      if (categoryFilter === 'SEISMIC' && alt.dangerType !== 'SEISMIC') return false;
      if (categoryFilter === 'NAVIGATIONAL' && alt.dangerType !== 'NAVIGATIONAL') return false;
      if (categoryFilter === 'SECURITY' && alt.dangerType !== 'SECURITY') return false;
      if (categoryFilter === 'LIGHTNING' && alt.dangerType !== 'LIGHTNING') return false;
      if (categoryFilter === 'ECOLOGICAL' && alt.dangerType !== 'ECOLOGICAL') return false;
      if (categoryFilter === 'PORT_CLOSURE' && alt.dangerType !== 'PORT_CLOSURE') return false;
    }

    // Region Filter
    if (regionFilter !== 'ALL') {
      const regionsStr = (alt.affectedRegions || []).join(' ').toLowerCase();
      const titleStr = (alt.title || '').toLowerCase();
      const combined = `${regionsStr} ${titleStr}`;
      if (!combined.includes(regionFilter.toLowerCase())) return false;
    }

    return true;
  });

  const redAlertCount = MOCK_ALERTS.filter(a => a.severity === 'HIGH').length;
  const cautionCount = MOCK_ALERTS.filter(a => a.severity === 'MEDIUM').length;
  const advisoryCount = MOCK_ALERTS.filter(a => a.severity === 'LOW').length;

  const outlook = imdData.tropicalWeatherOutlook;
  const bob = imdData.bayOfBengal;
  const as = imdData.arabianSea;

  return (
    <div className="space-y-3 font-sans max-w-7xl mx-auto pb-8">
      {/* 1. TOP EMERGENCY BANNER WITH DATE & LIVE TRACKING */}
      <div className="bg-[#071A2B] border-l-4 border-l-[#C93C4B] border-y border-r border-[#0B2942] rounded-lg px-4 py-3 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C93C4B]/20 border border-[#C93C4B]/50 flex items-center justify-center text-[#C93C4B] animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-sm text-white tracking-wide">
                SEVERE WEATHER BULLETIN
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C93C4B] text-white">
                🔴 RED ALERT ACTIVE
              </span>
              <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>DATE: {currentDateFormatted} • {currentTimeFormatted}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Active Storm Track: <strong>Cyclone ASNA</strong> (988 hPa, 85 km/h winds, 4.8m waves) &amp; <strong>Bay of Bengal BOB-05</strong>. Complete fishing suspension in Arabian Sea &amp; North Bay.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {onNavigateToMap && (
            <button
              type="button"
              onClick={() => onNavigateToMap([9.15, 75.80], 'Cyclone ASNA Hazard Zone')}
              className="px-3 py-1.5 rounded bg-[#0B2942] hover:bg-[#0D5C7A] text-white text-xs border border-[#0D5C7A] transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-300" />
              <span>VIEW ON MAP</span>
            </button>
          )}

          {onAskOrca && (
            <button
              type="button"
              onClick={() => onAskOrca('Evaluate active Cyclone ASNA, Kallakkadal swell surge, and port closure status')}
              className="px-3 py-1.5 rounded bg-[#0F8B8D] hover:bg-[#0D5C7A] text-white text-xs font-bold border border-[#2EAFD0] transition-colors"
            >
              ASK ORCA
            </button>
          )}

          {onOpenBulletin && (
            <button
              type="button"
              onClick={() => onOpenBulletin('Kochi Fishing Harbor')}
              className="px-3 py-1.5 rounded bg-[#071A2B] hover:bg-[#0B2942] text-slate-200 text-xs border border-slate-600 transition-colors"
            >
              OPEN BULLETIN
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP METRIC STATS TILES (TOTAL RED ALERTS & EMERGENCY OVERVIEW) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
        {/* Red Alerts Count */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('alerts');
            setSeverityFilter('RED_ALERTS');
          }}
          className={`p-3 rounded-lg border text-left transition-all ${
            severityFilter === 'RED_ALERTS'
              ? 'bg-[#C93C4B] text-white border-[#C93C4B] ring-2 ring-red-400'
              : 'bg-white hover:bg-red-50/50 border-[#D1DCE5] text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${severityFilter === 'RED_ALERTS' ? 'text-white/80' : 'text-[#C93C4B]'}`}>
              CRITICAL RED ALERTS
            </span>
            <AlertOctagon className={`w-4 h-4 ${severityFilter === 'RED_ALERTS' ? 'text-white' : 'text-[#C93C4B]'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{redAlertCount} ACTIVE</div>
          <span className={`text-[10px] mt-0.5 block ${severityFilter === 'RED_ALERTS' ? 'text-white/90' : 'text-slate-500'}`}>
            Cyclones, Kallakkadal, Shoals, Tsunami
          </span>
        </button>

        {/* Caution Count */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('alerts');
            setSeverityFilter('CAUTION');
          }}
          className={`p-3 rounded-lg border text-left transition-all ${
            severityFilter === 'CAUTION'
              ? 'bg-[#D89B24] text-slate-950 border-[#D89B24] ring-2 ring-amber-300'
              : 'bg-white hover:bg-amber-50/50 border-[#D1DCE5] text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${severityFilter === 'CAUTION' ? 'text-slate-900 font-bold' : 'text-amber-600'}`}>
              CAUTION &amp; WARNINGS
            </span>
            <AlertTriangle className={`w-4 h-4 ${severityFilter === 'CAUTION' ? 'text-slate-950' : 'text-amber-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{cautionCount} NOTICES</div>
          <span className={`text-[10px] mt-0.5 block ${severityFilter === 'CAUTION' ? 'text-slate-900' : 'text-slate-500'}`}>
            Lightning, Rip Current, IMBL, Debris
          </span>
        </button>

        {/* Advisories Count */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('alerts');
            setSeverityFilter('ADVISORY');
          }}
          className={`p-3 rounded-lg border text-left transition-all ${
            severityFilter === 'ADVISORY'
              ? 'bg-[#1F9D72] text-white border-[#1F9D72] ring-2 ring-emerald-300'
              : 'bg-white hover:bg-emerald-50/50 border-[#D1DCE5] text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${severityFilter === 'ADVISORY' ? 'text-white/80' : 'text-[#1F9D72]'}`}>
              SAFE ADVISORIES
            </span>
            <CheckCircle2 className={`w-4 h-4 ${severityFilter === 'ADVISORY' ? 'text-white' : 'text-[#1F9D72]'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{advisoryCount} ADVISORIES</div>
          <span className={`text-[10px] mt-0.5 block ${severityFilter === 'ADVISORY' ? 'text-white/90' : 'text-slate-500'}`}>
            PFZ Hotspots &amp; Safe Corridors
          </span>
        </button>

        {/* Current Broadcast Date */}
        <div className="p-3 rounded-lg border border-[#0B2942] bg-[#071A2B] text-white text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
              TELEMETRY DATE
            </span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold mt-1 text-white">{currentDateFormatted.toUpperCase()}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentTimeFormatted} INCOIS/IMD Cycle</span>
          </span>
        </div>
      </div>

      {/* 3. TABS & MULTI-CATEGORY FILTER BAR */}
      <div className="bg-white border border-[#D1DCE5] rounded-lg p-3 space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`px-3.5 py-1.5 rounded font-mono text-xs font-bold transition-colors ${
                activeTab === 'alerts'
                  ? 'bg-[#071A2B] text-white shadow-xs'
                  : 'bg-[#F4F7F8] text-slate-700 hover:bg-[#EAF0F3] border border-[#D1DCE5]'
              }`}
            >
              ALL ACTIVE HAZARDS ({filteredAlerts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bulletin')}
              className={`px-3.5 py-1.5 rounded font-mono text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'bulletin'
                  ? 'bg-[#071A2B] text-white shadow-xs'
                  : 'bg-[#F4F7F8] text-slate-700 hover:bg-[#EAF0F3] border border-[#D1DCE5]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#0D5C7A]" />
              <span>OFFICIAL MARINE BULLETIN</span>
            </button>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleRefreshImd}
            disabled={refreshing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded bg-[#F4F7F8] hover:bg-[#EAF0F3] text-slate-700 border border-[#D1DCE5] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0D5C7A]' : ''}`} />
            <span>{refreshing ? 'SYNCING...' : 'SYNC IMD/INCOIS FEEDS'}</span>
          </button>
        </div>

        {/* Severity Quick Filters */}
        {activeTab === 'alerts' && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-bold uppercase text-[10px] mr-1">SEVERITY:</span>
              
              <button
                type="button"
                onClick={() => setSeverityFilter('RED_ALERTS')}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                  severityFilter === 'RED_ALERTS'
                    ? 'bg-[#C93C4B] text-white shadow-sm ring-1 ring-red-400'
                    : 'bg-red-50 text-[#C93C4B] hover:bg-red-100 border border-red-200'
                }`}
              >
                <AlertOctagon className="w-3 h-3" />
                <span>RED ALERTS ONLY ({redAlertCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setSeverityFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  severityFilter === 'ALL'
                    ? 'bg-[#0B2942] text-white'
                    : 'bg-[#F4F7F8] text-slate-700 hover:bg-[#EAF0F3] border border-[#D1DCE5]'
                }`}
              >
                ALL HAZARDS ({MOCK_ALERTS.length})
              </button>

              <button
                type="button"
                onClick={() => setSeverityFilter('CAUTION')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  severityFilter === 'CAUTION'
                    ? 'bg-[#D89B24] text-slate-950 font-bold'
                    : 'bg-[#F4F7F8] text-slate-700 hover:bg-[#EAF0F3] border border-[#D1DCE5]'
                }`}
              >
                CAUTION ({cautionCount})
              </button>

              <button
                type="button"
                onClick={() => setSeverityFilter('ADVISORY')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  severityFilter === 'ADVISORY'
                    ? 'bg-[#1F9D72] text-white'
                    : 'bg-[#F4F7F8] text-slate-700 hover:bg-[#EAF0F3] border border-[#D1DCE5]'
                }`}
              >
                ADVISORIES ({advisoryCount})
              </button>
            </div>

            {/* Region Filter Selector */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 font-bold text-[10px] uppercase">SECTOR:</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-[#F4F7F8] border border-[#D1DCE5] rounded px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Coastal Sectors (Pan-India)</option>
                <option value="kerala">Kerala &amp; Lakshadweep</option>
                <option value="odisha">Odisha &amp; Bay of Bengal</option>
                <option value="andhra">Andhra Pradesh</option>
                <option value="tamilnadu">Tamil Nadu &amp; Palk Bay</option>
                <option value="karnataka">Karnataka &amp; Goa</option>
                <option value="maharashtra">Maharashtra &amp; Mumbai</option>
                <option value="andaman">Andaman &amp; Nicobar</option>
              </select>
            </div>
          </div>
        )}

        {/* Hazard Category Filter Pills */}
        {activeTab === 'alerts' && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="text-slate-500 font-bold uppercase text-[10px] mr-1">DANGER TYPE:</span>
            {[
              { id: 'ALL', label: 'All Types' },
              { id: 'OCEAN_WEATHER', label: '🌊 Ocean Weather & Swell' },
              { id: 'LIGHTNING', label: '⚡ Lightning & Squalls' },
              { id: 'NAVIGATIONAL', label: '🪨 Shoals & Nav Hazards' },
              { id: 'SECURITY', label: '🛡️ IMBL Security & Geofence' },
              { id: 'SEISMIC', label: '🌊 Seismic & Tsunami' },
              { id: 'PORT_CLOSURE', label: '🚩 Port Signal 10 / Closure' },
              { id: 'ECOLOGICAL', label: '🧪 Red Tide & Algal Hypoxia' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-[#0D5C7A] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. MAIN WORKSPACE: ACTIVE HAZARDS (Vertical Alert Feed + Emergency Operations Panel) */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[500px]">
          {/* LEFT 8 COLS: Vertical Alert Cards */}
          <div className="lg:col-span-8 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="bg-white border border-[#D1DCE5] rounded-lg p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1F9D72] mx-auto" />
                <h3 className="font-mono font-bold text-sm text-slate-900 uppercase">NO ACTIVE HAZARDS IN THIS FILTER</h3>
                <p className="text-xs text-slate-500">No matching meteorological or oceanographic warnings for the selected criteria.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isHigh = alert.severity === 'HIGH' || alert.isRedAlert;
                const isMed = alert.severity === 'MEDIUM';

                return (
                  <div
                    key={alert.id}
                    className={`bg-white border rounded-lg overflow-hidden shadow-xs space-y-0 transition-all ${
                      isHigh
                        ? 'border-[#C93C4B] ring-1 ring-red-400/40'
                        : isMed
                        ? 'border-[#D89B24]'
                        : 'border-[#1F9D72]'
                    }`}
                  >
                    {/* TOP STRIP: SEVERITY BADGE, CATEGORY & PROMINENT DATE/TIME */}
                    <div className="bg-[#071A2B] text-white px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#0B2942]">
                      <div className="flex items-center gap-2">
                        {isHigh ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#C93C4B] text-white font-mono font-bold text-[11px] tracking-wide animate-pulse">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>CRITICAL RED ALERT</span>
                          </span>
                        ) : isMed ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#D89B24] text-slate-950 font-mono font-bold text-[11px] tracking-wide">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>CAUTION ALERT</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1F9D72] text-white font-mono font-bold text-[11px] tracking-wide">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ADVISORY</span>
                          </span>
                        )}
                        <span className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-tight">
                          [{alert.category}]
                        </span>
                      </div>

                      {/* Prominent Broadcast Date & Time */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <div className="flex items-center gap-1.5 bg-[#0B2942] border border-[#0D5C7A] px-2.5 py-0.5 rounded text-white font-bold">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>DATE: {alert.dateTime || alert.date}</span>
                        </div>
                        <span className="text-slate-400 hidden sm:inline text-[11px]">
                          EXPIRY: <strong className="text-amber-300">{alert.validUntil}</strong>
                        </span>
                      </div>
                    </div>

                    {/* CARD BODY */}
                    <div className="p-4 space-y-3">
                      {/* Authority & ID */}
                      <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                        <span className="font-mono font-bold text-slate-700 uppercase text-[11px]">
                          {alert.issuedBy}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          ID: {alert.id}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold text-sm leading-snug ${isHigh ? 'text-slate-900 font-mono' : 'text-slate-900'}`}>
                        {alert.title}
                      </h3>

                      {/* Affected Regions */}
                      <div className="text-[11px] font-mono text-[#0D5C7A] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C93C4B]" />
                        <span>AFFECTED SECTORS: <strong>{alert.affectedRegions.join(' • ')}</strong></span>
                      </div>

                      {/* Warning Summary Narrative */}
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {alert.summary}
                      </p>

                      {/* Telemetry Chips (Wave, Wind, Danger Metrics) */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                        {alert.waveHeightMax && (
                          <div className={`px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                            isHigh ? 'bg-red-50 border-red-200 text-[#C93C4B]' : 'bg-[#F4F7F8] border-[#D1DCE5] text-slate-800'
                          }`}>
                            <Waves className="w-3.5 h-3.5" />
                            <span>WAVE: <strong>{alert.waveHeightMax}</strong></span>
                          </div>
                        )}

                        {alert.windSpeedMax && (
                          <div className="px-2.5 py-1 rounded bg-[#F4F7F8] border border-[#D1DCE5] text-slate-800 flex items-center gap-1.5">
                            <Wind className="w-3.5 h-3.5 text-[#0D5C7A]" />
                            <span>WIND: <strong>{alert.windSpeedMax}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Mandatory Directive Callout Box */}
                      <div className={`p-2.5 rounded text-xs font-mono leading-relaxed border ${
                        isHigh
                          ? 'bg-[#C93C4B]/10 border-[#C93C4B]/40 text-[#C93C4B] font-bold'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}>
                        <div className="flex items-start gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="uppercase tracking-wider">ACTION DIRECTIVE: </span>
                            <span>{alert.actionRequired}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
                        {onAskOrca && (
                          <button
                            type="button"
                            onClick={() => onAskOrca({ zoneName: alert.affectedRegions[0], name: alert.title })}
                            className="px-3 py-1.5 rounded bg-[#F4F7F8] hover:bg-[#EAF0F3] text-slate-800 font-bold border border-[#D1DCE5] transition-colors"
                          >
                            CONSULT ORCA AI
                          </button>
                        )}

                        {onNavigateToMap && alert.coordinates && (
                          <button
                            type="button"
                            onClick={() => onNavigateToMap(alert.coordinates, alert.title)}
                            className="px-3.5 py-1.5 rounded bg-[#071A2B] hover:bg-[#0B2942] text-white font-bold border border-[#0D5C7A] transition-colors flex items-center gap-1.5"
                          >
                            <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                            <span>VIEW ON MAP</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT 4 COLS: Emergency Operations Center (EOC) Command Panel */}
          <div className="lg:col-span-4 space-y-3">
            {/* Operational Actions Box */}
            <div className="bg-white border border-[#D1DCE5] rounded-lg p-3.5 space-y-3 shadow-xs">
              <div className="pb-2 border-b border-[#D1DCE5] flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-900 uppercase tracking-wide">
                  EMERGENCY OPERATIONS (EOC)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#C93C4B] animate-pulse" />
              </div>

              <div className="space-y-2 font-mono text-xs">
                {/* 1. Suspend Departure */}
                <button
                  type="button"
                  onClick={() => setDepartureSuspended(!departureSuspended)}
                  className={`w-full p-2.5 rounded-lg text-left transition-colors flex items-center justify-between border ${
                    departureSuspended
                      ? 'bg-[#C93C4B] text-white border-[#C93C4B]'
                      : 'bg-[#F4F7F8] hover:bg-[#EAF0F3] text-slate-800 border-[#D1DCE5]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">SUSPEND DEPARTURE</div>
                    <div className={`text-[10px] ${departureSuspended ? 'text-white/80' : 'text-slate-500'}`}>
                      {departureSuspended ? 'HARBOR GATE CLOSED' : 'Harbor Master Flag Signal 10'}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    departureSuspended ? 'bg-white text-[#C93C4B]' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {departureSuspended ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </button>

                {/* 2. Notify Vessels */}
                <button
                  type="button"
                  onClick={() => {
                    setBroadcastSent(true);
                    setTimeout(() => setBroadcastSent(false), 3000);
                  }}
                  className="w-full p-2.5 rounded-lg text-left bg-[#F4F7F8] hover:bg-[#EAF0F3] text-slate-800 border border-[#D1DCE5] transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs">BROADCAST TO FLEET</div>
                    <div className="text-[10px] text-slate-500">
                      {broadcastSent ? 'NAVIC S-BAND DISPATCH TRANSMITTED' : 'VHF Ch 16 / NavIC Broadcast'}
                    </div>
                  </div>
                  {broadcastSent ? (
                    <Check className="w-4 h-4 text-[#1F9D72]" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-[#0D5C7A]" />
                  )}
                </button>

                {/* 3. Open Harbor Shelter */}
                <div className="p-2.5 rounded-lg bg-[#F4F7F8] border border-[#D1DCE5] space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>HARBOR STORM BERTHS</span>
                    <span className="text-[10px] text-[#1F9D72] font-bold">READY</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans leading-snug">
                    Inner Basin Kochi, Paradip, &amp; Mangalore wharfs cleared for craft berthing. Free storm mooring permitted.
                  </p>
                </div>

                {/* 4. View Safe Routes */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = 'routes';
                  }}
                  className="w-full p-2.5 rounded-lg bg-[#071A2B] hover:bg-[#0B2942] text-white border border-[#0D5C7A] transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs">VIEW SAFE DETOUR ROUTES</div>
                    <div className="text-[10px] text-slate-400">Hydrodynamic avoidance corridors</div>
                  </div>
                  <Navigation className="w-3.5 h-3.5 text-cyan-300" />
                </button>
              </div>
            </div>

            {/* Watch Stand Live Console */}
            <div className="bg-[#071A2B] border border-[#0B2942] rounded-lg p-3 text-white font-mono text-xs space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide border-b border-[#0B2942] pb-1.5 flex items-center justify-between">
                <span>EOC WATCH STAND</span>
                <span className="text-[#1F9D72] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE MONITORING</span>
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">COMMAND DUTY:</span>
                  <span className="font-bold text-slate-200">INCOIS-CG-S04</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">VHF DISTRESS:</span>
                  <span className="font-bold text-cyan-300">156.800 MHz (CH 16)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">NAVIC S-BAND:</span>
                  <span className="font-bold text-[#1F9D72]">100% OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DATE LOCK:</span>
                  <span className="font-bold text-amber-300">{currentDateFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OFFICIAL MARINE BULLETIN TAB */}
      {activeTab === 'bulletin' && (
        <div className="space-y-3 font-sans">
          <div className="bg-white border border-[#D1DCE5] rounded-lg p-4 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#D1DCE5]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-slate-900 uppercase">
                  RSMC NEW DELHI • NORTH INDIAN OCEAN TROPICAL WEATHER OUTLOOK
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C93C4B]/10 text-[#C93C4B] border border-[#C93C4B]/30 font-bold">
                  {outlook.cycloneStatus}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                DATE: {currentDateFormatted} • VALID: {outlook.validPeriod}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-3 rounded border border-slate-200 whitespace-pre-line">
              {outlook.cycloneNarrative}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-slate-200 bg-[#F8FAFC]">
                <h4 className="font-mono font-bold text-xs text-[#0D5C7A] mb-1">BAY OF BENGAL OUTLOOK</h4>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">{bob.cycloneStatus}: {bob.advisory}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">WIND: {bob.wind} • WAVES: {bob.waves}</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-[#F8FAFC]">
                <h4 className="font-mono font-bold text-xs text-[#0D5C7A] mb-1">ARABIAN SEA OUTLOOK</h4>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">{as.cycloneStatus}: {as.advisory}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">WIND: {as.wind} • WAVES: {as.waves}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
