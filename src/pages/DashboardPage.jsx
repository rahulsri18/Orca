import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { MapWidget } from '../components/map/MapWidget';
import { RecommendationCard } from '../components/chat/RecommendationCard';
import { DEMO_SCENARIOS } from '../data/mockAgents';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_PFZ } from '../data/mockPfz';
import { COASTAL_REGIONS } from '../data/coastalRegions';
import {
  Sparkles,
  MapPin,
  Compass,
  Fish,
  AlertTriangle,
  Waves,
  Wind,
  Thermometer,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Activity,
  Satellite
} from 'lucide-react';

export function DashboardPage({
  onNavigateTab,
  onAskOrca,
  onHighlightMap,
  onOpenSos = null
}) {
  const { role, currentRole } = useRole();
  const { t } = useLanguage();
  const [regionFilter, setRegionFilter] = useState('ALL');

  const activeAlert = MOCK_ALERTS.find(a => a.severity === 'HIGH') || MOCK_ALERTS[0];
  const primePfz = MOCK_PFZ.find(p => p.suitabilityScore >= 90) || MOCK_PFZ[0];

  const filteredRegions = COASTAL_REGIONS.filter(reg => {
    if (regionFilter === 'WEST') return ['gujarat', 'maharashtra', 'goa', 'karnataka', 'kerala'].includes(reg.id);
    if (regionFilter === 'EAST') return ['tamilnadu', 'palkbay', 'andhra', 'odisha', 'bengal'].includes(reg.id);
    if (regionFilter === 'ISLANDS') return ['andaman', 'lakshadweep'].includes(reg.id);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Risk Status Strip */}
      <div className="bg-gradient-to-r from-ocean-deep via-ocean-navy to-ocean-medium text-white rounded-2xl p-5 md:p-6 shadow-marine relative overflow-hidden">
        {/* Subtle decorative wave pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-ocean-teal/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30">
                {t('sihBadge')}
              </span>
              <span className="text-xs text-sky-200/80 font-mono">
                {t('telemetryLive')}
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
              {t('dashboardTitle')}
            </h1>
            <p className="text-xs md:text-sm text-sky-100/90 mt-1 max-w-2xl leading-relaxed">
              {t('dashboardSubtitle')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex flex-col items-end gap-1.5">
            <span className="text-[10px] uppercase font-bold text-sky-200">
              {t('compositeRiskTitle')}
            </span>
            <RiskBadge level="HIGH" score={84} size="lg" />
            <span className="text-[10px] text-sky-100 font-mono">{t('kochiRedAlert')}</span>
          </div>
        </div>
      </div>

      {/* 3 Primary Entry Cards (Dashboard Core) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Entry 1: Conversational AI Assistant */}
        <div
          onClick={() => onNavigateTab('chat')}
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-ocean-teal/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-sky-50 text-ocean-deep group-hover:bg-ocean-deep group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5 text-ocean-teal group-hover:text-ocean-cyan" />
              </div>
              <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                {t('orcaAiCardBadge')}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-ocean-deep transition-colors">
              {t('orcaAiCardTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {t('orcaAiCardDesc')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-ocean-teal group-hover:translate-x-1 transition-transform">
            <span>{t('launchDialogue')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Entry 2: Interactive Marine GIS Map */}
        <div
          onClick={() => onNavigateTab('map')}
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-ocean-teal/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-ocean-light text-ocean-deep group-hover:bg-ocean-deep group-hover:text-white transition-colors">
                <Compass className="w-5 h-5 text-ocean-medium group-hover:text-sky-300" />
              </div>
              <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {t('mapCardBadge')}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-ocean-deep transition-colors">
              {t('mapCardTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {t('mapCardDesc')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-ocean-teal group-hover:translate-x-1 transition-transform">
            <span>{t('openSpatialStation')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Entry 3: Safety Bulletins & Alerts */}
        <div
          onClick={() => onNavigateTab('alerts')}
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-rose-400/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 group-hover:bg-rose-700 group-hover:text-white transition-colors">
                <AlertTriangle className="w-5 h-5 text-rose-600 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 animate-pulse">
                {t('alertsCardBadge')}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
              {t('alertsCardTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {t('alertsCardDesc')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700 group-hover:translate-x-1 transition-transform">
            <span>{t('viewDirectives')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick-Glance Coastal Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title={t('waveHeight')}
          value="3.4 meters"
          subtext={t('roughSwell')}
          trend={t('surgeTrend')}
          iconName="Waves"
          status="danger"
        />
        <StatCard
          title={t('windSpeed')}
          value="28 knots"
          subtext={t('gustingKts')}
          trend={t('galeTrend')}
          iconName="Wind"
          status="warning"
        />
        <StatCard
          title={t('sst')}
          value="29.1°C"
          subtext={t('thermalAnomaly')}
          trend={t('sstTrend')}
          iconName="Thermometer"
          status="warning"
        />
        <StatCard
          title={t('chlorophyll')}
          value="1.42 mg/m³"
          subtext={t('highBioDensity')}
          badge={t('primePfzBadge')}
          iconName="Layers"
          status="safe"
        />
      </div>

      {/* Role-Adaptive Section (Fisherman / Authority / Operator / Researcher) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal">
                {t('adaptiveWorkflowTitle')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-ocean-deep border border-sky-200">
                {t('personaPrefix')}: {t(currentRole.id) || currentRole.title}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {t(currentRole.id + 'Desc', currentRole.tagline)}
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="text-xs text-ocean-teal font-semibold hover:underline"
          >
            {t('changePersona')}
          </button>
        </div>

        {/* Dynamic content matching the role */}
        {role === 'fisherman' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <Fish className="w-4 h-4 text-emerald-700" />
                  <span>{t('primeCatchTitle')}: {primePfz.zoneName}</span>
                </span>
                <span className="font-bold text-emerald-800">{primePfz.suitabilityScore}% {t('suitability')}</span>
              </div>
              <p className="text-slate-600">
                {t('locatedOffshore')} {primePfz.distanceNm} nm {t('offshoreRegion')} ({primePfz.region}). {t('targetSpecies')}: <strong>{primePfz.primarySpecies.join(', ')}</strong>.
              </p>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onAskOrca(primePfz)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors"
                >
                  {t('askOrcaSafety')}
                </button>
                <button
                  onClick={() => onNavigateTab('pfz')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors"
                >
                  {t('viewAllPfzs')}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-ocean-teal" />
                <span>{t('navicSafeRouteTitle')}</span>
              </span>
              <p className="text-slate-600">
                {t('navicSafeRouteDesc')}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="px-3 py-1.5 rounded-lg bg-ocean-deep text-white font-semibold hover:bg-ocean-navy transition-colors"
                >
                  {t('inspectSafeWaypoints')}
                </button>
              </div>
            </div>

            {/* Emergency SOS Protocol Banner for Fishermen */}
            {onOpenSos && (
              <div className="md:col-span-2 p-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm border border-rose-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white shrink-0 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight flex items-center gap-2">
                      <span>{t('sosBannerTitle')}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/25 text-rose-100 border border-white/20">
                        {t('navicSbandBadge')}
                      </span>
                    </div>
                    <p className="text-xs text-rose-100/90 mt-0.5">
                      {t('sosBannerSubtitle')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenSos}
                  className="px-3.5 py-2 rounded-xl bg-white text-rose-700 font-extrabold text-xs hover:bg-rose-50 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>{t('triggerSosBeacon')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {role === 'authority' && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-950">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t('disasterResponseTitle')}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold font-mono">{t('codeRed')}</span>
            </div>
            <p className="leading-relaxed">
              {t('authorityDesc')}
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onNavigateTab('alerts')}
                className="px-3 py-1.5 rounded-lg bg-rose-700 text-white font-bold hover:bg-rose-800 transition-colors"
              >
                {t('broadcastSiren')}
              </button>
              <button
                onClick={() => onNavigateTab('map')}
                className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 font-semibold hover:bg-rose-50 transition-colors"
              >
                {t('viewDangerCone')}
              </button>
            </div>
          </div>
        )}

        {role === 'operator' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5 text-ocean-deep">
                <Compass className="w-4 h-4 text-ocean-teal" />
                <span>{t('shippingChannelTitle')}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-ocean-light text-ocean-deep font-semibold">{t('vtsActive')}</span>
            </div>
            <p className="text-slate-600">
              {t('operatorDesc')}
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onNavigateTab('routes')}
                className="px-3 py-1.5 rounded-lg bg-ocean-deep text-white font-semibold hover:bg-ocean-navy transition-colors"
              >
                {t('openRouteTool')}
              </button>
            </div>
          </div>
        )}

        {role === 'researcher' && (
          <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-200 space-y-2 text-xs text-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5 text-ocean-deep">
                <Satellite className="w-4 h-4 text-ocean-teal" />
                <span>{t('researcherSensorTitle')}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">{t('oceansatValid')}</span>
            </div>
            <p className="text-slate-600">
              {t('researcherDesc')}
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onNavigateTab('satellites')}
                className="px-3 py-1.5 rounded-lg bg-ocean-deep text-white font-semibold hover:bg-ocean-navy transition-colors"
              >
                {t('inspectSatellites')}
              </button>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="px-3 py-1.5 rounded-lg bg-white border border-cyan-300 text-cyan-900 font-semibold hover:bg-cyan-50 transition-colors"
              >
                {t('openAnalytics')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Live Map Preview & Latest Multi-Agent Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mini Map */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-ocean-teal" />
              <h3 className="font-bold text-sm text-slate-800">{t('liveMapTitle')}</h3>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-bold text-ocean-teal hover:underline flex items-center gap-1"
            >
              <span>{t('fullScreenGis')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-80 rounded-xl overflow-hidden border border-slate-200">
            <MapWidget
              highlightedCoordinates={[9.9312, 76.2673]}
              onAskOrca={onAskOrca}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>{t('mapFooterLocation')}</span>
            <span className="font-mono">{t('layersEnabled')}</span>
          </div>
        </div>

        {/* Right: Latest Synthesized Advisory Card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ocean-teal" />
              <h3 className="font-bold text-sm text-slate-800">{t('latestAdvisoryTitle')}</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{t('verified10m')}</span>
          </div>

          <RecommendationCard
            scenario={DEMO_SCENARIOS.kochi}
            onHighlightMap={onHighlightMap}
          />
        </div>
      </div>

      {/* Pan-India Coastal Maritime Sectors Highlight Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                Pan-India Coastal Maritime Sectors (7,516 km Coastline)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                12 Monitored Sectors
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active oceanographic safety monitoring, potential fishing zones (PFZ), and NavIC telemetry across all 9 coastal states and island territories.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'ALL', label: 'All India (12)' },
              { id: 'WEST', label: 'West Coast (5)' },
              { id: 'EAST', label: 'East Coast (5)' },
              { id: 'ISLANDS', label: 'Islands (2)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setRegionFilter(f.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  regionFilter === f.id
                    ? 'bg-white text-ocean-deep shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRegions.map(reg => {
            const isHigh = reg.riskLevel === 'HIGH';
            const isMed = reg.riskLevel === 'MEDIUM';
            const badgeClass = isHigh
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : isMed
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300';

            return (
              <div
                key={reg.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-ocean-teal/60 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/60 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-ocean-teal uppercase tracking-wider block">{reg.state}</span>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-ocean-deep transition-colors leading-snug">
                        {reg.name}
                      </h4>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${badgeClass}`}>
                      {reg.riskLevel} ({reg.riskScore}/100)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-2.5">
                    Coastline: <strong>{reg.coastlineKm}</strong> • {reg.harbors.length} Harbors
                  </div>

                  <div className="text-[11px] p-2 rounded-lg bg-white border border-slate-200/80 mb-3 space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Waves:</span>
                      <strong className="text-slate-900">{reg.waveState.split(' ')[0]}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SST Temp:</span>
                      <strong className="text-slate-900">{reg.sst}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 truncate">
                      <strong>Ports:</strong> {reg.harbors.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => onHighlightMap(reg.coordinates, reg.name)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-sky-50 hover:text-ocean-deep hover:border-ocean-teal/40 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-ocean-teal" />
                    <span>View Map</span>
                  </button>

                  <button
                    onClick={() => onAskOrca(`Assess marine weather, safety advisory, wave conditions, and fishing catch potential for ${reg.name} (${reg.state})`)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-ocean-deep hover:bg-ocean-navy text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ocean-cyan" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
