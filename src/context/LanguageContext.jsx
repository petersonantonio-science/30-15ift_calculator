import { createContext, useContext, useState, useCallback, useMemo } from "react";
import pt from "../data/i18n/pt.json";
import en from "../data/i18n/en.json";
import es from "../data/i18n/es.json";

const translations = { pt, en, es };
const STORAGE_KEY = "app-language";
const DEFAULT_LANG = "pt";

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {}
  return DEFAULT_LANG;
}

/**
 * Resolve a dot-path key like "calculator.title" into the translated string.
 * Falls back to pt if the key is missing in the current language.
 * Supports simple interpolation: t("key", { name: "value" }) replaces {name}.
 */
function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((newLang) => {
    if (!translations[newLang]) return;
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch {}
  }, []);

  const t = useCallback((key, params) => {
    let value = resolve(translations[lang], key);
    // Fallback to pt
    if (value === undefined || value === null) {
      value = resolve(translations[DEFAULT_LANG], key);
    }
    // Still nothing — return the key itself
    if (value === undefined || value === null) return key;
    // If not a string (e.g. array or object), return as-is
    if (typeof value !== "string") return value;
    // Interpolate {param} placeholders
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), v);
      });
    }
    return value;
  }, [lang]);

  const ctx = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={ctx}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
