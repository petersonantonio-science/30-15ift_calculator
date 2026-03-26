import { useState, useRef, useCallback, useMemo } from "react";
import { S } from "../styles";
import { useFilterContext } from "../context/FilterContext";
import GROUPS_DATA from "../data/groups.json";
import FORMATS_DATA from "../data/formats.json";
import Pill from "./Pill";

/* ── Presets por tipo de jogo ── */
const PRESETS = {
  SSG: { jogadores: 6,  appDesejada: 75,  proporcao: 1.2 },
  MSG: { jogadores: 10, appDesejada: 130, proporcao: 1.4 },
  LSG: { jogadores: 14, appDesejada: 200, proporcao: 1.6 },
};

/* ── Modelo prescritivo: classificação × grupo ── */
const PRESCRIPTION_MODEL = {
  SSG: {
    A: { series: "3–4", duracao: "2–3 min", pausa: "2–3 min", intensidade: "Alta" },
    B: { series: "4–5", duracao: "2–4 min", pausa: "1–2 min", intensidade: "Alta / Muito alta" },
    C: { series: "5–6", duracao: "3–4 min", pausa: "1–2 min", intensidade: "Muito alta" },
  },
  MSG: {
    A: { series: "3–4", duracao: "3–4 min", pausa: "2–3 min", intensidade: "Moderada / Alta" },
    B: { series: "3–5", duracao: "3–5 min", pausa: "2–3 min", intensidade: "Alta" },
    C: { series: "4–5", duracao: "4–5 min", pausa: "1–2 min", intensidade: "Alta / Muito alta" },
  },
  LSG: {
    A: { series: "2–3", duracao: "4–5 min", pausa: "3–4 min", intensidade: "Moderada" },
    B: { series: "2–4", duracao: "4–6 min", pausa: "2–4 min", intensidade: "Moderada / Alta" },
    C: { series: "3–4", duracao: "5–6 min", pausa: "2–3 min", intensidade: "Alta" },
  },
};

/* ── Definições terminológicas finais SSG/MSG/LSG ── */
const CLASSIF_DESCRIPTIONS = {
  SSG: "Maior densidade de interação, maior carga neuromuscular e contribuição anaeróbica",
  MSG: "Estímulo intermediário, podendo privilegiar carga neuromuscular ou exposição a velocidade",
  LSG: "Maior exposição a velocidade e deslocamentos longos, com maior contribuição aeróbica",
};

const DEFAULT_VALUES = { jogadores: 8, appDesejada: 80, proporcao: 1.5 };

const GROUPS = GROUPS_DATA.map(g => ({
  id: g.group, label: g.label, color: g.color,
}));

const INTENSITY_LEVELS = [
  { level: "Muito alta", color: "#e74c3c" },
  { level: "Alta",       color: "#e67e22" },
  { level: "Moderada",   color: "#f1c40f", darkText: true },
  { level: "Baixa",      color: "#3498db" },
  { level: "Muito baixa",color: "#95a5a6" },
];

/* ── HeaderCode: classificação de carga do setup ──
   Lógica explícita e auditável:
   - Compara ApP real e jogadores contra o preset do filtro ativo
   - Calcula desvio percentual ponderado (ApP tem peso maior que jogadores)
   - Faixas fixas determinam a classificação
   - Quando filtro = "Todos", usa faixas absolutas de ApP como referência */

const LOAD_BANDS = [
  { id: "sem-estimulo", label: "Sem estímulo", color: "#95a5a6", bg: "rgba(149,165,166,.12)", desc: "Muito abaixo do alvo esperado — estímulo insuficiente para adaptação" },
  { id: "leve",         label: "Leve",          color: "#3498db", bg: "rgba(52,152,219,.12)",  desc: "Abaixo do alvo — estímulo presente, mas baixo" },
  { id: "bom",          label: "Bom",           color: "#27ae60", bg: "rgba(39,174,96,.12)",   desc: "Faixa coerente com o objetivo do tipo de jogo" },
  { id: "dificil",      label: "Difícil",       color: "#e67e22", bg: "rgba(230,126,34,.12)",  desc: "Acima do alvo esperado — carga alta" },
  { id: "pesado",       label: "Pesado",        color: "#e74c3c", bg: "rgba(231,76,60,.12)",   desc: "Claramente exigente para o contexto" },
  { id: "extremo",      label: "Extremo",       color: "#8e44ad", bg: "rgba(142,68,173,.12)",  desc: "Muito acima do envelope recomendado" },
];

/* Faixas absolutas de ApP usadas quando filtro = "Todos"
   (sem preset para comparar, classifica pelo valor bruto) */
const ABSOLUTE_APP_BANDS = [
  { maxApp: 30,  bandIdx: 5 },
  { maxApp: 50,  bandIdx: 4 },
  { maxApp: 70,  bandIdx: 3 },
  { maxApp: 150, bandIdx: 2 },
  { maxApp: 250, bandIdx: 1 },
  { maxApp: Infinity, bandIdx: 0 },
];

/**
 * Calcula o índice da faixa de carga (0–5).
 *
 * Quando há filtro ativo (SSG/MSG/LSG):
 *   score = desvio_app * 0.65 + desvio_jogadores * 0.35
 *   - desvio positivo = ApP menor ou mais jogadores que o preset → mais carga
 *   - desvio negativo = ApP maior ou menos jogadores → menos carga
 *   Faixas: <-40% → 0, -40 a -15% → 1, -15 a +15% → 2, +15 a +35% → 3, +35 a +60% → 4, >+60% → 5
 *
 * Quando filtro = "Todos": usa faixas absolutas de ApP.
 */
function computeLoadBandIndex(filterClassif, appReal, jogadores) {
  if (filterClassif === "Todos") {
    for (const band of ABSOLUTE_APP_BANDS) {
      if (appReal <= band.maxApp) return band.bandIdx;
    }
    return 0;
  }

  const preset = PRESETS[filterClassif];
  if (!preset) return 2; // fallback: "bom"

  const desvioApp = (preset.appDesejada - appReal) / preset.appDesejada;
  const desvioJog = (jogadores - preset.jogadores) / preset.jogadores;
  const score = desvioApp * 0.65 + desvioJog * 0.35;

  if (score < -0.40) return 0;
  if (score < -0.15) return 1;
  if (score <= 0.15) return 2;
  if (score <= 0.35) return 3;
  if (score <= 0.60) return 4;
  return 5;
}

/* ── L1/L2: Matching do formato mais próximo da tabela ──
   Critério explícito e auditável, por ordem de prioridade:
   1. Classificação compatível (SSG/MSG/LSG)
   2. Jogadores de campo compatíveis (distância absoluta)
   3. GK compatível (presença)
   4. Coringa compatível (presença)
   5. Faixa de ApP mais próxima (distância do midpoint)
   Desempate: menor distância de ApP; se persistir, menor distância de jogadores. */

function parseAppRange(appStr) {
  if (!appStr) return null;
  const clean = String(appStr).replace("~", "").trim();
  const parts = clean.split("–");
  if (parts.length === 2) {
    return { min: parseFloat(parts[0]), max: parseFloat(parts[1]) };
  }
  const single = parseFloat(clean);
  return isNaN(single) ? null : { min: single, max: single };
}

function appMidpoint(appStr) {
  const r = parseAppRange(appStr);
  return r ? (r.min + r.max) / 2 : null;
}

function hasGk(fmt) { return fmt.gk === "Sim"; }
function hasCoringa(fmt) { return fmt.coringa !== "Não"; }

/**
 * Encontra o formato mais próximo ao setup atual da calculadora.
 * Retorna { format, confidence } onde confidence é "alta" | "media" | "baixa" | null.
 */
function findClosestFormat(jogadores, appReal, gkAtivo, coringasAtivo, classifKey) {
  if (!FORMATS_DATA || FORMATS_DATA.length === 0) return { format: null, confidence: null };

  // Passo 1: filtrar por classificação compatível
  let candidates = FORMATS_DATA.filter(f => f.classif === classifKey);

  // Se não há candidatos na classificação, tentar todas (fallback parcial)
  if (candidates.length === 0) {
    candidates = FORMATS_DATA;
  }

  // Passo 2: pontuar cada candidato
  const scored = candidates.map(fmt => {
    const mid = appMidpoint(fmt.app);
    const jogDist = Math.abs(fmt.jogCampo - jogadores);
    const appDist = mid !== null ? Math.abs(mid - appReal) : 999;
    const gkMatch = hasGk(fmt) === gkAtivo ? 0 : 1;
    const coringaMatch = hasCoringa(fmt) === coringasAtivo ? 0 : 1;
    const classifMatch = fmt.classif === classifKey ? 0 : 2;

    // Score composto: classificação > jogadores > GK > coringa > ApP
    // Pesos projetados para manter a prioridade hierárquica
    const score =
      classifMatch * 10000 +
      jogDist * 100 +
      gkMatch * 50 +
      coringaMatch * 25 +
      appDist * 0.1;

    return { fmt, score, jogDist, appDist, gkMatch, coringaMatch, classifMatch };
  });

  scored.sort((a, b) => a.score - b.score);

  const best = scored[0];
  if (!best) return { format: null, confidence: null };

  // Determinar confiança
  let confidence;
  if (best.classifMatch === 0 && best.jogDist <= 2 && best.gkMatch === 0 && best.appDist <= 30) {
    confidence = "alta";
  } else if (best.classifMatch === 0 && best.jogDist <= 4 && best.appDist <= 60) {
    confidence = "media";
  } else {
    confidence = "baixa";
  }

  return { format: best.fmt, confidence };
}

/* ── C2: Modelo prescritivo derivado da tabela ──
   Classificação (SSG/MSG/LSG) define a moldura base.
   Grupo (A/B/C) modula a faixa (inferior/média/superior).
   Objetivo e %FC do formato de referência ajustam dentro da faixa.

   Regras de modulação (R1–R6):
   R1: objetivo sprint/velocidade/VHSR → duração faixa superior, pausa não curta
   R2: objetivo transições/acelerações/posse/superioridade → duração inferior/média, +densidade
   R3: %FC ≥ 88% → intensidade Alta ou Muito alta
   R4: %FC ≤ 84% → evitar Muito alta, favorecer Moderada/Alta
   R5: intensidade do grupo na tabela = "Muito alta" → dose faixa superior
   R6: intensidade do grupo = "Baixa"/"Muito baixa" → dose faixa inferior, pausa conservadora */

const CLASSIF_FRAMES = {
  SSG: {
    series: [3, 6],     // min 3, max 6
    duracao: [2, 4],    // min 2, max 4
    pausa:   [1, 3],    // min 1, max 3
    group: {
      A: { intensidade: "Alta" },
      B: { intensidade: "Alta / Muito alta" },
      C: { intensidade: "Muito alta" },
    },
  },
  MSG: {
    series: [3, 5],
    duracao: [3, 5],
    pausa:   [1, 3],
    group: {
      A: { intensidade: "Moderada / Alta" },
      B: { intensidade: "Alta" },
      C: { intensidade: "Alta / Muito alta" },
    },
  },
  LSG: {
    series: [2, 4],
    duracao: [4, 6],
    pausa:   [2, 4],
    group: {
      A: { intensidade: "Moderada" },
      B: { intensidade: "Moderada / Alta" },
      C: { intensidade: "Alta" },
    },
  },
};

// Grupo → posição na faixa: A=inferior(0), B=média(0.5), C=superior(1)
const GROUP_POSITION = { A: 0, B: 0.5, C: 1 };

function parseFcRange(fcStr) {
  if (!fcStr) return null;
  const nums = fcStr.match(/(\d+)/g);
  if (!nums || nums.length < 1) return null;
  const values = nums.map(Number);
  return { min: Math.min(...values), max: Math.max(...values) };
}

// Detecta padrões no objetivo para R1/R2
const R1_PATTERN = /sprint|velocidade|vhsr|alta velocidade|lsr/i;
const R2_PATTERN = /transi[çc][ãõo]|acelera[çc][ãõo]|posse|superioridade/i;

// Intensidade da tabela → ajuste de posição (R5/R6)
const INTENSITY_SHIFTS = {
  "Muito alta": 0.2,
  "Alta": 0.1,
  "Moderada": 0,
  "Baixa": -0.1,
  "Muito baixa": -0.2,
};

/**
 * Deriva prescrição a partir do formato de referência da tabela.
 * Retorna { series, duracao, pausa, intensidade, fonte } ou null.
 */
function derivePrescriptionFromTable(formatoRef, grupoEfetivo, classifKey) {
  if (!formatoRef) return null;
  const frame = CLASSIF_FRAMES[classifKey];
  if (!frame) return null;

  const groupPos = GROUP_POSITION[grupoEfetivo] ?? 0.5;
  const objetivo = formatoRef.objetivo || "";
  const fcRange = parseFcRange(formatoRef.fc);
  const grupoKey = `grupo${grupoEfetivo}`;
  const intensidadeTabela = formatoRef[grupoKey] || "";

  // Posição base do grupo
  let seriesPos = groupPos;
  let duracaoPos = groupPos;
  // Pausa é invertida: grupo A (menor capacidade) precisa de mais pausa
  let pausaPos = 1 - groupPos;

  // R1: objetivo sprint/velocidade → duração para cima, pausa não muito curta
  if (R1_PATTERN.test(objetivo)) {
    duracaoPos = Math.min(1, duracaoPos + 0.15);
    pausaPos = Math.max(pausaPos, 0.4); // evita pausa muito curta
  }

  // R2: objetivo transições/posse/acelerações → duração para baixo, mais densidade
  if (R2_PATTERN.test(objetivo)) {
    duracaoPos = Math.max(0, duracaoPos - 0.1);
    seriesPos = Math.min(1, seriesPos + 0.1); // mais séries = mais densidade
  }

  // R5/R6: intensidade da tabela ajusta posição
  const intShift = INTENSITY_SHIFTS[intensidadeTabela] ?? 0;
  seriesPos = Math.max(0, Math.min(1, seriesPos + intShift));
  duracaoPos = Math.max(0, Math.min(1, duracaoPos + intShift));
  // Pausa inversamente: mais intensidade → menos pausa
  pausaPos = Math.max(0, Math.min(1, pausaPos - intShift));

  // Interpolar dentro da faixa
  const interpolar = (range, pos) => {
    const [min, max] = range;
    return Math.round(min + (max - min) * pos);
  };

  const seriesMin = interpolar(frame.series, Math.max(0, seriesPos - 0.2));
  const seriesMax = interpolar(frame.series, Math.min(1, seriesPos + 0.2));
  const duracaoMin = interpolar(frame.duracao, Math.max(0, duracaoPos - 0.15));
  const duracaoMax = interpolar(frame.duracao, Math.min(1, duracaoPos + 0.15));
  const pausaMin = interpolar(frame.pausa, Math.max(0, pausaPos - 0.15));
  const pausaMax = interpolar(frame.pausa, Math.min(1, pausaPos + 0.15));

  // Intensidade: começar pelo grupo, modular por FC (R3/R4)
  let intensidade = frame.group[grupoEfetivo]?.intensidade ?? "Alta";
  if (fcRange) {
    const fcMid = (fcRange.min + fcRange.max) / 2;
    // R3: FC alta → puxar intensidade para cima
    if (fcMid >= 88 && !intensidade.includes("Muito alta") && grupoEfetivo !== "A") {
      intensidade = intensidade === "Moderada" ? "Moderada / Alta"
                  : intensidade === "Moderada / Alta" ? "Alta"
                  : intensidade === "Alta" ? "Alta / Muito alta"
                  : intensidade;
    }
    // R4: FC baixa → evitar muito alta
    if (fcMid <= 84 && intensidade.includes("Muito alta")) {
      intensidade = intensidade === "Muito alta" ? "Alta"
                  : intensidade === "Alta / Muito alta" ? "Alta"
                  : intensidade;
    }
  }

  // Formatar faixas (evitar "3–3" → usar "3")
  const fmtRange = (lo, hi, suffix) => {
    const a = Math.min(lo, hi);
    const b = Math.max(lo, hi);
    const range = a === b ? `${a}` : `${a}–${b}`;
    return suffix ? `${range} ${suffix}` : range;
  };

  return {
    series: fmtRange(seriesMin, seriesMax, ""),
    duracao: fmtRange(duracaoMin, duracaoMax, "min"),
    pausa: fmtRange(pausaMin, pausaMax, "min"),
    intensidade,
    fonte: "tabela",
  };
}

/* ── C2.5: Modulação da prescrição pelo filtro de intensidade ──
   Camada local aplicada DEPOIS da camada 2 (tabela ou fallback).
   Não altera matching, classificação nem formato de referência.
   Ajusta séries, duração, pausa e rótulo de intensidade final.
   Todos os ajustes são clamped dentro da moldura da classificação (CLASSIF_FRAMES). */

const INTENSITY_MODULATION = {
  "Muito baixa": { seriesAdj: -1, duracaoAdj: -1, pausaAdj: +1, intensityCap: "Baixa",             desc: "−1 série, duração menor, pausa maior" },
  "Baixa":       { seriesAdj: -1, duracaoAdj: -1, pausaAdj: +1, intensityCap: "Moderada / Alta",    desc: "−1 série, duração menor, pausa maior" },
  "Moderada":    { seriesAdj:  0, duracaoAdj:  0, pausaAdj:  0, intensityCap: null,                 desc: null },
  "Alta":        { seriesAdj: +1, duracaoAdj: +1, pausaAdj: -1, intensityCap: "Alta / Muito alta",  desc: "+1 série, duração maior, pausa menor" },
  "Muito alta":  { seriesAdj: +1, duracaoAdj: +1, pausaAdj: -1, intensityCap: "Muito alta",         desc: "+1 série, duração maior, pausa menor" },
};

// Hierarquia de intensidade para capping
const INTENSITY_ORDER = ["Muito baixa", "Baixa", "Moderada", "Moderada / Alta", "Alta", "Alta / Muito alta", "Muito alta"];

function capIntensity(current, cap) {
  if (!cap) return current;
  const curIdx = INTENSITY_ORDER.indexOf(current);
  const capIdx = INTENSITY_ORDER.indexOf(cap);
  if (curIdx < 0 || capIdx < 0) return current;
  // Para caps baixos (Baixa, Moderada/Alta), limitar por cima
  // Para caps altos (Alta/Muito alta, Muito alta), limitar por baixo
  // Regra: resultado final deve estar no sentido do cap
  if (capIdx < 3) {
    // Cap conservador: não pode exceder o cap
    return curIdx > capIdx ? cap : current;
  }
  // Cap agressivo: não pode ficar abaixo do cap
  return curIdx < capIdx ? cap : current;
}

/**
 * Parseia uma faixa de prescrição como "3–5" ou "4 min" → { min, max }.
 */
function parsePrescRange(str) {
  if (!str) return null;
  const clean = str.replace(/\s*min\s*/g, "").trim();
  const parts = clean.split("–");
  if (parts.length === 2) {
    return { min: parseInt(parts[0], 10), max: parseInt(parts[1], 10) };
  }
  const v = parseInt(clean, 10);
  return isNaN(v) ? null : { min: v, max: v };
}

/**
 * Aplica modulação de intensidade sobre a prescrição base.
 * Retorna nova prescrição modulada + descrição do efeito, ou a prescrição original se sem efeito.
 */
function applyIntensityModulation(prescBase, intensityFilter, classifKey) {
  if (!prescBase || !intensityFilter || intensityFilter === "Todas") {
    return { presc: prescBase, intensityEffect: null };
  }

  const mod = INTENSITY_MODULATION[intensityFilter];
  if (!mod || (mod.seriesAdj === 0 && mod.duracaoAdj === 0 && mod.pausaAdj === 0)) {
    return { presc: prescBase, intensityEffect: null };
  }

  const frame = CLASSIF_FRAMES[classifKey];
  if (!frame) return { presc: prescBase, intensityEffect: null };

  const clamp = (val, range) => Math.max(range[0], Math.min(range[1], val));

  const fmtRange = (lo, hi, suffix) => {
    const a = Math.min(lo, hi);
    const b = Math.max(lo, hi);
    const range = a === b ? `${a}` : `${a}–${b}`;
    return suffix ? `${range} ${suffix}` : range;
  };

  // Parse, adjust, clamp series
  const seriesR = parsePrescRange(prescBase.series);
  const duracaoR = parsePrescRange(prescBase.duracao);
  const pausaR = parsePrescRange(prescBase.pausa);

  let newSeries = prescBase.series;
  let newDuracao = prescBase.duracao;
  let newPausa = prescBase.pausa;

  if (seriesR) {
    const sMin = clamp(seriesR.min + mod.seriesAdj, frame.series);
    const sMax = clamp(seriesR.max + mod.seriesAdj, frame.series);
    newSeries = fmtRange(sMin, sMax, "");
  }

  if (duracaoR) {
    const dMin = clamp(duracaoR.min + mod.duracaoAdj, frame.duracao);
    const dMax = clamp(duracaoR.max + mod.duracaoAdj, frame.duracao);
    newDuracao = fmtRange(dMin, dMax, "min");
  }

  if (pausaR) {
    const pMin = clamp(pausaR.min + mod.pausaAdj, frame.pausa);
    const pMax = clamp(pausaR.max + mod.pausaAdj, frame.pausa);
    newPausa = fmtRange(pMin, pMax, "min");
  }

  // Modular rótulo de intensidade
  const newIntensidade = capIntensity(prescBase.intensidade, mod.intensityCap);

  return {
    presc: {
      ...prescBase,
      series: newSeries,
      duracao: newDuracao,
      pausa: newPausa,
      intensidade: newIntensidade,
    },
    intensityEffect: mod.desc,
  };
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: S.surface2, borderRadius: 10, padding: "8px 12px" }}>
      <div style={{ fontSize: 9, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>{label}</div>
      <div style={{ fontFamily: S.mono, fontSize: 16, fontWeight: 700, color: S.textPrimary }}>{value}</div>
    </div>
  );
}

/* ── Calculadora ──
   Lógica do objetivo fisiológico derivada da ApP (conforme planilha),
   NÃO do número de jogadores por lado.
   Classificação de formato: baseada em jpl (jogadores por lado). */
export default function FieldCalculator() {
  const {
    filterClassif, setFilterClassif,
    filterGrupo, setFilterGrupo,
    filterIntensity, setFilterIntensity,
  } = useFilterContext();

  const [jogadores, setJogadores] = useState(DEFAULT_VALUES.jogadores);
  const [appDesejada, setAppDesejada] = useState(DEFAULT_VALUES.appDesejada);
  const [proporcao, setProporcao] = useState(DEFAULT_VALUES.proporcao);
  const [gk, setGk] = useState(2);
  const [coringas, setCoringas] = useState(0);

  // Track whether user has manually touched sliders since last preset
  const userTouched = useRef(false);
  // Track which preset is currently applied (to show feedback)
  const [activePreset, setActivePreset] = useState(null);

  const handleFilterChange = useCallback((classif) => {
    setFilterClassif(classif);

    if (classif === "Todos") {
      if (!userTouched.current) {
        setJogadores(DEFAULT_VALUES.jogadores);
        setAppDesejada(DEFAULT_VALUES.appDesejada);
        setProporcao(DEFAULT_VALUES.proporcao);
      }
      setActivePreset(null);
      return;
    }

    const preset = PRESETS[classif];
    if (preset && !userTouched.current) {
      setJogadores(preset.jogadores);
      setAppDesejada(preset.appDesejada);
      setProporcao(preset.proporcao);
      setActivePreset(classif);
    } else if (preset && userTouched.current) {
      setActivePreset(null);
    }
  }, [setFilterClassif]);

  const applyPreset = useCallback(() => {
    if (filterClassif === "Todos") return;
    const preset = PRESETS[filterClassif];
    if (preset) {
      setJogadores(preset.jogadores);
      setAppDesejada(preset.appDesejada);
      setProporcao(preset.proporcao);
      setActivePreset(filterClassif);
      userTouched.current = false;
    }
  }, [filterClassif]);

  const handleSlider = useCallback((setter) => (e) => {
    userTouched.current = true;
    setActivePreset(null);
    setter(Number(e.target.value));
  }, []);

  const handleGrupoChange = useCallback((g) => {
    setFilterGrupo(g);
    if (g === "Todos") setFilterIntensity("Todas");
  }, [setFilterGrupo, setFilterIntensity]);

  const totalParticipantes = jogadores + gk + coringas;
  const areaTotal = jogadores * appDesejada;
  const comprimento = Math.round(Math.sqrt(areaTotal * proporcao));
  const largura = comprimento > 0 ? (areaTotal / comprimento).toFixed(1) : "0";
  const appReal = jogadores > 0 ? Number((areaTotal / jogadores).toFixed(0)) : 0;

  const jpl = jogadores / 2;
  let classif;
  if (jpl <= 4)      classif = "SSG — Jogo Reduzido (2–4 por lado)";
  else if (jpl <= 7) classif = "MSG — Jogo Médio (5–7 por lado)";
  else               classif = "LSG — Jogo Grande (8+ por lado)";

  let objetivo;
  if (appDesejada < 60)       objetivo = "Potência aeróbia / Acelerações (ApP < 60 m²)";
  else if (appDesejada <= 120) objetivo = "Resistência aeróbia / HIR (ApP 60–120 m²)";
  else                         objetivo = "Sprint / VHSR (ApP > 120 m²)";

  // HeaderCode — classificação de carga
  const loadBandIdx = useMemo(
    () => computeLoadBandIndex(filterClassif, appReal, jogadores),
    [filterClassif, appReal, jogadores]
  );
  const loadBand = LOAD_BANDS[loadBandIdx];

  // Texto explicativo do racional
  const loadRationale = useMemo(() => {
    if (filterClassif === "Todos") {
      return `Classificação baseada na ApP absoluta (${appReal} m²) — selecione SSG/MSG/LSG para análise relativa ao alvo`;
    }
    const preset = PRESETS[filterClassif];
    return `Baseado em ${filterClassif} • ApP alvo: ${preset.appDesejada} m², atual: ${appReal} m² • Jogadores alvo: ${preset.jogadores}, atual: ${jogadores}`;
  }, [filterClassif, appReal, jogadores]);

  // ── Prescrição derivada: classificação × grupo ──
  const classifKey = jpl <= 4 ? "SSG" : jpl <= 7 ? "MSG" : "LSG";
  const grupoEfetivo = filterGrupo === "Todos" ? "B" : filterGrupo;
  const prescricao = PRESCRIPTION_MODEL[classifKey]?.[grupoEfetivo];
  const isGrupoTodos = filterGrupo === "Todos";

  // ── L1-L7: Formato de referência da tabela ──
  const gkAtivo = gk > 0;
  const coringasAtivo = coringas > 0;
  const { format: formatoRef, confidence: formatoConfianca } = useMemo(
    () => findClosestFormat(jogadores, appReal, gkAtivo, coringasAtivo, classifKey),
    [jogadores, appReal, gkAtivo, coringasAtivo, classifKey]
  );

  // L3: Extrair metadados do formato mais próximo
  const grupoKey = `grupo${grupoEfetivo}`;
  const tabelaModulacao = useMemo(() => {
    if (!formatoRef || formatoConfianca === "baixa") return null;
    return {
      label: formatoRef.label,
      objetivo: formatoRef.objetivo,
      fc: formatoRef.fc,
      intensidadeGrupo: formatoRef[grupoKey],
      classif: formatoRef.classif,
      appRange: formatoRef.app,
    };
  }, [formatoRef, formatoConfianca, grupoKey]);

  // L4: Objetivo e FC driven by table when available
  const objetivoFinal = tabelaModulacao ? tabelaModulacao.objetivo : objetivo;
  const fcFinal = tabelaModulacao ? tabelaModulacao.fc : null;
  const intensidadeRef = tabelaModulacao ? tabelaModulacao.intensidadeGrupo : null;
  const usandoTabela = !!tabelaModulacao;

  // ── C2: Prescrição derivada da tabela (camada 2) ──
  const prescricaoTabela = useMemo(
    () => usandoTabela ? derivePrescriptionFromTable(formatoRef, grupoEfetivo, classifKey) : null,
    [usandoTabela, formatoRef, grupoEfetivo, classifKey]
  );
  // Prescrição base: tabela quando disponível, senão fallback genérico
  const prescricaoBase = prescricaoTabela || prescricao;
  const fontePrescrição = prescricaoTabela ? "tabela" : "fallback";

  // ── C2.5: Modulação pelo filtro de intensidade ──
  const { presc: prescricaoFinal, intensityEffect } = useMemo(
    () => applyIntensityModulation(prescricaoBase, filterIntensity, classifKey),
    [prescricaoBase, filterIntensity, classifKey]
  );
  const intensidadeAtiva = filterIntensity && filterIntensity !== "Todas";

  const fieldW = 240;
  const rawH = comprimento > 0 ? Math.round(fieldW * (parseFloat(largura) / comprimento)) : 100;
  const maxH = 160;
  const scale = rawH > maxH ? maxH / rawH : 1;
  const dW = Math.round(fieldW * scale);
  const dH = Math.round(rawH * scale);

  const sliders = [
    { label: "Jogadores de campo (sem GK/coringa)", value: jogadores, set: setJogadores, min: 2, max: 22, step: 1, ariaLabel: "Número de jogadores de campo" },
    { label: "Área por jogador desejada (m²)", value: appDesejada, set: setAppDesejada, min: 20, max: 400, step: 5, ariaLabel: "Área por jogador em metros quadrados" },
    { label: "Proporção comprimento / largura", value: proporcao, set: setProporcao, min: 1, max: 2.5, step: 0.1, ariaLabel: "Proporção entre comprimento e largura do campo" },
  ];

  return (
    <div>
      {/* ── Filter bar: Tipo de jogo + Grupo + Intensidade ── */}
      <div style={{
        background: S.surface2, borderRadius: 10, padding: "12px 14px", marginBottom: 18,
      }}>
        {/* Row 1: Tipo de jogo + preset feedback */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Tipo de jogo</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["Todos", "SSG", "MSG", "LSG"].map(c => (
              <Pill key={c} active={filterClassif === c} color={S.accent} darkText onClick={() => handleFilterChange(c)}>{c}</Pill>
            ))}
          </div>
          {filterClassif !== "Todos" && (
            <>
              <div style={{ width: 1, height: 18, background: S.border }} />
              {activePreset ? (
                <span style={{
                  fontSize: 10, color: S.accent, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 4,
                  animation: "fadeIn .3s ease",
                }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: S.accent }} />
                  Valores sugeridos para {activePreset}
                </span>
              ) : userTouched.current ? (
                <button
                  onClick={applyPreset}
                  style={{
                    background: "none", border: `1px solid ${S.accent}`, borderRadius: 8,
                    padding: "3px 10px", color: S.accent, fontSize: 10, fontWeight: 700,
                    cursor: "pointer", fontFamily: S.body, transition: "all .15s",
                  }}
                >
                  Aplicar sugestão {filterClassif}
                </button>
              ) : null}
            </>
          )}
        </div>

        {/* Row 2: Grupo + Intensidade */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.border}`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Grupo</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["Todos", ...GROUPS.map(g => g.id)].map(g => (
              <Pill
                key={g}
                active={filterGrupo === g}
                color={g === "Todos" ? S.accent : GROUPS.find(x => x.id === g)?.color}
                darkText={g === "Todos"}
                onClick={() => handleGrupoChange(g)}
              >{g}</Pill>
            ))}
          </div>

          {filterGrupo !== "Todos" && (
            <>
              <div style={{ width: 1, height: 18, background: S.border }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Intensidade</span>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Pill small active={filterIntensity === "Todas"} color={S.accent} darkText onClick={() => setFilterIntensity("Todas")}>Todas</Pill>
                {INTENSITY_LEVELS.map(i => (
                  <Pill key={i.level} small active={filterIntensity === i.level} color={i.color} darkText={i.darkText} onClick={() => setFilterIntensity(i.level)}>{i.level}</Pill>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div className="calc-grid">
        {/* Left column: Parameters */}
        <div>
          <h3 style={{ fontFamily: S.heading, fontSize: 14, color: S.accent, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Parâmetros</h3>
          {sliders.map(({ label, value, set, min, max, step, ariaLabel }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, color: S.textMuted, marginBottom: 5, fontWeight: 600 }}>{label}</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={handleSlider(set)}
                  aria-label={ariaLabel}
                  style={{ flex: 1, accentColor: S.accent }} />
                <span style={{ fontFamily: S.mono, fontWeight: 700, fontSize: 15, color: S.textPrimary, minWidth: 46, textAlign: "right" }}>{value}</span>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend style={{ fontSize: 11, color: S.textMuted, fontWeight: 600, marginBottom: 4 }}>Goleiros</legend>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 2].map(v => (
                  <button key={v} onClick={() => setGk(v)} aria-pressed={gk === v} style={{
                    padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: gk === v ? S.accent : S.surface2, color: gk === v ? "#000" : S.textMuted,
                    fontWeight: 700, fontSize: 12, fontFamily: S.body,
                  }}>{v}</button>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend style={{ fontSize: 11, color: S.textMuted, fontWeight: 600, marginBottom: 4 }}>Coringas</legend>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(v => (
                  <button key={v} onClick={() => setCoringas(v)} aria-pressed={coringas === v} style={{
                    padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: coringas === v ? S.accent : S.surface2, color: coringas === v ? "#000" : S.textMuted,
                    fontWeight: 700, fontSize: 12, fontFamily: S.body,
                  }}>{v}</button>
                ))}
              </div>
            </fieldset>
          </div>
          <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(0,230,118,0.05)", borderRadius: 8, fontSize: 10, color: S.textMuted, lineHeight: 1.5 }}>
            <strong style={{ color: S.textSecondary }}>Sobre a ApP:</strong> a Área por Jogador é calculada dividindo a área total apenas pelos jogadores de campo. Goleiros e coringas são excluídos do cálculo porque ocupam espaços funcionalmente distintos no jogo.
          </div>
        </div>

        {/* Right column: Results */}
        <div>
          <h3 style={{ fontFamily: S.heading, fontSize: 14, color: S.accent, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Resultados</h3>

          {/* ── S2-1: HeaderCode — classificação de carga ── */}
          <div
            role="status"
            aria-label={`Carga percebida: ${loadBand.label}`}
            style={{
              background: loadBand.bg,
              borderLeft: `3px solid ${loadBand.color}`,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 12,
              animation: "fadeIn .25s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{
                display: "inline-block", padding: "2px 10px", borderRadius: 12,
                fontSize: 11, fontWeight: 800, letterSpacing: .5,
                background: loadBand.color, color: "#fff",
              }}>{loadBand.label}</span>
              <span style={{ fontSize: 10, color: S.textMuted, fontWeight: 600 }}>Carga do setup atual</span>
            </div>
            <div style={{ fontSize: 10, color: S.textDim, lineHeight: 1.4 }}>{loadBand.desc}</div>
            <div style={{ fontSize: 9, color: S.textDim, marginTop: 4, fontStyle: "italic" }}>{loadRationale}</div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            <StatCard label="Participantes totais" value={totalParticipantes} />
            <StatCard label="Área total" value={`${areaTotal} m²`} />
            <StatCard label="Comprimento" value={`${comprimento} m`} />
            <StatCard label="Largura" value={`${largura} m`} />
            <StatCard label="ApP real (jog. campo)" value={`${appReal} m²/jog.`} />
          </div>

          {/* Field SVG */}
          <div style={{ background: "linear-gradient(135deg, #0d3b1e 0%, #1a5c30 100%)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <svg width={dW} height={dH} viewBox={`0 0 ${dW} ${dH}`} role="img" aria-label={`Campo ${comprimento}m × ${largura}m`}>
              <rect x={0} y={0} width={dW} height={dH} rx={4} fill="#2d7a3f" stroke="#4ade6a" strokeWidth={2} />
              <line x1={dW / 2} y1={0} x2={dW / 2} y2={dH} stroke="#4ade6a" strokeWidth={1} strokeDasharray="4 3" />
              <circle cx={dW / 2} cy={dH / 2} r={Math.min(dW, dH) * 0.15} fill="none" stroke="#4ade6a" strokeWidth={1} strokeDasharray="4 3" />
              {gk > 0 && <>
                <rect x={0} y={dH / 2 - 18} width={5} height={36} fill="none" stroke="#4ade6a" strokeWidth={1} />
                <rect x={dW - 5} y={dH / 2 - 18} width={5} height={36} fill="none" stroke="#4ade6a" strokeWidth={1} />
              </>}
            </svg>
            <div style={{ fontSize: 10, color: "#a3e6b5" }}>{comprimento}m × {largura}m</div>
          </div>

          {/* Classification + L7: formato de referência */}
          <div style={{ marginTop: 10, background: S.surface2, borderRadius: 10, padding: "8px 12px" }}>
            <div style={{ fontSize: 10, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Classificação</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.accent, marginTop: 1 }}>{classif}</div>
            <div style={{ fontSize: 11, color: S.textSecondary, marginTop: 3, lineHeight: 1.4 }}>{CLASSIF_DESCRIPTIONS[classifKey]}</div>
            <div style={{ fontSize: 10, color: S.textMuted, marginTop: 4 }}>{objetivoFinal}</div>
            {fcFinal && (
              <div style={{ fontSize: 10, color: S.textMuted, marginTop: 2 }}>FC esperada: {fcFinal} FCmáx</div>
            )}
            {usandoTabela && (
              <div style={{
                marginTop: 6, paddingTop: 5, borderTop: `1px solid ${S.border}`,
                display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 6,
                  background: "rgba(0,230,118,.10)", color: S.accent,
                }}>Formato de referência: {tabelaModulacao.label}</span>
                {intensidadeRef && (
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: "1px 7px", borderRadius: 6,
                    background: "rgba(255,255,255,.06)", color: S.textSecondary,
                  }}>Intensidade ({isGrupoTodos ? "Grupo B — ref. média" : `Grupo ${grupoEfetivo}`}): {intensidadeRef}</span>
                )}
              </div>
            )}
            {!usandoTabela && formatoRef && formatoConfianca === "baixa" && (
              <div style={{ fontSize: 9, color: S.textDim, marginTop: 4, fontStyle: "italic" }}>
                Sem correspondência forte na tabela — usando modelo genérico
              </div>
            )}
          </div>

          {/* ── Prescrição HIIT — modelo derivado: classificação × grupo ── */}
          <div style={{
            marginTop: 12, background: S.surface2, borderRadius: 10, padding: "10px 14px",
            border: `1px solid ${S.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 6,
                fontSize: 9, fontWeight: 800, letterSpacing: .5,
                background: "rgba(0,230,118,.12)", color: S.accent,
              }}>{classifKey}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Prescrição HIIT</span>
              <span style={{ fontSize: 9, color: S.textMuted, marginLeft: "auto" }}>Grupo {grupoEfetivo}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
              {[
                { label: "Séries", value: prescricaoFinal?.series ?? "—" },
                { label: "Duração", value: prescricaoFinal?.duracao ?? "—" },
                { label: "Pausa", value: prescricaoFinal?.pausa ?? "—" },
                { label: "Intensidade", value: prescricaoFinal?.intensidade ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: S.surface, borderRadius: 8, padding: "5px 8px" }}>
                  <div style={{ fontSize: 8, color: S.textDim, textTransform: "uppercase", letterSpacing: .8 }}>{label}</div>
                  <div style={{ fontFamily: S.mono, fontSize: 13, fontWeight: 700, color: S.textPrimary }}>{value}</div>
                </div>
              ))}
            </div>
            {isGrupoTodos && (
              <div style={{ fontSize: 9, color: S.textMuted, marginBottom: 4 }}>
                Grupo não selecionado — exibindo referência média (Grupo B)
              </div>
            )}
            {fontePrescrição === "tabela" ? (
              <div style={{ fontSize: 9, color: S.textDim, lineHeight: 1.4 }}>
                <span style={{
                  display: "inline-block", padding: "1px 5px", borderRadius: 4, marginRight: 4,
                  background: "rgba(0,230,118,.08)", color: S.accent, fontWeight: 700, fontSize: 8,
                }}>VIA TABELA</span>
                Ref: <strong style={{ color: S.textMuted }}>{tabelaModulacao.label}</strong> · {tabelaModulacao.objetivo} · FC {tabelaModulacao.fc} · Moldura {classifKey} × Grupo {grupoEfetivo}
              </div>
            ) : (
              <div style={{ fontSize: 9, color: S.textDim, lineHeight: 1.4 }}>
                <span style={{
                  display: "inline-block", padding: "1px 5px", borderRadius: 4, marginRight: 4,
                  background: "rgba(255,255,255,.06)", color: S.textMuted, fontWeight: 700, fontSize: 8,
                }}>MODELO GENÉRICO</span>
                Classificação do jogo define a moldura; grupo define a progressão/regressão da dose.
              </div>
            )}
            {intensidadeAtiva && intensityEffect && (
              <div style={{ fontSize: 9, color: S.textDim, marginTop: 3, lineHeight: 1.4 }}>
                <span style={{
                  display: "inline-block", padding: "1px 5px", borderRadius: 4, marginRight: 4,
                  background: "rgba(231,76,60,.08)", color: "#e67e22", fontWeight: 700, fontSize: 8,
                }}>INTENSIDADE {filterIntensity.toUpperCase()}</span>
                {intensityEffect}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
