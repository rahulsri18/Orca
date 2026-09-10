import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  SST_TREND_DATA,
  CHLOROPHYLL_TREND_DATA,
  WAVE_WIND_FORECAST,
  TIDE_PREDICTION,
  HISTORICAL_MONTHLY_SUMMARY
} from '../data/mockAnalytics';
import { useLanguage } from '../context/LanguageContext';
import { Activity, Thermometer, Waves, Wind, Layers, Calendar, Download } from 'lucide-react';

export function AnalyticsPage() {
  const { t } = useLanguage();
  const [timeHorizon, setTimeHorizon] = useState('7D');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-ocean-deep to-ocean-navy text-white rounded-2xl p-5 md:p-6 shadow-marine">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Activity className="w-6 h-6 text-ocean-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{t('analyticsPageTitle', 'Oceanographic & Weather Analytics')}</h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  INCOIS / ISRO Bio-Physical Models
                </span>
              </div>
              <p className="text-xs md:text-sm text-sky-100/80 mt-1">
                {t('analyticsPageSub', 'Multi-temporal sensor trends: Sea Surface Temperature anomalies, Chlorophyll-a bloom tracking, wave swells, and astronomical tides.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-ocean-navy p-1 rounded-xl border border-sky-400/30 flex text-xs">
              {['24H', '7D', '30D'].map(tOption => (
                <button
                  key={tOption}
                  onClick={() => setTimeHorizon(tOption)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    timeHorizon === tOption ? 'bg-ocean-teal text-white' : 'text-sky-200 hover:text-white'
                  }`}
                >
                  {tOption}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: SST Anomaly Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-800">{t('sstChartTitle', 'Sea Surface Temperature (SST) & Thermal Anomaly')}</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{t('unitCelsius', 'Unit: °Celsius')}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SST_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[26, 31]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B3D5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="actualSst" name={t('observedSst', 'Observed SST (°C)')} stroke="#F97316" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="historicalNorm" name={t('historicalBaseline', 'Historical Baseline (°C)')} stroke="#94A3B8" strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500">
            {t('thermalAnomaly', 'Thermal anomaly indicates persistent regional marine heatwave (+1.2°C above 10-year climatology).')}
          </p>
        </div>

        {/* Chart 2: Chlorophyll-a Concentration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">{t('chlorophyllChartTitle', 'Chlorophyll-a Bio-Optical Density (Oceansat-3)')}</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{t('unitMgM3', 'Unit: mg/m³')}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHLOROPHYLL_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 2.0]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B3D5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="concentration" name={t('chlorophyllConcentration', 'Chlorophyll-a (mg/m³)')} fill="#10B981" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="threshold" name={t('pfzThreshold', 'PFZ Threshold (0.8)')} stroke="#E67E22" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500">
            {t('highBioDensity', 'Concentrations above 0.8 mg/m³ represent fertile feeding grounds for pelagic shoals.')}
          </p>
        </div>

        {/* Chart 3: Significant Wave Height & Wind Gusts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-800">{t('waveWindForecastTitle', 'Significant Wave Height & Wind Gust Forecast')}</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{t('cadence24H', '24-Hour Cadence')}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WAVE_WIND_FORECAST} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis yAxisId="left" domain={[0, 4.5]} stroke="#0284C7" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 45]} stroke="#F59E0B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B3D5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area yAxisId="left" type="monotone" dataKey="waveHeight" name={t('waveHeightM', 'Wave Height (m)')} stroke="#0284C7" fill="#BAE6FD" fillOpacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="gust" name={t('windGustsKts', 'Wind Gusts (kts)')} stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500">
            {t('roughSwell', 'Peak sea state surge expected at 12:00 IST coinciding with peak squall wind convergence.')}
          </p>
        </div>

        {/* Chart 4: Tide Level Astronomical Prediction */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-800">{t('tidePredictionTitle', 'Astronomical Tide Chart (Survey of India)')}</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{t('chartDatum', 'Chart Datum')}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIDE_PREDICTION} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 2.2]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B3D5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="natural" dataKey="levelMeters" name={t('tidalLevelMeters', 'Tidal Level (Meters)')} stroke="#6366F1" fill="#E0E7FF" fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500">
            {t('tide', 'High tide at 08:30 IST (+1.6m) increases bar-mouth breaking wave danger for outgoing vessels.')}
          </p>
        </div>
      </div>

      {/* Historical Climatological Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ocean-teal" />
            <h3 className="font-bold text-sm text-slate-800">{t('historicalSummaryTitle', '12-Month Climatological & Fish Catch Index')}</h3>
          </div>
          <span className="text-xs text-slate-500">{t('historicalImdDataset', 'Historical IMD / CMFRI Dataset')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{t('month', 'Month')}</th>
                <th className="py-2.5 px-3">{t('waveHeight', 'Avg Swell (m)')}</th>
                <th className="py-2.5 px-3">{t('cycloneFrequency', 'Cyclone Frequency')}</th>
                <th className="py-2.5 px-3">{t('suitability', 'Catch Suitability')}</th>
                <th className="py-2.5 px-3">{t('currentRisk', 'Safety Classification')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {HISTORICAL_MONTHLY_SUMMARY.map(m => (
                <tr key={m.month} className="hover:bg-slate-50/80">
                  <td className="py-2 px-3 font-bold font-sans text-slate-900">{t(m.month)}</td>
                  <td className="py-2 px-3">{m.avgWave}m</td>
                  <td className="py-2 px-3">{m.cyclonicEvents} {t('events', 'events')}</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">{m.catchIndex}/100</td>
                  <td className="py-2 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      m.avgWave > 3.0 ? 'bg-rose-100 text-rose-800' :
                      m.avgWave > 2.0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.avgWave > 3.0 ? t('monsoonBanExtreme', 'Monsoon Ban / Extreme') : m.avgWave > 2.0 ? t('cautionarySeason', 'Cautionary Season') : t('primeSafeWindow', 'Prime Safe Window')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
