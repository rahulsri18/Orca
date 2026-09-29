import React, { useState, useEffect } from 'react';
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
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  SST_TREND_DATA,
  CHLOROPHYLL_TREND_DATA,
  WAVE_WIND_FORECAST,
  HISTORICAL_MONTHLY_SUMMARY
} from '../data/mockAnalytics';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentMarineConditions } from '../services/apiClient';
import { 
  Activity, 
  Thermometer, 
  Waves, 
  Wind, 
  Layers, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Database,
  Download
} from 'lucide-react';

export function AnalyticsPage() {
  const { t } = useLanguage();
  const [timeHorizon, setTimeHorizon] = useState('7D');
  const [selectedStation, setSelectedStation] = useState('KOC');
  const [marineData, setMarineData] = useState(null);

  useEffect(() => {
    getCurrentMarineConditions()
      .then(data => setMarineData(data))
      .catch(err => console.warn('Analytics live marine telemetry load error:', err));
  }, []);

  const stationSectorMap = {
    KOC: 'kerala',
    VZG: 'andhra',
    MAN: 'palkbay',
    POR: 'gujarat'
  };
  const activeSector = marineData?.sectors?.find(s => s.sector_id === stationSectorMap[selectedStation]);

  const stations = [
    { id: 'KOC', name: 'Kochi Offshore (09°55\'N, 076°14\'E)', sector: 'Arabian Sea' },
    { id: 'VZG', name: 'Visakhapatnam Shelf (17°41\'N, 083°17\'E)', sector: 'Bay of Bengal' },
    { id: 'MAN', name: 'Gulf of Mannar Reef (09°17\'N, 079°18\'E)', sector: 'Palk Strait' },
    { id: 'POR', name: 'Porbandar Bank (21°38\'N, 069°36\'E)', sector: 'Saurashtra Coast' },
  ];

  return (
    <div className="space-y-3 font-sans">
      {/* TOP HEADER: Location Selector & Time Horizon */}
      <div className="bg-[#071A2B] border border-[#0B2942] rounded px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-300" />
            <span className="font-mono font-bold text-xs uppercase tracking-wide">
              OCEANOGRAPHIC & ATMOSPHERIC ANALYTICS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[10px] uppercase">STATION:</span>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="bg-[#0B2942] border border-[#0D5C7A] rounded px-2 py-1 text-xs font-mono text-white focus:outline-none"
            >
              {stations.map(st => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Horizon Selector: 24H | 7D | 30D */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400 text-[10px] uppercase">HORIZON:</span>
          <div className="bg-[#0B2942] p-0.5 rounded border border-[#0D5C7A] flex">
            {['24H', '7D', '30D'].map(th => (
              <button
                key={th}
                type="button"
                onClick={() => setTimeHorizon(th)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  timeHorizon === th
                    ? 'bg-[#0F8B8D] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN: 2x2 Restrained Scientific Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* CHART 1: Sea Surface Temperature (SST) & Thermal Anomaly */}
        <div className="bg-white border border-[#D1DCE5] rounded p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#D96B3B]" />
                <h3 className="font-mono font-bold text-xs text-slate-900 uppercase">
                  SEA SURFACE TEMPERATURE (SST)
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-slate-900 font-mono">
                  {activeSector ? `${activeSector.surface_temp_c}°C` : '29.1°C'}
                </span>
                <span className="text-[11px] font-mono text-[#D96B3B] font-bold bg-[#D96B3B]/10 px-1.5 py-0.2 rounded border border-[#D96B3B]/30">
                  {activeSector?.data_provenance || 'LIVE OBSERVATION'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">INCOIS / Open-Meteo High-Res</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">UNIT: °C</span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SST_TREND_DATA} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} font-family="monospace" />
                <YAxis domain={[26.5, 30.5]} stroke="#64748B" fontSize={10} font-family="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', color: '#fff', border: '1px solid #0D5C7A', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '4px' }} />
                <ReferenceLine y={27.6} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: '10Y Climatological Norm (27.6°C)', position: 'insideTopLeft', fontSize: 9, fill: '#64748B' }} />
                <Line type="monotone" dataKey="actualSst" name="Observed SST (°C)" stroke="#D96B3B" strokeWidth={2} dot={{ r: 3, fill: '#D96B3B' }} />
                <Line type="monotone" dataKey="historicalNorm" name="Historical Baseline" stroke="#64748B" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Chlorophyll-a Bio-Optical Density */}
        <div className="bg-white border border-[#D1DCE5] rounded p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1F9D72]" />
                <h3 className="font-mono font-bold text-xs text-slate-900 uppercase">
                  CHLOROPHYLL-A BIO-OPTICAL DENSITY
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-slate-900 font-mono">1.42 mg/m³</span>
                <span className="text-[11px] font-mono text-[#1F9D72] font-bold bg-[#1F9D72]/10 px-1.5 py-0.2 rounded border border-[#1F9D72]/30">
                  FERTILE PFZ
                </span>
                <span className="text-[10px] font-mono text-slate-500">ISRO Oceansat-3 OCM-3</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">UNIT: mg/m³</span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHLOROPHYLL_TREND_DATA} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} font-family="monospace" />
                <YAxis domain={[0, 1.8]} stroke="#64748B" fontSize={10} font-family="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', color: '#fff', border: '1px solid #0D5C7A', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '4px' }} />
                <ReferenceLine y={0.8} stroke="#D89B24" strokeDasharray="3 3" label={{ value: 'PFZ Threshold (0.8 mg/m³)', position: 'insideTopLeft', fontSize: 9, fill: '#D89B24' }} />
                <Bar dataKey="concentration" name="Chlorophyll-a (mg/m³)" fill="#1F9D72" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Significant Wave Height & Swell */}
        <div className="bg-white border border-[#D1DCE5] rounded p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#0D5C7A]" />
                <h3 className="font-mono font-bold text-xs text-slate-900 uppercase">
                  SIGNIFICANT WAVE HEIGHT (SWH)
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-slate-900 font-mono">
                  {activeSector ? `${activeSector.wave_height_m} m` : '3.4 m'}
                </span>
                <span className="text-[11px] font-mono text-[#C93C4B] font-bold bg-[#C93C4B]/10 px-1.5 py-0.2 rounded border border-[#C93C4B]/30">
                  {activeSector?.risk_level === 'HIGH' ? 'HIGH RISK' : (activeSector?.risk_level ? `${activeSector.risk_level} RISK` : 'DANGER')}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ECMWF Wave Model</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">UNIT: METERS</span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WAVE_WIND_FORECAST} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} font-family="monospace" />
                <YAxis domain={[0, 4.5]} stroke="#64748B" fontSize={10} font-family="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', color: '#fff', border: '1px solid #0D5C7A', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '4px' }} />
                <ReferenceLine y={2.5} stroke="#C93C4B" strokeDasharray="3 3" label={{ value: 'Small Craft Ban Threshold (2.5m)', position: 'insideTopLeft', fontSize: 9, fill: '#C93C4B' }} />
                <Area type="monotone" dataKey="waveHeight" name="Significant Wave Height (m)" stroke="#0D5C7A" fill="#EAF0F3" fillOpacity={0.8} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Sustained Surface Wind Velocity & Gusts */}
        <div className="bg-white border border-[#D1DCE5] rounded p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#0F8B8D]" />
                <h3 className="font-mono font-bold text-xs text-slate-900 uppercase">
                  SUSTAINED WIND SPEED &amp; GUST FORECAST
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-slate-900 font-mono">
                  {activeSector ? `${activeSector.wind_speed_kt} kt` : '28 kt'}
                </span>
                <span className="text-[11px] font-mono text-[#D89B24] font-bold bg-[#D89B24]/10 px-1.5 py-0.2 rounded border border-[#D89B24]/30">
                  {activeSector ? `GUSTS ${activeSector.wind_gusts_kt} KT` : 'GALE GUSTS 36 KT'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">IMD AWS / Coastal Network</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">UNIT: KNOTS</span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WAVE_WIND_FORECAST} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} font-family="monospace" />
                <YAxis domain={[0, 45]} stroke="#64748B" fontSize={10} font-family="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', color: '#fff', border: '1px solid #0D5C7A', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '4px' }} />
                <ReferenceLine y={28} stroke="#D89B24" strokeDasharray="3 3" label={{ value: 'Gale Warning Level (28 kt)', position: 'insideTopLeft', fontSize: 9, fill: '#D89B24' }} />
                <Line type="monotone" dataKey="windSpeed" name="Sustained Wind (kt)" stroke="#0F8B8D" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="gust" name="Peak Gusts (kt)" stroke="#D89B24" strokeDasharray="3 3" strokeWidth={1.5} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM: 12-Month Climatology Table */}
      <div className="bg-white border border-[#D1DCE5] rounded overflow-hidden shadow-xs">
        <div className="p-2.5 bg-[#071A2B] border-b border-[#0B2942] flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-300" />
            <span className="font-mono font-bold text-xs uppercase tracking-wide">
              12-MONTH HISTORICAL OCEANOGRAPHIC CLIMATOLOGY (ARABIAN SEA / KOCHI SECTOR)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-300">
            IMD 30-YEAR CLIMATOLOGICAL NORMALS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#EAF0F3] border-b border-[#D1DCE5] text-[10px] text-slate-600 uppercase">
                <th className="py-2 px-3">MONTH</th>
                <th className="py-2 px-3">MEAN SST</th>
                <th className="py-2 px-3">SST ANOMALY</th>
                <th className="py-2 px-3">MEAN WAVE</th>
                <th className="py-2 px-3">MEAN WIND</th>
                <th className="py-2 px-3">GALE RISK</th>
                <th className="py-2 px-3 text-right">METEOROLOGICAL SEASON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {HISTORICAL_MONTHLY_SUMMARY.map(m => {
                const isPositive = m.anomaly.startsWith('+');
                return (
                  <tr key={m.month} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900 font-sans">
                      {m.month}
                    </td>
                    <td className="py-2 px-3 text-slate-800">
                      {m.sst}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isPositive ? 'bg-[#D96B3B]/10 text-[#D96B3B]' : 'bg-[#1F9D72]/10 text-[#1F9D72]'
                      }`}>
                        {m.anomaly}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-800">
                      {m.wave}
                    </td>
                    <td className="py-2 px-3 text-slate-800">
                      {m.wind}
                    </td>
                    <td className="py-2 px-3">
                      <RiskBadge level={m.galeRisk} size="sm" />
                    </td>
                    <td className="py-2 px-3 text-right font-sans text-slate-600">
                      {m.season}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
