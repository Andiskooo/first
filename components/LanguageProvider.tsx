"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLocale = "sq" | "de" | "en";

interface LanguageContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LOCALE_STORAGE_KEY = "ecotek_locale";

function detectInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") return "sq";
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale | null;
  if (stored === "sq" || stored === "de" || stored === "en") return stored;
  // Try navigator language as a fallback
  const nav = (navigator.language || navigator.languages?.[0] || "").toLowerCase();
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("en")) return "en";
  return "sq";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Important: start with 'sq' to match the server-rendered <html lang="sq"> and avoid hydration mismatch.
  const [locale, setLocaleState] = useState<SupportedLocale>("sq");

  // On mount, reconcile locale from localStorage or navigator.
  useEffect(() => {
    const initial = detectInitialLocale();
    if (initial !== locale) {
      setLocaleState(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html lang> in sync and persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale]);

  const setLocale = (l: SupportedLocale) => setLocaleState(l);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
