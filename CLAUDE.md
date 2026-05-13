# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Low-fidelity wireframes for Itaú's "Management Plane" — the internal portal over StackSpot's agentic engineering platform. React 19 + TypeScript + Vite + Tailwind, dark theme only, no UI library (Tailwind primitives only — no shadcn even though it's in `package.json`). lucide-react for icons.

All screens are mocked end-to-end with realistic data; there is no backend, no fetch layer, no state management. Each screen is one large `.tsx` file under `src/screens/`.

## Commands

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build (TS errors fail the build)
npm run lint      # eslint .
npm run preview   # preview production build
```

There are no tests. Verification = `npm run build` succeeds and the screen renders in `npm run dev`.

## The Ralph loop (how screens are generated)

This repo is driven by an autonomous loop, not by ad-hoc edits. `ralph.sh` calls `claude -p < PROMPT.md` up to 15 times; each invocation generates exactly ONE screen and stops. The contract is in `PROMPT.md`:

1. Read `PROGRESS.md`, pick the first `- [ ]` line. If none, print `RALPH_DONE`.
2. Always read `specs/00-master-context.md` first.
3. Read `specs/<NN>-<slug>.md` for the screen.
4. If `src/screens/01-Home.tsx` exists and you're not generating 01, read it as the canonical design-system anchor.
5. Write `src/screens/<NN>-<PascalName>.tsx`, register the route in `src/App.tsx`, flip `[ ]` → `[x]` in `PROGRESS.md` with an ISO timestamp + one-line summary, append decisions to `NOTES.md`, commit `feat(<NN>): <tela>`.

Rules: one screen per iteration, never regenerate `[x]` screens, never edit `specs/`. On ambiguity: decide, generate, log in `NOTES.md`. On conflict with a prior screen: mark `[!]` in PROGRESS and stop.

As of 2026-05-12 all seven screens (01–07) are `[x]`. Further iterations should either extend specs/PROGRESS with new `[ ]` entries or edit existing screens directly.

## Architecture

- `src/App.tsx` — `BrowserRouter` with all routes nested under one `<Layout />`. Some screens have two route aliases (e.g. `/assets` and `/catalog`).
- `src/components/Layout.tsx` — the only shared component. Fixed 240px sidebar (logo, nav, "Recentes", live dot footer) + sticky topbar (global search with ⌘K, env selector, bell, avatar) + `<Outlet />` in a `max-w-[1400px]` main. Screens render their own page chrome inside this.
- `src/screens/NN-Name.tsx` — self-contained. Mock data, SVG charts (sparklines, donuts, dependency graphs) hand-rolled inline, no chart libs. Density is the point — don't simplify.

When adding/editing a screen, read `01-Home.tsx` first; it's the canonical reference for spacing, type scale, badge/chip patterns, and color usage.

## Design system (Tailwind extensions in `tailwind.config.js`)

Named colors map to the master-context palette and are used everywhere — prefer them over raw hex:

- Surfaces: `bg` (#0A0A0B), `surface` (#141518), `surface-2`, `border`, `border-strong`
- Text: `text-primary`, `text-secondary`, `text-muted`
- Brand: `accent` (StackSpot orange #FF6B2C), `accent-hover`
- Status: `success`, `warning`, `failure`, `info`, `live` (#22D3EE, used with `animate-pulse-live` for real-time indicators)
- Fonts: `font-sans` = Geist Variable, `font-mono` = Geist Mono Variable (use mono for SA names, IDs, timestamps)

## Domain vocabulary (don't paraphrase in UI text)

- **SA (Sigla App)** — Itaú's app identifier; the spine of the data model. Mock IDs follow `ssa-pix-core`, `ssa-conta-corrente`, `ssa-12345`.
- **ON-PLAT** — app migrated to StackSpot (infra managed by the engines).
- **7 motores deterministas** — Kaptain (CD/AWS), Komply (policies), Konstructor (build), Orkestra (K8s), Traffik (routing/DNS), Pantheon (Kafka), Migration (data migration). Each has its own status (ok/warn/fail).
- **4 verbos da Operação Vanilla** — build, deploy, migration, rollout (the MVP scope; progress bars are segmented by these).
- **IUConfia** — internal score (security + quality + performance), shown as donuts with deltas vs. previous month.
- **Workflow states** — `running`, `awaiting human`, `failed`, `success`. Show a pulsing `live` dot when running.

## Conventions worth following

- Real-time-evident UI: pulsing live dot, "updated Ns ago", live counters on anything in motion.
- High density, no placeholder filler. Tables show 10–25 rows of realistic mock data; sidebars show counts, distributions, recent activity.
- Charts are inline SVG (sparklines `polyline` + translucent gradient area, donuts via `stroke-dasharray`). No chart libraries.
- Page chrome lives inside the screen, not in `Layout` — breadcrumb, title row, filter bar, side panels are all per-screen.
- Portuguese (pt-BR) for all user-facing copy.

## TypeScript / config quirks

`tsconfig.app.json` is strict (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax`). Build does `tsc -b` before `vite build`, so unused imports fail CI. `NOTES.md` documents past corrections to the scaffolding (broken paths in `tailwind.config.js`, `tsconfig*.json`, `vite.config.ts`) — if you see similar corruption, fix and note it there.
