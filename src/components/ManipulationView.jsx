import { S } from "../styles";
import { useLanguage } from "../context/LanguageContext";
import { resolveField } from "../utils/resolveField";
import MANIPULATION_DATA from "../data/manipulation.json";

const MANIPULATION = MANIPULATION_DATA.map(m => ({
  variavel: m.variavel,
  manip: m.efeito,
  efeitoFC: m.efeitoFC,
  efeitoDist: m.efeitoDist,
  efeitoVel: m.efeitoVel,
  ref: m.referencia,
  refCompleta: m.referenciaCompleta || "",
  sourceStatus: m.sourceStatus,
  id: m.id,
}));

function DivergenceBadge({ status }) {
  const { t } = useLanguage();
  if (!status || status === "aligned") return null;
  const cfg = {
    divergent: { bg: "rgba(231,76,60,.15)", fg: "#e74c3c", label: t("divergence.divergente") },
    pending: { bg: "rgba(243,156,18,.15)", fg: "#f39c12", label: t("divergence.pendente") },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span title={t("divergence.statusTooltip", { label: c.label })} style={{
      display: "inline-block", padding: "1px 6px", borderRadius: 4,
      fontSize: 8, fontWeight: 700, letterSpacing: .5,
      background: c.bg, color: c.fg, marginLeft: 6, verticalAlign: "middle",
    }}>{c.label}</span>
  );
}

export default function ManipulationView() {
  const { t, lang } = useLanguage();
  const r = (field) => resolveField(field, lang);
  return (
    <div>
      <h2 style={{ fontFamily: S.heading, fontSize: 16, color: S.textPrimary, marginBottom: 4 }}>{t("manipulation.title")}</h2>
      <p style={{ fontSize: 11, color: S.textMuted, marginBottom: 20 }}>{t("manipulation.subtitle")}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MANIPULATION.map((m, i) => {
          const fcText = resolveField(m.efeitoFC, "pt");
          const borderColor = fcText.includes("↑↑") ? "#e74c3c" : fcText.includes("↑") ? "#f39c12" : fcText.includes("↓") ? "#3498db" : S.textMuted;
          return (
            <div key={i} className="manip-card" style={{
              background: S.surface, borderRadius: 12, padding: "14px 18px",
              borderLeft: `3px solid ${borderColor}`,
            }}>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{t("manipulation.variavel")}</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: S.textPrimary }}>
                  {r(m.variavel)}
                  <DivergenceBadge status={m.sourceStatus} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{t("manipulation.manipulacao")}</div>
                <div style={{ fontSize: 11, color: S.accent, fontWeight: 600 }}>{r(m.manip)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{t("manipulation.fcIntens")}</div>
                <div style={{ fontSize: 11, fontFamily: S.mono }}>{r(m.efeitoFC)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{t("manipulation.distancia")}</div>
                <div style={{ fontSize: 11, fontFamily: S.mono }}>{r(m.efeitoDist)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{t("manipulation.altaVel")}</div>
                <div style={{ fontSize: 11, fontFamily: S.mono }}>{r(m.efeitoVel)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{t("manipulation.ref")}</div>
                <div style={{ fontSize: 10, color: S.textMuted, cursor: m.refCompleta ? "help" : "default" }}
                     title={m.refCompleta || m.ref}>{m.ref}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 9, color: S.textDim, fontStyle: "italic" }}>
        Fontes: Hill-Haas et al. (2010, 2011) · Casamichana & Castellano (2010) · Casamichana et al. (2018, 2020) · Rodríguez-Fernández et al. (2024) · Clemente et al. (2014, 2023) · Santos et al. (2024) · Guard et al. (2022) · Zhang et al. (2023)
      </div>
    </div>
  );
}
