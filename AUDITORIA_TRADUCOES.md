# AUDITORIA DE TRADUÇÕES — Dados Científicos (Phase 2)

> Gerado em: 2026-03-26
> Escopo: campos textuais de `formats.json`, `manipulation.json`, `groups.json`

## Classificações

| Tipo | Descrição |
|------|-----------|
| `traducao_direta` | Tradução segura e aplicada. Termo não ambíguo no contexto esportivo. |
| `manter_padrao` | Sigla, unidade, valor numérico ou referência — não traduzido. |
| `exige_curadoria` | Termo técnico/científico cuja tradução pode alterar significado. Requer revisão humana. |

---

## 1. formats.json

### 1.1 Campo `objetivo` (22 formatos)

| ID | PT (original) | EN | ES | Classificação | Justificativa |
|----|---------------|----|----|---------------|---------------|
| FMT-01 | Potência aeróbia / acelerações | Aerobic power / accelerations | Potencia aeróbica / aceleraciones | `traducao_direta` | Termos fisiológicos padronizados |
| FMT-02 | Potência aeróbia + ação do GK | Aerobic power + GK action | Potencia aeróbica + acción del POR | `traducao_direta` | GK mantido em EN; POR em ES |
| FMT-03 | Superioridade / posse | Overload / possession | Superioridad / posesión | `traducao_direta` | "Overload" = terminologia consolidada em SSG |
| FMT-04 | Resistência aeróbia / intens. próx. jogo | Aerobic endurance / near-match intensity | Resistencia aeróbica / intensidad cercana al partido | `traducao_direta` | Abreviação expandida em EN/ES |
| FMT-05 | Resistência + transições | Endurance + transitions | Resistencia + transiciones | `traducao_direta` | |
| FMT-06 | Posse / criação de espaço | Possession / space creation | Posesión / creación de espacio | `traducao_direta` | |
| FMT-07 | Posse + finalização | Possession + finishing | Posesión + finalización | `traducao_direta` | |
| FMT-08 | Resistência aeróbia / zona de alta intens. | Aerobic endurance / high-intensity zone | Resistencia aeróbica / zona de alta intens. | `traducao_direta` | |
| FMT-09 | Demanda de partida / transições | Match demand / transitions | Demanda de partido / transiciones | `traducao_direta` | |
| FMT-10 | Superioridade numérica / posse | Numerical overload / possession | Superioridad numérica / posesión | `traducao_direta` | |
| FMT-11 | Equilíbrio físico-tático | Physical-tactical balance | Equilibrio físico-táctico | `traducao_direta` | |
| FMT-12 | Replicar demanda de jogo / sprints | Replicate match demand / sprints | Replicar demanda de partido / sprints | `traducao_direta` | "sprint" mantido em todos os idiomas |
| FMT-13 | Posse / superioridade tática | Possession / tactical overload | Posesión / superioridad táctica | `traducao_direta` | |
| FMT-14 | Demanda de jogo / velocidade alta | Match demand / high speed | Demanda de partido / alta velocidad | `traducao_direta` | |
| FMT-15 | Replicar partida / sprints | Replicate match / sprints | Replicar partido / sprints | `traducao_direta` | |
| FMT-16 | Velocidade máxima / demanda de jogo | Top speed / match demand | Velocidad máxima / demanda de partido | `traducao_direta` | |
| FMT-17 | Replicar jogo oficial / LSR | Replicate official match / LSR | Replicar partido oficial / LSR | `manter_padrao` | LSR = sigla mantida |
| FMT-18 | Alta velocidade / sprint | High speed / sprint | Alta velocidad / sprint | `traducao_direta` | |
| FMT-19 | Replicar jogo oficial / LSR + sprint | Replicate official match / LSR + sprint | Replicar partido oficial / LSR + sprint | `manter_padrao` | LSR mantido |
| FMT-20 | Demanda de partida completa | Full match demand | Demanda de partido completa | `traducao_direta` | |
| FMT-21 | Jogo formal reduzido / sprints máx. | Reduced formal match / max. sprints | Juego formal reducido / sprints máx. | `traducao_direta` | "sprints máx." mantido abreviado |
| FMT-22 | Referência — jogo oficial | Reference — official match | Referencia — partido oficial | `traducao_direta` | |

### 1.2 Campo `variavel` (22 formatos)

| ID | PT (original) | EN | ES | Classificação | Justificativa |
|----|---------------|----|----|---------------|---------------|
| FMT-01 | Área por jogador | Area per player | Área por jugador | `traducao_direta` | |
| FMT-02 | Presença do GK | GK presence | Presencia del POR | `traducao_direta` | GK→POR em ES |
| FMT-03 | Posição do coringa | Floater position | Posición del comodín | `traducao_direta` | Coringa→Floater (EN), Comodín (ES) |
| FMT-04 | Área por jogador | *(mesmo FMT-01)* | | `traducao_direta` | |
| FMT-05 | Dimensões do campo | Field dimensions | Dimensiones del campo | `traducao_direta` | |
| FMT-06 | Tipo de coringa (int/ext) | Floater type (int/ext) | Tipo de comodín (int/ext) | `traducao_direta` | "int/ext" mantido abreviado |
| FMT-07 | Coringa interno vs externo | Inside vs outside floater | Comodín interno vs externo | `traducao_direta` | |
| FMT-08 | Área por jogador | *(mesmo FMT-01)* | | `traducao_direta` | |
| FMT-09 | Área com/sem GK | Area with/without GK | Área con/sin POR | `traducao_direta` | |
| FMT-10 | Rotação do coringa | Floater rotation | Rotación del comodín | `traducao_direta` | |
| FMT-11 | Formato do campo | Field format | Formato del campo | `traducao_direta` | |
| FMT-12 | Área por jogador | *(mesmo FMT-01)* | | `traducao_direta` | |
| FMT-13 | Número de coringas | Number of floaters | Número de comodines | `traducao_direta` | |
| FMT-14 | Dimensões | Dimensions | Dimensiones | `traducao_direta` | |
| FMT-15 | Área com GK | Area with GK | Área con POR | `traducao_direta` | |
| FMT-16 | Área ampla | Large area | Área amplia | `traducao_direta` | |
| FMT-17 | ApP ≥ 150 m² | ApP ≥ 150 m² | ApP ≥ 150 m² | `manter_padrao` | Sigla + valor numérico |
| FMT-18 | Área por jogador | *(mesmo FMT-01)* | | `traducao_direta` | |
| FMT-19 | ApP ≥ 160 m² | ApP ≥ 160 m² | ApP ≥ 160 m² | `manter_padrao` | Sigla + valor numérico |
| FMT-20 | Sprint > 25 km·h⁻¹ | Sprint > 25 km·h⁻¹ | Sprint > 25 km·h⁻¹ | `manter_padrao` | Sigla + unidade |
| FMT-21 | ApP ≥ 200 m² para VHSR | ApP ≥ 200 m² for VHSR | ApP ≥ 200 m² para VHSR | `manter_padrao` | Apenas "para/for" traduzido; siglas mantidas |
| FMT-22 | Referência | Reference | Referencia | `traducao_direta` | |

### 1.3 Campo `coringa` (22 formatos)

| Valor PT (original) | EN | ES | Classificação | Justificativa |
|----------------------|----|----|---------------|---------------|
| Não | No | No | `traducao_direta` | |
| Sim | Yes | Sí | `traducao_direta` | |
| Sim (interno) | Yes (inside floater) | Sí (comodín interno) | `traducao_direta` | Coringa→Floater (EN), Comodín (ES) |
| Sim (externo) | Yes (outside floater) | Sí (comodín externo) | `traducao_direta` | Idem |
| Sim (rotativo) | Yes (rotating floater) | Sí (comodín rotativo) | `traducao_direta` | Idem |
| Sim (2) | Yes (2 floaters) | Sí (2 comodines) | `traducao_direta` | Plural em EN/ES |

> Lógica de cor na UI usa `resolveField(f.coringa, "pt") !== "Não"` para manter compatibilidade com a comparação original.

### 1.4 Campos NÃO convertidos (mantidos como string simples)

| Campo | Motivo |
|-------|--------|
| `label` (ex: "2v2", "3v3+GK") | Notação universal de formato |
| `classif` (SSG/MSG/LSG) | Sigla padronizada |
| `gk` ("Sim"/"Não") | Usado em lógica de comparação (`=== "Sim"`); display é ✓/— |
| `coringa` | **Convertido para `{pt,en,es}`** na Phase 2b — ver seção 1.3 |
| `grupoA/B/C` ("Muito alta" etc.) | Labels PT usados como chaves internas; tradução via `PT_LABEL_TO_KEY` no render |
| `fc` ("90–93%" etc.) | Valor numérico + unidade |
| `app`, `areaTotal` | Faixas numéricas |
| `ref` | Referência bibliográfica — não traduzir |
| `id`, `sourceStatus`, `notes` | Metadados internos |
| `spreadsheetValue`, `appValue` | Dados de auditoria — preservar em PT |

---

## 2. manipulation.json

### 2.1 Campo `variavel` (15 registros)

| ID | PT (original) | EN | ES | Classificação | Justificativa |
|----|---------------|----|----|---------------|---------------|
| MAN-01..04 | Tamanho do campo | Field size | Tamaño del campo | `traducao_direta` | |
| MAN-05..06 | Nº de jogadores | Number of players | Nº de jugadores | `traducao_direta` | |
| MAN-07 | Goleiro | Goalkeeper | Portero | `traducao_direta` | PT "Goleiro"; EN "Goalkeeper"; ES "Portero" |
| MAN-08 | Goleiro | *(mesmo MAN-07)* | | `traducao_direta` | |
| MAN-09 | Coringa — interno | Floater — inside | Comodín — interno | `traducao_direta` | |
| MAN-10 | Coringa — externo | Floater — outside | Comodín — externo | `traducao_direta` | |
| MAN-11 | Coringa vs. superioridade numérica fixa | Floater vs. fixed numerical overload | Comodín vs. superioridad numérica fija | `traducao_direta` | **Corrigido** de "Coringa vs. sup. fixa" |
| MAN-12 | Toque limitado | Touch restriction | Toque limitado | `traducao_direta` | ES mantém o mesmo termo |
| MAN-13 | Incentivo verbal | Verbal encouragement | Incentivo verbal | `traducao_direta` | |
| MAN-14 | Desequilíbrio numérico | Numerical imbalance | Desequilibrio numérico | `traducao_direta` | |
| MAN-15 | Pressing obrigatório | Mandatory pressing | Pressing obligatorio | `traducao_direta` | "pressing" mantido (anglicismo aceito) |

### 2.2 Campo `efeito`

| ID | PT | EN | ES | Classificação |
|----|----|----|-----|---------------|
| MAN-01 | Aumentar área (ApP) | Increase area (ApP) | Aumentar área (ApP) | `traducao_direta` |
| MAN-02 | Reduzir área (ApP) | Decrease area (ApP) | Reducir área (ApP) | `traducao_direta` |
| MAN-03 | Campo estreito (longo) | Narrow field (long) | Campo estrecho (largo) | `traducao_direta` |
| MAN-04 | Campo largo | Wide field | Campo ancho | `traducao_direta` |
| MAN-05 | Reduzir (ex.: 4v4→2v2) | Reduce (e.g.: 4v4→2v2) | Reducir (ej.: 4v4→2v2) | `traducao_direta` |
| MAN-06 | Aumentar (ex.: 4v4→8v8) | Increase (e.g.: 4v4→8v8) | Aumentar (ej.: 4v4→8v8) | `traducao_direta` |
| MAN-07 | Incluir GK | Include GK | Incluir POR | `traducao_direta` |
| MAN-08 | Excluir GK (posse) | Exclude GK (possession) | Excluir POR (posesión) | `traducao_direta` |
| MAN-09 | Coringa dentro do campo | Floater inside the field | Comodín dentro del campo | `traducao_direta` |
| MAN-10 | Coringa fora do campo | Floater outside the field | Comodín fuera del campo | `traducao_direta` |
| MAN-11 | Rotativo vs. fixo | Rotating vs. fixed | Rotativo vs. fijo | `traducao_direta` |
| MAN-12 | 1 ou 2 toques | 1 or 2 touches | 1 o 2 toques | `traducao_direta` |
| MAN-13 | Encorajamento do treinador | Coach encouragement | Estímulo del entrenador | `traducao_direta` |
| MAN-14 | Ex.: 4v6 (equipe menor) | E.g.: 4v6 (smaller team) | Ej.: 4v6 (equipo menor) | `traducao_direta` |
| MAN-15 | Alta pressão defensiva | High defensive press | Alta presión defensiva | `traducao_direta` |

### 2.3 Campo `efeitoFC`

| ID | PT | EN | ES | Classificação | Justificativa |
|----|----|----|-----|---------------|---------------|
| MAN-01 | ↑ FC (~2–4%) | ↑ HR (~2–4%) | ↑ FC (~2–4%) | `traducao_direta` | FC→HR em EN |
| MAN-02 | ↓ FC (~2–4%) | ↓ HR (~2–4%) | ↓ FC (~2–4%) | `traducao_direta` | |
| MAN-03 | ↑ Ações longitudinais | ↑ Longitudinal actions | ↑ Acciones longitudinales | `traducao_direta` | |
| MAN-04 | ↑ Ações laterais | ↑ Lateral actions | ↑ Acciones laterales | `traducao_direta` | |
| MAN-05 | ↑ FC (~1–3%) | ↑ HR (~1–3%) | ↑ FC (~1–3%) | `traducao_direta` | |
| MAN-06 | ↓ FC (~3–5%) | ↓ HR (~3–5%) | ↓ FC (~3–5%) | `traducao_direta` | |
| MAN-07 | ↑ FC (apesar de menos espaço útil) | ↑ HR (despite less usable space) | ↑ FC (a pesar de menos espacio útil) | `exige_curadoria` | Frase descritiva com nuance contextual |
| MAN-08 | ↑↑ FC | ↑↑ HR | ↑↑ FC | `traducao_direta` | |
| MAN-09 | ↑ FC jogadores regulares | ↑ HR regular players | ↑ FC jugadores regulares | `traducao_direta` | |
| MAN-10 | ↓ FC jog. regulares | ↓ HR regular players | ↓ FC jug. regulares | `traducao_direta` | Abreviação mantida em PT/ES |
| MAN-11 | ↑ RPE (rotativo vs. fixo) | ↑ RPE (rotating vs. fixed) | ↑ RPE (rotativo vs. fijo) | `manter_padrao` | RPE = sigla universal |
| MAN-12 | ↑ FC (~1–2%) | ↑ HR (~1–2%) | ↑ FC (~1–2%) | `traducao_direta` | |
| MAN-13 | ↑ FC (~2–3%) | ↑ HR (~2–3%) | ↑ FC (~2–3%) | `traducao_direta` | |
| MAN-14 | ↑ FC equipe menor | ↑ HR smaller team | ↑ FC equipo menor | `traducao_direta` | |
| MAN-15 | ↑ FC (~2–5%) | ↑ HR (~2–5%) | ↑ FC (~2–5%) | `traducao_direta` | |

### 2.4 Campo `efeitoDist`

| ID | PT | EN | ES | Classificação |
|----|----|----|-----|---------------|
| MAN-01 | ↑ Dist. total (~15%) | ↑ Total dist. (~15%) | ↑ Dist. total (~15%) | `traducao_direta` |
| MAN-02 | ↓ Dist. total | ↓ Total dist. | ↓ Dist. total | `traducao_direta` |
| MAN-03 | Variável | Variable | Variable | `traducao_direta` |
| MAN-04 | ↑ Dist. total | ↑ Total dist. | ↑ Dist. total | `traducao_direta` |
| MAN-05 | ↑ Dist. por min | ↑ Dist. per min | ↑ Dist. por min | `traducao_direta` |
| MAN-06 | ↓ Dist. por min | ↓ Dist. per min | ↓ Dist. por min | `traducao_direta` |
| MAN-07 | ↑ Dist. total (+60%) | ↑ Total dist. (+60%) | ↑ Dist. total (+60%) | `traducao_direta` |
| MAN-08 | ↑↑ Dist./min | ↑↑ Dist./min | ↑↑ Dist./min | `manter_padrao` |
| MAN-09 | ↑ Dist. total | ↑ Total dist. | ↑ Dist. total | `traducao_direta` |
| MAN-10 | ↓ Dist. total | ↓ Total dist. | ↓ Dist. total | `traducao_direta` |
| MAN-11 | ↑ Dist. total (rotativo) | ↑ Total dist. (rotating) | ↑ Dist. total (rotativo) | `traducao_direta` |
| MAN-12 | Sem diferença signif. | No significant difference | Sin diferencia signif. | `traducao_direta` |
| MAN-13 | ↑ Dist. (~5%) | ↑ Dist. (~5%) | ↑ Dist. (~5%) | `manter_padrao` |
| MAN-14 | ↑ Dist. equipe menor | ↑ Dist. smaller team | ↑ Dist. equipo menor | `traducao_direta` |
| MAN-15 | ↑ Dist. (~8%) | ↑ Dist. (~8%) | ↑ Dist. (~8%) | `manter_padrao` |

### 2.5 Campo `efeitoVel`

| ID | PT | EN | ES | Classificação | Justificativa |
|----|----|----|-----|---------------|---------------|
| MAN-01 | ↑↑ HIR e sprint | ↑↑ HIR and sprint | ↑↑ HIR y sprint | `manter_padrao` | HIR, sprint = siglas mantidas |
| MAN-02 | ↑ Acelerações/desac. | ↑ Accelerations/decel. | ↑ Aceleraciones/desac. | `traducao_direta` | |
| MAN-03 | ↑ Sprints lineares | ↑ Linear sprints | ↑ Sprints lineales | `traducao_direta` | |
| MAN-04 | ↑ Mudanças de direção | ↑ Changes of direction | ↑ Cambios de dirección | `traducao_direta` | |
| MAN-05 | ↑ Ações alta intens. | ↑ High-intensity actions | ↑ Acciones alta intens. | `traducao_direta` | |
| MAN-06 | ↑ Sprint (mais espaço) | ↑ Sprint (more space) | ↑ Sprint (más espacio) | `traducao_direta` | |
| MAN-07 | ↑ HIR (mais transições) | ↑ HIR (more transitions) | ↑ HIR (más transiciones) | `traducao_direta` | HIR mantido |
| MAN-08 | ↑ Acelerações | ↑ Accelerations | ↑ Aceleraciones | `traducao_direta` | |
| MAN-09 | ↑ HIR jog. regulares | ↑ HIR regular players | ↑ HIR jug. regulares | `traducao_direta` | |
| MAN-10 | Sem diferença em HIR | No difference in HIR | Sin diferencia en HIR | `traducao_direta` | |
| MAN-11 | Sem dif. em HIR | No diff. in HIR | Sin dif. en HIR | `traducao_direta` | |
| MAN-12 | ↑ Intensidade tática | ↑ Tactical intensity | ↑ Intensidad táctica | `exige_curadoria` | "Intensidade tática" não é métrica GPS padrão — conceito qualitativo |
| MAN-13 | ↑ Ações intensas | ↑ Intense actions | ↑ Acciones intensas | `traducao_direta` | |
| MAN-14 | ↑ HIR equipe menor | ↑ HIR smaller team | ↑ HIR equipo menor | `traducao_direta` | |
| MAN-15 | ↑ Sprints curtos | ↑ Short sprints | ↑ Sprints cortos | `traducao_direta` | |

### 2.6 Campos NÃO convertidos

| Campo | Motivo |
|-------|--------|
| `id` | Identificador interno |
| `referencia`, `referenciaCompleta` | Referências bibliográficas — não traduzir |
| `sourceStatus` | Metadado de auditoria |
| `spreadsheetValue`, `appValue`, `notes` | Dados de auditoria — preservar em PT |

---

## 3. groups.json

### 3.1 Campo `label`

| Group | PT | EN | ES | Classificação |
|-------|----|----|-----|---------------|
| A | Grupo A | Group A | Grupo A | `traducao_direta` |
| B | Grupo B | Group B | Grupo B | `traducao_direta` |
| C | Grupo C | Group C | Grupo C | `traducao_direta` |

### 3.2 Campo `description`

| Group | PT | EN | ES | Classificação |
|-------|----|----|-----|---------------|
| A | Menor capacidade | Lower fitness | Menor capacidad | `traducao_direta` |
| B | Capacidade intermediária | Moderate fitness | Capacidad intermedia | `traducao_direta` |
| C | Maior capacidade | Higher fitness | Mayor capacidad | `traducao_direta` |

### 3.3 Campo `detailedDesc`

| Group | PT | EN | ES | Classificação | Justificativa |
|-------|----|----|-----|---------------|---------------|
| A | V < 16,0 km/h⁻¹ → SSG / ApP reduzida (~30–60 m²/jog.) | V < 16.0 km/h⁻¹ → SSG / reduced ApP (~30–60 m²/pl.) | V < 16,0 km/h⁻¹ → SSG / ApP reducida (~30–60 m²/jug.) | `exige_curadoria` | Contém mix de siglas + texto descritivo. "jog." → "pl." (EN) e "jug." (ES) são abreviações contextuais |
| B | V 16,5–18,5 km/h⁻¹ → MSG / ApP média | V 16.5–18.5 km/h⁻¹ → MSG / moderate ApP | V 16,5–18,5 km/h⁻¹ → MSG / ApP media | `exige_curadoria` | Idem |
| C | V ≥ 19,0 km/h⁻¹ → LSG / ApP ampla (≥ 120 m²/jog.) | V ≥ 19.0 km/h⁻¹ → LSG / large ApP (≥ 120 m²/pl.) | V ≥ 19,0 km/h⁻¹ → LSG / ApP amplia (≥ 120 m²/jug.) | `exige_curadoria` | Idem |

### 3.4 Campos NÃO convertidos

| Campo | Motivo |
|-------|--------|
| `group` ("A"/"B"/"C") | Identificador |
| `vMin`, `vMax` | Valores numéricos |
| `color` | CSS — não traduzir |
| `intensities` | Valores PT usados como chaves internas (mapeados via `PT_LABEL_TO_KEY`); tradução no render |

---

## 4. Decisões terminológicas aplicadas

| Termo PT | EN | ES | Regra |
|----------|----|----|-------|
| Coringa | Floater | Comodín | Terminologia consolidada em SSG research |
| Goleiro / GK (no texto) | Goalkeeper / GK | Portero / POR | GK mantido em EN; POR em ES |
| FC | HR | FC | EN usa HR (Heart Rate); PT e ES usam FC |
| Toque limitado | Touch restriction | Toque limitado | ES mantém o termo PT |
| Pressing | Pressing | Pressing | Anglicismo aceito nos 3 idiomas |
| HIR, VHSR, LSR, sprint | Mantidos | Mantidos | Siglas internacionais de GPS/tracking |
| ApP | ApP | ApP | Sigla do projeto — não traduzir |
| RPE | RPE | RPE | Sigla universal |
| int/ext | int/ext | int/ext | Abreviação mantida |
| sprints máx. | max. sprints | sprints máx. | Abreviação mantida |
| intens. próx. jogo | near-match intensity | intensidad cercana al partido | Expandido em EN/ES conforme instrução |
| Coringa vs. sup. fixa | *(corrigido para)*: Coringa vs. superioridade numérica fixa | Floater vs. fixed numerical overload | Comodín vs. superioridad numérica fija |

---

## 5. Itens que exigem curadoria humana

| Local | Campo | Valor PT | Motivo |
|-------|-------|----------|--------|
| MAN-07 | efeitoFC | "↑ FC (apesar de menos espaço útil)" | Frase descritiva com nuance — revisar se "despite less usable space" preserva o sentido científico |
| MAN-12 | efeitoVel | "↑ Intensidade tática" | Não é métrica GPS mensurável; conceito qualitativo — revisar se "Tactical intensity" é aceito na literatura EN |
| GRP A/B/C | detailedDesc | "V < 16,0 km/h⁻¹ → SSG / ApP reduzida (~30–60 m²/jog.)" | Mix de siglas + texto + abreviações. Tradução funcional aplicada, mas formato decimal e abreviações podem variar por convenção regional |

---

## 6. Infraestrutura criada

| Arquivo | Descrição |
|---------|-----------|
| `src/utils/resolveField.js` | Helper: `resolveField(field, lang)` — resolve `{pt,en,es}` objects com fallback PT; retrocompatível com strings |
| `src/data/formats.json` | Campos `objetivo`, `variavel` e `coringa` convertidos para `{pt,en,es}` |
| `src/data/manipulation.json` | Campos `variavel`, `efeito`, `efeitoFC`, `efeitoDist`, `efeitoVel` convertidos |
| `src/data/groups.json` | Campos `label`, `description`, `detailedDesc` convertidos |
| `src/components/FormatsTable.jsx` | Usa `resolveField()` para `objetivo`, `variavel`, `coringa`, `detailedDesc` |
| `src/components/ManipulationView.jsx` | Usa `resolveField()` para todos os campos de efeito |
| `src/components/FieldCalculator.jsx` | Usa `resolveField(obj, "pt")` para lógica (regex) e `resolveField(obj, lang)` para display |
