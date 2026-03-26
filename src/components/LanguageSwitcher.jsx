import { useLanguage } from "../context/LanguageContext";
import { S } from "../styles";

const LANGUAGES = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: "flex", gap: 2, background: S.surface2, borderRadius: 8, padding: 2 }}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          aria-label={`Switch to ${label}`}
          style={{
            padding: "3px 8px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            fontFamily: S.body,
            background: lang === code ? S.accent : "transparent",
            color: lang === code ? "#000" : S.textMuted,
            transition: "all .15s",
          }}
        >{label}</button>
      ))}
    </div>
  );
}
