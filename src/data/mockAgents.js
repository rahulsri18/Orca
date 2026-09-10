export const AGENT_ROSTER = [
  {
    id: 'planner',
    name: 'Planner Agent',
    role: 'Decomposition & Task Orchestration',
    color: '#38BDF8',
    icon: 'BrainCircuit',
    badge: 'LLM Orchestrator',
    description: 'Deconstructs user queries into spatial, meteorological, and oceanographic sub-tasks.'
  },
  {
    id: 'ocean',
    name: 'Ocean Agent',
    role: 'Hydrodynamic & Satellite Bio-Optics',
    color: '#0EA5E9',
    icon: 'Waves',
    badge: 'INCOIS / Oceansat-3',
    description: 'Pulls Sea Surface Temperature (SST), Chlorophyll-a, swell height, and tidal flow.'
  },
  {
    id: 'weather',
    name: 'Weather Agent',
    role: 'Meteorological & Doppler Radar',
    color: '#0284C7',
    icon: 'CloudRain',
    badge: 'IMD Doppler / INSAT-3DR',
    description: 'Assesses wind vectors, gale warnings, squall lines, precipitation, and lightning clusters.'
  },
  {
    id: 'geo',
    name: 'Geo Agent',
    role: 'Spatial Geofencing & Bathymetry',
    color: '#14B8A6',
    icon: 'Compass',
    badge: 'NavIC / GIS / EEZ',
    description: 'Validates 12nm Territorial Waters, Marine Protected Sanctuaries, and port proximity.'
  },
  {
    id: 'risk',
    name: 'Risk Agent',
    role: 'Probabilistic Hazard Synthesis',
    color: '#F59E0B',
    icon: 'ShieldAlert',
    badge: 'Composite Risk Engine',
    description: 'Computes multi-parametric risk matrices based on vessel size, sea state, and weather thresholds.'
  },
  {
    id: 'decision',
    name: 'Decision / ORCA Agent',
    role: 'Actionable Advisory & Policy Formulation',
    color: '#10B981',
    icon: 'Sparkles',
    badge: 'Final Synthesizer',
    description: 'Translates complex telemetry into clear, safety-critical natural language advisories.'
  }
];

export const DEMO_SCENARIOS = {
  kochi: {
    query: "Is it safe to fish tomorrow near Kochi coast?",
    targetZone: "Kochi Offshore (Zone A-1)",
    coordinates: [9.9312, 76.2673],
    riskLevel: "HIGH",
    riskScore: 84, // 0 - 100
    confidenceScore: 94, // %
    headline: "HIGH RISK: Rough Sea State & Gale Warning in Effect",
    recommendation: "DO NOT VENTURE into sea beyond 3 nautical miles tomorrow. An active cyclonic depression in the Southeast Arabian Sea is generating squally winds up to 55 km/h (30 knots) and high swell waves reaching 3.4m. Country crafts and small motorized boats must remain anchored.",
    conditionsSummary: {
      waveHeight: "3.2m - 3.6m (Very Rough)",
      windSpeed: "28 - 32 knots (Squally)",
      sst: "29.1°C (Thermal Anomaly +1.2°C)",
      visibility: "Poor (3-5 km in rain)",
      tide: "High Tide at 07:45 IST (1.4m)",
      lightning: "Severe cluster detected 18km WSW"
    },
    sources: [
      { name: "INCOIS Ocean State Forecast", id: "OSF-KL-892", time: "10 mins ago" },
      { name: "IMD Kochi Doppler Radar", id: "DWR-KOC-04", time: "5 mins ago" },
      { name: "ISRO Oceansat-3 OCM", id: "OCM3-ORBIT-4421", time: "42 mins ago" },
      { name: "NavIC Coastal AIS Transponder", id: "AIS-STN-COCHIN", time: "Live" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 240,
        action: 'Parsing query & identifying spatial bounds',
        findings: 'Target: Kochi Coast (9.93°N, 76.26°E). Time horizon: T+12h to T+36h. Vessel class: Artisanal / Small motorized fishing craft.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 380,
        action: 'Querying INCOIS wave buoys & Oceansat-3 SST/Chlorophyll',
        findings: 'Buoy #AD02 reports Significant Wave Height 3.4m, Peak Period 12.8s (High Swell Surge). SST 29.1°C with strong thermal divergence.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 340,
        action: 'Analyzing IMD Doppler radar & INSAT-3DR cloud cover',
        findings: 'Gale wind warning active. Sustained winds 28 kts gusting to 35 kts. Doppler radar confirms heavy convective squall line approaching from WSW.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 290,
        action: 'Evaluating bathymetry & harbor approach channels',
        findings: 'Shallow bar mouth at Kochi Port entrance indicates breaking surf risk. Wave breaking index 0.78 (dangerous for small craft).'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 410,
        action: 'Synthesizing multi-variable hazard index',
        findings: 'Calculated Composite Marine Risk Score: 84/100 (HIGH RISK). Primary risk drivers: Swell surge (45%), Squall wind gust (35%), Low visibility (20%).'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 310,
        action: 'Formulating safety advisory and fallback alternatives',
        findings: 'Decision reached: Issue Red Alert advisory. Recommend postponement of all fishing operations until T+48h when swell drops below 1.8m.'
      }
    ],
    explainability: {
      decisionSummary: "Advisory to withhold fishing operations is driven by concurrent high wave surge (>3.2m) and convective squall gusts reaching Force 7 on the Beaufort scale.",
      riskWeights: [
        { factor: "Wave & Swell Height (3.4m)", weight: 42, impact: "Critical risk of small craft capsize" },
        { factor: "Wind Speed & Gale Gusts (32 kts)", weight: 28, impact: "High drift and navigation impairment" },
        { factor: "Lightning Proximity (<20km)", weight: 18, impact: "Direct strike hazard for open wood/FRP boats" },
        { factor: "Harbor Bar Surf Breaking", weight: 12, impact: "High hazard during return transit" }
      ],
      confidenceBreakdown: {
        overall: 94,
        dataFreshness: 98,
        sensorConsensus: 93,
        modelCertainty: 91
      }
    }
  },

  vizag: {
    query: "Show today's best PFZ coordinates off Visakhapatnam",
    targetZone: "Vizag Offshore Bank (PFZ-VZ-03)",
    coordinates: [17.6868, 83.2185],
    riskLevel: "LOW",
    riskScore: 18,
    confidenceScore: 96,
    headline: "EXCELLENT CONDITIONS: Prime Potential Fishing Zone Identified",
    recommendation: "Safe to venture. Oceanographic sensors confirm a prime Potential Fishing Zone (PFZ) located 14.2 nautical miles East-Southeast of Visakhapatnam Harbor (17.62°N, 83.45°E). Favorable thermal front (27.4°C) overlapping high chlorophyll density (1.42 mg/m³) indicates high pelagic fish aggregation (Tuna & Mackerel).",
    conditionsSummary: {
      waveHeight: "0.8m - 1.1m (Smooth to Slight)",
      windSpeed: "8 - 12 knots (Gentle breeze)",
      sst: "27.4°C (Optimal front)",
      visibility: "Clear (>10 km)",
      tide: "Low Tide 12:10 IST, Next High 18:20 IST",
      lightning: "No lightning detected within 120km"
    },
    sources: [
      { name: "ISRO Oceansat-3 OCM Ocean Color", id: "OCM3-VZ-901", time: "25 mins ago" },
      { name: "INCOIS PFZ Mission Node", id: "PFZ-AP-09", time: "1 hr ago" },
      { name: "IMD Visakhapatnam Radar", id: "DWR-VZG-01", time: "15 mins ago" },
      { name: "NOAA/AVHRR SST Blend", id: "SST-MODIS-IN", time: "2 hrs ago" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 210,
        action: 'Task dispatch for biological productivity & sea safety',
        findings: 'Target: Visakhapatnam offshore waters. Objective: Detect thermal-chlorophyll front congruence and evaluate safety window.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 360,
        action: 'Processing Oceansat-3 OCM & INCOIS PFZ algorithm',
        findings: 'Strong biological boundary detected at 17.62°N, 83.45°E. Chlorophyll gradient 1.42 mg/m³ with cyclonic eddy upwelling nutrients.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 310,
        action: 'Reviewing atmospheric stability and wind forecast',
        findings: 'Calm atmospheric profile. Gentle southeasterly breeze 10 kts. Sea state code 2. No squall or precipitation triggers for 36 hours.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 280,
        action: 'Checking transit corridor and underwater hazards',
        findings: 'PFZ point is 14.2 nm from outer fishing harbor. Clear of Vizag Port commercial shipping lanes and naval exercise corridors.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 370,
        action: 'Evaluating vessel safety thresholds',
        findings: 'Composite Risk Score: 18/100 (LOW RISK). Safety index: 9.2/10. Optimal operational window open until Thursday 18:00 IST.'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 290,
        action: 'Formulating PFZ coordinates and catch advisory',
        findings: 'High-confidence green recommendation. Transmitting coordinates (17.62°N, 83.45°E) with estimated fuel efficiency index of 88%.'
      }
    ],
    explainability: {
      decisionSummary: "High suitability score is derived from optimal chlorophyll-thermal coincidence verified by Oceansat-3, combined with calm sea conditions across all marine buoys.",
      riskWeights: [
        { factor: "Chlorophyll-SST Front Match", weight: 45, impact: "Exceptional pelagic fish aggregation probability" },
        { factor: "Wave Height (<1.1m)", weight: 30, impact: "Safe operation for all vessel classes" },
        { factor: "Wind Forecast (10 kts)", weight: 15, impact: "Minimal drift, low fuel consumption" },
        { factor: "Shipping Lane Clearance", weight: 10, impact: "Zero maritime traffic conflict" }
      ],
      confidenceBreakdown: {
        overall: 96,
        dataFreshness: 95,
        sensorConsensus: 97,
        modelCertainty: 96
      }
    }
  },

  mannar: {
    query: "Marine alert status for Gulf of Mannar & Rameswaram",
    targetZone: "Gulf of Mannar Biosphere Reserve",
    coordinates: [9.2876, 79.3129],
    riskLevel: "MEDIUM",
    riskScore: 56,
    confidenceScore: 89,
    headline: "MODERATE CAUTION: Squally Winds & Coral Geofence Restrictions",
    recommendation: "EXERCISE CAUTION. Gusty easterly winds (18-22 knots) and moderate swell waves (1.8m - 2.2m) are observed in the Palk Strait and Gulf of Mannar. Mechanized vessels may operate with vigilance, but small artisanal crafts should avoid deep reef passages. Note: Marine National Park Sanctuary boundaries are strictly geofenced.",
    conditionsSummary: {
      waveHeight: "1.8m - 2.2m (Moderate)",
      windSpeed: "18 - 22 knots (Breezy/Gusty)",
      sst: "28.5°C",
      visibility: "Moderate (7 km in sea mist)",
      tide: "Tidal Surge +0.6m in shallow reef channels",
      lightning: "Scattered lightning 45km Southeast"
    },
    sources: [
      { name: "INCOIS Tamil Nadu Coastal Node", id: "OSF-TN-412", time: "18 mins ago" },
      { name: "NavIC Marine Sanctuary Geofence", id: "MNP-ZONE-02", time: "Live" },
      { name: "IMD Chennai Radar Feed", id: "DWR-CHN-08", time: "22 mins ago" },
      { name: "Coast Guard Maritime Safety Net", id: "CG-MSN-RAM", time: "1 hr ago" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 230,
        action: 'Query analysis for environmentally sensitive coastal zone',
        findings: 'Target: Rameswaram / Gulf of Mannar. Sensitivity: Biosphere reserve sanctuary boundary and shallow coral reef bathymetry.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 390,
        action: 'Bathymetric analysis & swell modeling',
        findings: 'Swell waves 2.0m interacting with shallow continental shelf, creating steep choppy waves in Pamban pass.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 330,
        action: 'Atmospheric pressure gradient evaluation',
        findings: 'High pressure gradient across Gulf of Mannar generating wind funnelling through Palk Strait at 20 knots.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 350,
        action: 'Verifying Marine Protected Area & IMBL boundaries',
        findings: 'Warning: 3 fishing vessels detected within 1.2 nautical miles of International Maritime Boundary Line (IMBL) buffer zone.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 400,
        action: 'Synthesizing environmental and navigation hazards',
        findings: 'Composite Risk Score: 56/100 (MEDIUM / CAUTION). Hazard triggers: Shallow reef grounding risk + wind swell + international boundary proximity.'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 300,
        action: 'Drafting conditional advisory with geofence alert',
        findings: 'Advisory issued: Exercise caution. Avoid Pamban bridge channel during high ebb tide. Maintain strict 2nm clearance from IMBL.'
      }
    ],
    explainability: {
      decisionSummary: "Moderate caution score reflects a confluence of gusty wind swell and high sensitivity to maritime boundary lines and shallow coral reefs.",
      riskWeights: [
        { factor: "Wind Funneling in Palk Strait", weight: 35, impact: "Steep choppy waves challenging for open crafts" },
        { factor: "IMBL Boundary Proximity", weight: 25, impact: "Risk of accidental border crossing" },
        { factor: "Coral Reef Depth Hazard", weight: 25, impact: "Risk of propeller and hull grounding at low tide" },
        { factor: "Tidal Current Surge", weight: 15, impact: "Strong drift in Pamban channel" }
      ],
      confidenceBreakdown: {
        overall: 89,
        dataFreshness: 94,
        sensorConsensus: 88,
        modelCertainty: 86
      }
    }
  },

  route: {
    query: "Plot safest return route to Mangalore avoiding rough waters",
    targetZone: "Mangalore Coastal Corridor",
    coordinates: [12.9141, 74.8560],
    riskLevel: "LOW",
    riskScore: 24,
    confidenceScore: 93,
    headline: "SAFE ROUTE COMPUTED: High-Wave Zone Circumvented",
    recommendation: "Safe route calculated from current offshore coordinates (13.15°N, 74.45°E) to Mangalore Old Port. The direct course crosses an active 2.9m breaking swell zone off Malpe Bank. ORCA's recommended waypoint path shifts your heading 15° West into deep water (42m depth), reducing maximum wave encounter to 1.4m and saving 18% fuel with favorable tidal drift.",
    conditionsSummary: {
      waveHeight: "1.2m - 1.5m along safe corridor (vs 2.9m direct)",
      windSpeed: "14 knots NNW",
      sst: "28.3°C",
      visibility: "Good (>8 km)",
      tide: "Ebb tide assisting southbound transit",
      lightning: "Nil"
    },
    sources: [
      { name: "INCOIS Coastal Routing System", id: "CRS-KA-11", time: "12 mins ago" },
      { name: "New Mangalore Port Vessel Traffic Service", id: "VTS-NMPT-03", time: "Live" },
      { name: "IMD Mangalore Station", id: "AWS-MNG-99", time: "30 mins ago" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 220,
        action: 'Route optimization & waypoint calculation',
        findings: 'Origin: Offshore Malpe (13.15°N, 74.45°E). Destination: Mangalore Port (12.91°N, 74.85°E). Direct distance: 28.4 nm.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 370,
        action: 'Scanning spatial wave height grid across route candidates',
        findings: 'Nearshore Malpe-Udupi corridor shows high shoaling wave surge of 2.9m due to submerged rocky shoals.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 300,
        action: 'Evaluating prevailing wind and surface currents',
        findings: 'NNW wind at 14 kts with 0.8 knot southbound longshore current. Favorable tailwind on recommended offshore vector.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 310,
        action: 'Calculating safe depth contour and harbor approach',
        findings: 'Maintains >30m contour until final approach buoy (Fairway Buoy #1) of Mangalore Harbor. Avoids St. Mary island rocky reefs.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 380,
        action: 'Evaluating dynamic safety envelope',
        findings: 'Direct path risk: 72/100 (HIGH). ORCA Waypoint path risk: 24/100 (LOW). Risk delta: -48 points.'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 280,
        action: 'Generating waypoint route instruction card',
        findings: 'Route approved: Waypoint WP-1 (13.08°N, 74.52°E) -> WP-2 (12.98°N, 74.68°E) -> Mangalore Fairway. ETA: 2h 45m @ 10 kts.'
      }
    ],
    explainability: {
      decisionSummary: "The safe route deliberately deviates 3.8 nm seaward to bypass severe coastal shoaling waves while utilizing the southbound current for fuel conservation.",
      riskWeights: [
        { factor: "Shoal Wave Avoidance (2.9m → 1.4m)", weight: 50, impact: "Eliminates dangerous beam-sea roll hazard" },
        { factor: "Deep Water Bathymetry (>30m)", weight: 25, impact: "Prevents shallow-water wave steepening" },
        { factor: "Favorable Surface Current (0.8 kts)", weight: 15, impact: "Reduces fuel consumption by ~18%" },
        { factor: "Port VTS Corridor Alignment", weight: 10, impact: "Smooth pilotage entry into New Mangalore Port" }
      ],
      confidenceBreakdown: {
        overall: 93,
        dataFreshness: 97,
        sensorConsensus: 94,
        modelCertainty: 90
      }
    }
  }
};

export function getScenarioForQuery(queryText = "") {
  const q = queryText.toLowerCase();
  if (q.includes("kochi") || q.includes("tomorrow") || q.includes("fish tomorrow") || q.includes("safe to fish") || q.includes("कोच्चि") || q.includes("கொச்சி") || q.includes("కొచ్చి") || q.includes("কোচি")) {
    return DEMO_SCENARIOS.kochi;
  }
  if (q.includes("vizag") || q.includes("visakhapatnam") || q.includes("pfz") || q.includes("zone") || q.includes("विशाखापत्तनम") || q.includes("விசாகப்பட்டினம்") || q.includes("విశాఖపట్నం") || q.includes("বিশাখাপত্তনম")) {
    return DEMO_SCENARIOS.vizag;
  }
  if (q.includes("mannar") || q.includes("rameswaram") || q.includes("alert") || q.includes("मन्नार") || q.includes("ராமேஸ்வரம்") || q.includes("రామేశ్వరం") || q.includes("মান্নার")) {
    return DEMO_SCENARIOS.mannar;
  }
  if (q.includes("route") || q.includes("mangalore") || q.includes("return") || q.includes("karwar") || q.includes("मार्ग") || q.includes("பாதை") || q.includes("మార్గాలు") || q.includes("রুট")) {
    return DEMO_SCENARIOS.route;
  }
  // Generic marine response dynamic synthesizer
  return {
    ...DEMO_SCENARIOS.kochi,
    query: queryText,
    headline: "ORCA MULTI-AGENT ADVISORY FOR: " + queryText.slice(0, 45),
  };
}
