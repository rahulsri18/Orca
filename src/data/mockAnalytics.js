export const SST_TREND_DATA = [
  { day: 'Mon', actualSst: 28.1, historicalNorm: 27.5, anomaly: '+0.6' },
  { day: 'Tue', actualSst: 28.3, historicalNorm: 27.5, anomaly: '+0.8' },
  { day: 'Wed', actualSst: 28.7, historicalNorm: 27.6, anomaly: '+1.1' },
  { day: 'Thu', actualSst: 29.1, historicalNorm: 27.6, anomaly: '+1.5' },
  { day: 'Fri', actualSst: 29.4, historicalNorm: 27.7, anomaly: '+1.7' },
  { day: 'Sat', actualSst: 29.0, historicalNorm: 27.7, anomaly: '+1.3' },
  { day: 'Sun (Forecast)', actualSst: 28.6, historicalNorm: 27.6, anomaly: '+1.0' },
];

export const CHLOROPHYLL_TREND_DATA = [
  { day: 'Mon', concentration: 0.65, threshold: 0.8 },
  { day: 'Tue', concentration: 0.78, threshold: 0.8 },
  { day: 'Wed', concentration: 0.95, threshold: 0.8 },
  { day: 'Thu', concentration: 1.34, threshold: 0.8 },
  { day: 'Fri', concentration: 1.48, threshold: 0.8 },
  { day: 'Sat', concentration: 1.42, threshold: 0.8 },
  { day: 'Sun (Forecast)', concentration: 1.25, threshold: 0.8 },
];

export const WAVE_WIND_FORECAST = [
  { time: '00:00', waveHeight: 1.2, swellPeriod: 8.5, windSpeed: 14, gust: 18 },
  { time: '04:00', waveHeight: 1.6, swellPeriod: 9.8, windSpeed: 18, gust: 24 },
  { time: '08:00', waveHeight: 2.4, swellPeriod: 11.2, windSpeed: 24, gust: 30 },
  { time: '12:00', waveHeight: 3.4, swellPeriod: 12.8, windSpeed: 29, gust: 36 },
  { time: '16:00', waveHeight: 3.2, swellPeriod: 12.4, windSpeed: 28, gust: 34 },
  { time: '20:00', waveHeight: 2.8, swellPeriod: 11.0, windSpeed: 22, gust: 28 },
  { time: '24:00', waveHeight: 2.1, swellPeriod: 10.1, windSpeed: 17, gust: 22 },
];

export const TIDE_PREDICTION = [
  { time: '02:15', levelMeters: 0.4, type: 'Low Tide' },
  { time: '08:30', levelMeters: 1.6, type: 'High Tide' },
  { time: '14:45', levelMeters: 0.5, type: 'Low Tide' },
  { time: '20:50', levelMeters: 1.5, type: 'High Tide' },
];

export const HISTORICAL_MONTHLY_SUMMARY = [
  { month: 'Jan', avgWave: 1.1, cyclonicEvents: 0, catchIndex: 82 },
  { month: 'Feb', avgWave: 1.0, cyclonicEvents: 0, catchIndex: 88 },
  { month: 'Mar', avgWave: 1.2, cyclonicEvents: 0, catchIndex: 84 },
  { month: 'Apr', avgWave: 1.5, cyclonicEvents: 1, catchIndex: 76 },
  { month: 'May', avgWave: 2.2, cyclonicEvents: 2, catchIndex: 65 },
  { month: 'Jun', avgWave: 3.6, cyclonicEvents: 3, catchIndex: 40 },
  { month: 'Jul', avgWave: 3.8, cyclonicEvents: 3, catchIndex: 35 },
  { month: 'Aug', avgWave: 3.4, cyclonicEvents: 2, catchIndex: 48 },
  { month: 'Sep', avgWave: 2.4, cyclonicEvents: 1, catchIndex: 72 },
  { month: 'Oct', avgWave: 1.8, cyclonicEvents: 2, catchIndex: 79 },
  { month: 'Nov', avgWave: 1.6, cyclonicEvents: 2, catchIndex: 81 },
  { month: 'Dec', avgWave: 1.3, cyclonicEvents: 0, catchIndex: 85 },
];
