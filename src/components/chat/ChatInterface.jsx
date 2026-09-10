import React, { useState, useRef, useEffect } from 'react';
import { ChatBubble } from './ChatBubble';
import { AgentStatusPanel } from '../agents/AgentStatusPanel';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { getScenarioForQuery, DEMO_SCENARIOS } from '../../data/mockAgents';
import { generateOrcaAgentResponse, getStoredGeminiKey, setStoredGeminiKey, testGeminiKey } from '../../services/geminiService';
import { Send, Sparkles, RefreshCw, Cpu, Key, CheckCircle2 } from 'lucide-react';

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
      text: 'Namaste. I am ORCA, your AI Marine Safety & Collaborative Multi-Agent Assistant. I synthesize real-time radar, satellite ocean color, wave buoys, and coastal geofencing to evaluate navigation safety and fishing zones. How can our agent collective assist your voyage today?',
      timestamp: '10:40 AM'
    },
    {
      id: 'm-demo-seed',
      sender: 'orca',
      scenario: DEMO_SCENARIOS.kochi,
      timestamp: '10:41 AM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSimulating, activeStepIndex]);

  // Handle external initialQuery (e.g. from ZoneCard "Ask ORCA")
  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const runMultiAgentPipeline = async (queryText, historyMessages = []) => {
    // Initial preview scenario while LLM is generating
    const previewScenario = getScenarioForQuery(queryText);
    setCurrentScenario(previewScenario);
    setIsSimulating(true);
    setActiveStepIndex(0);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAgentLogs([
      { time: now, agent: 'Planner', message: `Decomposing query: "${queryText.slice(0, 45)}"` }
    ]);

    // Kick off real LLM generation in parallel with full chat history
    const livePromise = generateOrcaAgentResponse(queryText, role, currentLang, historyMessages);

    // Step 0: Planner Agent
    setTimeout(() => {
      setActiveStepIndex(1); // Parallel agents: Ocean, Weather, Geo
      setAgentLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), agent: 'Ocean', message: 'INCOIS Wave Buoy #AD02 & Oceansat-3 bio-optics received.' },
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), agent: 'Weather', message: 'IMD Doppler Radar reflectivity matrix calculated.' },
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), agent: 'Geo', message: 'NavIC geofence & territorial 12nm baseline validated.' }
      ]);

      // Step 2: Risk Agent
      setTimeout(() => {
        setActiveStepIndex(4); // Risk agent index
        setAgentLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), agent: 'Risk', message: `Composite risk index: ${previewScenario.riskScore}/100 (${previewScenario.riskLevel}) calculated.` }
        ]);

        // Step 3: Decision / ORCA Agent
        setTimeout(() => {
          setActiveStepIndex(5); // Decision agent
          setAgentLogs(prev => [
            ...prev,
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), agent: 'ORCA', message: 'Final synthesized natural language marine advisory drafted.' }
          ]);

          // Complete pipeline and append response card
          setTimeout(async () => {
            let finalScenario = previewScenario;
            let responseText = previewScenario.recommendation;

            try {
              const live = await livePromise;
              if (live) {
                if (live.text) responseText = live.text;
                if (live.scenario) finalScenario = live.scenario;
              }
            } catch (e) {
              console.warn("Using preview scenario fallback:", e);
            }

            setIsSimulating(false);
            setActiveStepIndex(-1);

            const orcaMessage = {
              id: `orca-${Date.now()}`,
              sender: 'orca',
              text: responseText,
              scenario: finalScenario,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, orcaMessage]);
          }, 600);
        }, 800);
      }, 900);
    }, 800);
  };

  const handleSend = (text = null) => {
    const q = (text || inputQuery).trim();
    if (!q || isSimulating) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputQuery('');

    // Kick off multi-agent collaborative pipeline with chat history
    runMultiAgentPipeline(q, nextMessages);
  };

  const quickChips = t('quickChips') || [
    "Is it safe to fish tomorrow near Kochi coast?",
    "Show today's best PFZ coordinates off Visakhapatnam",
    "Marine alert status for Gulf of Mannar & Rameswaram",
    "Plot safest return route to Mangalore avoiding rough waters"
  ];

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiKey());
  const [keyStatusMsg, setKeyStatusMsg] = useState(null);

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      setStoredGeminiKey('');
      setKeyStatusMsg('Key removed. Switched to high-fidelity scenario engine.');
      setTimeout(() => setKeyStatusMsg(null), 3000);
      return;
    }
    setKeyStatusMsg('Testing Gemini key connection...');
    const result = await testGeminiKey(apiKeyInput.trim());
    if (result.valid) {
      setStoredGeminiKey(apiKeyInput.trim());
      setKeyStatusMsg('Success! Gemini 1.5 Flash live engine connected.');
      setTimeout(() => {
        setKeyStatusMsg(null);
        setShowKeyModal(false);
      }, 1500);
    } else {
      setKeyStatusMsg(`Error: ${result.error || 'Failed to connect. Check key.'}`);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/90 shadow-marine overflow-hidden ${className}`}>
      {/* Assistant Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ocean-deep text-white flex items-center justify-center shadow-sm">
            <Cpu className="w-4 h-4 text-ocean-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-900">{t('dialogueCenterTitle', 'ORCA Multi-Agent Dialogue Center')}</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{t('dialogueCenterSub', '6 Autonomous Agents Synchronized • INCOIS / ISRO Feeds')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live AI Status pill */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              hasGeminiKey
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-sky-50 hover:bg-sky-100 text-ocean-deep border border-sky-200'
            }`}
            title="Configure Gemini Live API Key"
          >
            <Key className="w-3.5 h-3.5 text-ocean-teal" />
            <span className="hidden sm:inline">{hasGeminiKey ? t('geminiActive', 'Gemini Live: ACTIVE') : t('configureApiKey', 'Configure API Key')}</span>
          </button>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'm-seed',
                  sender: 'orca',
                  scenario: DEMO_SCENARIOS.kochi,
                  timestamp: '10:42 AM'
                }
              ]);
              setIsSimulating(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gemini Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-ocean-teal" />
                <h3 className="font-bold text-sm text-slate-900">{t('configGeminiKey', 'Configure Live Gemini API Key')}</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t('configGeminiDesc', 'Connect your Google Gemini API key to power 100% live multi-agent reasoning for any dynamic query. (If blank, ORCA uses the verified scenario engine).')}
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">{t('geminiKeyLabel', 'Google Gemini API Key (VITE_GEMINI_API_KEY)')}</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-teal"
              />
            </div>

            {keyStatusMsg && (
              <div className={`p-2.5 rounded-lg text-xs font-medium ${
                keyStatusMsg.startsWith('Success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                keyStatusMsg.startsWith('Error') ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                'bg-sky-50 text-sky-800'
              }`}>
                {keyStatusMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-1.5 rounded-lg bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-bold shadow-xs transition-colors"
              >
                {t('saveConnectKey', 'Save & Connect Key')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat messages scroll viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        {messages.map(msg => (
          <ChatBubble
            key={msg.id}
            message={msg}
            onHighlightMap={onHighlightMap}
            onSendQuery={handleSend}
          />
        ))}

        {/* Live Multi-Agent Execution Panel inside chat stream */}
        {isSimulating && currentScenario && (
          <div className="my-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <AgentStatusPanel
              steps={currentScenario.agentSteps}
              activeStepIndex={activeStepIndex}
              isSimulating={isSimulating}
              logs={agentLogs}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips Carousel */}
      <div className="bg-white/80 backdrop-blur px-4 pt-2.5 pb-1 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-ocean-teal" />
          <span>{t('quickCoastalQuestions', 'Quick Coastal Questions')}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              disabled={isSimulating}
              onClick={() => handleSend(chip)}
              className="text-xs bg-slate-100 hover:bg-sky-50 hover:text-ocean-deep hover:border-sky-300 border border-slate-200/80 rounded-full px-3 py-1.5 whitespace-nowrap transition-colors text-slate-700 font-medium shrink-0 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t('askOrcaPlaceholder', "Ask ORCA (e.g. 'Is it safe to fish tomorrow near Kochi?')")}
              disabled={isSimulating}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:bg-white transition-all"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Voice Input with recording animation */}
          <VoiceInputButton
            disabled={isSimulating}
            onSpeechRecognized={(spokenText) => {
              setInputQuery(spokenText);
              handleSend(spokenText);
            }}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isSimulating}
            className="p-3 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
            title="Send query to ORCA Agent Collective"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
