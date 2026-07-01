import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../lib/translations";

type Lang = "en" | "bn";

interface LanguageContextType {
  language: Lang;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({ 
  language: 'bn', 
  t: (k) => k, 
  toggleLanguage: () => {} 
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Lang>("bn");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("poraboo_lang") as Lang;
    if (savedLang === "en" || savedLang === "bn") {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.startsWith("bn") ? "bn" : "en";
      setLanguage(browserLang);
      localStorage.setItem("poraboo_lang", browserLang);
    }
  }, []);

  const toggleLanguage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const next: Lang = language === "bn" ? "en" : "bn";
      setLanguage(next);
      localStorage.setItem("poraboo_lang", next);
      setIsTransitioning(false);
    }, 150);
  };

  const t = (key: string): string => {
    const value = translations[language]?.[key] || translations["en"]?.[key];
    if (!value) {
      console.warn(`Missing translation key: ${key}`);
      return key.replace(/_/g, ' ');
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
