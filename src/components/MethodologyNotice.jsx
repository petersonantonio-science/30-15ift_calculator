import { S } from "../styles";
import { useLanguage } from "../context/LanguageContext";

export default function MethodologyNotice({ type = "app", children }) {
  const { t } = useLanguage();
  const styles = {
    app: { borderColor: S.accent, icon: "\u26a0" },
    divergence: { borderColor: "#e74c3c", icon: "\u26a0" },
    info: { borderColor: "#3498db", icon: "\u2139\ufe0f" },
  };
  const cfg = styles[type] || styles.app;

  return (
    <div
      role="note"
      style={{
        marginTop: 14,
        background: S.surface,
        borderRadius: 10,
        padding: "12px 16px",
        borderLeft: `3px solid ${cfg.borderColor}`,
        fontSize: 11,
        color: S.textMuted,
        lineHeight: 1.6,
      }}
    >
      {children || (
        <>
          <strong style={{ color: S.textSecondary }}>
            {cfg.icon} {t("methodology.title")}
          </strong>{" "}
          {t("methodology.text")}
        </>
      )}
    </div>
  );
}
