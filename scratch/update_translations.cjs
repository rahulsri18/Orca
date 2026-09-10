const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/data/translations.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

// The new key-values per language
const newTranslations = {
  common: {
    en: {
      search: "Search",
      filter: "Filter",
      region: "Region",
      allCoasts: "All Coasts",
      depth: "Ocean Depth",
      surfaceTemp: "Surface Temp",
      bearing: "Bearing",
      distance: "Distance",
      save: "Save",
      done: "Done",
      enableAll: "Enable All",
      printPdf: "Print / Save PDF",
      viewPlan: "View Response Plan",
      alertLabel: "ALERT",
      sectors: "Sectors",
      noticesCount: "Notices",
      
      // PFZ
      pfzPageTitle: "Potential Fishing Zones (PFZ) Advisory",
      pfzPageSub: "Real-time ocean color & sea surface temperature front convergence. Maximizing catch per unit effort while maintaining vessel safety.",
      pfzSearchPlaceholder: "Search by zone name or target fish species (e.g., Tuna, Mackerel)...",
      satellitePassLabel: "Satellite Pass",
      plotWaypointsMap: "Plot Waypoints on Map",
      askOrcaPfz: "Ask ORCA Safety Analysis",

      // Alerts
      alertsPageTitle: "Marine Hazard & Safety Broadcast Center",
      alertsPageSub: "Multi-agency early warning feeds from IMD Cyclone Warning Centre, INCOIS Tsunami/Surge, and Coast Guard NavIC.",
      activeCoastalAlert: "Active Coastal Alert",
      testAudioBroadcast: "Test Audio Broadcast Horn",
      filterSeverity: "Filter Severity",
      allAlerts: "All Alerts",
      severeRed: "Severe Red",
      moderateCaution: "Moderate Caution",
      advisories: "Advisories",
      officialDirectives: "Official Marine Safety Directives",
      effectiveRange: "Effective Range",
      issuedBy: "Issued By",

      // Routes
      routesPageTitle: "ORCA Safe Route Navigation Engine",
      routesPageSub: "Dynamic vessel corridor optimization: Avoiding high breaking swells, submerged shoals, and restricted marine sanctuaries.",
      activeSector: "Active Sector",
      hazardousDirectCourse: "Hazardous Direct Course",
      straightCompassCourse: "Straight Compass Course",
      severeWarning: "Severe Warning",
      orcaSafeRoute: "ORCA NavIC Recommended Safe Route",
      deepWaterCorridor: "Deep Water Breaker Bypass Corridor",
      estTime: "Est. Time",
      maxWave: "Max Wave",
      fuelSavings: "Fuel Savings",
      courseSegments: "Course Segments",
      plotSafeCorridor: "Plot Safe Corridor on Map",

      // Analytics
      analyticsPageTitle: "Oceanographic & Weather Analytics",
      analyticsPageSub: "Multi-temporal sensor trends: Sea Surface Temperature anomalies, Chlorophyll-a bloom tracking, wave swells, and astronomical tides.",
      sstChartTitle: "Sea Surface Temperature (SST) & Thermal Anomaly",
      chlorophyllChartTitle: "Chlorophyll-a Bio-Optical Density (OCM-3)",
      waveWindForecastTitle: "Wave Swell & Wind Speed Forecast (48h)",
      tidePredictionTitle: "Astronomical Tide Predictions & Tidal Currents",
      historicalSummaryTitle: "Historical 12-Month Coastal Safety Index",
      unitCelsius: "Unit: °Celsius",
      unitMgM3: "Unit: mg/m³",

      // Satellite
      satellitePageTitle: "Earth Observation Satellite Products",
      satellitePageSub: "Calibrated spaceborne sensors: Oceansat-3 OCM bio-optics, INSAT-3DR thermal infrared, and synthetic aperture altimetry.",
      activeSensorTelemetry: "Active Sensor Telemetry",
      sensorDetails: "Sensor Parameters & Orbit Specs",
      spatialResolution: "Spatial Resolution",
      temporalRepeat: "Temporal Repeat Cycle",
      spectralBands: "Spectral Bands",
      dataQualityIndex: "Quality Index",
      inspectSatelliteMatrix: "Inspect Spatial GeoTIFF",

      // Profile
      profilePageTitle: "Vessel & User Profile Settings",
      profilePageSub: "Configure your maritime operational persona, vessel telemetry limits, and multilingual coastal alert preferences.",
      maritimePersona: "Maritime Operational Persona",
      personaExpl: "Switching your persona reorganizes dashboard tiles, alert priorities, and agent recommendations tailored to your maritime mission.",
      vesselSpecs: "Vessel & Transponder Specifications",
      navicAisId: "NavIC AIS Transponder ID",
      hullCategory: "Hull & Craft Category",
      engineCapacity: "Engine Propulsion Capacity",
      homePortLabel: "Registered Home Port & Anchorage",
      coastalLanguageHeading: "Coastal Language & Voice Interface",
      alertChannelsHeading: "Alert Dispatch & Telemetry Channels",
      emergencySmsLabel: "Emergency SMS Coastal Broadcast",
      emergencySmsDesc: "Receive red alert cyclone and swell warnings via regional cell towers even when offline",
      audioSirenLabel: "Audio Siren / Voice Readout",
      audioSirenDesc: "Play spoken audio synthesized warning in selected local dialect",
      saveVesselConfig: "Save Vessel Configuration",
      settingsSaved: "Settings updated and synced to vessel cache!",

      // Chat Sidebar
      autonomousAgentCollective: "Autonomous Agent Collective",
      connectedGroundStations: "Connected Ground Stations",

      // Map & GIS Layers
      marineGisLayers: "Marine GIS Layers",
      pfzHighCatch: "PFZ High Catch",
      cycloneConeAsna: "Cyclone Cone (ASNA)",
      roughSeaState: "Rough Sea State",
      safeCorridorLegend: "Safe Passage Corridor",
      aisFishingFleet: "AIS Fishing Fleet",

      // Daily Bulletin
      officialBulletinTitle: "Official Daily Coastal Marine Safety Bulletin",
      bulletinGovt: "Government of India • Ministry of Earth Sciences • ISRO SIH26176",
      bulletinIssuedFor: "Issued for",
      bulletinValid: "Valid for next 24 Hours",
      bulletinOverallRisk: "Overall Risk Level",
      bulletinSignificantWaves: "Significant Waves",
      bulletinSustainedWind: "Sustained Wind & Gale",
      bulletinAstronomicalTides: "Astronomical Tides",

      // Emergency SOS
      distressBeaconDispatchTab: "1. Distress Beacon Dispatch",
      survivalGuideTab: "2. Offline Sea Survival Guide",
      vhfChannelTab: "3. VHF Ch 16 & Coast Guard",
      distressAuditLogTab: "Distress Audit Log"
    },
    hi: {
      search: "खोजें",
      filter: "फ़िल्टर",
      region: "क्षेत्र",
      allCoasts: "सभी तट",
      depth: "समुद्र की गहराई",
      surfaceTemp: "सतह का तापमान",
      bearing: "दिशा",
      distance: "दूरी",
      save: "सुरक्षित करें",
      done: "पूर्ण",
      enableAll: "सभी सक्रिय करें",
      printPdf: "प्रिंट / पीडीएफ सुरक्षित करें",
      viewPlan: "प्रतिक्रिया योजना देखें",
      alertLabel: "चेतावनी",
      sectors: "तटीय क्षेत्र",
      noticesCount: "सूचनाएं",

      // PFZ
      pfzPageTitle: "संभावित मत्स्य क्षेत्र (PFZ) परामर्श",
      pfzPageSub: "समुद्री रंग और समुद्र तल के तापमान का वास्तविक समय मिलन। सुरक्षा बनाए रखते हुए मछली पकड़ने की दक्षता को अधिकतम करना।",
      pfzSearchPlaceholder: "क्षेत्र के नाम या मछली की प्रजाति से खोजें (जैसे टूना, बांगड़ा)...",
      satellitePassLabel: "उपग्रह कक्षा",
      plotWaypointsMap: "मानचित्र पर मार्ग बिंदु बनाएं",
      askOrcaPfz: "ओर्का से सुरक्षा विश्लेषण पूछें",

      // Alerts
      alertsPageTitle: "समुद्री खतरा और सुरक्षा प्रसारण केंद्र",
      alertsPageSub: "आईएमडी चक्रवात चेतावनी केंद्र, इनकोइस सुनामी/लहर केंद्र और तटरक्षक नाविक से संयुक्त पूर्व चेतावनी।",
      activeCoastalAlert: "सक्रिय तटीय चेतावनी",
      testAudioBroadcast: "ऑडियो चेतावनी हॉर्न का परीक्षण करें",
      filterSeverity: "गंभीरता के अनुसार फ़िल्टर",
      allAlerts: "सभी चेतावनियाँ",
      severeRed: "गंभीर रेड अलर्ट",
      moderateCaution: "मध्यम सावधानी",
      advisories: "सलाहकार सूचनाएँ",
      officialDirectives: "आधिकारिक समुद्री सुरक्षा निर्देश",
      effectiveRange: "प्रभावित दायरा",
      issuedBy: "जारीकर्ता",

      // Routes
      routesPageTitle: "ओर्का सुरक्षित मार्ग नेविगेशन इंजन",
      routesPageSub: "गतिशील नौका मार्ग अनुकूलन: खतरनाक ऊंची लहरों, जलमग्न चट्टानों और प्रतिबंधित समुद्री क्षेत्रों से बचाव।",
      activeSector: "सक्रिय समुद्री क्षेत्र",
      hazardousDirectCourse: "खतरनाक सीधा मार्ग",
      straightCompassCourse: "सीधा कम्पास मार्ग",
      severeWarning: "गंभीर चेतावनी",
      orcaSafeRoute: "ओर्का नाविक अनुशंसित सुरक्षित मार्ग",
      deepWaterCorridor: "गहरे पानी का सुरक्षित लहर बायपास कॉरिडोर",
      estTime: "अनुमानित समय",
      maxWave: "अधिकतम लहर",
      fuelSavings: "ईंधन बचत",
      courseSegments: "मार्ग के खंड",
      plotSafeCorridor: "मानचित्र पर सुरक्षित मार्ग बनाएं",

      // Analytics
      analyticsPageTitle: "समुद्र विज्ञान और मौसम विश्लेषण",
      analyticsPageSub: "विभिन्न उपग्रह डेटा: समुद्र तल का तापमान, क्लोरोफिल-ए फैलाव, ऊंची लहरें और खगोलीय ज्वार-भाटा।",
      sstChartTitle: "समुद्र तल का तापमान (SST) और तापीय विसंगति",
      chlorophyllChartTitle: "क्लोरोफिल-ए जैव-ऑप्टिकल घनत्व (OCM-3)",
      waveWindForecastTitle: "ऊंची लहरों और हवा की गति का पूर्वानुमान (48 घंटे)",
      tidePredictionTitle: "खगोलीय ज्वार-भाटा पूर्वानुमान और तटीय धाराएं",
      historicalSummaryTitle: "ऐतिहासिक 12 महीने का तटीय सुरक्षा सूचकांक",
      unitCelsius: "इकाई: °सेल्सियस",
      unitMgM3: "इकाई: mg/m³",

      // Satellite
      satellitePageTitle: "पृथ्वी अवलोकन उपग्रह डेटा उत्पाद",
      satellitePageSub: "अंतरिक्ष आधारित सेंसर: ओशनसैट-3 बायो-ऑप्टिक्स, इनसैट-3डीआर थर्मल इन्फ्रारेड और रडार अल्टीमेट्री।",
      activeSensorTelemetry: "सक्रिय सेंसर टेलीमेट्री",
      sensorDetails: "सेंसर मापदंड और कक्षा विवरण",
      spatialResolution: "स्थानिक रिज़ॉल्यूशन",
      temporalRepeat: "कक्षा पुनरावृत्ति चक्र",
      spectralBands: "स्पेक्ट्रल बैंड्स",
      dataQualityIndex: "गुणवत्ता सूचकांक",
      inspectSatelliteMatrix: "स्थानिक जियोटिफ़ जांचें",

      // Profile
      profilePageTitle: "नौका और उपयोगकर्ता प्रोफ़ाइल सेटिंग्स",
      profilePageSub: "अपनी परिचालन भूमिका, नौका विवरण और बहुभाषी तटीय चेतावनी प्राथमिकताएं कॉन्फ़िगर करें।",
      maritimePersona: "समुद्री परिचालन भूमिका",
      personaExpl: "भूमिका बदलने से डैशबोर्ड, चेतावनियाँ और एआई सलाह आपके मिशन के अनुसार अनुकूलित हो जाती हैं।",
      vesselSpecs: "नौका और ट्रांसपोंडर विवरण",
      navicAisId: "नाविक एआईएस ट्रांसपोंडर आईडी",
      hullCategory: "नाव की श्रेणी",
      engineCapacity: "इंजन क्षमता",
      homePortLabel: "पंजीकृत गृह बंदरगाह और लंगरगाह",
      coastalLanguageHeading: "तटीय भाषा और आवाज़ इंटरफ़ेस",
      alertChannelsHeading: "चेतावनी प्रेषण और टेलीमेट्री चैनल",
      emergencySmsLabel: "आपातकालीन एसएमएस तटीय प्रसारण",
      emergencySmsDesc: "ऑफ़लाइन होने पर भी मोबाइल टावरों के माध्यम से चक्रवात और ऊंची लहरों की चेतावनी प्राप्त करें",
      audioSirenLabel: "ऑडियो सायरन / आवाज़ में चेतावनी",
      audioSirenDesc: "चुनी गई स्थानीय भाषा में बोलकर चेतावनी सुनें",
      saveVesselConfig: "नौका विवरण सुरक्षित करें",
      settingsSaved: "सेटिंग्स अपडेट हो गईं और सुरक्षित हो गईं!",

      // Chat Sidebar
      autonomousAgentCollective: "स्वायत्त एआई एजेंट समूह",
      connectedGroundStations: "संबद्ध भू-केंद्र",

      // Map & GIS Layers
      marineGisLayers: "समुद्री जीआईएस परतें",
      pfzHighCatch: "उच्च मत्स्य क्षेत्र (PFZ)",
      cycloneConeAsna: "चक्रवात शंकु (आसना)",
      roughSeaState: "खतरनाक समुद्र स्थिति",
      safeCorridorLegend: "सुरक्षित नौकायन गलियारा",
      aisFishingFleet: "मछुआरा नौका बेड़ा",

      // Daily Bulletin
      officialBulletinTitle: "आधिकारिक दैनिक तटीय समुद्री सुरक्षा बुलेटिन",
      bulletinGovt: "भारत सरकार • पृथ्वी विज्ञान मंत्रालय • इसरो SIH26176",
      bulletinIssuedFor: "के लिए जारी",
      bulletinValid: "अगले 24 घंटों के लिए मान्य",
      bulletinOverallRisk: "समग्र जोखिम स्तर",
      bulletinSignificantWaves: "महत्वपूर्ण लहरें",
      bulletinSustainedWind: "निरंतर हवा और आंधी",
      bulletinAstronomicalTides: "खगोलीय ज्वार-भाटा",

      // Emergency SOS
      distressBeaconDispatchTab: "1. संकट बीकन प्रेषण",
      survivalGuideTab: "2. ऑफ़लाइन समुद्री जीवन रक्षा गाइड",
      vhfChannelTab: "3. वीएचएफ चैनल 16 व तटरक्षक",
      distressAuditLogTab: "संकट प्रसारण लॉग"
    },
    ta: {
      search: "தேடுக",
      filter: "வடிகட்டி",
      region: "பகுதி",
      allCoasts: "அனைத்து கடற்கரைகள்",
      depth: "கடல் ஆழம்",
      surfaceTemp: "மேற்பரப்பு வெப்பநிலை",
      bearing: "திசை",
      distance: "தூரம்",
      save: "சேமிக்க",
      done: "முடிந்தது",
      enableAll: "அனைத்தையும் இயக்கு",
      printPdf: "அச்சிடுக / பிடிஎஃப் சேமி",
      viewPlan: "நடவடிக்கை திட்டம் பார்க்க",
      alertLabel: "எச்சரிக்கை",
      sectors: "கடலோரப் பகுதிகள்",
      noticesCount: "அறிவிப்புகள்",

      // PFZ
      pfzPageTitle: "சாத்தியமான மீன்பிடி மண்டலங்கள் (PFZ) ஆலோசனை",
      pfzPageSub: "கடல் நிறம் மற்றும் வெப்பநிலை மாற்றங்களின் நேரலை தரவு. படகு பாதுகாப்பை உறுதிசெய்து மீன்பிடி அளவை அதிகரித்தல்.",
      pfzSearchPlaceholder: "மண்டல பெயர் அல்லது மீன் வகை மூலம் தேடுக (எ.கா. சூரை, கானாங்கெளுத்தி)...",
      satellitePassLabel: "செயற்கைக்கோள் தகவல்",
      plotWaypointsMap: "வரைபடத்தில் வழியைக் காட்டு",
      askOrcaPfz: "ஓர்கா பாதுகாப்பு பகுப்பாய்வு கேட்க",

      // Alerts
      alertsPageTitle: "கடல்சார் ஆபத்து மற்றும் பாதுகாப்பு ஒளிபரப்பு மையம்",
      alertsPageSub: "வானிலை மையம், இன்கோயிஸ் மற்றும் கடலோரக் காவல் படையின் ஒருங்கிணைந்த முன்னெச்சரிக்கை தகவல்கள்.",
      activeCoastalAlert: "செயலில் உள்ள கடலோர எச்சரிக்கை",
      testAudioBroadcast: "ஒலி எச்சரிக்கை சைரன் சோதனை",
      filterSeverity: "தீவிர வடிகட்டி",
      allAlerts: "அனைத்து எச்சரிக்கைகள்",
      severeRed: "அதிதீவிர சிவப்பு",
      moderateCaution: "மிதமான எச்சரிக்கை",
      advisories: "வழிகாட்டுதல்கள்",
      officialDirectives: "அதிகாரப்பூர்வ கடல்சார் பாதுகாப்பு வழிகாட்டுதல்",
      effectiveRange: "பாதிக்கப்படும் பகுதி",
      issuedBy: "வெளியிட்டவர்",

      // Routes
      routesPageTitle: "ஓர்கா பாதுகாப்பான கடல் வழித்தடக் கருவி",
      routesPageSub: "படகுகளுக்கான பாதுகாப்பான வழித்தடத் திட்டம்: ஆபத்தான அலைகள் மற்றும் தடைசெய்யப்பட்ட பகுதிகளைத் தவிர்த்தல்.",
      activeSector: "செயலில் உள்ள பகுதி",
      hazardousDirectCourse: "ஆபத்தான நேரடிப் பாதை",
      straightCompassCourse: "நேரடி திசைகாட்டி வழி",
      severeWarning: "அதிதீவிர எச்சரிக்கை",
      orcaSafeRoute: "ஓர்கா நாவிக் பரிந்துரைத்த பாதுகாப்பான வழி",
      deepWaterCorridor: "ஆழமான நீர் வழித்தடம்",
      estTime: "மதிப்பிடப்பட்ட நேரம்",
      maxWave: "அதிகபட்ச அலை",
      fuelSavings: "எரிபொருள் சேமிப்பு",
      courseSegments: "பாதை பிரிவுகள்",
      plotSafeCorridor: "வரைபடத்தில் பாதுகாப்பான பாதையைக் காட்டு",

      // Analytics
      analyticsPageTitle: "கடல்சார் மற்றும் வானிலை பகுப்பாய்வு",
      analyticsPageSub: "கடல் வெப்பநிலை, குளோரோபில் வளர்ச்சி, அலைகள் மற்றும் அலை ஏற்ற இறக்கங்களின் காலவரிசைப் பகுப்பாய்வு.",
      sstChartTitle: "கடல் மேற்பரப்பு வெப்பநிலை & மாற்றங்கள்",
      chlorophyllChartTitle: "குளோரோபில் அடர்த்தி (OCM-3)",
      waveWindForecastTitle: "அலை உயரம் & காற்றின் வேகம் முன்கணிப்பு (48 மணிநேரம்)",
      tidePredictionTitle: "அலை ஏற்ற இறக்க முன்கணிப்பு & நீரோட்டங்கள்",
      historicalSummaryTitle: "கடந்த 12 மாத கடலோர பாதுகாப்பு குறியீடு",
      unitCelsius: "அலகு: °செ",
      unitMgM3: "அலகு: mg/m³",

      // Satellite
      satellitePageTitle: "பூமி கண்காணிப்பு செயற்கைக்கோள் தரவுகள்",
      satellitePageSub: "விண்வெளி உணர்விகள்: ஓசன்சாட்-3, இன்சாட்-3டிஆர் மற்றும் ரேடார் கண்காணிப்பு அமைப்புகள்.",
      activeSensorTelemetry: "செயலில் உள்ள உணர்வி தரவு",
      sensorDetails: "சென்சார் மற்றும் சுற்றுப்பாதை விவரங்கள்",
      spatialResolution: "தெளிவுத்திறன்",
      temporalRepeat: "மறுசுழற்சி காலம்",
      spectralBands: "ஸ்பெக்ட்ரல் பட்டைகள்",
      dataQualityIndex: "தரக் குறியீடு",
      inspectSatelliteMatrix: "வரைபடத் தகவலை ஆய்வு செய்க",

      // Profile
      profilePageTitle: "படகு & பயனர் சுயவிவர அமைப்புகள்",
      profilePageSub: "உங்கள் பணிப் பங்கு, படகு விவரங்கள் மற்றும் மொழி விருப்பங்களை அமைக்கவும்.",
      maritimePersona: "கடல்சார் செயல்பாட்டுப் பங்கு",
      personaExpl: "பங்கை மாற்றுவது உங்கள் தேவைக்கு ஏற்ப முகப்பு, எச்சரிக்கைகள் மற்றும் ஆலோசனைகளை மாற்றியமைக்கும்.",
      vesselSpecs: "படகு மற்றும் டிரான்ஸ்பாண்டர் விவரங்கள்",
      navicAisId: "நாவிக் ஏஐஎஸ் டிரான்ஸ்பாண்டர் ஐடி",
      hullCategory: "படகு வகை",
      engineCapacity: "என்ஜின் திறன்",
      homePortLabel: "பதிவு செய்யப்பட்ட துறைமுகம்",
      coastalLanguageHeading: "கடலோர மொழி மற்றும் குரல் இடைமுகம்",
      alertChannelsHeading: "எச்சரிக்கை மற்றும் தொலைத்தொடர்பு வழிகள்",
      emergencySmsLabel: "அவசர எஸ்எம்எஸ் எச்சரிக்கை",
      emergencySmsDesc: "இணையம் இல்லாதபோதும் செல் டவர்கள் மூலம் புயல் மற்றும் அலை எச்சரிக்கைகளைப் பெறுங்கள்",
      audioSirenLabel: "ஒலி எச்சரிக்கை / குரல் அறிவிப்பு",
      audioSirenDesc: "தேர்ந்தெடுக்கப்பட்ட உள்ளூர் மொழியில் குரல் எச்சரிக்கையைக் கேட்கவும்",
      saveVesselConfig: "படகு அமைப்புகளைச் சேமிக்கவும்",
      settingsSaved: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!",

      // Chat Sidebar
      autonomousAgentCollective: "தன்னாட்சி ஏஐ ஏஜெண்டுகள்",
      connectedGroundStations: "இணைக்கப்பட்ட பூமி நிலையங்கள்",

      // Map & GIS Layers
      marineGisLayers: "கடல்சார் ஜிஐஎஸ் அடுக்குகள்",
      pfzHighCatch: "அதிக மீன்வளம்",
      cycloneConeAsna: "புயல் அபாயப் பகுதி (அஸ்னா)",
      roughSeaState: "சீற்றமான கடல் நிலை",
      safeCorridorLegend: "பாதுகாப்பான வழித்தடம்",
      aisFishingFleet: "மீன்பிடி படகுகள்",

      // Daily Bulletin
      officialBulletinTitle: "அதிகாரப்பூர்வ தினசரி கடலோர பாதுகாப்பு அறிக்கை",
      bulletinGovt: "இந்திய அரசு • புவி அறிவியல் அமைச்சகம் • இஸ்ரோ SIH26176",
      bulletinIssuedFor: "வழங்கப்பட்ட இடம்",
      bulletinValid: "அடுத்த 24 மணி நேரத்திற்கு செல்லுபடியாகும்",
      bulletinOverallRisk: "ஒட்டுமொத்த ஆபத்து நிலை",
      bulletinSignificantWaves: "அலை உயரம்",
      bulletinSustainedWind: "தொடர் காற்று & சூறாவளி",
      bulletinAstronomicalTides: "அலை ஏற்ற இறக்கங்கள்",

      // Emergency SOS
      distressBeaconDispatchTab: "1. அவசர சிக்னல் அனுப்புதல்",
      survivalGuideTab: "2. ஆஃப்லைன் உயிர் பிழைப்பு கையேடு",
      vhfChannelTab: "3. விஎச்எஃப் 16 & கடலோர காவல் படை",
      distressAuditLogTab: "அவசரப் பதிவு விவரங்கள்"
    },
    te: {
      search: "శోధించండి",
      filter: "ఫిల్టర్",
      region: "ప్రాంతం",
      allCoasts: "అన్ని తీరాలు",
      depth: "సముద్ర లోతు",
      surfaceTemp: "ఉపరితల ఉష్ణోగ్రత",
      bearing: "దిశ",
      distance: "దూరం",
      save: "సేవ్ చేయండి",
      done: "పూర్తయింది",
      enableAll: "అన్నీ ప్రారంభించండి",
      printPdf: "ప్రింట్ / PDF సేవ్ చేయండి",
      viewPlan: "ప్రతిస్పందన ప్రణాళిక చూడండి",
      alertLabel: "హెచ్చరిక",
      sectors: "తీర ప్రాంతాలు",
      noticesCount: "ప్రకటనలు",

      // PFZ
      pfzPageTitle: "సంభావ్య చేపల వేట మండలాలు (PFZ) సలహా",
      pfzPageSub: "సముద్ర రంగు మరియు ఉష్ణోగ్రతల ప్రత్యక్ష విశ్లేషణ. పడవ భద్రతతో పాటు చేపల వేట దిగుబడిని పెంచడం.",
      pfzSearchPlaceholder: "ప్రాంతం పేరు లేదా చేప రకం ద్వారా శోధించండి (ఉదా. ట్యూనా, వంజరం)...",
      satellitePassLabel: "ఉపగ్రహ సమాచారం",
      plotWaypointsMap: "మ్యాప్‌లో పాయింట్లు గుర్తించండి",
      askOrcaPfz: "ఓర్కా భద్రతా విశ్లేషణను అడగండి",

      // Alerts
      alertsPageTitle: "సముద్ర ప్రమాదాలు & భద్రతా ప్రసార కేంద్రం",
      alertsPageSub: "వాతావరణ కేంద్రం, ఇన్‌కోయిస్ మరియు కోస్ట్‌గార్డ్ నావిక్ నుండి ముందస్తు హెచ్చరికలు.",
      activeCoastalAlert: "సక్రియ తీరప్రాంత హెచ్చరిక",
      testAudioBroadcast: "ఆడియో హెచ్చరిక సైరన్ పరీక్షించండి",
      filterSeverity: "తీవ్రత ఫిల్టర్",
      allAlerts: "అన్ని హెచ్చరికలు",
      severeRed: "తీవ్రమైన రెడ్ అలర్ట్",
      moderateCaution: "మితమైన జాగ్రత్త",
      advisories: "సూచనలు",
      officialDirectives: "అధికారిక సముద్ర భద్రతా మార్గదర్శకాలు",
      effectiveRange: "ప్రభావిత పరిధి",
      issuedBy: "జారీ చేసినవారు",

      // Routes
      routesPageTitle: "ఓర్కా సురక్షిత ప్రయాణ మార్గ ఇంజిన్",
      routesPageSub: "పడవల సురక్షిత ప్రయాణ మార్గం: ప్రమాదకర అలలు మరియు నిషేధిత ప్రాంతాలను తప్పించడం.",
      activeSector: "ప్రస్తుత ప్రాంతం",
      hazardousDirectCourse: "ప్రమాదకర ప్రత్యక్ష మార్గం",
      straightCompassCourse: "నేరుగా ప్రయాణించే మార్గం",
      severeWarning: "తీవ్రమైన హెచ్చరిక",
      orcaSafeRoute: "ఓర్కా నావిక్ సూచించిన సురక్షిత మార్గం",
      deepWaterCorridor: "లోతైన నీటి సురక్షిత మార్గం",
      estTime: "అంచనా సమయం",
      maxWave: "గరిష్ట అలల ఎత్తు",
      fuelSavings: "ఇంధన ఆదా",
      courseSegments: "మార్గ విభాగాలు",
      plotSafeCorridor: "మ్యాప్‌లో సురక్షిత మార్గం గుర్తించండి",

      // Analytics
      analyticsPageTitle: "సముద్ర మరియు వాతావరణ విశ్లేషణ",
      analyticsPageSub: "సముద్ర ఉష్ణోగ్రత మార్పులు, క్లోరోఫిల్ పెరుగుదల, అలల ఎత్తు మరియు ఆటుపోట్ల కాలక్రమ విశ్లేషణ.",
      sstChartTitle: "సముద్ర ఉపరితల ఉష్ణోగ్రత & విశ్లేషణ",
      chlorophyllChartTitle: "క్లోరోఫిల్ జీవ సాంద్రత (OCM-3)",
      waveWindForecastTitle: "అలల ఎత్తు & గాలి వేగం అంచనా (48 గంటలు)",
      tidePredictionTitle: "ఖగోళ ఆటుపోట్ల అంచనాలు & సముద్ర ప్రవాహాలు",
      historicalSummaryTitle: "గత 12 నెలల తీరప్రాంత భద్రతా సూచిక",
      unitCelsius: "యూనిట్: °సెల్సియస్",
      unitMgM3: "యూనిట్: mg/m³",

      // Satellite
      satellitePageTitle: "భూ పరిశీలన ఉపగ్రహ ఉత్పత్తులు",
      satellitePageSub: "అంతరిక్ష సెన్సార్లు: ఓషన్‌శాట్-3, ఇన్‌శాట్-3DR మరియు సింథటిక్ రాడార్ డేటా.",
      activeSensorTelemetry: "ప్రస్తుత సెన్సార్ సమాచారం",
      sensorDetails: "సెన్సార్ పారామితులు & ఆర్బిట్ వివరాలు",
      spatialResolution: "స్పేషియల్ రిజల్యూషన్",
      temporalRepeat: "పునరావృత చక్రం",
      spectralBands: "స్పెక్ట్రల్ బ్యాండ్‌లు",
      dataQualityIndex: "నాణ్యత సూచిక",
      inspectSatelliteMatrix: "మ్యాప్ డేటాను పరిశీలించండి",

      // Profile
      profilePageTitle: "పడవ మరియు ప్రొఫైల్ సెట్టింగ్‌లు",
      profilePageSub: "మీ నిర్వహణ పాత్ర, పడవ వివరాలు మరియు భాషా ప్రాధాన్యతలను ఎంచుకోండి.",
      maritimePersona: "సముద్ర నిర్వహణ పాత్ర",
      personaExpl: "పాత్రను మార్చడం ద్వారా డాష్‌బోర్డ్, హెచ్చరికలు మరియు సలహాలు మీ అవసరాలకు అనుగుణంగా మారతాయి.",
      vesselSpecs: "పడవ మరియు ట్రాన్స్‌పాండర్ వివరాలు",
      navicAisId: "నావిక్ AIS ట్రాన్స్‌పాండర్ ID",
      hullCategory: "పడవ వర్గం",
      engineCapacity: "ఇంజిన్ సామర్థ్యం",
      homePortLabel: "నమోదిత హోమ్ పోర్ట్",
      coastalLanguageHeading: "తీరప్రాంత భాష & వాయిస్ ఇంటర్‌ఫేస్",
      alertChannelsHeading: "హెచ్చరికలు మరియు సమాచార ఛానెల్స్",
      emergencySmsLabel: "అత్యవసర SMS హెచ్చరిక",
      emergencySmsDesc: "ఆఫ్‌లైన్‌లో ఉన్నప్పటికీ టవర్ల ద్వారా తుఫాను మరియు అలల హెచ్చరికలను పొందండి",
      audioSirenLabel: "ఆడియో సైరన్ / వాయిస్ హెచ్చరిక",
      audioSirenDesc: "ఎంచుకున్న స్థానిక భాషలో శ్రవణ హెచ్చరికను వినండి",
      saveVesselConfig: "పడవ సెట్టింగ్‌లను సేవ్ చేయండి",
      settingsSaved: "సెట్టింగ్‌లు విజయవంతంగా భద్రపరచబడ్డాయి!",

      // Chat Sidebar
      autonomousAgentCollective: "స్వయంప్రతిపత్తి గల ఏఐ ఏజెంట్లు",
      connectedGroundStations: "కనెక్ట్ చేయబడిన భూకేంద్రాలు",

      // Map & GIS Layers
      marineGisLayers: "సముద్ర GIS లేయర్లు",
      pfzHighCatch: "అధిక చేపల వేట ప్రాంతం",
      cycloneConeAsna: "తుఫాను ప్రమాద జోన్ (అస్నా)",
      roughSeaState: "తీవ్ర సముద్ర అలజడి",
      safeCorridorLegend: "సురక్షిత ప్రయాణ కారిడార్",
      aisFishingFleet: "చేపల వేట పడవలు",

      // Daily Bulletin
      officialBulletinTitle: "అధికారిక రోజువారీ తీరప్రాంత భద్రతా బులెటిన్",
      bulletinGovt: "భారత ప్రభుత్వం • భూ శాస్త్రాల మంత్రిత్వ శాఖ • ఇస్రో SIH26176",
      bulletinIssuedFor: "జారీ చేయబడిన ప్రాంతం",
      bulletinValid: "తదుపరి 24 గంటలకు చెల్లుబాటు",
      bulletinOverallRisk: "మొత్తం ప్రమాద స్థాయి",
      bulletinSignificantWaves: "అలల ఎత్తు",
      bulletinSustainedWind: "నిరంతర గాలి & తుఫాను",
      bulletinAstronomicalTides: "ఖగోళ ఆటుపోట్లు",

      // Emergency SOS
      distressBeaconDispatchTab: "1. అత్యవసర బీకాన్ పంపడం",
      survivalGuideTab: "2. ఆఫ్‌లైన్ సర్వైవల్ గైడ్",
      vhfChannelTab: "3. VHF ఛానెల్ 16 & కోస్ట్‌గార్డ్",
      distressAuditLogTab: "డిస్ట్రెస్ లాగ్ రికార్డు"
    },
    bn: {
      search: "অনুসন্ধান করুন",
      filter: "ফিল্টার",
      region: "অঞ্চল",
      allCoasts: "সকল উপকূল",
      depth: "সমুদ্রের গভীরতা",
      surfaceTemp: "পৃষ্ঠের তাপমাত্রা",
      bearing: "দিক",
      distance: "দূরত্ব",
      save: "সংরক্ষণ করুন",
      done: "সম্পন্ন",
      enableAll: "সব সক্রিয় করুন",
      printPdf: "প্রিন্ট / পিডিএফ সংরক্ষণ",
      viewPlan: "কর্মপরিকল্পনা দেখুন",
      alertLabel: "সতর্কবার্তা",
      sectors: "উপকূলীয় সেক্টর",
      noticesCount: "বিজ্ঞপ্তি",

      // PFZ
      pfzPageTitle: "সম্ভাব্য মৎস্য অঞ্চল (PFZ) পরামর্শ",
      pfzPageSub: "রিয়েল-টাইম সমুদ্রের রঙ এবং সমুদ্রপৃষ্ঠের তাপমাত্রার সংযোগ। নৌকার সুরক্ষা বজায় রেখে মাছ ধরার উৎপাদন সর্বাধিক করা।",
      pfzSearchPlaceholder: "অঞ্চলের নাম বা মাছের প্রজাতি দিয়ে খুঁজুন (যেমন টুনা, ইলিশ, ম্যাকেরেল)...",
      satellitePassLabel: "স্যাটেলাইট পাস",
      plotWaypointsMap: "মানচিত্রে পথবিন্দু চিহ্নিত করুন",
      askOrcaPfz: "ওর্কা সুরক্ষা বিশ্লেষণ জানুন",

      // Alerts
      alertsPageTitle: "সামুদ্রিক বিপদ ও সুরক্ষা সম্প্রচার কেন্দ্র",
      alertsPageSub: "আবহাওয়া দপ্তর, ইনকোইস এবং উপকূলরক্ষী বাহিনীর সমন্বিত আগাম সতর্কতা।",
      activeCoastalAlert: "সক্রিয় উপকূলীয় সতর্কতা",
      testAudioBroadcast: "অডিও সতর্কতা সাইরেন পরীক্ষা করুন",
      filterSeverity: "তীব্রতা অনুসারে ফিল্টার",
      allAlerts: "সকল সতর্কতা",
      severeRed: "মারাত্মক রেড অ্যালার্ট",
      moderateCaution: "মাঝারি সতর্কতা",
      advisories: "পরামর্শসমূহ",
      officialDirectives: "অফিসিয়াল সামুদ্রিক সুরক্ষা নির্দেশিকা",
      effectiveRange: "কার্যকর এলাকা",
      issuedBy: "প্রদানকারী",

      // Routes
      routesPageTitle: "ওর্কা নিরাপদ নৌ-রুট নেভিগেশন ইঞ্জিন",
      routesPageSub: "জাহাজের নিরাপদ রুট অপ্টিমাইজেশন: উত্তাল ঢেউ, ডুবো পাহাড় এবং সুরক্ষিত এলাকা এড়িয়ে চলা।",
      activeSector: "সক্রিয় সেক্টর",
      hazardousDirectCourse: "বিপজ্জনক সরাসরি পথ",
      straightCompassCourse: "সরাসরি কম্পাস কোর্স",
      severeWarning: "মারাত্মক সতর্কতা",
      orcaSafeRoute: "ওর্কা নাভিক প্রস্তাবিত নিরাপদ রুট",
      deepWaterCorridor: "গভীর জলের নিরাপদ করিডোর",
      estTime: "আনুমানিক সময়",
      maxWave: "সর্বোচ্চ ঢেউ",
      fuelSavings: "জ্বালানী সাশ্রয়",
      courseSegments: "পথের অংশসমূহ",
      plotSafeCorridor: "মানচিত্রে নিরাপদ পথ আঁকুন",

      // Analytics
      analyticsPageTitle: "সমুদ্রবিজ্ঞান ও আবহাওয়া বিশ্লেষণ",
      analyticsPageSub: "সমুদ্রপৃষ্ঠের তাপমাত্রা, ক্লোরোফিল ঘনত্ব, ঢেউয়ের উচ্চতা এবং জোয়ার-ভাটার সময়ভিত্তিক বিশ্লেষণ।",
      sstChartTitle: "সমুদ্রপৃষ্ঠের তাপমাত্রা এবং তাপীয় পরিবর্তন",
      chlorophyllChartTitle: "ক্লোরোফিল ঘনত্ব (OCM-3)",
      waveWindForecastTitle: "ঢেউয়ের উচ্চতা ও বাতাসের গতির পূর্বাভাস (৪৮ ঘণ্টা)",
      tidePredictionTitle: "জোয়ার-ভাটার পূর্বাভাস এবং স্রোতের গতি",
      historicalSummaryTitle: "ঐতিহাসিক ১২ মাসের উপকূলীয় সুরক্ষা সূচক",
      unitCelsius: "একক: °সেলসিয়াস",
      unitMgM3: "একক: mg/m³",

      // Satellite
      satellitePageTitle: "পৃথিবী পর্যবেক্ষণ উপগ্রহ ডেটা",
      satellitePageSub: "মহাকাশ সেন্সর: ওশানস্যাট-৩, ইনস্যাট-৩ডিআর এবং সিন্থেটিক অ্যাপারচার আলটিমেট্রি।",
      activeSensorTelemetry: "সক্রিয় সেন্সর টেলিমেট্রি",
      sensorDetails: "সেন্সর প্যারামিটার ও কক্ষপথ বিবরণ",
      spatialResolution: "রেজোলিউশন",
      temporalRepeat: "কক্ষপথ পুনরাবৃত্তি চক্র",
      spectralBands: "স্পেকট্রাল ব্যান্ড",
      dataQualityIndex: "গুণমান সূচক",
      inspectSatelliteMatrix: "জিওটিআইএফএফ পরীক্ষা করুন",

      // Profile
      profilePageTitle: "নৌকা এবং ব্যবহারকারী প্রোফাইল সেটিংস",
      profilePageSub: "আপনার কার্যক্রমের ভূমিকা, নৌকার বিবরণ এবং ভাষার পছন্দ কনফিগার করুন।",
      maritimePersona: "সামুদ্রিক কার্যক্রমের ভূমিকা",
      personaExpl: "ভূমিকা পরিবর্তন করলে ড্যাশবোর্ড, সতর্কতা এবং এআই পরামর্শ আপনার কাজের সুবিধার্থে পুনর্বিন্যস্ত হয়।",
      vesselSpecs: "নৌকা ও ট্রান্সপন্ডার বিবরণ",
      navicAisId: "নাভিক এআইএস ট্রান্সপন্ডার আইডি",
      hullCategory: "নৌকার ধরন",
      engineCapacity: "ইঞ্জিন ক্ষমতা",
      homePortLabel: "নিবন্ধিত হোম পোর্ট ও নোঙরখানা",
      coastalLanguageHeading: "উপকূলীয় ভাষা ও ভয়েস ইন্টারফেস",
      alertChannelsHeading: "সতর্কতা প্রেরণ ও টেলিমেট্রি চ্যানেল",
      emergencySmsLabel: "জরুরি এসএমএস সম্প্রচার",
      emergencySmsDesc: "অফলাইনে থাকলেও মোবাইল টাওয়ারের মাধ্যমে ঘূর্ণিঝড় ও ঢেউয়ের সতর্কতা পান",
      audioSirenLabel: "অডিও সাইরেন / ভয়েস বার্তা",
      audioSirenDesc: "নির্বাচিত স্থানীয় ভাষায় ভয়েস সতর্কতা শুনুন",
      saveVesselConfig: "নৌকার কনফিগারেশন সংরক্ষণ করুন",
      settingsSaved: "সেটিংস আপডেট এবং সংরক্ষণ করা হয়েছে!",

      // Chat Sidebar
      autonomousAgentCollective: "স্বায়ত্তশাসিত এআই এজেন্ট দল",
      connectedGroundStations: "সংযুক্ত গ্রাউন্ড স্টেশন",

      // Map & GIS Layers
      marineGisLayers: "সামুদ্রিক জিআইএস স্তরসমূহ",
      pfzHighCatch: "উচ্চ মৎস্য অঞ্চল",
      cycloneConeAsna: "ঘূর্ণিঝড় শঙ্কু (আসনা)",
      roughSeaState: "উত্তাল সমুদ্রের অবস্থা",
      safeCorridorLegend: "নিরাপদ চলাচলের পথ",
      aisFishingFleet: "মাছ ধরার নৌবহর",

      // Daily Bulletin
      officialBulletinTitle: "অফিসিয়াল দৈনিক উপকূলীয় সামুদ্রিক সুরক্ষা বুলেটিন",
      bulletinGovt: "ভারত সরকার • ভূ-বিজ্ঞান মন্ত্রক • ইসরো SIH26176",
      bulletinIssuedFor: "প্রদত্ত এলাকা",
      bulletinValid: "পরবর্তী ২৪ ঘণ্টার জন্য বৈধ",
      bulletinOverallRisk: "সামগ্রিক ঝুঁকির মাত্রা",
      bulletinSignificantWaves: "ঢেউয়ের উচ্চতা",
      bulletinSustainedWind: "স্থায়ী বাতাস ও ঝড়ো হাওয়া",
      bulletinAstronomicalTides: "জোয়ার-ভাটা",

      // Emergency SOS
      distressBeaconDispatchTab: "১. বিপদ সংকেত প্রেরণ",
      survivalGuideTab: "২. অফলাইন বেঁচে থাকার গাইড",
      vhfChannelTab: "৩. ভিএইচএফ ১৬ ও কোস্টগার্ড",
      distressAuditLogTab: "বিপদ অডিট লগ"
    },
    ml: {
      search: "തിരയുക",
      filter: "ഫിൽട്ടർ",
      region: "മേഖല",
      allCoasts: "എല്ലാ തീരങ്ങളും",
      depth: "കടലിന്റെ ആഴം",
      surfaceTemp: "ഉപരിതല താപനില",
      bearing: "ദിശ",
      distance: "ദൂരം",
      save: "സേവ് ചെയ്യുക",
      done: "പൂർത്തിയായി",
      enableAll: "എല്ലാം പ്രവർത്തനക്ഷമമാക്കുക",
      printPdf: "പ്രിന്റ് / പിഡിഎഫ് സേവ് ചെയ്യുക",
      viewPlan: "പ്രതികരണ പദ്ധതി കാണുക",
      alertLabel: "മുന്നറിയിപ്പ്",
      sectors: "തീരദേശ മേഖലകൾ",
      noticesCount: "അറിയിപ്പുകൾ",

      // PFZ
      pfzPageTitle: "സാധ്യതാ മത്സ്യബന്ധന മേഖലകൾ (PFZ) നിർദ്ദേശം",
      pfzPageSub: "തത്സമയ സമുദ്ര വർണ്ണവും ഉപരിതല താപനിലയും. ബോട്ടിന്റെ സുരക്ഷ നിലനിർത്തിക്കൊണ്ട് പരമാവധി മത്സ്യലഭ്യത ഉറപ്പാക്കുന്നു.",
      pfzSearchPlaceholder: "മേഖലയുടെ പേരോ മത്സ്യ ഇനമോ നൽകി തിരയുക (ഉദാ: ചൂര, അയല)...",
      satellitePassLabel: "ഉപഗ്രഹ നിരീക്ഷണം",
      plotWaypointsMap: "ഭൂപടത്തിൽ വഴിയടയാളങ്ങൾ രേഖപ്പെടുത്തുക",
      askOrcaPfz: "ഓർക്കയോട് സുരക്ഷാ വിശകലനം ചോദിക്കുക",

      // Alerts
      alertsPageTitle: "സമുദ്ര അപകട സുരക്ഷാ പ്രക്ഷേപണ കേന്ദ്രം",
      alertsPageSub: "കാലാവസ്ഥാ നിരീക്ഷണ കേന്ദ്രം, ഇൻകോയിസ്, കോസ്റ്റ് ഗാർഡ് എന്നിവയിൽ നിന്നുള്ള മുന്നറിയിപ്പുകൾ.",
      activeCoastalAlert: "സജീവ തീരദേശ മുന്നറിയിപ്പ്",
      testAudioBroadcast: "ഓഡിയോ സൈറൺ പരിശോധിക്കുക",
      filterSeverity: "തീവ്രത അനുസരിച്ച് ഫിൽട്ടർ",
      allAlerts: "എല്ലാ മുന്നറിയിപ്പുകളും",
      severeRed: "അതീവ ജാഗ്രത (റെഡ്)",
      moderateCaution: "മിതമായ ജാഗ്രത",
      advisories: "നിർദ്ദേശങ്ങൾ",
      officialDirectives: "ഔദ്യോഗിക സമുദ്ര സുരക്ഷാ നിർദ്ദേശങ്ങൾ",
      effectiveRange: "ബാധിത പ്രദേശം",
      issuedBy: "നൽകിയ ഏജൻസി",

      // Routes
      routesPageTitle: "ഓർക്ക സുരക്ഷിത നാവിഗേഷൻ എഞ്ചിൻ",
      routesPageSub: "സുരക്ഷിത ബോട്ട് പാത: ഉയർന്ന തിരമാലകൾ, പാറക്കെട്ടുകൾ, സംരക്ഷിത സമുദ്ര മേഖലകൾ എന്നിവ ഒഴിവാക്കുന്നു.",
      activeSector: "പ്രവർത്തന മേഖല",
      hazardousDirectCourse: "അപകടകരമായ നേരിട്ടുള്ള പാത",
      straightCompassCourse: "നേരെയുള്ള കോമ്പസ് പാത",
      severeWarning: "കടുത്ത മുന്നറിയിപ്പ്",
      orcaSafeRoute: "ഓർക്ക നാവിക് നിർദ്ദേശിച്ച സുരക്ഷിത പാത",
      deepWaterCorridor: "ആഴക്കടൽ സുരക്ഷിത ഇടനാഴി",
      estTime: "പ്രതീക്ഷിത സമയം",
      maxWave: "പരമാവധി തിരമാല",
      fuelSavings: "ഇന്ധന ലാഭം",
      courseSegments: "പാതയുടെ ഭാഗങ്ങൾ",
      plotSafeCorridor: "ഭൂപടത്തിൽ സുരക്ഷിത പാത വരയ്ക്കുക",

      // Analytics
      analyticsPageTitle: "സമുദ്ര ശാസ്ത്ര കാലാവസ്ഥാ വിശകലനം",
      analyticsPageSub: "കടൽ ഉപരിതല താപനില, ക്ലോറോഫിൽ സാന്നിധ്യം, തിരമാലകൾ, വേലിയേറ്റം എന്നിവയുടെ വിശകലനം.",
      sstChartTitle: "കടൽ ഉപരിതല താപനിലയും വ്യതിയാനങ്ങളും",
      chlorophyllChartTitle: "ക്ലോറോഫിൽ സാന്ദ്രത (OCM-3)",
      waveWindForecastTitle: "തിരമാലകളുടെ ഉയരവും കാറ്റിന്റെ വേഗതയും പ്രവചനം (48 മണിക്കൂർ)",
      tidePredictionTitle: "വേലിയേറ്റ/വേലിയിറക്ക പ്രവചനങ്ങളും പ്രവാഹങ്ങളും",
      historicalSummaryTitle: "കഴിഞ്ഞ 12 മാസത്തെ തീരദേശ സുരക്ഷാ സൂചിക",
      unitCelsius: "യൂണിറ്റ്: °സെൽഷ്യസ്",
      unitMgM3: "യൂണിറ്റ്: mg/m³",

      // Satellite
      satellitePageTitle: "ഭൗമനിരീക്ഷണ ഉപഗ്രഹ വിവരങ്ങൾ",
      satellitePageSub: "ബഹിരാകാശ സെൻസറുകൾ: ഓഷ്യൻസാറ്റ്-3, ഇൻസാറ്റ്-3ഡിആർ, റഡാർ വിവരങ്ങൾ.",
      activeSensorTelemetry: "തത്സമയ സെൻസർ വിവരങ്ങൾ",
      sensorDetails: "സെൻസർ വിവരങ്ങളും ഭ്രമണപഥവും",
      spatialResolution: "റെസല്യൂഷൻ",
      temporalRepeat: "ഭ്രമണപഥ ആവർത്തനം",
      spectralBands: "സ്പെക്ട്രൽ ബാൻഡുകൾ",
      dataQualityIndex: "ഗുണനിലവാര സൂചിക",
      inspectSatelliteMatrix: "ജിയോട്ടിഫ് ഭൂപടം പരിശോധിക്കുക",

      // Profile
      profilePageTitle: "ബോട്ട്, പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ",
      profilePageSub: "നിങ്ങളുടെ തൊഴിൽ പങ്ക്, ബോട്ട് വിവരങ്ങൾ, ഭാഷ എന്നിവ ക്രമീകരിക്കുക.",
      maritimePersona: "സമുദ്ര പ്രവർത്തന പങ്ക്",
      personaExpl: "പങ്ക് മാറ്റുന്നത് നിങ്ങളുടെ ആവശ്യത്തിനനുസരിച്ച് ഡാഷ്‌ബോർഡും മുന്നറിയിപ്പുകളും ക്രമീകരിക്കും.",
      vesselSpecs: "ബോട്ട്, ട്രാൻസ്‌പോണ്ടർ വിവരങ്ങൾ",
      navicAisId: "നാവിക് എഐഎസ് ട്രാൻസ്‌പോണ്ടർ ഐഡി",
      hullCategory: "ബോട്ടിന്റെ ഇനം",
      engineCapacity: "എഞ്ചിൻ ശേഷി",
      homePortLabel: "രജിസ്റ്റർ ചെയ്ത തുറമുഖം",
      coastalLanguageHeading: "തീരദേശ ഭാഷയും വോയ്സ് ഇന്റർഫേസും",
      alertChannelsHeading: "മുന്നറിയിപ്പ് വിതരണ ചാനലുകൾ",
      emergencySmsLabel: "അടിയന്തര എസ്എംഎസ് പ്രക്ഷേപണം",
      emergencySmsDesc: "ഓഫ്‌ലൈനിലായിരിക്കുമ്പോഴും മൊബൈൽ ടവറുകൾ വഴി ചുഴലിക്കാറ്റ്, തിരമാല മുന്നറിയിപ്പുകൾ നേടുക",
      audioSirenLabel: "ശബ്ദ സൈറൺ / വോയ്സ് അറിയിപ്പ്",
      audioSirenDesc: "തിരഞ്ഞെടുത്ത പ്രാദേശിക ഭാഷയിൽ ശബ്ദ മുന്നറിയിപ്പ് കേൾക്കുക",
      saveVesselConfig: "ബോട്ട് വിവരങ്ങൾ സേവ് ചെയ്യുക",
      settingsSaved: "വിവരങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!",

      // Chat Sidebar
      autonomousAgentCollective: "സ്വയംപ്രേരിത എഐ ഏജന്റുകൾ",
      connectedGroundStations: "ബന്ധിപ്പിച്ച ഗ്രൗണ്ട് സ്റ്റേഷനുകൾ",

      // Map & GIS Layers
      marineGisLayers: "സമുദ്ര ജിഐഎസ് ലെയറുകൾ",
      pfzHighCatch: "കൂടുതൽ മത്സ്യലഭ്യതയുള്ള പ്രദേശം",
      cycloneConeAsna: "ചുഴലിക്കാറ്റ് മേഖല (അസ്ന)",
      roughSeaState: "പ്രക്ഷുബ്ധമായ കടൽ",
      safeCorridorLegend: "സുരക്ഷിത സഞ്ചാര പാത",
      aisFishingFleet: "മത്സ്യബന്ധന ബോട്ടുകൾ",

      // Daily Bulletin
      officialBulletinTitle: "ഔദ്യോഗിക പ്രതിദിന തീരദേശ സുരക്ഷാ ബുള്ളറ്റിൻ",
      bulletinGovt: "ഭാരത സർക്കാർ • ഭൗമശാസ്ത്ര മന്ത്രാലയം • ഐഎസ്ആർഒ SIH26176",
      bulletinIssuedFor: "നൽകപ്പെട്ട പ്രദേശം",
      bulletinValid: "അടുത്ത 24 മണിക്കൂറിലേക്ക് ബാധകം",
      bulletinOverallRisk: "മൊത്തം അപകട നില",
      bulletinSignificantWaves: "തിരമാലകളുടെ ഉയരം",
      bulletinSustainedWind: "തുടർച്ചയായ കാറ്റ്",
      bulletinAstronomicalTides: "വേലിയേറ്റവും വേലിയിറക്കവും",

      // Emergency SOS
      distressBeaconDispatchTab: "1. അപായ സന്ദേശം അയക്കൽ",
      survivalGuideTab: "2. ഓഫ്‌ലൈൻ അതിജീവന സഹായി",
      vhfChannelTab: "3. വിഎച്ച്എഫ് 16 & കോസ്റ്റ് ഗാർഡ്",
      distressAuditLogTab: "അപായ സന്ദേശ രേഖ"
    }
  }
};

// Update each language section
['en', 'hi', 'ta', 'te', 'bn', 'ml'].forEach(lang => {
  const keysObj = newTranslations.common[lang];
  const entriesStr = Object.entries(keysObj)
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');

  // Insert before the quickChips or before the end of the lang block
  const langDecl = `  ${lang}: {`;
  const langIdx = fileContent.indexOf(langDecl);
  if (langIdx === -1) {
    console.error(`Could not find ${langDecl}`);
    return;
  }
  
  // Find `quickChips:` after langIdx
  const quickChipsIdx = fileContent.indexOf('quickChips:', langIdx);
  if (quickChipsIdx !== -1) {
    // Insert just before quickChips
    fileContent = fileContent.slice(0, quickChipsIdx) + entriesStr + '\n\n    ' + fileContent.slice(quickChipsIdx);
  }
});

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully updated translations.js with all new keys across 6 languages!');
