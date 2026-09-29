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
    targetZone: "Kochi Offshore",
    coordinates: [9.9312, 76.2673],
    riskLevel: "HIGH",
    riskScore: 84,
    confidenceScore: 94,
    headline: "🚨 DO NOT GO TO SEA TODAY (DANGEROUS SEA)",
    recommendation: "Stay in harbor. Dangerous waves over 11 feet (3.4 meters) and stormy winds will flip small boats. Keep your boat tied in port until Thursday when sea calms down.",
    conditionsSummary: {
      "Sea Waves": "11 feet high (3.4m) — Very Rough",
      "Wind Speed": "55 km/h (Storm Gale)",
      "Sea Temp": "29°C (Warm Sea)",
      "Storm Alert": "Cyclone Asna passing 48 NM away",
      "Harbor Mouth": "Dangerous crashing waves",
      "What To Do": "STAY IN HARBOR — DO NOT VENTURE"
    },
    sources: [
      { name: "INCOIS Sea State Buoys", id: "OSF-KL-892", time: "10 mins ago" },
      { name: "IMD Weather Radar", id: "DWR-KOC-04", time: "5 mins ago" },
      { name: "ISRO Oceansat-3 Satellite", id: "OCM3-ORBIT-4421", time: "42 mins ago" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 240,
        action: 'Checking trip safety for Kochi fishing boats',
        findings: 'Target: Kochi Coast. Time: Next 24 hours. Vessel: Small motorized & country boats.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 380,
        action: 'Checking ocean buoys for wave height',
        findings: 'Sea buoy reports 3.4 meter (11 feet) rough waves. High swell surge makes boat roll heavily.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 340,
        action: 'Checking storm radar and wind speed',
        findings: 'Strong gale winds blowing at 55 km/h. Rain clouds and squalls moving in from southwest.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 290,
        action: 'Checking harbor entrance water depth',
        findings: 'Waves are crashing hard at the Kochi harbor mouth. High danger of boat capsizing on return.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 410,
        action: 'Calculating total danger score',
        findings: 'Danger Score: 84 / 100 (HIGH RISK). High danger of capsizing and engine trouble.'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 310,
        action: 'Creating final fisherman advice',
        findings: 'Final Decision: RED ALERT. Tell fishermen to stay in harbor until sea calms down.'
      }
    ],
    explainability: {
      decisionSummary: "Do not go out because 11-foot waves and 55 km/h winds can easily flip small wooden and FRP fishing boats.",
      riskWeights: [
        { factor: "Dangerous High Waves (11 feet / 3.4m)", weight: 42, impact: "Very high risk of boat flipping over" },
        { factor: "Strong Storm Winds (55 km/h)", weight: 28, impact: "Boat will drift away, engine cannot fight" },
        { factor: "Thunderstorm Rain Clouds", weight: 18, impact: "Zero visibility and lightning strike risk" },
        { factor: "Harbor Mouth Crashing Waves", weight: 12, impact: "Dangerous to re-enter harbor safely" }
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
    targetZone: "Visakhapatnam Offshore",
    coordinates: [17.6868, 83.2185],
    riskLevel: "LOW",
    riskScore: 18,
    confidenceScore: 96,
    headline: "✅ SAFE TO FISH TODAY (GOOD CATCH ZONE)",
    recommendation: "Safe to go fishing today. Calm sea with small gentle waves under 3 feet (0.9m). Good fish catch zone (Tuna and Mackerel) located 26 km East of harbor.",
    conditionsSummary: {
      "Sea Waves": "Under 3 feet (0.9m) — Calm Sea",
      "Wind Speed": "Gentle breeze (18 km/h)",
      "Sea Temp": "27.4°C (Good Fish Water)",
      "Target Fish": "Tuna & Mackerel",
      "Distance": "26 km (14 NM) East of port",
      "What To Do": "SAFE TO GO — Great day to fish"
    },
    sources: [
      { name: "ISRO Oceansat-3 Fish Satellite", id: "OCM3-VZ-901", time: "25 mins ago" },
      { name: "INCOIS Fish Advisory Node", id: "PFZ-AP-09", time: "1 hr ago" },
      { name: "IMD Weather Radar", id: "DWR-VZG-01", time: "15 mins ago" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 210,
        action: 'Finding fish zone and checking safety',
        findings: 'Target: Vizag coast. Finding where fish are feeding and checking if sea is calm.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 360,
        action: 'Checking satellite picture for fish food (algae)',
        findings: 'Satellite shows large green fish food zone at 17.62°N, 83.45°E. Big schools of Tuna feeding here.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 310,
        action: 'Checking wind and rain forecast',
        findings: 'Weather is clear and calm. Gentle breeze at 18 km/h. No storms expected for 3 days.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 280,
        action: 'Checking navigation route from fishing harbor',
        findings: 'Fish zone is 26 km (14 NM) from harbor. Path is completely clear of big cargo ships.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 370,
        action: 'Checking safety score',
        findings: 'Risk is 18 / 100 (VERY SAFE). Great sea condition for small and large boats.'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 290,
        action: 'Writing simple fish advice',
        findings: 'Decision: Green light. Send GPS coordinates to boats with expected good fish catch.'
      }
    ],
    explainability: {
      decisionSummary: "Safe to fish because waves are gentle (under 3 feet) and satellite confirms large schools of fish feeding in this area.",
      riskWeights: [
        { factor: "Lots of Fish Food (Algae)", weight: 45, impact: "High chance of catching Tuna & Mackerel" },
        { factor: "Calm Waves (under 3 feet)", weight: 30, impact: "Safe for small country and fiberglass boats" },
        { factor: "Gentle Breeze (18 km/h)", weight: 15, impact: "Smooth ride, uses less boat diesel" },
        { factor: "Clear Ship Path", weight: 10, impact: "No big cargo ships in your fishing area" }
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
    targetZone: "Rameswaram / Gulf of Mannar",
    coordinates: [9.2876, 79.3129],
    riskLevel: "MEDIUM",
    riskScore: 56,
    confidenceScore: 89,
    headline: "⚠️ BE CAREFUL — NEAR SHORE ONLY",
    recommendation: "Stay close to shore. Choppy waves (2 meters / 6.5 feet) and gusty winds in the strait. Large boats can fish with caution, but small country boats should stay inside the bay. Do not cross the international border line.",
    conditionsSummary: {
      "Sea Waves": "6.5 feet (2.0m) — Choppy Sea",
      "Wind Speed": "Gusty wind (35 km/h)",
      "Sea Reefs": "Shallow rocks at low tide",
      "Border Alert": "Stay 4 km away from border line",
      "What To Do": "CAUTION — Fish near shore only"
    },
    sources: [
      { name: "INCOIS Tamil Nadu Coastal Node", id: "OSF-TN-412", time: "18 mins ago" },
      { name: "NavIC Sanctuary Border Map", id: "MNP-ZONE-02", time: "Live" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 230,
        action: 'Checking sea and border rules for Rameswaram',
        findings: 'Target: Gulf of Mannar and Palk Strait. Checking wind swell and border line.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 390,
        action: 'Checking shallow coral reefs and waves',
        findings: 'Waves are 2 meters high. Shallow coral rocks can damage boat propellers during low tide.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 330,
        action: 'Checking wind gusts through the strait',
        findings: 'Brisk wind funnelling through the strait at 35 km/h causing sudden rolling waves.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 350,
        action: 'Checking distance to International Border Line',
        findings: 'Caution: Some boats are getting close to the international border line.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 400,
        action: 'Calculating safety risk',
        findings: 'Risk Score: 56 / 100 (YELLOW CAUTION). Safe only for bigger boats near shore.'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 300,
        action: 'Preparing fisherman safety advice',
        findings: 'Advice: Caution. Keep small boats inside the bay and stay well clear of border line.'
      }
    ],
    explainability: {
      decisionSummary: "Be careful because gusty winds create choppy waves and you must stay away from shallow rocks and the border line.",
      riskWeights: [
        { factor: "Gusty Wind (35 km/h)", weight: 35, impact: "Choppy waves make small boats wobble heavily" },
        { factor: "Border Line Proximity", weight: 25, impact: "Risk of accidentally crossing border" },
        { factor: "Shallow Coral Rocks", weight: 25, impact: "Can hit bottom and break boat propeller" },
        { factor: "Water Currents", weight: 15, impact: "Strong drift near Pamban bridge" }
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
    targetZone: "Mangalore Sea Path",
    coordinates: [12.9141, 74.8560],
    riskLevel: "LOW",
    riskScore: 24,
    confidenceScore: 93,
    headline: "🧭 SAFER SEA ROUTE FOUND",
    recommendation: "Take the outer deep-water path to Mangalore. The direct straight path has breaking rough waves (over 9 feet). Moving slightly west into deeper water keeps waves down to 4 feet and saves fuel.",
    conditionsSummary: {
      "Straight Path": "Rough waves (9.5 feet / 2.9m)",
      "Safe Outer Path": "Calm waves (4.5 feet / 1.4m)",
      "Diesel Saved": "Saves about 18% fuel",
      "Arrival Time": "About 2 hours 45 minutes",
      "What To Do": "Follow the green deep-water path"
    },
    sources: [
      { name: "INCOIS Sea Route Map", id: "CRS-KA-11", time: "12 mins ago" },
      { name: "Mangalore Port Traffic", id: "VTS-NMPT-03", time: "Live" }
    ],
    agentSteps: [
      {
        agentId: 'planner',
        status: 'completed',
        durationMs: 220,
        action: 'Finding calm path back to Mangalore port',
        findings: 'Start: Sea near Malpe. Destination: Mangalore Harbor. Distance: 28 nautical miles.'
      },
      {
        agentId: 'ocean',
        status: 'completed',
        durationMs: 370,
        action: 'Checking where high waves are breaking',
        findings: 'The near-shore straight path has 9-foot crashing waves over shallow sand banks.'
      },
      {
        agentId: 'weather',
        status: 'completed',
        durationMs: 300,
        action: 'Checking wind and water current direction',
        findings: 'Wind is blowing from northwest. A helpful water current will push your boat south toward port.'
      },
      {
        agentId: 'geo',
        status: 'completed',
        durationMs: 310,
        action: 'Picking deep water path',
        findings: 'Steering into deeper water keeps boat away from rocky islands and shallow breakers.'
      },
      {
        agentId: 'risk',
        status: 'completed',
        durationMs: 380,
        action: 'Comparing danger of straight path vs outer path',
        findings: 'Straight path is HIGH DANGER (72/100). Outer path is LOW DANGER (24/100).'
      },
      {
        agentId: 'decision',
        status: 'completed',
        durationMs: 280,
        action: 'Sending simple steering instructions',
        findings: 'Route Ready: Steer slightly west into deep water to enjoy calm sea and save diesel.'
      }
    ],
    explainability: {
      decisionSummary: "The outer route is much safer because moving into deeper water avoids dangerous 9-foot crashing waves near the sand banks.",
      riskWeights: [
        { factor: "Wave Avoidance (9 ft down to 4 ft)", weight: 50, impact: "Prevents boat from violently rocking" },
        { factor: "Deep Water Bathymetry", weight: 25, impact: "Deep water stops waves from suddenly breaking" },
        { factor: "Helpful Sea Current", weight: 15, impact: "Pushes boat forward and saves 18% diesel" },
        { factor: "Clear Port Entrance", weight: 10, impact: "Smooth easy entry into Mangalore harbor" }
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
