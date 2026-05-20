---
name: design-system
description: Use this skill to generate well-branded interfaces and assets for shadcn/ui, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, OKLCH color tokens, Geist type system, fonts, assets, and UI kit components (canonical dashboard-01 + marketing page) for prototyping the shadcn aesthetic.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files. For **anything copy-related** — voice, tone, microcopy, error messages, empty states, button labels, PT-BR locale rules, glossary, or content do/don't decisions — read **`Content.md`**. It's the source of truth owned by the content design team and supersedes any content guidance in `README.md`.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `colors_and_type.css` and `ui_kits/kit.css` from any new HTML to get the full shadcn surface for free.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. The components in `ui_kits/*/` show how each piece factors — both as static HTML and as JSX reference modules.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Critical reminders for this brand
- **Locale: PT-BR (português brasileiro).** All UI copy, labels, demo content, headings, button text and voice examples are written in Brazilian Portuguese. See `Content.md` for casing, punctuation, number, date, currency rules, microcopy patterns, glossary and do/don't examples. CSS variable names, component class names and file paths stay in English.
- Geist Sans is the family. 14px is the default body size. Weights 400/500/600 only.
- Color is neutral by default. Add a tinted primary only when the user asks for one — pick from the canonical theme list (Blue, Rose, Emerald, Violet, Orange, etc.) in `README.md`.
- Lucide icons, 2px stroke, `currentColor`. No emoji.
- Cards are `rounded-xl` with `shadow-sm` over `bg-card` and a 1px `--border` hairline.
- Voice is sentence case, second-person, no exclamation points, no marketing superlatives.
