import React, { createContext, useContext, useState } from 'react';
import { translations, languages } from '../data/translations';

const LanguageContext = createContext();

// Build reverse lookup from English text values to keys
const reverseMap = {};
if (translations.en) {
  for (const [k, v] of Object.entries(translations.en)) {
    if (typeof v === 'string') {
      reverseMap[v.trim().toLowerCase()] = k;
    }
  }
}

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLangState] = useState(() => {
    return localStorage.getItem('orca_app_language') || 'en';
  });

  const setCurrentLang = (lang) => {
    setCurrentLangState(lang);
    localStorage.setItem('orca_app_language', lang);
  };

  const t = (keyOrText, fallback = null) => {
    if (!keyOrText) return '';
    const dict = translations[currentLang] || translations.en;

    // 1. Direct key match
    if (dict[keyOrText] !== undefined) {
      return dict[keyOrText];
    }

    // 2. Reverse lookup by English phrase
    if (typeof keyOrText === 'string') {
      const normalized = keyOrText.trim().toLowerCase();
      const mappedKey = reverseMap[normalized];
      if (mappedKey && dict[mappedKey] !== undefined) {
        return dict[mappedKey];
      }
    }

    // 2.5 Reverse lookup by English fallback string if provided
    if (typeof fallback === 'string') {
      const normFallback = fallback.trim().toLowerCase();
      const mappedFallbackKey = reverseMap[normFallback];
      if (mappedFallbackKey && dict[mappedFallbackKey] !== undefined) {
        return dict[mappedFallbackKey];
      }
    }

    // 3. Fallback to English dictionary key
    if (translations.en[keyOrText] !== undefined) {
      return translations.en[keyOrText];
    }

    return fallback !== null ? fallback : keyOrText;
  };

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t, currentLangObj, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
