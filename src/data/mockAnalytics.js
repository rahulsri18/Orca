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
  { month: 'January', sst: '27.4°C', wave: '1.1 m', wind: '12 kt', galeRisk: 'LOW', season: 'Northeast Monsoon', anomaly: '-0.2°C' },
  { month: 'February', sst: '27.8°C', wave: '1.0 m', wind: '10 kt', galeRisk: 'LOW', season: 'Fair Weather Inter-monsoon', anomaly: '0.0°C' },
  { month: 'March', sst: '28.5°C', wave: '1.2 m', wind: '11 kt', galeRisk: 'LOW', season: 'Pre-Monsoon Transition', anomaly: '+0.3°C' },
  { month: 'April', sst: '29.4°C', wave: '1.5 m', wind: '14 kt', galeRisk: 'CAUTION', season: 'Pre-Monsoon Warming', anomaly: '+0.7°C' },
  { month: 'May', sst: '29.9°C', wave: '2.4 m', wind: '22 kt', galeRisk: 'HIGH', season: 'Pre-Monsoon Squall Phase', anomaly: '+1.1°C' },
  { month: 'June', sst: '28.6°C', wave: '3.6 m', wind: '32 kt', galeRisk: 'HIGH', season: 'Southwest Monsoon (Active)', anomaly: '+0.4°C' },
  { month: 'July', sst: '27.8°C', wave: '3.8 m', wind: '34 kt', galeRisk: 'HIGH', season: 'Southwest Monsoon (Peak)', anomaly: '+0.2°C' },
  { month: 'August', sst: '27.5°C', wave: '3.4 m', wind: '30 kt', galeRisk: 'HIGH', season: 'Southwest Monsoon (Late)', anomaly: '+0.1°C' },
  { month: 'September', sst: '28.1°C', wave: '2.4 m', wind: '18 kt', galeRisk: 'CAUTION', season: 'Monsoon Withdrawal', anomaly: '+0.5°C' },
  { month: 'October', sst: '28.9°C', wave: '1.8 m', wind: '16 kt', galeRisk: 'CAUTION', season: 'Post-Monsoon Cyclone Season', anomaly: '+0.8°C' },
  { month: 'November', sst: '28.6°C', wave: '1.5 m', wind: '14 kt', galeRisk: 'CAUTION', season: 'Post-Monsoon Tropical Phase', anomaly: '+0.4°C' },
  { month: 'December', sst: '27.9°C', wave: '1.2 m', wind: '13 kt', galeRisk: 'LOW', season: 'Northeast Monsoon Initiation', anomaly: '-0.1°C' },
];

