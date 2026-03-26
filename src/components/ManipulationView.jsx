import { S } from "../styles";
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

// P0-3: Badge para itens com divergência
function DivergenceBadge({ status }) {
  if (!status || status === "aligned") return null;
  const cfg = {
    divergent: { bg: "rgba(231,76,60,.15)", fg: "#e74c3c", label: "Divergente" },
    pending: { bg: "rgba(243,156,18,.15)", fg: "#f39c12", label: "Pendente" },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span title={`Status: ${c.label} — verificar contra planilha`} style={{
      display: "inline-block", padding: "1px 6px", borderRadius: 4,
      fontSize: 8, fontWeight: 700, letterSpacing: .5,
      background: c.bg, color: c.fg, marginLeft: 6, verticalAlign: "middle",
    }}>{c.label}</span>
  );
}

export default function ManipulationView() {
  return (
    <div>
      <h2 style={{ fontFamily: S.heading, fontSize: 16, color: S.textPrimary, marginBottom: 4 }}>VARIÁVEIS DE MANIPULAÇÃO</h2>
      <p style={{ fontSize: 11, color: S.textMuted, marginBottom: 20 }}>Efeitos fisiológicos das variáveis de manipulação dos jogos reduzidos</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MANIPULATION.map((m, i) => {
          const borderColor = m.efeitoFC.includes("↑↑") ? "#e74c3c" : m.efeitoFC.includes("↑") ? "#f39c12" : m.efeitoFC.includes("↓") ? "#3498db" : S.textMuted;
          return (
            <div key={i} className="manip-card" style={{
              background: S.surface, borderRadius: 12, padding: "14px 18px",
              borderLeft: `3px solid ${borderColor}`,
            }}>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Variável</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: S.textPrimary }}>
                  {m.variavel}
                  <DivergenceBadge status={m.sourceStatus} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Manipulação</div>
                <div style={{ fontSize: 11, color: S.accent, fontWeight: 600 }}>{m.manip}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>FC / Intens.</div>
                <div style={{ fontSize: 11, fontFamily: S.mono }}>{m.efeitoFC}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Distância</div>
                <div style={{ fontSize: 11, fontFamily: S.mono }}>{m.efeitoDist}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Alta Vel.</div>
                <div style={{ fontSize: 11, fontFamily: S.mono }}>{m.efeitoVel}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Ref.</div>
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
