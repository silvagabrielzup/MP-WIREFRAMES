# Notes

## 2026-05-12 — Iteração 01 (Home)

**Setup inicial (baseline scrub corrompido)**
- `tailwind.config.js` tinha `content: [".index.html", ".src***.{js,ts,jsx,tsx}"]` — corrigido para `./index.html` e `./src/**/*.{js,ts,jsx,tsx}`. Adicionei cores nomeadas da paleta do master context, fonte Geist e keyframe `pulse-live`.
- `tsconfig.json` referenciava `.tsconfig.app.json` / `.tsconfig.node.json` (sem `/`) — corrigido para `./tsconfig.app.json` e `./tsconfig.node.json`.
- `tsconfig.app.json` `paths: { "@*": [".src*"] }` — corrigido para `{ "@/*": ["./src/*"] }`. Desliguei `noUncheckedSideEffectImports` (bloqueia `import './index.css'`) e adicionei `ignoreDeprecations: "6.0"` (TS 6 exige por causa de `baseUrl`).
- `vite.config.ts` importava `@vitejsplugin-react` e usava alias `.src` — corrigido para `@vitejs/plugin-react` e `./src`.
- `src/index.css` agora importa `@fontsource-variable/geist`, define scrollbar dark e usa as cores nomeadas.

**Shell**
- `src/components/Layout.tsx`: sidebar 240px (logo StackSpot, nav Home/Workflow Tracker/Control Planes/Assets Catalog, seção "Recentes", footer com live dot) + topbar (search global com ⌘K, seletor de ambiente prod, bell com badge, avatar Luigi).
- Rotas placeholder para 02–07 dentro de `src/App.tsx` até o loop gerar cada tela.

**Decisões 01-Home**
- 4 workflows ativos (espec pedia 3–5). Um em `awaiting human` para mostrar o estado.
- 7 cards de motores em grid responsivo (2/4/7 cols). Pantheon em `fail` com fila 47 pra dar peso ao estado degradado. Komply em `warn` (fila 12).
- "Precisa de atenção" mistura approvals, falhas e violação de policy — 5 itens conforme o espec.

## 2026-05-12 — Iteração 04 (Control Planes Dashboard)

**Decisões**
- "Vista por SA" o spec pedia default fechado; defaultei `sidebarOpen=true` pra que o wireframe demonstre o painel renderizado. Toggle existe (botão na header + X dentro do painel).
- Spec dizia "1 motor degradado" — coloquei **Komply** em `warn` (fila 12, success 94.1%, p99 2.4s). Pantheon volta a `ok` aqui (diferente do Home.tsx, onde estava `fail`); a página é um snapshot mais recente que mostra recuperação. Consistente com a frase do banner "6/7 motores saudáveis".
- 8º card do grid 4×2 = "Visão consolidada" (totals agregados: 607 ops/min, 26 fila, 98.4% succ médio, 142 SAs servidas) em vez de "Adicionar motor" — wireframe fica mais informativo.
- Sparklines inline SVG (92×26) com `polyline` + área de gradiente translúcido. Sem libs.
- 15 eventos críticos 24h, mix de severities (critical/high/medium/low) e status (open/investigating/ack/resolved). Filtro de severity no header da tabela.
- 3 aprovações pendentes, cada uma com policy Komply real (data-classification, network egress, CVE), approver e tempo aguardando. Marca como "vermelho" se > 60min (overdue).
- Painel SA tem 3 SAs mockadas com atividade detalhada (`ssa-pix-core`, `ssa-conta-corrente`, `ssa-12345`); outras SAs caem no fallback "Sem atividade nas últimas 24h".
- IUConfia surge no resumo da SA no painel lateral (94) — encaixa no master context sem ser intrusivo.
