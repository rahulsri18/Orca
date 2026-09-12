import React, { useState, useEffect } from 'react';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldAlert, 
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
  Anchor
} from 'lucide-react';
import { fetchLiveImdData, getCachedImdData, REGIONAL_SECTORS } from '../services/imdWeatherService';

export function AlertsPage({ 
  onNavigateToMap = null, 
  onAskOrca = null, 
  onOpenBulletin = null,
  initialRegionFilter = 'ALL'
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('bulletin'); // 'bulletin' or 'alerts'
  const [regionFilter, setRegionFilter] = useState(initialRegionFilter || 'ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [imdData, setImdData] = useState(getCachedImdData);
  const [refreshing, setRefreshing] = useState(false);

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

  // Filter alerts by severity and region
  const filteredAlerts = MOCK_ALERTS.filter(alt => {
    // Severity filter
    if (severityFilter !== 'ALL' && alt.severity !== severityFilter) {
      return false;
    }

    // Region filter
    if (regionFilter === 'ALL') return true;

    const regionsStr = (alt.affectedRegions || []).join(' ').toLowerCase();
    const titleStr = (alt.title || '').toLowerCase();
    const summaryStr = (alt.summary || '').toLowerCase();
    const combined = `${regionsStr} ${titleStr} ${summaryStr}`;

    if (regionFilter === 'odisha') return combined.includes('odisha') || combined.includes('paradip') || combined.includes('gopalpur');
    if (regionFilter === 'andhra') return combined.includes('andhra') || combined.includes('visakhapatnam') || combined.includes('vizag') || combined.includes('kakinada');
    if (regionFilter === 'kerala') return combined.includes('kerala') || combined.includes('kochi') || combined.includes('kollam') || combined.includes('thiruvananthapuram');
    if (regionFilter === 'lakshadweep') return combined.includes('lakshadweep') || combined.includes('kavaratti');
    if (regionFilter === 'palkbay') return combined.includes('palk bay') || combined.includes('mannar') || combined.includes('rameswaram') || combined.includes('imbl');
    if (regionFilter === 'tamilnadu') return combined.includes('tamil') || combined.includes('chennai') || combined.includes('kanyakumari');
    if (regionFilter === 'maharashtra') return combined.includes('maharashtra') || combined.includes('mumbai') || combined.includes('konkan');
    if (regionFilter === 'gujarat') return combined.includes('gujarat') || combined.includes('veraval') || combined.includes('okha');
    if (regionFilter === 'goa') return combined.includes('goa') || combined.includes('karwar');
    if (regionFilter === 'karnataka') return combined.includes('karnataka') || combined.includes('mangalore') || combined.includes('karwar');
    if (regionFilter === 'bengal') return combined.includes('bengal') || combined.includes('digha') || combined.includes('sundarbans');
    if (regionFilter === 'andaman') return combined.includes('andaman') || combined.includes('nicobar');

    return true;
  });

  const outlook = imdData.tropicalWeatherOutlook;
  const bob = imdData.bayOfBengal;
  const as = imdData.arabianSea;
  const telemetry = imdData.liveMarineTelemetry;

  // Selected region details
  const selectedRegionObj = REGIONAL_SECTORS.find(r => r.id === regionFilter);
  const selectedRegionLive = (imdData.regionalData || []).find(r => r.id === regionFilter) || selectedRegionObj;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-ocean-deep text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold">{t('alertsPageTitle', 'Marine Hazard & Safety Broadcast Center')}</h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/30 animate-pulse">
                  {t('activeCoastalAlert', 'Active Coastal Alert')}
                </span>
              </div>
              <p className="text-xs md:text-sm text-rose-100/80 mt-1">
                {t('alertsPageSub', 'Multi-agency early warning feeds from IMD Cyclone Warning Centre, INCOIS Tsunami/Surge, and Coast Guard NavIC.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenBulletin && (
              <button
                type="button"
                onClick={() => onOpenBulletin(selectedRegionObj ? `${selectedRegionObj.harbors[0]} Harbor` : 'Kochi Fishing Harbor')}
                className="flex items-center gap-2 bg-white text-rose-950 hover:bg-rose-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-rose-700" />
                <span>Print PDF {selectedRegionObj ? `(${selectedRegionObj.name.split(' ')[0]})` : 'Bulletin'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                alert(t('audioSirenBtn', 'Audio siren & NavIC coastal distress broadcast triggered for coastal stations!'));
              }}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-rose-200" />
              <span>{t('testAudioBroadcast', 'Test Siren Horn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Section Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('bulletin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bulletin'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>IMD Official Daily Marine Bulletin (24h Outlook)</span>
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-ocean-deep text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Active Coastal Hazard Notices ({filteredAlerts.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRefreshImd}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-ocean-teal' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Refresh Real IMD Feeds'}</span>
        </button>
      </div>

      {/* REGION-WISE FILTER BAR (Applies across both Safety Alerts & Daily Bulletin) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-ocean-teal" />
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Filter by Coastal Region / Maritime Sector:
            </span>
          </div>
          {regionFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setRegionFilter('ALL')}
              className="text-xs text-ocean-teal hover:underline font-bold"
            >
              Reset to All India (12)
            </button>
          )}
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setRegionFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              regionFilter === 'ALL'
                ? 'bg-ocean-deep text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇮🇳 All India (12 Sectors)
          </button>

          {REGIONAL_SECTORS.map(sec => {
            const liveMatch = (imdData.regionalData || []).find(r => r.id === sec.id);
            const isHigh = liveMatch?.riskLevel === 'HIGH' || sec.id === 'odisha' || sec.id === 'andhra' || sec.id === 'kerala';
            const isSelected = regionFilter === sec.id;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setRegionFilter(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? isHigh ? 'bg-rose-700 text-white shadow-sm font-bold' : 'bg-ocean-deep text-white shadow-sm font-bold'
                    : isHigh
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{sec.state}</span>
                {isHigh && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'} animate-pulse`} />
                )}
                {liveMatch?.liveWaveHeight && (
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {liveMatch.liveWaveHeight}m
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: IMD OFFICIAL DAILY MARINE BULLETIN */}
      {activeTab === 'bulletin' && (
        <div className="space-y-5">
          {/* If a specific region is filtered, show the Focused Regional Daily Bulletin */}
          {regionFilter !== 'ALL' && selectedRegionObj && (
            <div className="bg-white rounded-2xl border-2 border-ocean-teal/70 p-5 md:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-ocean-deep flex items-center justify-center text-2xl font-bold">
                    ⚓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-ocean-light text-ocean-deep font-mono">
                        {selectedRegionObj.basin} Basin
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        OFFICIAL REGIONAL SAFETY BULLETIN
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-black text-slate-900 mt-0.5">
                      {selectedRegionObj.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge level={selectedRegionLive?.riskLevel || 'MEDIUM'} score={selectedRegionLive?.riskScore || 50} size="lg" />
                </div>
              </div>

              {/* Real-time ocean telemetry strip for this specific region */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Waves className="w-3.5 h-3.5 text-sky-600" />
                    <span>Live Wave Height</span>
                  </span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    {selectedRegionLive?.liveWaveHeight ? `${selectedRegionLive.liveWaveHeight} meters` : '1.4 meters'}
                  </div>
                  <div className="text-[10px] text-slate-500">Real-time Open-Meteo Buoy</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Swell & Wave Period</span>
                  </span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    {selectedRegionLive?.liveSwellHeight ? `${selectedRegionLive.liveSwellHeight}m Swell` : '0.9m Swell'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Period: {selectedRegionLive?.livePeriodSec ? `${selectedRegionLive.livePeriodSec}s` : '8.2s'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sustained Wind</span>
                  </span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    {selectedRegionObj.id === 'odisha' || selectedRegionObj.id === 'andhra' ? '45-55 km/h squall' : '15-20 knots'}
                  </div>
                  <div className="text-[10px] text-slate-500">IMD Synoptic Dispatch</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5 text-amber-600" />
                    <span>Monitored Ports</span>
                  </span>
                  <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {selectedRegionObj.harbors.join(', ')}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">VTS Radar Active</div>
                </div>
              </div>

              {/* Status Notice & Directives for this sector */}
              <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                selectedRegionLive?.riskLevel === 'HIGH'
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Sector Status: {selectedRegionLive?.statusNotice || 'Normal Maritime State'}</span>
                </div>
                <p className="leading-relaxed">
                  {selectedRegionObj.id === 'odisha' || selectedRegionObj.id === 'andhra'
                    ? 'Total suspension of all fishing and recreational coastal voyages under active IMD Low Pressure Area advisory. All crafts advised to return to nearest shelter harbor immediately.'
                    : selectedRegionObj.id === 'kerala' || selectedRegionObj.id === 'lakshadweep'
                      ? 'High swell surge (Kallakkadal) warnings active. Avoid low-profile nearshore anchoring during high-tide phases.'
                      : 'Sea conditions remain within safe limits for certified motorized crafts. Maintain NavIC transponder VHF listening on Channel 16.'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {onNavigateToMap && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMap([selectedRegionObj.lat, selectedRegionObj.lon], selectedRegionObj.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-ocean-teal" />
                    <span>Track {selectedRegionObj.state} on Marine Map</span>
                  </button>
                )}

                {onOpenBulletin && (
                  <button
                    type="button"
                    onClick={() => onOpenBulletin(`${selectedRegionObj.harbors[0]} Harbor`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-ocean-cyan" />
                    <span>Print Official {selectedRegionObj.state} Daily Bulletin PDF</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* North Indian Ocean Tropical Weather Outlook Box */}
          <div className="bg-white rounded-2xl border-2 border-rose-300 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
                  🌀
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                      {outlook.cycloneStatus}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      RSMC NEW DELHI • BULLETIN #TROP-2026
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
                    {outlook.title}
                  </h2>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-bold text-slate-900 font-mono">{outlook.validPeriod}</div>
                <div className="text-rose-600 font-bold text-[11px]">Probability: {outlook.cyclogenesisProbability24h}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Impacted Maritime Sector: {outlook.impactedRegion}</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-sans">
                {outlook.summary}
              </p>
            </div>

            {/* Mandatory Directive */}
            <div className="p-3.5 rounded-xl bg-rose-700 text-white text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 text-rose-200">
                <Radio className="w-4 h-4" />
                <span>Mandatory Fishermen Sea Venturing Directive:</span>
              </span>
              <p className="text-rose-50 leading-relaxed font-medium">
                {outlook.fishermenWarning}
              </p>
            </div>

            {/* Live Marine Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Squall & Gale Wind</span>
                <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{outlook.windSquallKnots}</span>
                <span className="text-[10px] text-slate-500">Squalls up to 35 knots</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Waves (Open-Meteo)</span>
                <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                  {telemetry.waveHeight ? `${telemetry.waveHeight}m` : '1.8m'} (Rough)
                </span>
                <span className="text-[10px] text-slate-500">
                  Swell: {telemetry.swellHeight ? `${telemetry.swellHeight}m` : '1.2m'} • {telemetry.wavePeriodSec ? `${telemetry.wavePeriodSec}s` : '8.4s'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trajectory Vector</span>
                <span className="text-sm font-extrabold text-slate-900 block mt-0.5">WNW Movement</span>
                <span className="text-[10px] text-slate-500">Across Odisha & North AP</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sea State Index</span>
                <span className="text-sm font-extrabold text-rose-700 block mt-0.5">{outlook.seaState}</span>
                <span className="text-[10px] text-slate-500">State: 5-6 (WMO Code)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {onNavigateToMap && (
                <button
                  type="button"
                  onClick={() => onNavigateToMap([18.5, 84.8], 'IMD Low Pressure Danger Zone')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pin Low-Pressure Zone on Map [18.50°N, 84.80°E]</span>
                </button>
              )}

              {onAskOrca && (
                <button
                  type="button"
                  onClick={() => onAskOrca('Provide complete safety contingency and harbor return protocol for the active Bay of Bengal low pressure area')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-ocean-cyan" />
                  <span>Ask AI for Vessel Contingency</span>
                </button>
              )}
            </div>
          </div>

          {/* Bay of Bengal Synoptic & Sub-Area Bulletins (ACWC Kolkata) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal">Official Coastal Sea Area Bulletin</span>
                <h3 className="text-base font-bold text-slate-900">{bob.agency}</h3>
                <span className="text-xs text-slate-500">{bob.validity}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-bold font-mono">
                Bay of Bengal Maritime Basin
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Synoptic Situation (Meteorologist Dispatch):
              </span>
              <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                {bob.synopticSituation}
              </p>
            </div>

            {/* Sub-sectors table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Sea Sector</th>
                    <th className="p-2.5">Sustained Wind</th>
                    <th className="p-2.5">Weather & Precipitation</th>
                    <th className="p-2.5">Visibility</th>
                    <th className="p-2.5">Sea State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bob.sectors.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{sec.name}</td>
                      <td className="p-2.5 font-mono text-ocean-deep font-semibold">{sec.wind}</td>
                      <td className="p-2.5 text-slate-700">{sec.weather}</td>
                      <td className="p-2.5 text-slate-600">{sec.visibility}</td>
                      <td className="p-2.5 font-semibold text-rose-700">{sec.sea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Arabian Sea Synoptic & Sub-Area Bulletins (ACWC Mumbai) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal">Official Coastal Sea Area Bulletin</span>
                <h3 className="text-base font-bold text-slate-900">{as.agency}</h3>
                <span className="text-xs text-slate-500">{as.validity}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold font-mono">
                Arabian Sea Maritime Basin
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Synoptic Situation (ACWC Mumbai):
              </span>
              <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                {as.synopticSituation}
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Sea Sector</th>
                    <th className="p-2.5">Sustained Wind</th>
                    <th className="p-2.5">Weather</th>
                    <th className="p-2.5">Visibility</th>
                    <th className="p-2.5">Sea State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {as.sectors.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{sec.name}</td>
                      <td className="p-2.5 font-mono text-ocean-deep">{sec.wind}</td>
                      <td className="p-2.5 text-slate-700">{sec.weather}</td>
                      <td className="p-2.5 text-slate-600">{sec.visibility}</td>
                      <td className="p-2.5 font-semibold text-emerald-700">{sec.sea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE COASTAL HAZARD NOTICES LIST */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Severity Filter Tabs */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t('filterSeverity', 'Filter Severity')}:</span>
              <div className="flex items-center gap-1.5">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      severityFilter === sev
                        ? sev === 'HIGH' ? 'bg-rose-700 text-white' :
                          sev === 'MEDIUM' ? 'bg-amber-600 text-white' :
                          sev === 'LOW' ? 'bg-emerald-700 text-white' :
                          'bg-ocean-deep text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sev === 'ALL' ? t('allAlerts', 'All Alerts') : 
                     sev === 'HIGH' ? t('severeRed', 'Severe Red') : 
                     sev === 'MEDIUM' ? t('moderateCaution', 'Moderate Caution') : 
                     t('advisories', 'Advisories')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mr-2">
              {regionFilter !== 'ALL' && (
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                  Region: {selectedRegionObj ? selectedRegionObj.state : regionFilter}
                </span>
              )}
              <span>{filteredAlerts.length} {t('noticesCount', 'Notices')}</span>
            </div>
          </div>

          {/* Empty state if no alerts match region */}
          {filteredAlerts.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Active Emergency Notices for {selectedRegionObj ? selectedRegionObj.name : 'this Region'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Marine meteorological parameters and NavIC boundary sensors indicate clear operations. Standard port fairway regulations apply.
              </p>
              <button
                type="button"
                onClick={() => setRegionFilter('ALL')}
                className="px-4 py-2 rounded-xl bg-ocean-deep text-white text-xs font-bold hover:bg-ocean-navy transition-colors cursor-pointer"
              >
                View All National Alerts
              </button>
            </div>
          )}

          {/* Alerts Feed */}
          <div className="space-y-4">
            {filteredAlerts.map(alert => {
              const isHigh = alert.severity === 'HIGH';
              const isMed = alert.severity === 'MEDIUM';

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                    alert.isRealImdData ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-300' :
                    isHigh ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' :
                    isMed ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isHigh ? 'bg-rose-100 text-rose-700' :
                        isMed ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isHigh ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {t(alert.category)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {alert.id}
                          </span>
                          {alert.isRealImdData && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white font-mono animate-pulse">
                              ● REAL-TIME IMD 24H OUTLOOK
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-slate-900 leading-snug mt-0.5">
                          {t(alert.title)}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t('issuedBy', 'Issued by')}: <strong>{alert.issuedBy}</strong> • {alert.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <RiskBadge level={alert.severity} size="md" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {t(alert.summary)}
                    </p>

                    {/* Directive */}
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                      isHigh ? 'bg-rose-100/70 border-rose-200 text-rose-950 font-medium' :
                      isMed ? 'bg-amber-100/70 border-amber-200 text-amber-950' :
                      'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}>
                      <Radio className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase tracking-wider">{t('officialDirectives', 'Mandatory Maritime Directive')}: </span>
                        <span>{t(alert.actionRequired)}</span>
                      </div>
                    </div>

                    {/* Regions and Telemetry Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500">{t('effectiveRange', 'Affected Sectors')}:</span>
                        <span className="font-medium text-slate-800">{alert.affectedRegions.join(', ')}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {alert.waveHeightMax && (
                          <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                            {t('waveHeight', 'Waves')}: <strong>{alert.waveHeightMax}</strong>
                          </span>
                        )}
                        {alert.windSpeedMax && (
                          <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                            {t('windSpeed', 'Wind')}: <strong>{alert.windSpeedMax}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                    {alert.isRealImdData && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('bulletin')}
                        className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Read Official IMD Bulletin & Outlook
                      </button>
                    )}

                    {onAskOrca && (
                      <button
                        type="button"
                        onClick={() => onAskOrca({ zoneName: alert.affectedRegions[0], name: alert.title })}
                        className="py-1.5 px-3 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        {t('askOrcaSafety', 'Consult ORCA on Safety Contingency')}
                      </button>
                    )}

                    {onNavigateToMap && alert.coordinates && (
                      <button
                        type="button"
                        onClick={() => onNavigateToMap(alert.coordinates, alert.title)}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{t('viewDangerCone', 'View Danger Zone on Map')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
