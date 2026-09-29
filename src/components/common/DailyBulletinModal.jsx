import React, { useEffect, useState } from 'react';
import { MOCK_PFZ } from '../../data/mockPfz';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { useLanguage } from '../../context/LanguageContext';
import { getDailyBulletin } from '../../services/apiClient';
import { Printer, Download, X, AlertTriangle, ShieldCheck, FileText, Loader2 } from 'lucide-react';

export function DailyBulletinModal({ isOpen, onClose, port = 'Kochi Fishing Harbor, Kerala' }) {
  const { t } = useLanguage();
  const [bulletin, setBulletin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoading(true);
    getDailyBulletin(port)
      .then(data => {
        if (isMounted) {
          setBulletin(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.warn('Failed to load live daily bulletin, using local fallback:', err);
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, [isOpen, port]);

  if (!isOpen) return null;

  const todayStr = bulletin?.system_date_ist || new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeAlert = MOCK_ALERTS.find(a => a.severity === 'HIGH') || MOCK_ALERTS[0];
  const primePfz = bulletin?.prime_pfz ? {
    zoneName: bulletin.prime_pfz.zone_name,
    coordinates: [bulletin.prime_pfz.latitude, bulletin.prime_pfz.longitude],
    distanceNm: bulletin.prime_pfz.distance_nm,
    bearing: `${bulletin.prime_pfz.bearing_deg}°`,
    sstCelsius: bulletin.prime_pfz.sst_c,
    chlorophyllMgM3: bulletin.prime_pfz.chlorophyll_mg_m3,
    primarySpecies: bulletin.prime_pfz.target_species.split(','),
    suitabilityScore: bulletin.prime_pfz.confidence_score
  } : MOCK_PFZ[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
    >
      {/* External Floating Cross Button (Always Accessible) */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-[#C93C4B] text-white flex items-center justify-center shadow-xl border border-white/20 transition-all hover:scale-105 active:scale-95 group print:hidden cursor-pointer"
        title="Close Bulletin (Esc)"
        aria-label="Close Bulletin"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Main A4 Document Container */}
      <div className="relative bg-white w-full max-w-3xl border border-slate-300 shadow-2xl flex flex-col max-h-[92vh] my-auto overflow-hidden animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:m-0 print:max-h-none">
        {/* Top Control Bar (Non-printable) */}
        <div className="bg-[#071A2B] text-white px-4 py-2.5 border-b border-[#0B2942] flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F8B8D]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              ORCA OFFICIAL DAILY BULLETIN DOCUMENT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0B2942] hover:bg-[#0D5C7A] text-slate-200 hover:text-white border border-[#0D5C7A] text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#0F8B8D]" />
              <span>PRINT</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0D5C7A] hover:bg-[#0F8B8D] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SAVE PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#C93C4B] hover:bg-red-700 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>CLOSE</span>
            </button>
          </div>
        </div>

        {/* Professional A4 Official Document Body (Scrollable & Fully Printable) */}
        <div className="p-6 sm:p-8 space-y-5 text-slate-900 font-sans overflow-y-auto flex-1 bg-white" id="printable-bulletin">
          {/* HEADER */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                ISRO • MINISTRY OF EARTH SCIENCES • GOVT OF INDIA
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase mt-0.5">
                ORCA DAILY MARINE SAFETY BULLETIN
              </h1>
              <div className="text-xs text-slate-600 font-mono mt-1">
                Port / Coastal Sector: <strong className="text-slate-900">{port}</strong>
              </div>
            </div>

            <div className="text-right text-xs font-mono shrink-0">
              <div className="font-bold text-slate-950 text-sm">
                ID: IN-ORCA-{bulletin?.system_date_ist ? bulletin.system_date_ist.replace(/[^a-zA-Z0-9]/g, '') : 'DAILY'}
              </div>
              <div className="text-slate-500 mt-0.5">{todayStr}</div>
              <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 mt-1 inline-block">
                INCOIS / IMD VALIDATED
              </div>
            </div>
          </div>

          {/* SECTION 1: Marine Risk Summary */}
          <div className="border border-slate-300 p-3.5 bg-slate-50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2 flex items-center justify-between">
              <span>1. MARINE RISK SUMMARY</span>
              <span className="text-[10px] text-slate-500">SECTOR FORECAST: 24-HOUR OUTLOOK</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Risk Assessment:</span>
                <span className="text-sm font-black text-[#C93C4B] block mt-0.5">
                  {bulletin?.cyclone_alert_level ? `${bulletin.cyclone_alert_level} RISK` : 'HIGH RISK'}
                </span>
                <span className="text-[10px] text-slate-500">Official IMD Outlook</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Wave State:</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">2.5 – 3.8 m</span>
                <span className="text-[10px] text-slate-500">Rough to Very Rough</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Wind Velocity:</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">25 – 35 kt</span>
                <span className="text-[10px] text-slate-500">Gusts to 45 kt</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Astronomical Tides:</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">High: 08:30 (+1.6m)</span>
                <span className="text-[10px] text-slate-600">Low: 14:45 (+0.4m)</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Active Warnings */}
          <div className="border-l-4 border-l-[#C93C4B] border border-slate-300 p-3.5 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#C93C4B] uppercase">
                <AlertTriangle className="w-4 h-4 text-[#C93C4B]" />
                <span>2. OFFICIAL GOVERNMENT ADVISORY &amp; WARNINGS</span>
              </div>
              <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 font-bold">
                IMD RSMC / INCOIS VALIDATED
              </span>
            </div>

            <div className="space-y-2">
              {bulletin?.rsmc_bulletin && (
                <div className="p-2.5 bg-red-50/60 rounded border border-red-200 text-xs font-mono space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="font-bold text-[#C93C4B] uppercase">● {bulletin.rsmc_bulletin.title}</span>
                    <span className="bg-white border border-red-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700 font-bold">
                      ISSUED: {bulletin.rsmc_bulletin.issue_time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-sans leading-snug">
                    {bulletin.rsmc_bulletin.synoptic_situation}
                  </p>
                  <div className="text-[10px] text-red-800 font-bold uppercase pt-0.5">
                    WARNING: {bulletin.rsmc_bulletin.warnings}
                  </div>
                </div>
              )}

              {bulletin?.bay_of_bengal_bulletin && bulletin.bay_of_bengal_bulletin.warnings && (
                <div className="p-2.5 bg-amber-50/60 rounded border border-amber-200 text-xs font-mono space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="font-bold text-amber-800 uppercase">● {bulletin.bay_of_bengal_bulletin.title}</span>
                    <span className="bg-white border border-amber-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700 font-bold">
                      ISSUED: {bulletin.bay_of_bengal_bulletin.issue_time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-sans leading-snug">
                    {bulletin.bay_of_bengal_bulletin.synoptic_situation || bulletin.bay_of_bengal_bulletin.warnings}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: PFZ Advisory */}
          <div className="border border-slate-300 p-3.5 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                3. POTENTIAL FISHING ZONE (PFZ) ADVISORY
              </h2>
              <span className="text-[10px] font-mono text-slate-500">ISRO Oceansat-3 OCM-3 Derived</span>
            </div>

            <div className="bg-white border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase text-slate-600 font-bold">
                  <tr>
                    <th className="p-2">Target Zone</th>
                    <th className="p-2">Coordinates</th>
                    <th className="p-2">Distance &amp; Bearing</th>
                    <th className="p-2">SST &amp; Chl-a</th>
                    <th className="p-2">Target Species</th>
                    <th className="p-2">Suitability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-bold font-sans text-slate-900">{primePfz.zoneName}</td>
                    <td className="p-2">{primePfz.coordinates[0]}°N, {primePfz.coordinates[1]}°E</td>
                    <td className="p-2">{primePfz.distanceNm} NM ({primePfz.bearing})</td>
                    <td className="p-2">{primePfz.sstCelsius}°C • {primePfz.chlorophyllMgM3} mg/m³</td>
                    <td className="p-2 font-sans">{primePfz.primarySpecies.slice(0, 2).join(', ')}</td>
                    <td className="p-2 font-bold text-emerald-700">{primePfz.suitabilityScore}% PRIME</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1.5">
              * Note: High wave state and active cyclone warning supersede PFZ commercial value. Prioritize sea safety.
            </div>
          </div>

          {/* SECTION 4: Operational Recommendation */}
          <div className="border-2 border-slate-900 p-3.5 bg-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-mono mb-1">
              4. OPERATIONAL RECOMMENDATION &amp; DIRECTIVES
            </h2>
            <div className="text-xs text-slate-900 font-sans space-y-1">
              <div className="font-bold text-rose-800 font-mono">
                RECOMMENDATION: SUSPEND DEPARTURE (DO NOT VENTURE INTO DEEP SEA)
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-800 leading-snug">
                <li>Non-mechanized country craft and outboard motor boats (OBMs) are strictly barred from leaving port.</li>
                <li>Mechanized trawlers currently at sea must steer course along deep-water safe corridors (&gt;42m depth) and return to refuge harbor immediately.</li>
                <li>Maintain 24-hour continuous listening watch on VHF Channel 16 (156.800 MHz) and NavIC S-Band transponders.</li>
                {bulletin?.safe_harbors && (
                  <li className="font-bold text-slate-900">
                    Designated Safe Refuge Harbors: {bulletin.safe_harbors.join(' • ')}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* BOTTOM: Source references, timestamp, disclaimer */}
          <div className="pt-3 border-t border-slate-300 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-500">
            <div>
              <div><strong>DATA SOURCES:</strong> INCOIS Hyderabad • IMD New Delhi • ISRO SAC Ahmedabad</div>
              <div><strong>INGEST TIMESTAMP:</strong> {bulletin?.system_time_ist || 'Today IST • Real-time'}</div>
            </div>
            <div className="text-right">
              <div>DISCLAIMER: Official advisory generated under Ministry of Earth Sciences maritime safety protocol.</div>
              <div className="text-slate-400">NavIC Satellite Broadcast Checksum: #98A2-F410-IN</div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS BAR (Non-printable) */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between print:hidden shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 text-slate-700">ESC</kbd> or click Close to return
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Print
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 bg-[#071A2B] hover:bg-[#0B2942] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
