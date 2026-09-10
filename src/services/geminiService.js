import { getScenarioForQuery } from '../data/mockAgents';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

export function getStoredGeminiKey() {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('orca_gemini_api_key') ||
    ''
  );
}

export function setStoredGeminiKey(key) {
  if (key) {
    localStorage.setItem('orca_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('orca_gemini_api_key');
  }
}

export async function testGeminiKey(apiKey) {
  if (!apiKey) return { valid: false, error: 'No key provided' };
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Ping: Respond with "ORCA_OK"' }] }]
      })
    });
    const data = await res.json();
    if (res.ok && data.candidates) {
      return { valid: true };
    }
    return { valid: false, error: data.error?.message || 'Invalid API key response' };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

export async function generateOrcaAgentResponse(userQuery, role = 'fisherman', language = 'en', chatHistory = []) {
  const apiKey = getStoredGeminiKey();
  const fallbackScenario = getScenarioForQuery(userQuery);

  // If no Gemini key configured, use high-fidelity scenario engine
  if (!apiKey) {
    return {
      text: fallbackScenario.recommendation,
      scenario: fallbackScenario
    };
  }

  const systemInstruction = `
You are ORCA (Oceanic Risk Calculation & Advisory), an AI-Powered Marine Safety and Multi-Agent Assistant for Smart India Hackathon (SIH26176, ISRO Disaster Management).
You synthesize data from 6 autonomous agents:
1. Planner Agent (route & trip planning)
2. Ocean Agent (INCOIS wave buoys, SST, chlorophyll-a from Oceansat-3)
3. Weather Agent (IMD Doppler radar, wind speed, squall warnings)
4. Geo Agent (NavIC geofencing, 12nm baseline, bathymetry)
5. Risk Agent (composite hazard index 0-100)
6. Decision / ORCA Agent (actionable directives)

USER PERSONA: ${role}
PREFERRED LANGUAGE: ${language}

BEHAVIOR GUIDELINES:
1. Speak conversationally, warmly, and politely directly to the user (e.g. "Namaste Captain!", "Hello Skipper!").
2. ALWAYS provide a comprehensive, well-structured conversational response using Markdown (use bold text, bullet points, headers, emojis).
3. If the user asks about marine safety, weather, fishing feasibility, or a coastal region:
   - State the Risk Level clearly (e.g. LOW RISK, MODERATE CAUTION, or HIGH RISK WARNING).
   - Provide predicted Wave Height, Wind Speed, and Sea State.
   - Give practical safety advice (life jackets, NavIC satellite receiver checks, anchor & fuel checks).
4. If the user asks conceptual, technical, or casual questions (e.g. "Who are you?", "Explain how the 6 agents work", "What is NavIC?"):
   - Answer in engaging, knowledgeable markdown conversation.
`;

  try {
    // Build multi-turn contents array for Gemini
    const contents = [];
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      // Keep up to last 8 turns
      const recent = chatHistory.slice(-8);
      for (const m of recent) {
        if (m.sender === 'user' && m.text) {
          contents.push({ role: 'user', parts: [{ text: m.text }] });
        } else if (m.sender === 'orca') {
          const modelText = m.text || m.scenario?.headline || m.scenario?.recommendation || '';
          if (modelText) {
            contents.push({ role: 'model', parts: [{ text: modelText }] });
          }
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: userQuery }] });

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.3
        }
      })
    });

    if (!res.ok) {
      console.warn("Gemini API call returned non-OK, falling back to scenario engine");
      return {
        text: fallbackScenario.recommendation,
        scenario: fallbackScenario
      };
    }

    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.find(p => p.text && !p.thought) || data.candidates?.[0]?.content?.parts?.[0];
    let rawText = part?.text;
    if (!rawText) {
      return {
        text: fallbackScenario.recommendation,
        scenario: fallbackScenario
      };
    }

    // Check if response is JSON formatted
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && (parsed.recommendation || parsed.headline || parsed.conversationalMessage)) {
        return {
          text: parsed.conversationalMessage || parsed.recommendation || parsed.headline,
          scenario: {
            ...fallbackScenario,
            ...parsed
          }
        };
      }
    } catch {
      // It is plain conversational markdown text from Gemini
    }

    // Derive risk level and conditions from text if possible
    let riskLevel = fallbackScenario.riskLevel;
    let riskScore = fallbackScenario.riskScore;
    const lowerText = rawText.toLowerCase();

    if (lowerText.includes('high risk') || lowerText.includes('red alert') || lowerText.includes('gale warning') || lowerText.includes('severe')) {
      riskLevel = 'HIGH';
      riskScore = Math.max(riskScore, 80);
    } else if (lowerText.includes('moderate risk') || lowerText.includes('caution') || lowerText.includes('rough')) {
      riskLevel = 'MEDIUM';
      riskScore = 55;
    } else if (lowerText.includes('low risk') || lowerText.includes('safe') || lowerText.includes('good conditions')) {
      riskLevel = 'LOW';
      riskScore = 20;
    }

    // Extract wave height if mentioned
    const waveMatch = rawText.match(/(\d+(\.\d+)?\s*(to|-)\s*\d+(\.\d+)?\s*meters?|\d+(\.\d+)?\s*meters?|\d+(\.\d+)?m\b)/i);
    const windMatch = rawText.match(/(\d+(\.\d+)?\s*(to|-)\s*\d+(\.\d+)?\s*knots?|\d+(\.\d+)?\s*knots?|\d+(\.\d+)?\s*km\/h)/i);

    const conditionsSummary = {
      ...fallbackScenario.conditionsSummary,
      ...(waveMatch ? { waveHeight: waveMatch[0] } : {}),
      ...(windMatch ? { windSpeed: windMatch[0] } : {})
    };

    const enhancedScenario = {
      ...fallbackScenario,
      query: userQuery,
      riskLevel: riskLevel,
      riskScore: riskScore,
      headline: `${riskLevel} RISK ADVISORY - SECTOR ${fallbackScenario.targetZone.toUpperCase()}`,
      recommendation: rawText.slice(0, 320),
      conditionsSummary: conditionsSummary
    };

    return {
      text: rawText,
      scenario: enhancedScenario
    };
  } catch (err) {
    console.error("Error invoking Gemini live agent:", err);
    return {
      text: fallbackScenario.recommendation,
      scenario: fallbackScenario
    };
  }
}

