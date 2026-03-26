import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function PwaPrompts() {
  const { t } = useLanguage();
  const [installEvt, setInstallEvt] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onInstall = (e) => { e.preventDefault(); setInstallEvt(e); };
    const onUpdate = () => setShowUpdate(true);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("sw-update-available", onUpdate);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstall);
      window.removeEventListener("sw-update-available", onUpdate);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    await installEvt.userChoice;
    setInstallEvt(null);
  };

  const handleUpdate = () => { setShowUpdate(false); window.location.reload(); };

  if (dismissed && !showUpdate) return null;
  if (!installEvt && !showUpdate) return null;

  const bar = {
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
    background: "#161b22", borderTop: "1px solid #21262d",
    padding: "10px 20px", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 12, fontSize: 12, color: "#c9d1d9",
  };
  const btn = {
    padding: "6px 14px", borderRadius: 6, border: "none",
    fontSize: 11, fontWeight: 700, cursor: "pointer",
  };

  if (showUpdate) {
    return (
      <div className="pwa-bar" style={bar}>
        <span>{t("pwa.novaVersao")}</span>
        <button onClick={handleUpdate} style={{ ...btn, background: "#00e676", color: "#000" }}>{t("pwa.atualizar")}</button>
      </div>
    );
  }

  return (
    <div className="pwa-bar" style={bar}>
      <span>{t("pwa.instalarMsg")}</span>
      <button onClick={handleInstall} style={{ ...btn, background: "#00e676", color: "#000" }}>{t("pwa.instalar")}</button>
      <button onClick={() => setDismissed(true)} style={{ ...btn, background: "transparent", color: "#8a9bb0", border: "1px solid #21262d" }}>{t("pwa.depois")}</button>
    </div>
  );
}
