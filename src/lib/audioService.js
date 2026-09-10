let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Authentic Marine Foghorn / Warning Horn using Web Audio API synthesis
 */
export function playMarineWarningHorn() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(145, ctx.currentTime); // Deep marine tone
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(182, ctx.currentTime); // Musical fifth harmonic

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.6);
    osc2.stop(ctx.currentTime + 1.6);
  } catch (err) {
    console.warn('Web Audio warning horn not supported:', err);
  }
}

/**
 * Rapid geofence proximity double-ping alert
 */
export function playDistressBeaconPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    [0, 0.25].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + delay + 0.18);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.18);
    });
  } catch (err) {
    console.warn('Web Audio beacon ping error:', err);
  }
}

/**
 * Native Web Speech Synthesis for spoken advisory readout
 */
export function speakAdvisory(text, langCode = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported on this browser');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any active speech

  const cleanText = text.replace(/[*_#`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Map app languages to BCP 47 voice tags
  const langMap = {
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    en: 'en-IN'
  };

  utterance.lang = langMap[langCode] || 'en-IN';
  utterance.rate = 0.95; // slightly deliberate for clarity over rolling waves
  utterance.pitch = 1.0;

  // Pick suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(langCode));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

let sosSirenInterval = null;
let sosOscillators = [];

/**
 * Continuous dual-tone marine emergency acoustic siren & SOS Morse alert
 */
export function startEmergencySosSiren() {
  stopEmergencySosSiren(); // ensure no overlap

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    let isHigh = false;

    // Immediately play first pulse
    const playTone = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(isHigh ? 960 : 680, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.48);

        isHigh = !isHigh;
      } catch (e) {
        console.warn('Error in siren pulse:', e);
      }
    };

    playTone();
    sosSirenInterval = setInterval(playTone, 500);
  } catch (err) {
    console.warn('Web Audio emergency siren error:', err);
  }
}

/**
 * Stops any ongoing emergency acoustic siren
 */
export function stopEmergencySosSiren() {
  if (sosSirenInterval) {
    clearInterval(sosSirenInterval);
    sosSirenInterval = null;
  }
  sosOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch {}
  });
  sosOscillators = [];
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

