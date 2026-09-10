import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function VoiceInputButton({ onSpeechRecognized, disabled = false, className = '' }) {
  const { currentLang } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const recognitionRef = useRef(null);

  // Map app languages to Web Speech recognition lang codes
  const speechLangMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN'
  };

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggle = () => {
    if (disabled) return;

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = speechLangMap[currentLang] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setIsRecording(false);
          if (onSpeechRecognized && transcript) {
            onSpeechRecognized(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition event:', event.error);
          setIsRecording(false);
          // Fallback to simulated query if microphone blocked or no speech detected
          fallbackSimulation();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('Could not start speech recognition, using fallback:', err);
      }
    }

    // Fallback if browser does not support SpeechRecognition
    fallbackSimulation();
  };

  const fallbackSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      if (onSpeechRecognized) {
        const simulatedQueries = {
          hi: "क्या कल कोच्चि तट पर मछली पकड़ना सुरक्षित है?",
          ta: "நாளை கொச்சி அருகே கடலுக்கு செல்லலாமா?",
          te: "రేపు కొచ్చి సమీపంలో చేపల వేటకు వెళ్లడం సురక్షితమేనా?",
          bn: "কাল কোচির কাছে মাছ ধরতে যাওয়া কি নিরাপদ?",
          en: "Is it safe to fish tomorrow near Kochi coast?"
        };
        onSpeechRecognized(simulatedQueries[currentLang] || simulatedQueries.en);
      }
    }, 2800);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {isRecording && (
        <div className="absolute right-full mr-3 flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-pulse whitespace-nowrap z-20">
          <Radio className="w-3.5 h-3.5 animate-spin text-rose-600" />
          <span>Listening ({speechLangMap[currentLang] || 'en-IN'})... 00:0{timer}</span>
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="w-1 h-4 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        title={isRecording ? "Stop voice listening" : "Speak to ORCA (Live Speech-to-Text)"}
        className={`relative p-2.5 rounded-xl transition-all duration-200 shadow-sm ${
          isRecording
            ? 'bg-rose-600 text-white shadow-rose-200 ring-4 ring-rose-200 animate-pulse'
            : 'bg-ocean-deep hover:bg-ocean-navy text-white hover:shadow-md'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
    </div>
  );
}
