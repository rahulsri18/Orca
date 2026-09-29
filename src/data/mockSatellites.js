export const SATELLITE_PRODUCTS = [
  {
    id: 'OCEANSAT-3',
    mission: 'Oceansat-3',
    sensor: 'OCM-3 (Ocean Color Monitor)',
    payload: 'Bio-Optical Spectral Radiometer',
    orbitType: 'Polar Sun-Synchronous',
    altitude: '720 km',
    passTime: '06:30 IST (Pass #4120)',
    cloudCoverPercent: 12,
    downlinkStatus: 'NRSC Shadnagar (Nominal Lock)',
    spatialResolution: '360 m / pixel',
    spectralBands: '13 Spectral Bands (400 - 1020 nm)',
    primaryLayer: 'Chlorophyll',
    qualityIndex: '98.4% Geo-rectified',
    description: 'Calibrated bio-optical radiometric data detecting chlorophyll plumes, thermal front convergences, and coastal sediment dispersion for the Indian EEZ.'
  },
  {
    id: 'INSAT-3DR',
    mission: 'INSAT-3DR',
    sensor: 'Multispectral Thermal Imager',
    payload: 'Thermal Infrared Sounder (TIR-1/2)',
    orbitType: 'Geostationary (74.0°E)',
    altitude: '35,786 km',
    passTime: '08:15 IST (Rapid Scan Blended)',
    cloudCoverPercent: 18,
    downlinkStatus: 'SAC Ahmedabad (100% Stream)',
    spatialResolution: '1.0 km / pixel',
    spectralBands: 'Mid-IR & Thermal IR (3.8 µm, 10.8 µm)',
    primaryLayer: 'SST',
    qualityIndex: '96.8% Precision Calibrated',
    description: 'Hourly geostationary thermal infrared scanning of sea surface skin temperature (SST), marine heatwave monitoring, and cyclonic heat potential mapping.'
  },
  {
    id: 'SENTINEL-3',
    mission: 'Sentinel-3',
    sensor: 'SRAL / SLSTR Synergy',
    payload: 'Dual-Frequency SAR Altimeter',
    orbitType: 'Polar Sun-Synchronous',
    altitude: '814 km',
    passTime: '05:42 IST (Nadir Swath)',
    cloudCoverPercent: 0, // Radar penetrates cloud deck
    downlinkStatus: 'INCOIS Marine Altimetry Portal',
    spatialResolution: '300 m along-track',
    spectralBands: 'Ku-band (13.575 GHz) & C-band',
    primaryLayer: 'Wave Height',
    qualityIndex: '99.1% Marine Calibrated',
    description: 'Dual-frequency synthetic aperture radar altimeter providing instantaneous significant wave heights, swell vectors, and geostrophic surface wind speeds.'
  },
  {
    id: 'SARAL-ALTIKA',
    mission: 'SARAL/AltiKa',
    sensor: 'AltiKa Ka-Band Altimeter',
    payload: '35.75 GHz Ka-Band Radiometer',
    orbitType: 'Polar Non-Sun-Synchronous',
    altitude: '800 km',
    passTime: '07:05 IST (Pass #8812)',
    cloudCoverPercent: 5,
    downlinkStatus: 'ISRO ISTRAC Bengaluru',
    spatialResolution: '250 m footprint',
    spectralBands: 'Ka-band (35.75 GHz single freq)',
    primaryLayer: 'Sea Surface Anomaly',
    qualityIndex: '97.9% Altimetric Lock',
    description: 'ISRO-CNES joint Ka-band altimetry mission delivering millimeter-accurate sea surface height anomalies (SSHA), coastal current shear, and mesoscale eddy tracks.'
  }
];

export const SATELLITE_DATA_LAYERS = [
  {
    id: 'Chlorophyll',
    label: 'Chlorophyll-a',
    unit: 'mg/m³',
    min: 0.1,
    max: 2.8,
    colorScheme: 'Deep Blue to Emerald Green',
    sensorSource: 'Oceansat-3 OCM-3',
    description: 'Photosynthetic pigment concentration indicating phytoplankton density and pelagic fish aggregation boundaries.'
  },
  {
    id: 'SST',
    label: 'Sea Surface Temp',
    unit: '°C',
    min: 26.0,
    max: 31.5,
    colorScheme: 'Cool Cyan to Crimson Red',
    sensorSource: 'INSAT-3DR TIR',
    description: 'Radiometric skin temperature delineating coastal upwelling cold tongues and warm cyclone feeding corridors.'
  },
  {
    id: 'Turbidity',
    label: 'Turbidity / Sediment',
    unit: 'NTU',
    min: 0.5,
    max: 18.0,
    colorScheme: 'Ultramarine to Sandy Ochre',
    sensorSource: 'Oceansat-3 OCM-3 Band 6',
    description: 'Diffuse attenuation coefficient at 490nm indicating suspended sediment discharge and estuarine outflow.'
  },
  {
    id: 'Wave Height',
    label: 'Wave Swell (SWH)',
    unit: 'm',
    min: 0.5,
    max: 4.8,
    colorScheme: 'Slate Navy to Violet Indigo',
    sensorSource: 'Sentinel-3 SRAL',
    description: 'Direct nadir radar echo altimetry calculating significant wave height across coastal shoals.'
  },
  {
    id: 'Sea Surface Anomaly',
    label: 'Sea Surface Anomaly',
    unit: 'cm',
    min: -25,
    max: +30,
    colorScheme: 'Bipolar Cyan to Magenta',
    sensorSource: 'SARAL/AltiKa Ka-band',
    description: 'Geostrophic height deviations from mean sea level revealing cyclonic (cold core) and anticyclonic (warm core) ocean eddies.'
  }
];

