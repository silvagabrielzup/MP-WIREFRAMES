# shadcn/ui — Design System

A faithful design system extracted from the [shadcn-ui/ui](https://github.com/shadcn-ui/ui) repository. Use it to design and prototype interfaces that look and behave like real shadcn projects — without re-deriving every token from scratch.

> "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code." — shadcn/ui README

## What is shadcn/ui?

shadcn/ui isn't a component library in the traditional npm sense — there's no `import { Button } from "shadcn/ui"`. Instead, it's a **code distribution platform**: you run a CLI, it copies the actual TSX source of each component into your repo, and you own it from there. The design system is the consistent *visual contract* the components ship under: a small set of OKLCH color tokens, a single sans family (Geist), Tailwind v4 utility classes, and the "new-york-v4" component style.

The pages and products in scope:
| Surface | What it is | Why it matters |
| --- | --- | --- |
| **ui.shadcn.com** | Marketing + docs site. Hero, examples grid, blocks gallery, MDX docs. | The canonical voice and presentation of the brand. |
| **Components & blocks** | TSX components (button, card, dialog, sidebar, …) and pre-composed "blocks" (dashboard-01, login-04, sidebar-07, …). | The actual product — the shapes everyone copies into their own apps. |
| **Themes** | 24 named themes (neutral, stone, zinc, blue, rose, …), each defined as a CSS-vars block in OKLCH for light + dark. | Color flexibility while keeping the same component primitives. |

## Sources

- **GitHub repo:** https://github.com/shadcn-ui/ui — `apps/v4` contains the v4 (Tailwind v4 + OKLCH) styles. Explore it for additional blocks, the full registry, and the canonical source of every component.
- **Docs:** https://ui.shadcn.com/docs
- **Files used to build this system:**
  - `apps/v4/app/globals.css` — base tokens + Tailwind theme aliases
  - `apps/v4/registry/themes.ts` — every named color theme
  - `apps/v4/registry/new-york-v4/ui/*` — the canonical "new-york-v4" components (Button, Card, Badge, Sidebar, etc.)
  - `apps/v4/registry/new-york-v4/blocks/dashboard-01/*` — the canonical dashboard block

> If you want to do a *better* job designing with shadcn, browse [shadcn-ui/ui](https://github.com/shadcn-ui/ui) directly — especially the registry blocks. They show the real composition patterns.

## Index

| File / Folder | What's in it |
| --- | --- |
| `README.md` | This file. Brand overview, visual guidelines, iconography. |
| `Content.md` | Voice, tone, microcopy patterns, PT-BR locale rules, glossary and do/don't gallery. Owned by the content design team. |
| `SKILL.md` | Drop-in Agent Skill manifest so this system works in Claude Code. |
| `colors_and_type.css` | Every CSS variable: OKLCH colors, radii, spacing, type. Drop into any HTML. |
| `assets/` | Real brand assets — shadcn mark (`shadcn-mark.png`), favicon, sample avatars. |
| `preview/` | Per-token visual cards rendered in the Design System tab. **Tokens:** colors, type, radii, shadows, spacing, brand mark, iconography. **Components:** alert, avatars, badges, buttons, card, inputs, menu, tabs, dialog, sheet, popover, tooltip + kbd, select, checkbox + radio, switch, textarea, form, separator + skeleton, toast, table, accordion, breadcrumb, pagination, progress + spinner, slider, command, combobox, calendar + date picker, hover card, context menu, navigation menu, scroll area. |
| `ui_kits/kit.css` | Shared component CSS used by both kits below. |
| `ui_kits/marketing/` | Marketing-site UI kit — see `ui_kits/marketing/README.md`. Open `index.html` for the result. |
| `ui_kits/app/` | Application UI kit — see `ui_kits/app/README.md`. Open `index.html` for the canonical `dashboard-01` recreation. |

**To start a new design:** load `colors_and_type.css` + `ui_kits/kit.css` in your HTML, then build with the classes (`.btn .default`, `.card`, `.badge .outline`, `.sidebar`, etc.) that the preview cards demonstrate.

---

## CONTENT

Voice, tone, microcopy patterns, PT-BR locale rules and the do/don't gallery live in **[`Content.md`](./Content.md)** — owned by the content design team. Edit content rules there, not here.

**The short version:**
- Voice is **sparse, calm, lower-stakes, developer-peer**. No exclamation points. No emoji in product UI. No marketing superlatives.
- **Locale: pt-BR.** Second person (`você`), sentence case, em-dash for asides, decimal comma, `DD/MM/AAAA`, `R$ 1.234,56`. Brazilian names and cities for demo data.
- **Buttons describe the action**, not "Sim" / "OK". `Excluir projeto`, not `Confirmar`.
- **Stays in English** (don't translate): CSS variable names, Tailwind classes, component class names, file paths, code, brand proper nouns (shadcn/ui, Geist, Lucide, OKLCH).

For anything beyond a one-line button label, open `Content.md`.

---

## VISUAL FOUNDATIONS

shadcn's look is the **calm, neutral, slightly-elevated SaaS aesthetic** that came to define 2024–2026 web product design. It's restrained on purpose: the components are meant to be a foundation, not a statement.

### Color
- **Neutral by default.** The flagship theme ("neutral") is pure greyscale — `oklch(0 chroma)` on every step. There is **no brand accent color** unless you opt in. Primary is near-black on light backgrounds, near-white on dark.
- **Themes are swappable.** Eight neutral bases (neutral, stone, zinc, mauve, olive, mist, taupe) for the "chrome", plus 16 color themes (blue, rose, violet, emerald, …) that re-tint only `primary` + `chart-*`.
- **OKLCH everywhere.** No hex, no rgb. This is intentional — OKLCH gives consistent perceptual lightness across hues, which is why the themes feel coherent.
- **Semantic, not literal.** Components reference `--primary`, `--muted`, `--accent`, never `--gray-500`. Designers theme by remapping the semantic vars, never by overriding component classes.

### Typography
- **One family: Geist Sans.** Geist Mono for code. Geist was designed by Vercel and is what shadcn.com itself ships.
- **Weights: 400, 500, 600.** Almost never 700. Headings are 600 with **negative letter-spacing** (-0.01 to -0.02em).
- **`text-sm` (14px) is the default body size.** This is unusual and very on-brand — most of shadcn's UI lives at 14px with tight line-height. Promote to 16px only for marketing pages.
- **Numbers use `tabular-nums`** in stat cards and tables.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body.

### Spacing & layout
- **4px base unit** (Tailwind v4 `--spacing: 0.25rem`). Components use multiples: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px) most commonly.
- **Cards have `py-6 px-6` and `gap-6` between sections.** Compact, but never cramped.
- **Container max-width 1400px** on marketing, with `px-4 lg:px-8`.
- **No fixed pixel widths anywhere** — everything responds via Tailwind's `@container` queries (cards re-flow their stats based on their own width, not the viewport).

### Borders & radii
- **Default radius: `--radius: 0.625rem` (10px).** The whole scale derives from this seed: `sm` (6px), `md` (8px), `lg` (10px), `xl` (14px), `2xl` (18px), `3xl` (22px), `4xl` (26px). Cards use `xl`. Buttons use `md`. Badges + pills are fully `rounded-full`.
- **1px borders, low contrast.** `--border` is `oklch(0.922 0 0)` — a barely-there hairline. In dark mode it's `oklch(1 0 0 / 10%)` — white at 10% opacity.

### Shadows & elevation
- **Tiny shadows.** Cards get `shadow-sm` (almost imperceptible). Popovers and dropdowns get `shadow-md` to `shadow-lg`. Modals get `shadow-xl`. Never bigger.
- **Stat cards layer a subtle gradient on top of the card surface** (`from-primary/5 to-card`) for a barely-there warm-cool tint. Otherwise surfaces are flat.
- **No inner shadows. No glow effects. No neumorphism.**

### Backgrounds & imagery
- **Backgrounds are solid.** Pure white on light, near-black (`oklch(0.145 0 0)`) on dark. No textures, no noise, no patterns.
- **No hand-drawn illustrations.** No emoji art. No gradient meshes.
- **Charts are the visual punch.** Stacked areas, simple bars, blueish ramps. They carry the visual energy because the chrome is so quiet.
- **Imagery in marketing is screenshots of the product itself** (dashboards, code blocks, code with syntax highlighting).

### Animation
- **Fast, restrained.** Most transitions are `duration-100` to `duration-200` with default ease. No bounce, no spring.
- **`transition-all` on interactive elements** for color + box-shadow changes.
- **Radix/tw-animate-css enter/exit** for popovers, dialogs, dropdowns — fade-in-0 + zoom-in-95 + slide-in-from-{side}-2. Subtle, never showy.
- Active state shrinks opacity: `a:active, button:active { opacity: 0.6 }` on touch devices.

### Hover & press states
- **Hover on primary buttons:** `bg-primary/90` — drops to 90% opacity of the primary color.
- **Hover on ghost/outline:** flips to `--accent` background.
- **Press on touch:** `opacity-60`.
- **Focus visible:** 3px ring at `--ring/50` opacity + border swap to `--ring`. This is the most distinctive interaction detail.
- **`aria-invalid`:** ring becomes `--destructive/20`.

### Transparency & blur
- **Overlays** (dialog, sheet, drawer) use `bg-black/30` + `backdrop-blur-sm` when supported.
- **Borders in dark mode** are `oklch(1 0 0 / 10%)` — white at 10% — to feel like edges of glass.
- **Sidebars use `bg-sidebar`** which is subtly off-background, never glassmorphic.

### Cards (the workhorse)
A typical shadcn card is: `rounded-xl border bg-card py-6 shadow-sm` with internal `gap-6` between header / content / footer, padded `px-6`. Header has a `CardTitle` (semibold, leading-none) and a `CardDescription` (text-sm, text-muted-foreground). No card ever has a "colored left border accent" — that's an anti-pattern from older systems.

---

## ICONOGRAPHY

shadcn does not ship its own icon font. The docs and blocks use **two CDN-available icon sets** depending on context:

- **[Lucide](https://lucide.dev)** (`lucide-react`) — the default for general UI. Stroke-based, 24×24 viewbox, 1.5–2px weight, rounded line caps. Used in nearly every component example.
- **[Tabler Icons](https://tabler.io/icons)** (`@tabler/icons-react`) — used in the canonical dashboard-01 block (e.g. `IconDashboard`, `IconInnerShadowTop`, `IconTrendingUp`). Also stroke-based, similar weight, slightly more variety on dashboard glyphs.

Both sets are CDN-loadable; this design system uses **Lucide** as the primary set (matches the docs site). Tabler is recommended when you're building the dashboard surface.

### Rules
- **Default size: `size-4` (16px).** Inline with text-sm. Use `size-3` in dense buttons / badges, `size-5` for nav-level icons, `size-8` for empty-states.
- **Color: inherit from text.** Icons are `currentColor` — they take on `--foreground`, `--muted-foreground`, or `--primary` from their context.
- **Stroke weight: 2px (Lucide default).** Don't mix-and-match weights within a screen.
- **Spacing from text: `gap-1.5` or `gap-2`** in buttons; `gap-2` in nav items.
- **No emoji.** Anywhere. Use a Lucide icon instead.
- **No unicode glyph icons** (`✓`, `→`) outside of legitimate text content. Use `Check`, `ArrowRight`.
- **The shadcn brand mark itself** is the small black/white "S" notch — see `assets/shadcn-mark.png`. Used as favicon and avatar in self-references.

### How to use Lucide from a static HTML page
```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="check" class="size-4"></i>
<script>lucide.createIcons();</script>
```

---

## Font note

shadcn.com runs **Geist Sans** + **Geist Mono** (open-source, by Vercel). This system loads them via Google Fonts in `colors_and_type.css`, which is faithful for prototypes. For production, install `geist` from npm or self-host the variable fonts.

