import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

// Language always defaults to English.
// It only changes when the user explicitly selects a different language.
const DEFAULT_LANGUAGE = 'en';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  // Load saved language preference from backend on mount (if authenticated)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    fetch('/api/user/language', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.language && translations[data.language]) {
          setLanguageState(data.language);
        }
      })
      .catch(() => { /* silent — default to English */ });
  }, []);

  const changeLanguage = (lang) => {
    if (!translations[lang]) return;
    setLanguageState(lang);


    // Persist to backend if authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('/api/user/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ language: lang })
      }).catch(() => { /* silent save failure */ });
    }
  };

  const t = translations[language] || translations[DEFAULT_LANGUAGE];

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
