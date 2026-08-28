"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations, type Language, type TranslationKey } from "./translations";

const STORAGE_KEY = "barraca-lang";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [hydrated, setHydrated] = useState(false);

  // Reads the stored preference once on mount. Kept separate from the write
  // effect below so a fresh mount never re-persists the "es" default before
  // the stored value has been read (that race would clobber it — see the
  // hydrated guard in the next effect).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "es" || stored === "en") setLanguageState(stored);
    } catch {
      // Ignore storage access errors (private browsing, disabled storage).
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage access errors (private browsing, disabled storage).
    }
  }, [language, hydrated]);

  const setLanguage = useCallback((next: Language) => setLanguageState(next), []);
  const toggleLanguage = useCallback(
    () => setLanguageState((current) => (current === "es" ? "en" : "es")),
    [],
  );

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(translations[key][language], vars),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider.");
  return context;
}

/** Picks the English value when available and the active language is English, falling back to Spanish. */
export function pickText(language: Language, es: string, en?: string): string {
  return language === "en" && en ? en : es;
}
