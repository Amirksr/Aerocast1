"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  dictionaries,
  DEFAULT_LANG,
  resolvePath,
  type Lang,
} from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  dict: Record<string, any>;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "aero-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Read the persisted choice once on mount (client only).
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Lang) || DEFAULT_LANG;
    setLangState(saved);
    applyLang(saved);
  }, []);

  const applyLang = (next: Lang) => {
    const root = document.documentElement;
    root.lang = next;
    root.dir = next === "fa" ? "rtl" : "ltr";
  };

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyLang(next);
  };

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "fa" ? "en" : "fa";
      localStorage.setItem(STORAGE_KEY, next);
      applyLang(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => resolvePath(dictionaries[lang], key),
    [lang]
  );

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir: lang === "fa" ? "rtl" : "ltr",
        dict: dictionaries[lang],
        setLang,
        toggle,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}

export const useT = () => useI18n().t;
export const useLang = () => useI18n().lang;
