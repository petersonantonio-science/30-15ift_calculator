import { useState } from "react";
import { FilterProvider } from "./src/context/FilterContext";
import { useLanguage } from "./src/context/LanguageContext";

/* ═══════════════════════════════════════════════════════════════════════════
   DADOS — fonte primária: Prescricao_JogosReduzidos_VIFT.xlsx
   Dados migrados para src/data/*.json (P0-4).
   Qualquer alteração de conteúdo deve ser validada contra a planilha.
   Divergências catalogadas em src/data/divergences.json (P0-3).
   ═══════════════════════════════════════════════════════════════════════════ */

import FORMATS_DATA from "./src/data/formats.json";
import MANIPULATION_DATA from "./src/data/manipulation.json";
import GROUPS_DATA from "./src/data/groups.json";

import FormatsTable from "./src/components/FormatsTable";
import FieldCalculator from "./src/components/FieldCalculator";
import ManipulationView from "./src/components/ManipulationView";
import MethodologyNotice from "./src/components/MethodologyNotice";
import PwaPrompts from "./src/components/PwaPrompts";
import LanguageSwitcher from "./src/components/LanguageSwitcher";

/** Preserva "ApP" em contextos com textTransform:uppercase */
const preserveApP = (str) => {
  if (typeof str !== "string" || !str.includes("ApP")) return str;
  return str.split("ApP").reduce((acc, part, i) => {
    if (i > 0) acc.push(<span key={i} style={{ textTransform: "none" }}>ApP</span>);
    acc.push(part);
    return acc;
  }, []);
};

/* ═══════════════════════════════════════════════════════════════════════════
   ESTILOS — centralizados (P2-2)
   ═══════════════════════════════════════════════════════════════════════════ */

const S = {
  accent: "#00e676",
  bg: "#0d1117",
  surface: "#161b22",
  surface2: "#1a2332",
  border: "#21262d",
  textPrimary: "#fff",
  textSecondary: "#c9d1d9",
  textMuted: "#8a9bb0",
  textDim: "#6a7a8a",
  mono: "'DM Mono', monospace",
  heading: "'Archivo Black', sans-serif",
  body: "'DM Sans', sans-serif",
};

/* ═══════════════════════════════════════════════════════════════════════════
   APP PRINCIPAL
   Componentes extraídos para src/components/ (P2-1).
   ═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [tab, setTab] = useState("prescricao");
  const { t } = useLanguage();

  const tabs = [
    { id: "prescricao", label: t("tabs.prescricao"), icon: "⚽" },
    { id: "calculadora", label: t("tabs.calculadora"), icon: "📐" },
    { id: "variaveis", label: t("tabs.variaveis"), icon: "🔬" },
  ];

  const REF_TABLE = t("refTableData");

  return (
    <FilterProvider>
    <div style={{
      fontFamily: S.body, background: S.bg, color: S.textSecondary,
      minHeight: "100vh", position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .aux-scrollbar::-webkit-scrollbar { height: 8px; }
        .aux-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .aux-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 4px; }
        .aux-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        .aux-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.18) transparent; }
        .calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
        .manip-card { display: grid; grid-template-columns: 160px 170px 1fr 1fr 1fr; gap: 14px; align-items: center; }
        .filter-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .group-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

        /* Vertical scroll interno para tabela em tablet */
        @media (max-width: 1024px) and (min-width: 641px) {
          .formats-table-scroll {
            max-height: 48vh;
            overflow-y: auto;
          }
          .formats-table-scroll::-webkit-scrollbar { width: 6px; }
          .formats-table-scroll::-webkit-scrollbar-track { background: transparent; }
          .formats-table-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        }

        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: 1fr; }
          .manip-card { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .group-cards { grid-template-columns: 1fr; }
        }
        /* Vertical scroll interno para tabela em mobile */
        @media (max-width: 640px) {
          .formats-table-scroll {
            max-height: 44vh;
            overflow-y: auto;
          }
          .formats-table-scroll::-webkit-scrollbar { width: 4px; }
          .formats-table-scroll::-webkit-scrollbar-track { background: transparent; }
          .formats-table-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        }

        @media (max-width: 640px) {
          .app-header { padding: 14px 12px 10px !important; }
          .app-header-title { font-size: 16px !important; }
          .app-header-sub { font-size: 9px !important; }
          .app-tabs { padding: 0 8px !important; }
          .app-tabs-inner { width: 100%; }
          .app-tabs-inner button { flex: 1; justify-content: center; padding: 10px 6px !important; font-size: 11px !important; gap: 4px !important; }
          .app-main { padding: 12px 10px 40px !important; }
          .manip-card { grid-template-columns: 1fr; padding: 10px 12px !important; gap: 8px !important; }
          .group-cards { grid-template-columns: 1fr !important; gap: 8px; }
          .group-cards > div { padding: 10px 12px !important; }
          .filter-bar { gap: 8px; padding: 10px 12px !important; }
          .calc-section { padding: 16px 14px !important; }
          .calc-grid { gap: 18px; }
          .pwa-bar { padding: 8px 12px !important; font-size: 11px !important; gap: 8px !important; }
          .intensity-legend { padding: 10px 12px !important; }
          .intensity-legend .legend-item span:last-child { display: none; }
          .ref-table-wrap { padding: 16px 14px !important; }
          .legend-participants { padding: 8px 12px !important; gap: 10px !important; }
          .scroll-hint-mobile { display: block !important; }
        }
        @media (max-width: 600px) {
          .manip-card { grid-template-columns: 1fr; }
          .group-cards { grid-template-columns: 1fr !important; }
          .filter-bar { gap: 8px; }
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,230,118,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <header className="app-header" style={{
        background: "linear-gradient(180deg, rgba(0,230,118,0.08) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(0,230,118,0.15)", padding: "20px 24px 14px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #00e676, #00b0ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#000", flexShrink: 0,
          }}>JR</div>
          <div style={{ flex: 1 }}>
            <h1 className="app-header-title" style={{ fontFamily: S.heading, fontSize: 20, color: S.textPrimary, margin: 0, letterSpacing: 1 }}>{t("app.title")}</h1>
            <p className="app-header-sub" style={{ fontSize: 10, color: S.textMuted, margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>
              {t("app.subtitle").split("{sub}").map((part, i) => {
                if (i === 0) return part;
                const [sub, rest] = part.split("{/sub}");
                return <span key={i}><sub>{sub}</sub>{rest}</span>;
              })}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Tabs */}
      <nav role="tablist" aria-label="Seções do aplicativo" className="app-tabs" style={{
        background: S.surface, borderBottom: `1px solid ${S.border}`,
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div className="app-tabs-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
          {tabs.map(tb => (
            <button
              key={tb.id}
              role="tab"
              aria-selected={tab === tb.id}
              aria-controls={`panel-${tb.id}`}
              onClick={() => setTab(tb.id)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: "12px 18px",
                fontSize: 13, fontWeight: 700, letterSpacing: .5, fontFamily: S.body,
                color: tab === tb.id ? S.textPrimary : S.textMuted,
                borderBottom: tab === tb.id ? `2px solid ${S.accent}` : "2px solid transparent",
                transition: "all .2s", display: "flex", alignItems: "center", gap: 6,
              }}
            ><span aria-hidden="true">{tb.icon}</span> {tb.label}</button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="app-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 50px" }}>

        {/* ── TAB: Prescrição — componente extraído (P2-1) ── */}
        {tab === "prescricao" && (
          <div role="tabpanel" id="panel-prescricao">
            <FormatsTable />
          </div>
        )}

        {/* ── TAB: Calculadora — componente extraído (P2-1) ── */}
        {tab === "calculadora" && (
          <div role="tabpanel" id="panel-calculadora">
            <div className="calc-section" style={{ background: S.surface, borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
              <h2 style={{ fontFamily: S.heading, fontSize: 16, color: S.textPrimary, marginBottom: 2 }}>{t("calculator.title")}</h2>
              <p style={{ fontSize: 11, color: S.textMuted, marginBottom: 20 }}>
                {t("calculator.subtitle")}
              </p>
              <FieldCalculator />
            </div>
            <div className="ref-table-wrap" style={{ background: S.surface, borderRadius: 16, padding: "24px 28px" }}>
              <h3 style={{ fontFamily: S.heading, fontSize: 13, color: S.accent, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                {preserveApP(t("refTable.title"))}
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                      {[
                        { key: "var", node: t("refTable.variavel") },
                        { key: "sem", node: preserveApP(t("refTable.appSemGK")) },
                        { key: "com", node: preserveApP(t("refTable.appComGK")) },
                        { key: "fmt", node: t("refTable.formatoAdequado") },
                      ].map(h => (
                        <th key={h.key} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: S.textMuted, fontWeight: 700 }}>{h.node}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(REF_TABLE) && REF_TABLE.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${S.border}` }}>
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: S.textSecondary }}>{r.variavel}</td>
                        <td style={{ padding: "8px 12px", fontFamily: S.mono }}>{r.appSem}</td>
                        <td style={{ padding: "8px 12px", fontFamily: S.mono }}>{r.appCom}</td>
                        <td style={{ padding: "8px 12px" }}>{r.formato}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 9, color: S.textDim, marginTop: 10, fontStyle: "italic" }}>
                {t("refTable.fontes")}
              </p>
            </div>
          </div>
        )}

        {/* ── TAB: Variáveis — componente extraído (P2-1) ── */}
        {tab === "variaveis" && (
          <div role="tabpanel" id="panel-variaveis">
            <ManipulationView />
          </div>
        )}
      </main>

      <footer style={{ borderTop: `1px solid ${S.border}`, padding: "14px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 9, color: S.textDim, margin: 0 }}>
          {t("footer.text").split("{sub}").map((part, i) => {
            if (i === 0) return part;
            const [sub, rest] = part.split("{/sub}");
            return <span key={i}><sub>{sub}</sub>{rest}</span>;
          })}
        </p>
      </footer>
      <PwaPrompts />
    </div>
    </FilterProvider>
  );
}
