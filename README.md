# 30-15 IFT Calculator

Aplicativo web (PWA) para prescrever **Jogos Reduzidos** no futebol com base no protocolo **30-15 Intermittent Fitness Test (IFT)**.

## Funcionalidades

### Tabela de Prescrição
- 22 formatos de jogo (SSG, MSG, LSG) com jogadores de campo, goleiros e coringas
- Classificação de intensidade por grupo de capacidade aeróbia (A, B, C)
- Filtros por formato, classificação e grupo
- Referências acadêmicas por formato

### Calculadora de Campo
- Cálculo de dimensões do campo a partir da Área por Jogador (ApP)
- Presets por tipo de jogo (SSG / MSG / LSG)
- Modelo prescritivo com séries, duração e pausa por grupo
- Tabela de referência com valores normativos da literatura

### Variáveis de Manipulação
- 15 variáveis que influenciam a carga fisiológica dos jogos reduzidos
- Efeitos sobre FC, distância total e corrida em alta velocidade
- Citações completas acessíveis via tooltip

## Grupos de Capacidade

| Grupo | Velocidade (30-15 IFT) | Perfil |
|-------|------------------------|--------|
| **A** | < 16,0 km/h | Menor capacidade |
| **B** | 16,5 – 18,5 km/h | Capacidade intermediária |
| **C** | >= 19,0 km/h | Maior capacidade |

## Stack

- **React 18** com Vite
- **PWA** com Workbox (suporte offline)
- Dados estruturados em JSON (`src/data/`)
- Design responsivo (mobile-first)

## Instalação

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
├── index.html                         # Entry point
├── prescricao_jogos_reduzidos.jsx     # Componente raiz (App)
├── vite.config.js                     # Vite + PWA config
├── public/                            # Assets estáticos (manifest, icons, offline)
└── src/
    ├── main.jsx                       # Bootstrap + Service Worker
    ├── styles.js                      # Design tokens
    ├── context/FilterContext.jsx       # Estado global de filtros
    ├── components/
    │   ├── FormatsTable.jsx           # Tabela de prescrição
    │   ├── FieldCalculator.jsx        # Calculadora de campo
    │   ├── ManipulationView.jsx       # Variáveis de manipulação
    │   ├── MethodologyNotice.jsx      # Notas metodológicas
    │   ├── PwaPrompts.jsx             # Prompts de instalação/atualização
    │   └── Pill.jsx                   # Badge UI
    └── data/
        ├── formats.json               # 22 formatos de jogo
        ├── manipulation.json          # 15 variáveis de manipulação
        ├── groups.json                # 3 grupos de capacidade
        ├── references.json            # Referências acadêmicas
        └── divergences.json           # Rastreabilidade planilha vs app
```

## Fonte dos dados

Todos os dados são derivados de uma planilha acadêmica de referência e validados por reconciliação campo a campo. O catálogo de divergências (`src/data/divergences.json`) documenta todas as decisões tomadas durante a migração.

## Licença

Este projeto é de uso acadêmico e educacional.

## Author
Peterson Antonio
Sports Scientist & Developer
Brazil
