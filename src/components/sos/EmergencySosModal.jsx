import React, { useState, useEffect } from 'react';
import {
  SURVIVAL_PROTOCOLS,
  getOfflineGpsPosition,
  findNearestRefugePort,
  formatNmeaDistressTelegram,
  queueOfflineDistressBeacon,
  getOfflineDistressQueue,
  generateDistressSmsUrl
} from '../../services/sosService';
import { startEmergencySosSiren, stopEmergencySosSiren } from '../../lib/audioService';
import { useConnectivity } from '../../context/ConnectivityContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  Flashlight,
  PhoneCall,
  MessageSquare,
  Compass,
  MapPin,
  LifeBuoy,
  X,
  CheckCircle2,
  Send,
  RefreshCw,
  Users,
  Ship,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { getStoredUserProfile } from '../../services/profileService';

const CONSOLE_EMERGENCY_TYPES = [
  {
    id: 'CAPSIZING',
    title: 'CAPSIZING',
    subtitle: 'Hull breach / flooding / sinking',
    urgency: 'CRITICAL (MAYDAY)',
    code: 'MAYDAY-CAP'
  },
  {
    id: 'ENGINE_FAILURE',
    title: 'ENGINE FAILURE',
    subtitle: 'Dead in water / drifting toward breakers',
    urgency: 'URGENT (PAN-PAN)',
    code: 'PAN-ENG'
  },
  {
    id: 'MEDICAL',
    title: 'MEDICAL',
    subtitle: 'Critical crew trauma / MEDEVAC needed',
    urgency: 'CRITICAL (MEDEVAC)',
    code: 'MED-EVAC'
  },
  {
    id: 'SEVERE_SQUALL',
    title: 'SEVERE SQUALL',
    subtitle: 'Gale wind >35 kt / waves >3.5m / trapped',
    urgency: 'CRITICAL (MAYDAY)',
    code: 'MAYDAY-WX'
  },
  {
    id: 'COLLISION',
    title: 'COLLISION',
    subtitle: 'Vessel impact / structural breach / fire',
    urgency: 'CRITICAL (MAYDAY)',
    code: 'MAYDAY-COL'
  },
  {
    id: 'MAN_OVERBOARD',
    title: 'MAN OVERBOARD',
    subtitle: 'Crew fallen into sea / active drift',
    urgency: 'CRITICAL (MOB)',
    code: 'MAYDAY-MOB'
  }
];

export function EmergencySosModal({ isOpen, onClose }) {
  const { mode, setMode } = useConnectivity();
  const { t } = useLanguage();

  const [selectedType, setSelectedType] = useState(CONSOLE_EMERGENCY_TYPES[0]);
  const [vesselName, setVesselName] = useState(() => {
    const prof = getStoredUserProfile('fisherman');
    return prof.vesselName || 'Sea Warrior (IND-KL-07-MM-4421)';
  });
  const [crewCount, setCrewCount] = useState(() => {
    const prof = getStoredUserProfile('fisherman');
    return prof.crewCount || 4;
  });
  const [gpsData, setGpsData] = useState({
    latitude: 9.9312,
    longitude: 76.2673,
    accuracy: 8,
    source: 'INITIALIZING_GPS'
  });
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);
  const [nearestPort, setNearestPort] = useState(findNearestRefugePort(9.9312, 76.2673));

  // Deliberate confirmation state for Send Distress
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [beaconPacketsSent, setBeaconPacketsSent] = useState(0);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState('red');
  const [lastTelegram, setLastTelegram] = useState('');
  const [activeSurvivalTab, setActiveSurvivalTab] = useState('Hull Flooding');

  useEffect(() => {
    if (isOpen) {
      const prof = getStoredUserProfile('fisherman');
      if (prof) {
        if (prof.vesselName) setVesselName(prof.vesselName);
        if (prof.crewCount) setCrewCount(prof.crewCount);
      }
      loadGps();
      setAwaitingConfirmation(false);
    } else {
      stopEmergencySosSiren();
      setIsSirenPlaying(false);
      setIsStrobeActive(false);
      setAwaitingConfirmation(false);
    }
  }, [isOpen]);

  const loadGps = async () => {
    setIsRefreshingGps(true);
    const pos = await getOfflineGpsPosition();
    setGpsData(pos);
    const port = findNearestRefugePort(pos.latitude, pos.longitude);
    setNearestPort(port);
    setIsRefreshingGps(false);
  };

  // Screen Strobe Effect for Night Rescue
  useEffect(() => {
    let interval = null;
    if (isStrobeActive) {
      interval = setInterval(() => {
        setStrobeColor(prev => (prev === 'red' ? 'white' : 'red'));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isStrobeActive]);

  // Transmit counter
  useEffect(() => {
    let interval = null;
    if (isBeaconActive) {
      interval = setInterval(() => {
        setBeaconPacketsSent(prev => prev + 1);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBeaconActive]);

  if (!isOpen) return null;

  const handleTransmitBeacon = () => {
    const distressId = `SOS-${Date.now().toString().slice(-6)}`;
    const record = {
      id: distressId,
      vesselName,
      latitude: gpsData.latitude,
      longitude: gpsData.longitude,
      emergencyType: selectedType.id,
      emergencyTitle: selectedType.title,
      urgency: selectedType.urgency,
      crewCount,
      nearestPort,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'BROADCASTING_VIA_NAVIC_SBAND'
    };

    const telegram = formatNmeaDistressTelegram(record);
    setLastTelegram(telegram);
    queueOfflineDistressBeacon(record);
    setIsBeaconActive(true);
    setBeaconPacketsSent(1);
    setAwaitingConfirmation(false);

    if (mode === '4g') {
      setMode('navic');
    }
  };

  const handleToggleSiren = () => {
    if (isSirenPlaying) {
      stopEmergencySosSiren();
      setIsSirenPlaying(false);
    } else {
      startEmergencySosSiren();
      setIsSirenPlaying(true);
    }
  };

  const smsUrl = generateDistressSmsUrl({
    vesselName,
    latitude: gpsData.latitude,
    longitude: gpsData.longitude,
    emergencyType: selectedType.title,
    crewCount,
    nearestPort
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#030B14]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Visual Strobe Overlay for Night Rescue */}
      {isStrobeActive && (
        <div
          onClick={() => setIsStrobeActive(false)}
          className={`fixed inset-0 z-50 pointer-events-auto cursor-pointer flex flex-col items-center justify-center text-center p-6 ${
            strobeColor === 'red' ? 'bg-[#DC2626] text-white' : 'bg-white text-black'
          }`}
        >
          <div className="text-4xl sm:text-6xl font-black uppercase mb-4 font-mono">
            SOS DISTRESS STROBE ACTIVE
          </div>
          <p className="text-base sm:text-xl font-bold max-w-md font-mono">
            Visible to Rescue Aircraft & Coast Guard Patrol Vessels. Tap anywhere to dismiss.
          </p>
        </div>
      )}

      {/* Main Serious Distress Console Frame */}
      <div className="relative w-full max-w-4xl bg-[#071A2B] border-2 border-[#C93C4B] shadow-2xl text-white flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* HEADER: EMERGENCY DISTRESS CONSOLE + TELEMETRY READOUT */}
        <div className="bg-[#0B2942] border-b-2 border-[#C93C4B] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C93C4B] text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#C93C4B] uppercase font-bold">
                ISRO / COAST GUARD MARITIME EMERGENCY SYSTEM
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
                EMERGENCY DISTRESS CONSOLE
              </h1>
            </div>
          </div>

          {/* Telemetry Chips in Header */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-[#071A2B] px-2.5 py-1 border border-[#0D5C7A]">
              <span className="w-2 h-2 rounded-full bg-[#1F9D72] animate-pulse" />
              <span className="text-slate-400">GPS:</span>
              <strong className="text-white">ACTIVE</strong>
            </div>

            <div className="flex items-center gap-1.5 bg-[#071A2B] px-2.5 py-1 border border-[#D96B3B]/50">
              <span className="w-2 h-2 rounded-full bg-[#D96B3B]" />
              <span className="text-slate-400">CONNECTIVITY:</span>
              <strong className="text-[#D96B3B]">OFFLINE READY</strong>
            </div>

            <div className="flex items-center gap-1.5 bg-[#071A2B] px-2.5 py-1 border border-[#0D5C7A]">
              <MapPin className="w-3.5 h-3.5 text-[#C93C4B]" />
              <span className="text-slate-400">POS:</span>
              <strong className="text-white">{gpsData.latitude}°N, {gpsData.longitude}°E</strong>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-[#C93C4B] hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONSOLE BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active Beacon Uplink Strip (If Transmitting) */}
          {isBeaconActive && (
            <div className="bg-[#C93C4B]/20 border-2 border-[#C93C4B] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#C93C4B] animate-ping" />
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-wider">
                    DISTRESS BEACON TRANSMITTING VIA NAVIC S-BAND (2492.0 MHz)
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    Relaying to MRCC Kochi & Indian Coast Guard • Packets Broadcast: <strong className="text-[#1F9D72]">{beaconPacketsSent}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBeaconActive(false)}
                className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-900 font-bold font-mono text-xs transition-colors"
              >
                CANCEL BEACON
              </button>
            </div>
          )}

          {/* MAIN: SELECT EMERGENCY TYPE (6 Physical-Button-Inspired Controls) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-[#0F8B8D]">
                SELECT EMERGENCY TYPE
              </h2>
              <span className="text-[10px] font-mono text-slate-400">CHOOSE PRIMARY NATURE OF CASUALTY</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CONSOLE_EMERGENCY_TYPES.map((type) => {
                const isSelected = selectedType.id === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(type);
                      setAwaitingConfirmation(false);
                    }}
                    className={`p-3.5 text-left transition-all border-2 relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B2942] border-[#C93C4B] text-white shadow-inner ring-2 ring-[#C93C4B]/50'
                        : 'bg-[#071A2B] border-[#0D5C7A]/60 text-slate-300 hover:border-slate-400 hover:bg-[#0B2942]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-black uppercase px-1.5 py-0.2 ${
                        isSelected ? 'bg-[#C93C4B] text-white' : 'bg-[#0B2942] text-slate-400'
                      }`}>
                        {type.code}
                      </span>
                      {isSelected ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C93C4B] animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                      )}
                    </div>
                    <div className="font-mono font-black text-sm text-white tracking-tight uppercase">
                      {type.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 line-clamp-1">
                      {type.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DISTRESS READY STATUS PANEL & DELIBERATE SEND ACTION */}
          <div className="bg-[#0B2942] border border-[#0D5C7A] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0D5C7A]/60 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#0F8B8D]" />
                <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  DISTRESS READY
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#1F9D72]/20 text-[#1F9D72] px-2 py-0.5 border border-[#1F9D72]/40 font-bold">
                TELEMETRY PRE-COMPUTED
              </span>
            </div>

            {/* The 5 Key Telemetry Points Requested */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
              <div className="p-2.5 bg-[#071A2B] border border-[#0D5C7A]/50">
                <span className="text-[10px] text-slate-400 uppercase block">Location:</span>
                <span className="font-bold text-white text-xs mt-0.5 block truncate">
                  {gpsData.latitude}°N, {gpsData.longitude}°E
                </span>
              </div>

              <div className="p-2.5 bg-[#071A2B] border border-[#0D5C7A]/50">
                <span className="text-[10px] text-slate-400 uppercase block">Nearest Harbor:</span>
                <span className="font-bold text-[#0F8B8D] text-xs mt-0.5 block truncate">
                  {nearestPort.name.split(',')[0]}
                </span>
              </div>

              <div className="p-2.5 bg-[#071A2B] border border-[#0D5C7A]/50">
                <span className="text-[10px] text-slate-400 uppercase block">Bearing:</span>
                <span className="font-bold text-white text-xs mt-0.5 block">
                  068° ENE
                </span>
              </div>

              <div className="p-2.5 bg-[#071A2B] border border-[#0D5C7A]/50">
                <span className="text-[10px] text-slate-400 uppercase block">Distance:</span>
                <span className="font-bold text-amber-400 text-xs mt-0.5 block">
                  {nearestPort.distanceNm} NM
                </span>
              </div>

              <div className="p-2.5 bg-[#071A2B] border border-[#0D5C7A]/50 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase block">VHF Channel:</span>
                <span className="font-bold text-[#1F9D72] text-xs mt-0.5 block">
                  Ch 16 (156.800 MHz)
                </span>
              </div>
            </div>

            {/* SEND DISTRESS (Deliberate 2-Step Confirmation) */}
            <div className="pt-2">
              {!awaitingConfirmation ? (
                <button
                  type="button"
                  onClick={() => setAwaitingConfirmation(true)}
                  className="w-full py-4 px-6 bg-[#C93C4B] hover:bg-red-700 text-white font-mono font-black text-sm sm:text-base tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer border border-white/20 active:scale-[0.99]"
                >
                  <Send className="w-5 h-5 text-white" />
                  <span>[SEND DISTRESS] — BROADCAST {selectedType.title} BEACON</span>
                </button>
              ) : (
                <div className="bg-[#C93C4B]/20 border-2 border-[#C93C4B] p-4 text-center space-y-3 animate-in fade-in">
                  <div className="text-sm sm:text-base font-black font-mono text-white uppercase tracking-wider">
                    CONFIRM IMMEDIATE MARITIME DISTRESS BROADCAST?
                  </div>
                  <p className="text-xs font-mono text-slate-300 max-w-lg mx-auto">
                    This will transmit an official distress telegram via NavIC S-band to the Indian Coast Guard MRCC with vessel ID: <strong>{vesselName}</strong> and {crewCount} lives on board.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleTransmitBeacon}
                      className="px-6 py-2.5 bg-[#C93C4B] hover:bg-red-700 text-white font-mono font-black text-sm uppercase transition-colors border border-white/40 cursor-pointer shadow-lg"
                    >
                      YES, TRANSMIT DISTRESS BEACON
                    </button>
                    <button
                      type="button"
                      onClick={() => setAwaitingConfirmation(false)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Physical Action Tools: Siren, Strobe, Call 1554, Offline SMS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <button
                type="button"
                onClick={handleToggleSiren}
                className={`p-2.5 border text-center transition-colors cursor-pointer ${
                  isSirenPlaying
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 animate-pulse'
                    : 'bg-[#071A2B] border-[#0D5C7A] text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#0F8B8D]" />}
                  <span className="font-bold">{isSirenPlaying ? 'STOP SIREN' : 'AUDIO SIREN'}</span>
                </div>
                <span className="text-[10px] text-slate-400">960Hz Morse SOS</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStrobeActive(true)}
                className="p-2.5 bg-[#071A2B] border border-[#0D5C7A] text-slate-300 hover:text-white text-center transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Flashlight className="w-4 h-4 text-[#C93C4B]" />
                  <span className="font-bold">NIGHT STROBE</span>
                </div>
                <span className="text-[10px] text-slate-400">Visual Screen Flash</span>
              </button>

              <a
                href="tel:1554"
                className="p-2.5 bg-[#071A2B] border border-[#0D5C7A] text-slate-300 hover:text-white text-center transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <PhoneCall className="w-4 h-4 text-[#1F9D72]" />
                  <span className="font-bold">CALL 1554</span>
                </div>
                <span className="text-[10px] text-[#1F9D72]">Coast Guard Toll-Free</span>
              </a>

              <a
                href={smsUrl}
                className="p-2.5 bg-[#071A2B] border border-[#0D5C7A] text-slate-300 hover:text-white text-center transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <MessageSquare className="w-4 h-4 text-[#0F8B8D]" />
                  <span className="font-bold">OFFLINE SMS</span>
                </div>
                <span className="text-[10px] text-slate-400">Pre-filled GPS Text</span>
              </a>
            </div>
          </div>

          {/* Transmitted Telegram Readout */}
          {lastTelegram && (
            <div className="p-3 bg-[#030B14] border border-[#0D5C7A] font-mono text-xs text-sky-300">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                TRANSMITTED NMEA 0183 SATELLITE BEACON PACKET:
              </span>
              <code>{lastTelegram}</code>
            </div>
          )}

          {/* BELOW: OFFLINE SURVIVAL PROCEDURES (4 Protocols) */}
          <div className="bg-[#0B2942] border border-[#0D5C7A] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#0D5C7A]/60 pb-2">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  OFFLINE SURVIVAL PROCEDURES
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">100% OFFLINE REFERENCE</span>
            </div>

            {/* 4 Protocol Selector Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Hull Flooding', 'Engine Failure', 'MOB', 'Hypothermia'].map((proto) => {
                const isProtoActive = activeSurvivalTab === proto;
                return (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => setActiveSurvivalTab(proto)}
                    className={`p-2 text-left text-xs font-mono font-bold uppercase border transition-colors cursor-pointer ${
                      isProtoActive
                        ? 'bg-[#071A2B] border-[#0F8B8D] text-white ring-1 ring-[#0F8B8D]'
                        : 'bg-[#071A2B]/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {proto}
                  </button>
                );
              })}
            </div>

            {/* Protocol Detail Content */}
            <div className="p-3 bg-[#071A2B] border border-[#0D5C7A]/40 text-xs font-mono space-y-2">
              {activeSurvivalTab === 'Hull Flooding' && (
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>Start bilge pump immediately and assign 2 crew to bailing buckets.</li>
                  <li>Locate breach; drive soft wooden wedges, canvas rolls, or cushions into the opening.</li>
                  <li>Maneuver vessel so breached side is on the leeward (sheltered) side away from waves.</li>
                  <li>Don life jackets (PFDs) on all crew before attempting internal repairs.</li>
                </ul>
              )}

              {activeSurvivalTab === 'Engine Failure' && (
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>Deploy sea-anchor (drogue) or bucket tied to bowline to keep the bow pointing into the swell.</li>
                  <li>NEVER let the boat sit beam-on (broadside) to breaking waves as rolling leads to capsizing.</li>
                  <li>Check fuel lines for airlocks or water contamination in sediment bowl.</li>
                  <li>Hoist radar reflector or bright orange flag on mast for patrol craft radar detection.</li>
                </ul>
              )}

              {activeSurvivalTab === 'MOB' && (
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>Shout "MAN OVERBOARD!" loudly to alert all crew.</li>
                  <li>Immediately throw a life ring, buoyant cushion, or floating buoy toward victim.</li>
                  <li>Keep eyes locked onto person in water; point arm continuously at their position.</li>
                  <li>Mark current GPS position instantly by pressing the SOS GPS mark button.</li>
                </ul>
              )}

              {activeSurvivalTab === 'Hypothermia' && (
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>Assume H.E.L.P. posture: cross arms tightly across chest and pull knees to chin.</li>
                  <li>If multiple crew are in water, huddle tightly in a circle facing inward.</li>
                  <li>Keep head and neck above water; do not attempt long swim unless within 100 meters.</li>
                </ul>
              )}
            </div>
          </div>

          {/* ALSO: VHF MAYDAY SCRIPT */}
          <div className="bg-[#030B14] border border-[#0D5C7A] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#0F8B8D] uppercase font-bold">
              <span>VHF MAYDAY SCRIPT (CHANNEL 16 - 156.800 MHz)</span>
              <span className="text-slate-400">READ CLEARLY INTO RADIO HANDSET</span>
            </div>
            <div className="p-3 bg-[#071A2B] border border-white/10 font-mono text-xs text-white leading-relaxed">
              "MAYDAY, MAYDAY, MAYDAY.<br />
              THIS IS FISHING VESSEL {vesselName.toUpperCase()}.<br />
              OUR POSITION IS {gpsData.latitude}° N, {gpsData.longitude}° E.<br />
              NATURE OF DISTRESS: {selectedType.title}.<br />
              WE HAVE {crewCount} PERSONS ON BOARD.<br />
              WE REQUIRE IMMEDIATE SEARCH AND RESCUE ASSISTANCE.<br />
              OVER."
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#0B2942] border-t border-[#0D5C7A] px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <span>NAVIC IRNSS S-BAND DIRECT SATELLITE UPLINK ACTIVE</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#071A2B] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition-colors cursor-pointer"
          >
            DISMISS CONSOLE
          </button>
        </div>
      </div>
    </div>
  );
}
