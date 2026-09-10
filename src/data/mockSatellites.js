export const SATELLITE_PRODUCTS = [
  {
    id: 'OCM3-L2-CHL',
    mission: 'ISRO Oceansat-3 (EOS-06)',
    sensor: 'Ocean Color Monitor-3 (OCM-3)',
    productName: 'Chlorophyll-a Bio-Optical Concentration',
    resolution: '360 meters',
    orbitType: 'Sun-synchronous Polar (720 km)',
    passTime: 'Today 06:45:12 UTC',
    cloudCoverPercent: 12,
    spectralBands: '13 Spectral Bands (400 - 1020 nm)',
    groundStation: 'NRSC Shadnagar, Hyderabad',
    qualityIndex: '98.2% Valid Pixels',
    status: 'OPERATIONAL',
    description: 'Calculates ocean surface chlorophyll concentration to delineate biological fronts and algal bloom boundaries for the Indian coastal zone.',
    paletteType: 'Chlorophyll (Deep Blue to Emerald Green)'
  },
  {
    id: 'INSAT3DR-TIR-SST',
    mission: 'ISRO INSAT-3DR',
    sensor: 'Multispectral Imager (Thermal IR)',
    productName: 'Sea Surface Temperature (SST) Hourly Blend',
    resolution: '1.0 km',
    orbitType: 'Geostationary (74° East)',
    passTime: 'Today 09:30:00 UTC (Hourly Rapid Scan)',
    cloudCoverPercent: 18,
    spectralBands: 'Mid-IR & Thermal IR (3.8 µm, 10.8 µm)',
    groundStation: 'SAC Ahmedabad / IMD New Delhi',
    qualityIndex: '96.5% Precision',
    status: 'OPERATIONAL',
    description: 'High-cadence thermal radiometric monitoring of ocean skin temperature, detecting marine heatwaves, upwelling zones, and cyclone heat potential.',
    paletteType: 'Thermal (Cool Cyan to Crimson Red)'
  },
  {
    id: 'SENTINEL3-SRAL-WAVE',
    mission: 'Copernicus Sentinel-3A / ISRO Synergy',
    sensor: 'Synthetic Aperture Radar Altimeter (SRAL)',
    productName: 'Significant Wave Height (SWH) & Wind Speed',
    resolution: '300m along-track',
    orbitType: 'Sun-synchronous Polar (814 km)',
    passTime: 'Today 04:18:22 UTC',
    cloudCoverPercent: 0, // Radar penetrates clouds
    spectralBands: 'Ku-band (13.575 GHz) & C-band (5.41 GHz)',
    groundStation: 'INCOIS National Altimetry Portal',
    qualityIndex: '99.1% Marine Calibrated',
    status: 'OPERATIONAL',
    description: 'Dual-frequency SAR radar altimeter measuring instantaneous sea surface height, wave swell heights, and geostrophic surface currents.',
    paletteType: 'Wave Swell (Pale Slate to Violet)'
  }
];
