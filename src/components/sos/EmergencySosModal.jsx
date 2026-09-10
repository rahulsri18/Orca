import React, { useState, useEffect } from 'react';
import {
  EMERGENCY_TYPES,
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
  AlertOctagon,
  Radio,
  Volume2,
  VolumeX,
  Flashlight,
  PhoneCall,
  MessageSquare,
  Compass,
  MapPin,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  Send,
  RefreshCw,
  Users,
  Ship,
  FileText
} from 'lucide-react';
import { getStoredUserProfile } from '../../services/profileService';

export function EmergencySosModal({ isOpen, onClose }) {
  const { mode, setMode } = useConnectivity();
  const { t } = useLanguage();

  // State
  const [selectedType, setSelectedType] = useState(EMERGENCY_TYPES[0]);
  const [vesselName, setVesselName] = useState(() => {
    const prof = getStoredUserProfile('fisherman');
    return prof.vesselName || 'Matsya-01 (KL-07-EF-4421)';
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

  // Emergency triggers
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [beaconPacketsSent, setBeaconPacketsSent] = useState(0);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState('red');
  const [activeTab, setActiveTab] = useState('beacon'); // beacon | survival | vhf | log
  const [distressQueue, setDistressQueue] = useState([]);
  const [lastTelegram, setLastTelegram] = useState('');

  // Fetch initial GPS on open
  useEffect(() => {
    if (isOpen) {
      const prof = getStoredUserProfile('fisherman');
      if (prof) {
        if (prof.vesselName) setVesselName(prof.vesselName);
        if (prof.crewCount) setCrewCount(prof.crewCount);
      }
      loadGps();
      setDistressQueue(getOfflineDistressQueue());
    } else {
      // Clean up when modal closes
      stopEmergencySosSiren();
      setIsSirenPlaying(false);
      setIsStrobeActive(false);
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

  // Screen Strobe Effect for Nighttime Helicopter / Patrol Craft Signaling
  useEffect(() => {
    let interval = null;
    if (isStrobeActive) {
      interval = setInterval(() => {
        setStrobeColor(prev => (prev === 'red' ? 'white' : 'red'));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isStrobeActive]);

  // Satellite Packet Uplink Pulse simulation
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

  // Trigger Satellite Beacon Broadcast
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
    setDistressQueue(getOfflineDistressQueue());
    setIsBeaconActive(true);
    setBeaconPacketsSent(1);

    // If currently on cellular, suggest satellite uplink telemetry
    if (mode === '4g') {
      setMode('navic');
    }
  };

  // Toggle Siren
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      {/* Visual Strobe Overlay for Night Rescue */}
      {isStrobeActive && (
        <div
          onClick={() => setIsStrobeActive(false)}
          className={`fixed inset-0 z-50 pointer-events-auto cursor-pointer transition-colors duration-100 flex flex-col items-center justify-center text-center p-6 ${
            strobeColor === 'red' ? 'bg-red-600 text-white' : 'bg-white text-slate-950'
          }`}
        >
          <div className="text-4xl sm:text-6xl font-black tracking-wider uppercase animate-bounce mb-4">
            🚨 {t('sosDistressStrobe', 'SOS DISTRESS STROBE')} 🚨
          </div>
          <p className="text-lg sm:text-xl font-bold max-w-md">
            {t('strobeActiveDesc', 'Signal Active for Rescue Aircraft & Patrol Vessels! Tap anywhere on screen to exit strobe.')}
          </p>
          <div className="mt-8 px-6 py-2 rounded-full border-2 border-current text-sm font-bold uppercase">
            {t('tapDismissFlash', 'Tap to Dismiss Flash')}
          </div>
        </div>
      )}

      {/* Main SOS Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-rose-600 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Urgent Header Strip */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-rose-700 flex items-center justify-center font-black shadow-md shrink-0 animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 uppercase">
                  {t('navicBeaconBadge', 'ISRO NavIC S-Band Beacon')}
                </span>
                <span className="text-[11px] font-bold text-emerald-200 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{t('offlineReadyBadge', '100% Offline Ready')}</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                {t('emergencyModalTitle', 'Emergency SOS Maritime Distress Console')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-xs font-bold transition-colors"
            title={t('closeConsole', 'Close emergency modal')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Hardware GPS Strip */}
        <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-sky-300">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-white text-sm">
                {gpsData.latitude}° N, {gpsData.longitude}° E
              </span>
              <span className="text-[10px] text-slate-400">({gpsData.accuracy}m fix)</span>
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-ocean-teal" />
              <span>{t('nearestRefuge', 'Nearest Refuge')}: <strong>{nearestPort.name}</strong> (~{nearestPort.distanceNm} nm)</span>
            </div>
          </div>

          <button
            onClick={loadGps}
            disabled={isRefreshingGps}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshingGps ? 'animate-spin' : ''}`} />
            <span>{t('updateGps', 'Update GPS')}</span>
          </button>
        </div>

        {/* Navigation Tabs (Beacon / Survival / VHF / Log) */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('beacon')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'beacon'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{t('distressBeaconDispatchTab', '1. Distress Beacon Dispatch')}</span>
          </button>

          <button
            onClick={() => setActiveTab('survival')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'survival'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-amber-600" />
            <span>{t('survivalGuideTab', '2. Offline Sea Survival Guide')}</span>
          </button>

          <button
            onClick={() => setActiveTab('vhf')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'vhf'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>{t('vhfChannelTab', '3. VHF Ch 16 & Coast Guard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'log'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>{t('distressAuditLogTab', 'Distress Audit Log')} ({distressQueue.length})</span>
          </button>
        </div>

        {/* Tab 1: Primary Distress Beacon Dispatch */}
        {activeTab === 'beacon' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Active Beacon Notification Banner */}
            {isBeaconActive && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 animate-in fade-in slide-in-from-top-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <div>
                    <span className="font-bold text-rose-950 text-sm block">
                      {t('distressBeaconTransmitting', 'DISTRESS BEACON TRANSMITTING VIA NAVIC S-BAND (2492.0 MHz)')}
                    </span>
                    <span className="text-rose-700 font-mono">
                      {t('uplinkPackets', 'Uplink Packets Broadcast')}: <strong>{beaconPacketsSent}</strong> • {t('relayingMrcc', 'Relaying to MRCC & Indian Coast Guard')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBeaconActive(false)}
                    className="px-3 py-1.5 rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-900 font-bold"
                  >
                    {t('cancelBeacon', 'Cancel Beacon')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Select Emergency Situation Category */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold">1</span>
                <span>{t('selectEmergencySituation', 'Select Your Emergency Situation')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {EMERGENCY_TYPES.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/80 shadow-sm ring-2 ring-rose-600/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${type.color}15`, color: type.color }}
                          >
                            {t(type.urgency)}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 leading-snug">{t(type.title)}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-tight">{t(type.description)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Vessel & Crew Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Ship className="w-3.5 h-3.5 text-ocean-teal" />
                  <span>{t('vesselNameLabel', 'Vessel Name & Registration')}</span>
                </label>
                <input
                  type="text"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-ocean-teal" />
                  <span>{t('crewCountLabel', 'Total Crew on Board')}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={crewCount}
                    onChange={(e) => setCrewCount(Number(e.target.value))}
                    className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-[11px] text-slate-500">{t('livesOnBoard', 'Lives on board to rescue')}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Big Emergency Actions */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold">2</span>
                <span>{t('dispatchProtocols', 'Dispatch Offline Rescue Protocols')}</span>
              </div>

              {/* Primary NavIC Satellite Broadcast Button */}
              <button
                type="button"
                onClick={handleTransmitBeacon}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-sm md:text-base tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border-2 border-white/20 active:scale-[0.99]"
              >
                <Radio className="w-6 h-6 animate-pulse" />
                <span>{t('broadcastBeaconBtn', 'BROADCAST NAVIC SATELLITE BEACON (OFFLINE ACTIVE)')}</span>
              </button>

              {/* Secondary Safety Tools: Siren, Strobe, SMS, Call */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* Siren Button */}
                <button
                  type="button"
                  onClick={handleToggleSiren}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isSirenPlaying
                      ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-500 animate-pulse'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {isSirenPlaying ? <VolumeX className="w-5 h-5 text-amber-700" /> : <Volume2 className="w-5 h-5 text-ocean-teal" />}
                  <span className="text-xs font-bold">{isSirenPlaying ? t('stopSirenBtn', 'Stop Siren') : t('audioSirenBtn', 'Audio Siren')}</span>
                  <span className="text-[10px] text-slate-400">{t('morseSosSub', '960Hz / Morse SOS')}</span>
                </button>

                {/* Strobe Light Button */}
                <button
                  type="button"
                  onClick={() => setIsStrobeActive(true)}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <Flashlight className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold">{t('nightStrobeBtn', 'Night Strobe')}</span>
                  <span className="text-[10px] text-slate-400">{t('screenFlashSub', 'Screen Flash Beacon')}</span>
                </button>

                {/* Coast Guard Call 1554 */}
                <a
                  href="tel:1554"
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-950 flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <PhoneCall className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold">{t('callIcgBtn', 'Call 1554')}</span>
                  <span className="text-[10px] text-emerald-700">{t('icgTollFreeSub', 'ICG Toll-Free 24x7')}</span>
                </a>

                {/* Send Offline SMS */}
                <a
                  href={smsUrl}
                  className="p-3 rounded-xl bg-sky-50 border border-sky-300 hover:bg-sky-100 text-sky-950 flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <MessageSquare className="w-5 h-5 text-sky-600" />
                  <span className="text-xs font-bold">{t('offlineSmsBtn', 'Offline SMS')}</span>
                  <span className="text-[10px] text-sky-700">{t('prefilledGpsSub', 'Pre-filled GPS text')}</span>
                </a>
              </div>
            </div>

            {/* Generated NMEA Telegram Preview */}
            {lastTelegram && (
              <div className="p-3 rounded-xl bg-slate-900 text-sky-300 font-mono text-[11px] leading-relaxed border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                  {t('transmittedPacket', 'Transmitted NMEA 0183 Satellite Packet:')}
                </span>
                <code>{lastTelegram}</code>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Offline Sea Survival Guide */}
        {activeTab === 'survival' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong>{t('offlineSurvivalGuideTitle', 'Offline Maritime First-Aid & Survival Instructions')}:</strong> {t('offlineSurvivalGuideDesc', 'Read and follow immediately while awaiting Coast Guard rescue. These guidelines work completely offline.')}
            </div>

            <div className="space-y-3">
              {SURVIVAL_PROTOCOLS.map((protocol, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-ocean-teal" />
                    <span>{t(protocol.title)}</span>
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700 leading-relaxed">
                    {protocol.steps.map((step, sIdx) => (
                      <li key={sIdx} className="pl-1">{t(step)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: VHF Channel 16 & Coast Guard Directory */}
        {activeTab === 'vhf' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            <div className="bg-ocean-deep text-white p-4 rounded-2xl border border-ocean-navy space-y-2">
              <span className="text-[10px] font-mono text-sky-300 uppercase font-bold">{t('maydayScriptTitle', 'Standard Mayday Script (VHF Channel 16 - 156.800 MHz)')}</span>
              <p className="font-mono text-xs leading-relaxed bg-black/30 p-3 rounded-xl border border-white/10">
                "MAYDAY, MAYDAY, MAYDAY.<br />
                THIS IS FISHING VESSEL {vesselName.toUpperCase()}.<br />
                OUR POSITION IS {gpsData.latitude}° N, {gpsData.longitude}° E.<br />
                NATURE OF DISTRESS: {selectedType.title.toUpperCase()}.<br />
                WE HAVE {crewCount} PERSONS ON BOARD.<br />
                WE REQUIRE IMMEDIATE SEARCH AND RESCUE ASSISTANCE.<br />
                OVER."
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                {t('regionalMrccTitle', 'Regional Maritime Rescue Coordination Centres (MRCC)')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">MRCC Kochi (Kerala / Lakshadweep)</span>
                  <span className="text-slate-500 font-mono">0484-2216444 / VHF Ch 16</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">MRCC Mumbai (Maharashtra / Goa)</span>
                  <span className="text-slate-500 font-mono">022-24388065 / VHF Ch 16</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">MRCC Chennai (Tamil Nadu / Bay of Bengal)</span>
                  <span className="text-slate-500 font-mono">044-23460405 / VHF Ch 16</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">MRCC Port Blair (Andaman & Nicobar)</span>
                  <span className="text-slate-500 font-mono">03192-245530 / VHF Ch 16</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Distress Audit Log */}
        {activeTab === 'log' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 text-xs">
            <div className="text-slate-500 flex items-center justify-between">
              <span>{t('queuedBeaconsDesc', 'Locally Queued Distress Beacons (Stored in IndexedDB / LocalStorage)')}</span>
              <span className="font-mono font-bold text-ocean-teal">{distressQueue.length} records</span>
            </div>

            {distressQueue.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                {t('noDistressLogged', 'No past distress signals logged on this vessel device.')}
              </div>
            ) : (
              distressQueue.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      {item.emergencyTitle || item.emergencyType}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {item.latitude}°N, {item.longitude}°E • Crew: {item.crewCount} • {item.timestamp}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800">
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            {t('navicDirectUplink', 'NavIC IRNSS S-band direct uplink • Emergency Channel active')}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            {t('closeConsole', 'Close Console')}
          </button>
        </div>
      </div>
    </div>
  );
}
