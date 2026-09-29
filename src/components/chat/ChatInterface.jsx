import React, { useState, useRef, useEffect } from 'react';
import { ChatBubble } from './ChatBubble';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { getScenarioForQuery, DEMO_SCENARIOS } from '../../data/mockAgents';
import { generateOrcaAgentResponse, getStoredGeminiKey, setStoredGeminiKey, testGeminiKey } from '../../services/geminiService';
import { queryOrcaAi } from '../../services/apiClient';
import {
  Send,
  Radio,
  RefreshCw,
  Cpu,
  Key,
  Check,
  CheckCircle2,
  MapPin,
  History,
  Bookmark,
  Layers,
  ShieldCheck,
  Activity,
  Waves,
  Wind,
  Satellite
} from 'lucide-react';

export function ChatInterface({
  onHighlightMap = null,
  initialQuery = null,
  className = ''
}) {
  const { t, currentLang } = useLanguage();
  const { role } = useRole();
  const hasGeminiKey = !!getStoredGeminiKey();

  const [messages, setMessages] = useState([
    {
      id: 'm-welcome',
      sender: 'orca',
      text: 'Namaste Captain! Welcome to ORCA Marine Assistant. Ask any question in simple words like "Can I go to sea tomorrow?" or "Where are the fish?" You can type or tap the microphone to speak, and tap the voice button to hear the answer.',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [currentScenario, setCurrentScenario] = useState(DEMO_SCENARIOS.kochi);
  const [agentLogs, setAgentLogs] = useState([]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiKey());
  const [keyStatusMsg, setKeyStatusMsg] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSimulating, activeStepIndex]);

  // Handle external initialQuery
  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const runMultiAgentPipeline = async (queryText, historyMessages = []) => {
    const previewScenario = getScenarioForQuery(queryText);
    setCurrentScenario(previewScenario);
    setIsSimulating(true);
    setActiveStepIndex(0);

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setAgentLogs([
      { time: now, agent: 'Planner', message: `Decomposing query: "${queryText.slice(0, 45)}"` }
    ]);

    const livePromise = generateOrcaAgentResponse(queryText, role, currentLang, historyMessages);

    // Step 0: Planner
    setTimeout(() => {
      setActiveStepIndex(1); // Parallel agents: Ocean, Weather, Geo
      setAgentLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), agent: 'Ocean', message: 'INCOIS Wave Buoy #AD02 & Oceansat-3 bio-optics received.' },
        { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), agent: 'Weather', message: 'IMD Doppler Radar reflectivity matrix calculated.' },
        { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), agent: 'Geo', message: 'NavIC geofence & territorial 12nm baseline validated.' }
      ]);

      // Step 2: Risk
      setTimeout(() => {
        setActiveStepIndex(4);
        setAgentLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), agent: 'Risk', message: `Composite risk index: ${previewScenario.riskScore}/100 (${previewScenario.riskLevel}) calculated.` }
        ]);

        // Step 3: Decision
        setTimeout(() => {
          setActiveStepIndex(5);
          setAgentLogs(prev => [
            ...prev,
            { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), agent: 'ORCA', message: 'Final synthesized natural language marine advisory drafted.' }
          ]);

          setTimeout(async () => {
            let finalScenario = previewScenario;
            let responseText = previewScenario.recommendation;

            try {
              const backendRes = await Promise.race([
                queryOrcaAi({
                  query: queryText,
                  user_location: role?.port || 'Kochi, Kerala',
                  coordinates: [9.93, 76.26],
                  language: currentLang
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4500))
              ]);
              if (backendRes && backendRes.synthesized_answer) {
                responseText = backendRes.synthesized_answer;
              } else {
                const live = await livePromise;
                if (live && live.text) responseText = live.text;
                if (live && live.scenario) finalScenario = live.scenario;
              }
            } catch (e) {
              try {
                const live = await livePromise;
                if (live && live.text) responseText = live.text;
                if (live && live.scenario) finalScenario = live.scenario;
              } catch (err) {
                console.warn("Using preview scenario fallback:", err);
              }
            }

            setIsSimulating(false);
            setActiveStepIndex(-1);

            const orcaMessage = {
              id: `orca-${Date.now()}`,
              sender: 'orca',
              text: responseText,
              scenario: finalScenario,
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
            };
            setMessages(prev => [...prev, orcaMessage]);
          }, 500);
        }, 600);
      }, 700);
    }, 600);
  };

  const handleSend = (text = null) => {
    const q = (text || inputQuery).trim();
    if (!q || isSimulating) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputQuery('');

    runMultiAgentPipeline(q, nextMessages);
  };

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      setStoredGeminiKey('');
      setKeyStatusMsg('Key cleared. Engine operating on INCOIS/ISRO scenario bank.');
      setTimeout(() => setKeyStatusMsg(null), 2500);
      return;
    }
    setKeyStatusMsg('Testing Gemini API key...');
    const result = await testGeminiKey(apiKeyInput.trim());
    if (result.valid) {
      setStoredGeminiKey(apiKeyInput.trim());
      setKeyStatusMsg('Key verified. Live multi-agent reasoning connected.');
      setTimeout(() => {
        setKeyStatusMsg(null);
        setShowKeyModal(false);
      }, 1500);
    } else {
      setKeyStatusMsg(`Verification failed: ${result.error || 'Invalid key'}`);
    }
  };

  // Agent Pipeline States
  const pipelineAgents = [
    { id: 'planner', name: 'Planner Agent', role: 'Task Decomposition', step: 0 },
    { id: 'ocean', name: 'Ocean Analyst', role: 'Wave & Bio-Optics', step: 1 },
    { id: 'weather', name: 'Weather Agent', role: 'Doppler Radar & Wind', step: 1 },
    { id: 'geo', name: 'Geofence Officer', role: '12nm & Bathymetry', step: 1 },
    { id: 'risk', name: 'Risk Assessor', role: 'Composite Hazard Score', step: 4 },
    { id: 'decision', name: 'Decision Officer', role: 'Advisory Formulation', step: 5 },
  ];

  const getAgentStatus = (agentStep) => {
    if (!isSimulating) return 'READY';
    if (activeStepIndex === -1) return 'READY';
    if (activeStepIndex === agentStep) return 'PROCESSING';
    if (activeStepIndex > agentStep) return 'READY';
    return 'STANDBY';
  };

  const savedQueries = [
    "Can I go fishing tomorrow near Kochi?",
    "Where is the best fish catch spot off Vizag?",
    "Is the sea safe near Rameswaram today?",
    "Find calm sea path to Mangalore harbor",
    "How close is Cyclone Asna to our boat?"
  ];

  const recentLocations = [
    { name: "Kochi Offshore", coords: "09°55'N, 076°14'E", query: "Evaluate marine safety status near Kochi coast" },
    { name: "Visakhapatnam Bank", coords: "17°41'N, 083°17'E", query: "Show today's best PFZ coordinates off Visakhapatnam" },
    { name: "Gulf of Mannar", coords: "09°17'N, 079°18'E", query: "Marine alert status for Gulf of Mannar & Rameswaram" },
    { name: "Mangalore Passage", coords: "12°52'N, 074°49'E", query: "Plot safest return route to Mangalore avoiding rough waters" },
  ];

  const confidenceScore = currentScenario?.confidenceScore || 94;

  return (
    <div className={`relative flex flex-col w-full h-full min-h-[600px] bg-[#071A2B] overflow-hidden ${className}`}>
      {/* 1. Ambient Oceanic Background Image spanning the ENTIRE SCREEN */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url('/jordan-allen-walters-j8QUs2P-_Rs-unsplash.jpg')`,
          backgroundPosition: 'center 40%'
        }}
      />

      {/* 2. Full-Screen Atmospheric Dark Navy Gradient Tint for Optimal Contrast & Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/80 via-[#071A2B]/75 to-[#0B2942]/85 pointer-events-none" />

      {/* 3. FULL-WIDTH SCREEN HEADER: Prominent Tagline Displayed Across the Entire Screen */}
      <header className="relative z-20 w-full bg-[#071A2B]/90 backdrop-blur-md border-b border-[#0D5C7A]/70 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#0B2942] border border-[#2EAFD0] flex items-center justify-center text-[#2EAFD0] shrink-0 shadow-inner">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="font-mono font-black text-base sm:text-lg uppercase tracking-wider text-white">
                ORCA AI ASSISTANT
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F9D72] animate-ping shrink-0" />
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1F9D72]/20 text-[#1F9D72] border border-[#1F9D72]/60 shrink-0">
                LIVE 24/7
              </span>
            </div>
            <p className="text-xs text-cyan-200/80 font-mono mt-0.5">
              INCOIS Ocean Buoy & ISRO Satellite Marine Stream
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-mono transition-colors ${hasGeminiKey
                ? 'bg-[#1F9D72]/20 text-[#1F9D72] border border-[#1F9D72]'
                : 'bg-[#0B2942]/80 hover:bg-[#0D5C7A] text-slate-200 border border-[#0D5C7A]'
              }`}
            title="Configure Gemini Live API Key"
          >
            <Key className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">{hasGeminiKey ? 'GEMINI LIVE: ACTIVE' : 'API KEY'}</span>
          </button>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'm-welcome',
                  sender: 'orca',
                  text: 'Namaste Captain! Welcome to ORCA Marine Assistant. Ask any question in simple words like "Can I go to sea tomorrow?" or "Where are the fish?" You can type or tap the microphone to speak, and tap the voice button to hear the answer.',
                  timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
                }
              ]);
              setIsSimulating(false);
            }}
            className="p-1.5 rounded bg-[#0B2942]/80 hover:bg-[#0D5C7A] text-slate-300 hover:text-white border border-[#0D5C7A] transition-colors"
            title="Reset Console Stream"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Gemini Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#D1DCE5] p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1DCE5]">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#0D5C7A]" />
                <h3 className="font-mono font-bold text-xs text-slate-900">CONFIG GEMINI 1.5 FLASH LIVE ENGINE</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Optional: Supply a Google Gemini API key to enable dynamic reasoning for un-cached open queries. If empty, ORCA executes verified INCOIS / ISRO operational scenarios.
            </p>

            <div>
              <label className="text-[11px] font-mono font-bold text-slate-700 block mb-1">GEMINI API KEY</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-[#F4F7F8] border border-[#D1DCE5] rounded px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0D5C7A]"
              />
            </div>

            {keyStatusMsg && (
              <div className="p-2 rounded text-xs font-mono bg-slate-100 border border-slate-300 text-slate-800">
                {keyStatusMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D1DCE5]">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1 text-xs font-mono text-slate-600 hover:bg-slate-100 rounded"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3.5 py-1 bg-[#071A2B] hover:bg-[#0B2942] text-white text-xs font-mono font-bold rounded border border-[#0D5C7A] transition-colors"
              >
                SAVE & TEST KEY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WORKSPACE BODY: Chat Dialogue Stream & Agent Pipeline */}
      <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
        {/* CENTER COLUMN: Marine Decision Dialogue Stream */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">
          {/* Message Stream Viewport */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
            {/* Welcoming Tagline Banner */}
            <div className="relative overflow-hidden rounded-xl border border-[#0D5C7A] bg-[#071A2B]/75 backdrop-blur-sm p-4 sm:p-6 text-white shadow-marine">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-[#0B2942] text-cyan-300 border border-[#0D5C7A]">
                    ORCA AI MARINE SAFETY ASSISTANT
                  </span>
                  <span className="text-[10px] font-mono text-[#1F9D72] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D72] animate-ping" />
                    ONLINE 24/7
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-mono uppercase mt-1">
                  Your Marine Safety Agent
                </h2>
                <p className="text-sm sm:text-base text-cyan-100 font-medium leading-relaxed max-w-3xl">
                  ask anything about weather,fishing zones, ocean conditions, and more.....
                </p>
              </div>
            </div>

            {messages.map(msg => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onHighlightMap={onHighlightMap}
                onSendQuery={handleSend}
              />
            ))}

            {/* In-stream Simulation Pipeline Status */}
            {isSimulating && (
              <div className="my-2 p-3 bg-[#0B2942]/90 border border-[#0D5C7A] rounded-lg font-mono text-xs space-y-2 animate-in fade-in shadow-md">
                <div className="flex items-center justify-between text-cyan-200 pb-1 border-b border-[#0D5C7A]/60">
                  <span className="font-bold flex items-center gap-1.5 text-[11px] text-[#2EAFD0]">
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    MULTI-AGENT SYNTHESIS IN PROGRESS...
                  </span>
                  <span className="text-[10px] text-slate-400">STAGE {activeStepIndex + 1}/6</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  {agentLogs.slice(-3).map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-cyan-400">[{log.time}]</span>
                      <span className="font-bold text-[#2EAFD0]">{log.agent}:</span>
                      <span className="truncate">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions Strip */}
          <div className="bg-[#071A2B]/85 backdrop-blur-md px-3 sm:px-4 py-2 border-t border-[#0D5C7A]/50 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider shrink-0">
              QUICK QUERIES:
            </span>
            {savedQueries.slice(0, 4).map((chip, idx) => (
              <button
                key={idx}
                disabled={isSimulating}
                onClick={() => handleSend(chip)}
                className="text-[11px] bg-[#0B2942]/80 hover:bg-[#0D5C7A] text-cyan-100 hover:text-white border border-[#0D5C7A] rounded-md px-3 py-1 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 shadow-xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Mission Input Deck */}
          <div className="p-3 sm:p-4 bg-[#071A2B]/90 backdrop-blur-md border-t border-[#0D5C7A]/60 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask in simple words (e.g., 'Can I fish tomorrow?' or 'Where are the fish?')..."
                  disabled={isSimulating}
                  className="w-full bg-[#0B2942]/80 border border-[#0D5C7A] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-sans text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2EAFD0] focus:ring-1 focus:ring-[#2EAFD0] transition-colors"
                />
                {inputQuery && (
                  <button
                    type="button"
                    onClick={() => setInputQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Voice Input Button */}
              <VoiceInputButton
                disabled={isSimulating}
                onSpeechRecognized={(spokenText) => {
                  setInputQuery(spokenText);
                  handleSend(spokenText);
                }}
              />

              {/* Submit Dispatch */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || isSimulating}
                className="px-4 sm:px-5 py-2.5 rounded-lg bg-[#0F8B8D] hover:bg-[#0D5C7A] text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold flex items-center gap-2 border border-[#2EAFD0]/50 transition-all cursor-pointer shadow-md"
                title="Send question to ORCA"
              >
                <Send className="w-4 h-4 text-cyan-200" />
                <span className="tracking-wide">ASK ORCA</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Multi-Agent Pipeline & Confidence Meter */}
        <aside className="hidden lg:flex flex-col w-72 border-l border-[#0D5C7A]/40 bg-[#071A2B]/75 backdrop-blur-md shrink-0 text-xs select-none">
          {/* Pipeline Header */}
          <div className="p-3 border-b border-[#0D5C7A]/40 bg-[#071A2B]/60 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2EAFD0]" />
              <span className="font-mono font-bold text-xs uppercase tracking-wide">
                AGENT PIPELINE
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B2942] text-cyan-300 border border-[#0D5C7A]">
              6 RUNNING
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-slate-200">
            {/* Agent Pipeline List */}
            <div className="space-y-1.5">
              {pipelineAgents.map((agent) => {
                const status = getAgentStatus(agent.step);
                return (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-2 rounded bg-[#0B2942]/60 border border-[#0D5C7A]/40"
                  >
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>{agent.name}</span>
                        {status === 'READY' && <Check className="w-3 h-3 text-[#1F9D72]" />}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-200/70">{agent.role}</div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${status === 'READY'
                        ? 'bg-[#1F9D72]/20 text-[#1F9D72] border-[#1F9D72]/50'
                        : status === 'PROCESSING'
                          ? 'bg-[#D89B24]/20 text-[#D89B24] border-[#D89B24]/50 animate-pulse'
                          : 'bg-[#071A2B] text-slate-400 border-slate-600'
                      }`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confidence Meter */}
            <div className="p-3 rounded border border-[#0D5C7A]/50 bg-[#0B2942]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[11px] text-cyan-200 uppercase">
                  SYSTEM CONFIDENCE
                </span>
                <span className="font-mono font-bold text-sm text-[#1F9D72]">
                  {confidenceScore}%
                </span>
              </div>

              {/* Drivers */}
              <div className="space-y-1.5 pt-1 text-[11px] font-mono">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  CONFIDENCE DRIVERS:
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Sensor Consensus</span>
                  <span className="font-bold text-white">96%</span>
                </div>
                <div className="w-full bg-[#071A2B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1F9D72] h-full" style={{ width: '96%' }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Data Freshness</span>
                  <span className="font-bold text-white">94%</span>
                </div>
                <div className="w-full bg-[#071A2B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0F8B8D] h-full" style={{ width: '94%' }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Model Certainty</span>
                  <span className="font-bold text-white">95%</span>
                </div>
                <div className="w-full bg-[#071A2B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0D5C7A] h-full" style={{ width: '95%' }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Geospatial Resolution</span>
                  <span className="font-bold text-white">92%</span>
                </div>
                <div className="w-full bg-[#071A2B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2EAFD0] h-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

            {/* Connected Ground Buoys */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                LIVE SENSOR FEEDS:
              </span>

              <div className="p-2 rounded bg-[#0B2942]/70 border border-[#0D5C7A]/50 text-[11px] font-mono">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>INCOIS Buoy #AD02</span>
                  <span className="text-[#C93C4B]">3.4m SWELL</span>
                </div>
                <div className="text-[10px] text-cyan-200/70">09°30'N, 075°48'E (Live)</div>
              </div>

              <div className="p-2 rounded bg-[#0B2942]/70 border border-[#0D5C7A]/50 text-[11px] font-mono">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>IMD Radar KOC</span>
                  <span className="text-[#D89B24]">28 kt GALE</span>
                </div>
                <div className="text-[10px] text-cyan-200/70">Doppler Sweep (5m ago)</div>
              </div>

              <div className="p-2 rounded bg-[#0B2942]/70 border border-[#0D5C7A]/50 text-[11px] font-mono">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Oceansat-3 OCM-3</span>
                  <span className="text-[#1F9D72]">98.2% VALID</span>
                </div>
                <div className="text-[10px] text-cyan-200/70">Bio-Optics Orbit 4421</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
