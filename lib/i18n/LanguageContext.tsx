"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Language, type TranslationKey } from "./translations";

interface LanguageContextValue {
  language: Language;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // The URL is the source of truth for the language (see middleware.ts, which
  // resolves "/en" vs. the unprefixed site). Re-sync whenever navigation
  // brings a new initialLanguage from the server.
  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(translations[key][language], vars),
    [language],
  );

  const value = useMemo<LanguageContextValue>(() => ({ language, t }), [language, t]);

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

/** Prefixes an internal path with "/en" when linking to the English site, leaving Spanish paths untouched. */
export function withLocalePrefix(path: string, language: Language): string {
  if (language !== "en") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}
