import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { S } from "../styles";
import FORMATS_DATA from "../data/formats.json";
import GROUPS_DATA from "../data/groups.json";
import MethodologyNotice from "./MethodologyNotice";
import { useFilterContext } from "../context/FilterContext";
import Pill from "./Pill";

const INTENSITY_LEVELS = [
  { level: "Muito alta", color: "#e74c3c", textOnBg: "#fff", desc: "Supera demanda de jogo · SSG curtos · >90% FC máx" },
  { level: "Alta",       color: "#e67e22", textOnBg: "#fff", desc: "Próximo da demanda de jogo · SSG/MSG · 85–90% FC máx" },
  { level: "Moderada",   color: "#f1c40f", textOnBg: "#222", desc: "Levemente abaixo · MSG · 80–86% FC máx" },
  { level: "Baixa",      color: "#3498db", textOnBg: "#fff", desc: "Abaixo da demanda de jogo · MSG/LSG · 77–83% FC máx" },
  { level: "Muito baixa",color: "#95a5a6", textOnBg: "#fff", desc: "Bem abaixo · LSG · <80% FC máx" },
];

const INTENSITY_MAP = Object.fromEntries(INTENSITY_LEVELS.map(i => [i.level, i]));
INTENSITY_MAP["—"] = { level: "—", color: "#bdc3c7", textOnBg: "#666", desc: "" };

const GROUPS = GROUPS_DATA.map(g => ({
  id: g.group, label: g.label, sub: g.description,
  vMin: g.vMin, vMax: g.vMax, color: g.color, desc: g.detailedDesc,
}));

// Map external data to internal format
const FORMATS = FORMATS_DATA.map(f => ({
  ...f, formato: f.label,
}));

function IntensityBadge({ level }) {
  const info = INTENSITY_MAP[level] || INTENSITY_MAP["—"];
  return (
    <span
      role="img"
      aria-label={`Intensidade: ${level}`}
      title={info.desc}
      style={{
        display: "inline-block", padding: "3px 10px", borderRadius: 20,
        fontSize: 11, fontWeight: 700, letterSpacing: ".3px",
        background: info.color, color: info.textOnBg, whiteSpace: "nowrap",
        cursor: info.desc ? "help" : "default",
      }}
    >{level}</span>
  );
}

function ClassifBadge({ classif }) {
  const map = { SSG: { bg: "rgba(231,76,60,.15)", fg: "#e74c3c" }, MSG: { bg: "rgba(243,156,18,.15)", fg: "#f39c12" }, LSG: { bg: "rgba(39,174,96,.15)", fg: "#27ae60" } };
  const c = map[classif] || map.SSG;
  return (
    <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 6, fontSize: 9, fontWeight: 800, letterSpacing: 1, background: c.bg, color: c.fg }}>{classif}</span>
  );
}

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

// Hook to manage horizontal scroll state, fades, and aux scrollbar sync
function useHorizontalScroll() {
  const scrollRef = useRef(null);
  const auxRef = useRef(null);
  const innerRef = useRef(null);
  const syncing = useRef(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tol = 2;
    const overflow = el.scrollWidth > el.clientWidth + tol;
    setHasOverflow(overflow);
    setFadeLeft(el.scrollLeft > tol);
    setFadeRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tol);
    // sync aux inner width
    if (innerRef.current) {
      innerRef.current.style.width = el.scrollWidth + "px";
    }
  }, []);

  const onTableScroll = useCallback(() => {
    if (syncing.current) return;
    syncing.current = true;
    const el = scrollRef.current;
    if (auxRef.current) auxRef.current.scrollLeft = el.scrollLeft;
    update();
    syncing.current = false;
  }, [update]);

  const onAuxScroll = useCallback(() => {
    if (syncing.current) return;
    syncing.current = true;
    const el = auxRef.current;
    if (scrollRef.current) scrollRef.current.scrollLeft = el.scrollLeft;
    update();
    syncing.current = false;
  }, [update]);

  useEffect(() => {
    update();
    const ro = new ResizeObserver(update);
    if (scrollRef.current) ro.observe(scrollRef.current);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [update]);

  return { scrollRef, auxRef, innerRef, hasOverflow, fadeLeft, fadeRight, onTableScroll, onAuxScroll, update };
}

export default function FormatsTable() {
  const { filterClassif, setFilterClassif, filterGrupo, setFilterGrupo, filterIntensity, setFilterIntensity } = useFilterContext();
  const [searchFormat, setSearchFormat] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const hs = useHorizontalScroll();

  const filtered = useMemo(() => {
    return FORMATS.filter(f => {
      if (filterClassif !== "Todos" && f.classif !== filterClassif) return false;
      if (filterGrupo !== "Todos" && filterIntensity !== "Todas") {
        const key = `grupo${filterGrupo}`;
        if (f[key] !== filterIntensity) return false;
      }
      if (searchFormat && !f.formato.toLowerCase().includes(searchFormat.toLowerCase())) return false;
      return true;
    });
  }, [filterClassif, filterGrupo, filterIntensity, searchFormat]);

  // Recalculate overflow when filtered data changes
  useEffect(() => { requestAnimationFrame(hs.update); }, [filtered, hs.update]);

  const thStyle = {
    padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 10,
    textTransform: "uppercase", letterSpacing: 1, color: S.textMuted,
    borderBottom: `1px solid ${S.border}`, whiteSpace: "nowrap",
    position: "sticky", top: 0, background: S.surface, zIndex: 2,
  };
  const tdStyle = { padding: "8px 8px", textAlign: "center", borderBottom: `1px solid ${S.border}`, verticalAlign: "middle" };

  return (
    <div>
      {/* Groups */}
      <div className="group-cards" style={{ marginBottom: 20 }}>
        {GROUPS.map(g => (
          <div key={g.id} style={{ background: S.surface, borderRadius: 12, padding: "14px 16px", borderLeft: `4px solid ${g.color}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -10, fontSize: 72, fontWeight: 900, opacity: 0.04, fontFamily: S.heading, color: g.color }}>{g.id}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 900, fontFamily: S.heading, color: g.color }}>{g.id}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: S.textPrimary }}>{g.sub}</span>
            </div>
            <div style={{ fontFamily: S.mono, fontSize: 11, color: S.textMuted }}>V: {g.vMin}–{g.vMax} km·h⁻¹</div>
            <div style={{ fontSize: 10, color: S.textDim, marginTop: 3 }}>{g.desc}</div>
          </div>
        ))}
      </div>

      {/* P0-2: Legenda persistente — jogadores de campo vs GK vs coringas */}
      <div className="legend-participants" style={{
        background: S.surface, borderRadius: 10, padding: "10px 16px", marginBottom: 14,
        display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center",
        borderLeft: `3px solid ${S.accent}`,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Legenda de participantes</span>
        <span style={{ fontSize: 11, color: S.textSecondary }}>
          <strong style={{ color: S.accent }}>Jog. campo</strong> = jogadores de linha (base do cálculo de ApP)
        </span>
        <span style={{ fontSize: 11, color: S.textSecondary }}>
          <strong style={{ color: "#f39c12" }}>GK</strong> = goleiros (excluídos do ApP)
        </span>
        <span style={{ fontSize: 11, color: S.textSecondary }}>
          <strong style={{ color: "#9b59b6" }}>Coringas</strong> = jogadores neutros (excluídos do ApP)
        </span>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ background: S.surface, borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Filtros</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["Todos", "SSG", "MSG", "LSG"].map(c => (
            <Pill key={c} active={filterClassif === c} color={S.accent} darkText onClick={() => setFilterClassif(c)}>{c}</Pill>
          ))}
        </div>
        <div style={{ width: 1, height: 18, background: S.border }} />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: S.textMuted }}>Grupo:</span>
          {["Todos", "A", "B", "C"].map(g => (
            <Pill
              key={g}
              active={filterGrupo === g}
              color={g === "Todos" ? S.accent : GROUPS.find(x => x.id === g)?.color}
              darkText={g === "Todos"}
              onClick={() => { setFilterGrupo(g); if (g === "Todos") setFilterIntensity("Todas"); }}
            >{g}</Pill>
          ))}
        </div>
        {filterGrupo !== "Todos" && (
          <>
            <div style={{ width: 1, height: 18, background: S.border }} />
            <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: S.textMuted }}>Intensidade:</span>
              <Pill small active={filterIntensity === "Todas"} color={S.accent} darkText onClick={() => setFilterIntensity("Todas")}>Todas</Pill>
              {INTENSITY_LEVELS.map(i => (
                <Pill key={i.level} small active={filterIntensity === i.level} color={i.color} darkText={i.level === "Moderada"} onClick={() => setFilterIntensity(i.level)}>{i.level}</Pill>
              ))}
            </div>
          </>
        )}
        <div style={{ flex: 1 }} />
        <input
          type="search"
          placeholder="Buscar formato..."
          aria-label="Buscar formato de jogo"
          value={searchFormat}
          onChange={e => setSearchFormat(e.target.value)}
          style={{
            background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 8,
            padding: "5px 10px", color: S.textPrimary, fontSize: 11, width: 130, outline: "none",
            fontFamily: S.body,
          }}
        />
      </div>

      {/* Table — P0-1: coluna renomeada para "Jog. campo" */}
      <div style={{ position: "relative", borderRadius: 12, border: `1px solid ${S.border}` }}>
        {/* Left fade */}
        {hs.fadeLeft && (
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 32, zIndex: 3,
            background: `linear-gradient(to right, ${S.bg}, transparent)`,
            pointerEvents: "none", borderRadius: "12px 0 0 12px",
          }} />
        )}
        {/* Right fade */}
        {hs.fadeRight && (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 32, zIndex: 3,
            background: `linear-gradient(to left, ${S.bg}, transparent)`,
            pointerEvents: "none", borderRadius: "0 12px 12px 0",
          }} />
        )}

        <div
          ref={hs.scrollRef}
          onScroll={hs.onTableScroll}
          className="formats-table-scroll"
          style={{ overflowX: "auto", borderRadius: 12, WebkitOverflowScrolling: "touch" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }} role="grid">
            <thead>
              <tr style={{ background: S.surface }}>
                {["", "Formato", "Jog. campo", "Área (m²)", "ApP", "GK", "Coringa", "Objetivo", "Grupo A", "Grupo B", "Grupo C", "%FC"].map((h, i) => (
                  <th key={i} style={thStyle} title={h === "Jog. campo" ? "Jogadores de campo (sem GK e sem coringas)" : undefined}>{h === "ApP" ? <span style={{ textTransform: "none" }}>ApP</span> : h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={12} style={{ padding: 24, textAlign: "center", color: S.textMuted }}>Nenhum formato encontrado com os filtros selecionados.</td></tr>
              )}
              {filtered.map((f, idx) => {
                const isExp = expandedRow === idx;
                return [
                  <tr
                    key={idx}
                    role="row"
                    aria-expanded={isExp}
                    tabIndex={0}
                    onClick={() => setExpandedRow(isExp ? null : idx)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedRow(isExp ? null : idx); } }}
                    style={{
                      cursor: "pointer",
                      background: isExp ? "rgba(0,230,118,0.05)" : (idx % 2 === 0 ? S.bg : S.surface),
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "rgba(0,230,118,0.03)"; }}
                    onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = idx % 2 === 0 ? S.bg : S.surface; }}
                  >
                    <td style={tdStyle}><ClassifBadge classif={f.classif} /></td>
                    <td style={{ ...tdStyle, fontFamily: S.mono, fontWeight: 700, color: S.textPrimary, fontSize: 13 }}>
                      {f.formato}
                      <DivergenceBadge status={f.sourceStatus} />
                    </td>
                    <td style={tdStyle}>{f.jogCampo}</td>
                    <td style={{ ...tdStyle, fontFamily: S.mono, fontSize: 11 }}>{f.areaTotal}</td>
                    <td style={{ ...tdStyle, fontFamily: S.mono, fontSize: 11 }}>{f.app}</td>
                    <td style={{ ...tdStyle, fontSize: 11 }}>{f.gk === "Sim" ? "\u2713" : "\u2014"}</td>
                    <td style={{ ...tdStyle, fontSize: 10, color: f.coringa !== "Não" ? S.accent : S.textMuted, whiteSpace: "nowrap" }}>
                      {f.coringa}
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 200, fontSize: 11, color: S.textMuted }}>{f.objetivo}</td>
                    <td style={tdStyle}><IntensityBadge level={f.grupoA} /></td>
                    <td style={tdStyle}><IntensityBadge level={f.grupoB} /></td>
                    <td style={tdStyle}><IntensityBadge level={f.grupoC} /></td>
                    <td style={{ ...tdStyle, fontFamily: S.mono, fontSize: 11 }}>{f.fc}</td>
                  </tr>,
                  isExp && (
                    <tr key={`${idx}-exp`}>
                      <td colSpan={12} style={{ padding: "14px 18px", background: "rgba(0,230,118,0.03)", borderBottom: `1px solid ${S.border}` }}>
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                          <div>
                            <span style={{ fontSize: 10, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Variável-chave</span>
                            <div style={{ fontSize: 13, fontWeight: 700, color: S.accent, marginTop: 2 }}>{f.variavel}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: 10, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Referência</span>
                            <div style={{ fontSize: 12, color: S.textSecondary, marginTop: 2, fontStyle: "italic" }}>{f.ref}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: 10, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>ID</span>
                            <div style={{ fontSize: 11, fontFamily: S.mono, color: S.textDim, marginTop: 2 }}>{f.id}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ];
              })}
            </tbody>
          </table>
        </div>

        {/* Auxiliary scrollbar — mobile only, inside the table card */}
        {hs.hasOverflow && (
          <div
            ref={hs.auxRef}
            onScroll={hs.onAuxScroll}
            className="aux-scrollbar"
            style={{
              overflowX: "auto", overflowY: "hidden",
              height: 14,
              borderTop: `1px solid ${S.border}`,
              background: S.surface,
              borderRadius: "0 0 12px 12px",
            }}
          >
            <div ref={hs.innerRef} style={{ height: 1 }} />
          </div>
        )}
      </div>

      {/* Scroll hint — mobile only, shown when table overflows */}
      {hs.hasOverflow && (
        <div className="scroll-hint-mobile" style={{
          marginTop: 6, fontSize: 10, color: S.textDim, textAlign: "center",
          display: "none", /* shown via media query */
        }}>
          ← Role para o lado →
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 10, color: S.textDim }}>
        {filtered.length} de {FORMATS.length} formatos · Clique na linha para detalhes
      </div>

      {/* Legenda de intensidade */}
      <div className="intensity-legend" style={{ marginTop: 20, background: S.surface, borderRadius: 12, padding: "14px 18px" }}>
        <h3 style={{ fontFamily: S.heading, fontSize: 12, color: S.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Legenda de Intensidade</h3>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {INTENSITY_LEVELS.map(({ level, desc }) => (
            <div key={level} className="legend-item" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <IntensityBadge level={level} />
              <span style={{ fontSize: 10, color: S.textDim }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nota metodológica */}
      <MethodologyNotice />
    </div>
  );
}
