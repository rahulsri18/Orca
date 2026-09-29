/**
 * mockAlerts.js
 * Fallback marine alerts with dynamically generated Indian Standard Time (IST) timestamps.
 * Updates dynamically with the real system clock so dates are never hardcoded or outdated.
 */

function getDynamicAlertDateTime(offsetDays = 0, timeStr = '17:30 IST') {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const dateStr = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  return {
    date: dateStr,
    time: timeStr,
    dateTime: `${dateStr} • ${timeStr}`
  };
}

function getDynamicValidUntil(offsetDays = 1, timeStr = '20:00 IST') {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const dateStr = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  return `${dateStr} • ${timeStr}`;
}

export const MOCK_ALERTS = [
  {
    id: 'RED-CYC-ASNA',
    title: 'RED ALERT: Severe Cyclonic Storm "ASNA" Advancing over Southeast Arabian Sea',
    category: 'Tropical Cyclone / Gale Storm',
    dangerType: 'OCEAN_WEATHER',
    severity: 'HIGH',
    ...getDynamicAlertDateTime(0, '17:30 IST'),
    validUntil: getDynamicValidUntil(1, '20:00 IST'),
    issuedBy: 'India Meteorological Department (Cyclone Warning Division)',
    affectedRegions: ['South Kerala Coast', 'Lakshadweep Waters', 'Kanyakumari Sector'],
    coordinates: [9.15, 75.80],
    radiusKm: 180,
    windSpeedMax: '85 km/h (46 knots, Gusts to 95 km/h)',
    waveHeightMax: '4.8m (Very Rough to High)',
    summary: 'Severe cyclonic storm maintaining central pressure of 988 hPa, advancing WNW towards Lakshadweep. Heavy torrential rain squalls and dense sea spray reducing visibility to <200m. Breaking swell waves capable of capsizing all artisanal and motorized fishing crafts.',
    actionRequired: 'TOTAL SUSPENSION OF SEA VENTURES. Red alert flag hoisted across all harbors. Vessels in deep sea must take immediate shelter.',
    status: 'ACTIVE',
    isRedAlert: true
  },
  {
    id: 'RED-BOB-DEPR',
    title: 'RED ALERT: IMD Deep Depression BOB-05 Intensifying over North Bay of Bengal',
    category: 'Tropical Cyclone / Depression',
    dangerType: 'OCEAN_WEATHER',
    severity: 'HIGH',
    ...getDynamicAlertDateTime(0, '16:45 IST'),
    validUntil: getDynamicValidUntil(1, '18:00 IST'),
    issuedBy: 'IMD RSMC New Delhi & Area Cyclone Warning Centre Kolkata',
    affectedRegions: ['South Odisha Coast', 'North Andhra Coast', 'NW & WC Bay of Bengal'],
    coordinates: [18.50, 84.80],
    radiusKm: 220,
    windSpeedMax: '65 km/h (Squalls gusting to 75 km/h)',
    waveHeightMax: '4.2m (Rough Sea Condition)',
    summary: 'Active Deep Depression centered off Gopalpur-Kalingapatnam coast. Deep cyclonic circulation extending up to 9.4 km above sea level. Likely to cross coast with violent onshore gale squalls and sea water flooding.',
    actionRequired: 'Immediate port recall for all mechanized and motorized trawlers. Absolute ban on venturing into open Bay of Bengal.',
    status: 'ACTIVE',
    isRedAlert: true
  },
  {
    id: 'RED-SWL-KALLAKKADAL',
    title: 'RED ALERT: INCOIS Kallakkadal High Swell Surge along Kerala & South Tamil Nadu',
    category: 'Swell Surge / Kallakkadal',
    dangerType: 'OCEAN_WEATHER',
    severity: 'HIGH',
    ...getDynamicAlertDateTime(0, '15:15 IST'),
    validUntil: getDynamicValidUntil(1, '12:00 IST'),
    issuedBy: 'INCOIS National Centre for Ocean Information Services',
    affectedRegions: ['Thiruvananthapuram', 'Kollam', 'Alappuzha', 'Kochi', 'Kanyakumari'],
    coordinates: [8.52, 76.93],
    radiusKm: 120,
    windSpeedMax: '42 km/h (Coastal Surge Wind)',
    waveHeightMax: '3.8m (Long Period 18s Breaking Waves)',
    summary: 'Distant low-frequency swell waves originating in the Southern Indian Ocean causing sudden surging breakers over low-lying coastal roads and fish landing jetties during spring high tides without prior meteorological warning.',
    actionRequired: 'Halt all beach boat launches. Secure fishing crafts at reinforced harbor wharfs. Avoid anchoring in surf breaker zones.',
    status: 'ACTIVE',
    isRedAlert: true
  },
  {
    id: 'RED-TSU-SEISMIC',
    title: 'RED ALERT: Indian Tsunami Early Warning Centre (ITEWC) Subsea Seismic Disturbance',
    category: 'Seismic / Tsunami Watch',
    dangerType: 'SEISMIC',
    severity: 'HIGH',
    ...getDynamicAlertDateTime(0, '14:10 IST'),
    validUntil: getDynamicValidUntil(1, '02:00 IST'),
    issuedBy: 'Indian Tsunami Early Warning Centre (ITEWC / INCOIS Hyderabad)',
    affectedRegions: ['Andaman & Nicobar Archipelago', 'Eastern Bay of Bengal Islands'],
    coordinates: [11.65, 92.75],
    radiusKm: 350,
    windSpeedMax: '30 km/h',
    waveHeightMax: '2.8m (Anomalous Ocean Level Drawback & Surge)',
    summary: 'Undersea earthquake of magnitude M6.4 recorded along the Andaman Subduction Trench (Depth 12 km). Sea level tide gauges at Port Blair and Car Nicobar detecting anomalous tidal oscillations.',
    actionRequired: 'Vessels in shallow bays must move immediately to deep water (>100m depth). Coastal shore activities completely suspended.',
    status: 'ACTIVE',
    isRedAlert: true
  },
  {
    id: 'RED-PRT-CLOSURE',
    title: 'RED ALERT: Port Great Danger Signal No. 10 & Complete Harbor Navigation Closure',
    category: 'Port Operations / Signal 10',
    dangerType: 'PORT_CLOSURE',
    severity: 'HIGH',
    ...getDynamicAlertDateTime(0, '13:20 IST'),
    validUntil: getDynamicValidUntil(1, '18:00 IST'),
    issuedBy: 'Cochin Port Authority & Paradip Port Trust Harbor Master',
    affectedRegions: ['Cochin Port Fairway Channel', 'Paradip Port Outer Anchorage'],
    coordinates: [9.96, 76.22],
    radiusKm: 40,
    windSpeedMax: '68 km/h Sustained Cross-Channel',
    waveHeightMax: '4.4m Channel Breakers',
    summary: 'Great Danger Signal No. 10 hoisted by Port Conservator. Harbor entry channel closed to all commercial and fishing navigation. Pilotage suspended due to 4.4m cross-channel breaking waves.',
    actionRequired: 'Harbor entry strictly prohibited. Incoming vessels hold in designated deep offshore anchorage. All berths secured with storm mooring lines.',
    status: 'ACTIVE',
    isRedAlert: true
  },
  {
    id: 'RED-SHO-REEF',
    title: 'RED ALERT: Submerged Rocky Shoal & Keel Striking Emergency Hazard',
    category: 'Subsurface Reef Hazard',
    dangerType: 'NAVIGATIONAL',
    severity: 'HIGH',
    ...getDynamicAlertDateTime(0, '12:00 IST'),
    validUntil: getDynamicValidUntil(2, '23:59 IST'),
    issuedBy: 'Naval Hydrographic Office (NHO Dehradun) / Coast Guard District 4',
    affectedRegions: ['Ponnani Offshore Shoals (10°46\'N, 75°50\'E)', 'Malpe Outer Shoal'],
    coordinates: [10.78, 75.83],
    radiusKm: 35,
    windSpeedMax: '35 km/h',
    waveHeightMax: '4.2m Swell Overtopping',
    summary: 'Lowest astronomical spring low tide combined with 4.2m swell exposes uncharted submerged granitic rocky reef pinnacles with keel depths <1.8m. Severe hull breaching and instant sinking danger.',
    actionRequired: 'Absolute prohibition of direct coastal transit. Maintain 15° seaward detour holding depth >42m.',
    status: 'ACTIVE',
    isRedAlert: true
  },
  {
    id: 'ALT-LGT-CONV',
    title: 'CAUTION: Severe Convective Cloud-to-Water Lightning Hazard & Squalls',
    category: 'Lightning & Convective Gale',
    dangerType: 'LIGHTNING',
    severity: 'MEDIUM',
    ...getDynamicAlertDateTime(0, '11:30 IST'),
    validUntil: getDynamicValidUntil(0, '23:00 IST'),
    issuedBy: 'IMD Doppler Radar Network & Damini Lightning System',
    affectedRegions: ['Goa to Karwar Coastal Belt (10-25nm offshore)'],
    coordinates: [14.85, 73.90],
    radiusKm: 60,
    windSpeedMax: '55 km/h in localized downdrafts',
    waveHeightMax: '2.4m Choppy Swell',
    summary: 'Intense mesoscale thunderstorm squall front displaying cloud-to-water flash density exceeding 55 strikes/minute. Violent localized microbursts capable of capsizing un-ballasted country crafts.',
    actionRequired: 'Disconnect external VHF aerials. Lower outriggers and carbon poles. Proceed to sheltered cove anchorage.',
    status: 'ACTIVE'
  },
  {
    id: 'ALT-GEO-IMBL',
    title: 'CAUTION: NavIC International Maritime Boundary Line (IMBL) Geofence Breach Alert',
    category: 'Maritime Boundary / Security',
    dangerType: 'SECURITY',
    severity: 'MEDIUM',
    ...getDynamicAlertDateTime(0, '10:15 IST'),
    validUntil: getDynamicValidUntil(1, '06:00 IST'),
    issuedBy: 'Indian Coast Guard / NavIC Coastal Surveillance Radar',
    affectedRegions: ['Palk Bay Sector 3', 'Gulf of Mannar Northern Line'],
    coordinates: [9.35, 79.45],
    radiusKm: 30,
    windSpeedMax: '22 km/h',
    waveHeightMax: '1.6m',
    summary: 'Coastal surveillance radar and NavIC transponders detect motorized crafts drifting within 1.2 nautical miles of the international median boundary line.',
    actionRequired: 'Verify transponder GPS locks immediately. Alter heading 210° SW into Indian territorial waters.',
    status: 'ACTIVE'
  },
  {
    id: 'ALT-RIP-SURF',
    title: 'CAUTION: Dangerous Rip Current & Coastal Undertow Red Flag Warning',
    category: 'Coastal Rip Currents / Surf Undertow',
    dangerType: 'OCEAN_WEATHER',
    severity: 'MEDIUM',
    ...getDynamicAlertDateTime(0, '09:30 IST'),
    validUntil: getDynamicValidUntil(1, '18:00 IST'),
    issuedBy: 'INCOIS Coastal Hazard Division & State Disaster Management',
    affectedRegions: ['Puri Beach (Odisha)', 'Kovalam Beach (Kerala)', 'Marina Beach (Chennai)'],
    coordinates: [19.78, 85.82],
    radiusKm: 50,
    windSpeedMax: '32 km/h',
    waveHeightMax: '2.6m Breaking Surf',
    summary: 'Heavy incoming swell wave refraction off shore sandbars creating powerful seaward undertow channels with velocity >2.5 m/s. High risk of craft swamping and bather drowning.',
    actionRequired: 'Red warning flags hoisted on beaches. Launching artisanal beach catamarans through surf strictly prohibited.',
    status: 'ACTIVE'
  },
  {
    id: 'ADV-PFZ-LIVE',
    title: 'ADVISORY: High-Density Potential Fishing Zone (PFZ) Discovered',
    category: 'Ocean State Advisory / PFZ',
    dangerType: 'OCEAN_WEATHER',
    severity: 'LOW',
    ...getDynamicAlertDateTime(0, '05:30 IST'),
    validUntil: getDynamicValidUntil(1, '18:00 IST'),
    issuedBy: 'INCOIS Marine Fishery Division / ISRO Oceansat-3',
    affectedRegions: ['Offshore Visakhapatnam (Zone 3B, 22nm ESE)'],
    coordinates: [17.65, 83.40],
    radiusKm: 45,
    windSpeedMax: '16 km/h (Gentle Breeze)',
    waveHeightMax: '1.1m (Calm Sea)',
    summary: 'Oceansat-3 satellite telemetry confirms strong biological front with high chlorophyll concentration (1.42 mg/m³). High pelagic catch expected.',
    actionRequired: 'Fishermen in Andhra coastal zone can utilize recommended safe navigational waypoint corridor.',
    status: 'ACTIVE'
  }
];
