import React, { useEffect } from 'react';
import { MOCK_PFZ } from '../../data/mockPfz';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { useLanguage } from '../../context/LanguageContext';
import { Printer, Download, Share2, X, ShieldCheck, Fish, AlertOctagon, Anchor, Compass } from 'lucide-react';

export function DailyBulletinModal({ isOpen, onClose, port = 'Kochi Fishing Harbor' }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeAlert = MOCK_ALERTS.find(a => a.severity === 'HIGH') || MOCK_ALERTS[0];
  const topPfz = MOCK_PFZ.slice(0, 3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      {/* External Floating Cross Button (Always Visible in Top Right) */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white flex items-center justify-center shadow-2xl border border-white/20 transition-all hover:scale-110 active:scale-95 group print:hidden cursor-pointer"
        title="Close Daily Bulletin & Return (Esc)"
        aria-label="Close Daily Bulletin"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Main Modal Window */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150">
        {/* Top Control Bar (Sticky & Always Accessible) */}
        <div className="sticky top-0 z-20 bg-ocean-deep text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="font-bold text-xs sm:text-sm tracking-tight">
              {t('officialBulletinTitle', 'Official Daily Coastal Marine Safety Bulletin')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('printPdf', 'Print / Save PDF')}</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-sm border border-rose-400/40 active:scale-95 group cursor-pointer"
              title="Close Daily Bulletin & Return (Esc)"
              aria-label="Close Daily Bulletin"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>{t('close', 'Close')}</span>
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document (Scrollable) */}
        <div className="p-5 sm:p-8 space-y-5 text-slate-800 font-sans overflow-y-auto flex-1" id="printable-bulletin">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-ocean-deep pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-ocean-deep text-white flex items-center justify-center text-2xl font-bold">
                🇮🇳
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {t('bulletinGovt', 'Government of India • Ministry of Earth Sciences • ISRO SIH26176')}
                </div>
                <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('bulletinDocTitle', 'ORCA DAILY MARINE SAFETY & PFZ ADVISORY BULLETIN')}
                </h1>
                <div className="text-xs text-slate-600 font-medium">
                  {t('bulletinIssuedFor', 'Issued for')}: <strong>{port}</strong> • {t('bulletinValid', 'Valid for next 24 Hours')}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-900 font-mono">BULLETIN #{new Date().getFullYear()}-0907</div>
              <div className="text-slate-500">{todayStr}</div>
              <div className="text-emerald-700 font-bold mt-0.5">{t('validatedIncoisImd', '● Validated INCOIS / IMD')}</div>
            </div>
          </div>

          {/* Section 1: Composite Marine Risk & Weather Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('bulletinOverallRisk', 'Overall Risk Level')}</span>
              <span className="text-sm font-black text-rose-700 block mt-0.5">{t('dangerTitle', 'HIGH RISK / DANGER')}</span>
              <span className="text-[10px] text-rose-600 font-mono">{t('compositeRiskTitle', 'Hazard Index')}: 84/100</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('bulletinSignificantWaves', 'Significant Waves')}</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">3.4m - 3.8m Swell</span>
              <span className="text-[10px] text-slate-500">Peak Period: 12.8s</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('bulletinSustainedWind', 'Sustained Wind & Gale')}</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">28 kts (Gust 35 kts)</span>
              <span className="text-[10px] text-slate-500">Direction: Southwesterly</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('bulletinAstronomicalTides', 'Astronomical Tides')}</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">High: 08:30 (+1.6m)</span>
              <span className="text-[10px] text-slate-500">Low: 14:45 (+0.4m)</span>
            </div>
          </div>

          {/* Section 2: Active Severe Alert Directive */}
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>{t('officialDirectives', 'MANDATORY DIRECTIVE')}: {t(activeAlert.title)}</span>
            </div>
            <p className="text-rose-950 leading-relaxed font-medium">
              {t(activeAlert.actionRequired)}
            </p>
          </div>

          {/* Section 3: Prime Potential Fishing Zones (PFZ) Coordinates Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Fish className="w-4 h-4 text-emerald-600" />
                <span>{t('pfz', 'Verified Potential Fishing Zones')} (ISRO Oceansat-3 OCM)</span>
              </h3>
              <span className="text-[11px] text-slate-500">{t('bioOpticalConvergence', 'Bio-Optical Front Convergence')}</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">{t('sectors', 'Sector Name')}</th>
                    <th className="p-2.5">{t('gpsCoordinates', 'GPS Latitude / Longitude')}</th>
                    <th className="p-2.5">{t('distance', 'Distance & Bearing')}</th>
                    <th className="p-2.5">{t('sst', 'SST & Chl-a')}</th>
                    <th className="p-2.5">{t('targetSpecies', 'Target Species')}</th>
                    <th className="p-2.5">{t('suitability', 'Suitability')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {topPfz.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-sans font-bold text-slate-900">{t(p.zoneName)}</td>
                      <td className="p-2.5 text-ocean-deep font-semibold">
                        {p.coordinates[0]}°N, {p.coordinates[1]}°E
                      </td>
                      <td className="p-2.5 font-sans">{p.distanceNm} nm ({p.bearing})</td>
                      <td className="p-2.5">{p.sstCelsius}°C • {p.chlorophyllMgM3}mg/m³</td>
                      <td className="p-2.5 font-sans text-slate-600">{p.primarySpecies.slice(0, 2).join(', ')}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{p.suitabilityScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer & QR Authenticity */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <div className="font-semibold text-slate-800">
                {t('orcaMultiAgentEngine', 'ORCA Multi-Agent Operational Command Engine')}
              </div>
              <div className="text-[11px]">
                {t('signedSafetyOfficer', 'Signed: Coastal Marine Safety Officer • NavIC Broadcast Hash #98A2-F410')}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>{t('scanNavicRouteSync', 'SCAN FOR NAVIC ROUTE SYNC ➔ [QR: ORCA-2026]')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar (Hidden during printing) */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 sm:px-8 py-3 flex items-center justify-between print:hidden shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300 text-slate-700 shadow-2xs">ESC</kbd> or click Close to return
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-95 ml-auto cursor-pointer"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>{t('closeReturn', 'Close Bulletin & Return')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
