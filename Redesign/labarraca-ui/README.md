# La Barraca de Juan — Soft UI component library

72 Next.js (App Router) + Tailwind CSS + TypeScript components in a Neumorphic (Soft UI) style, built for a handmade-timber-furniture store: catalogue, made-to-order configuration, quotes & consultations, deposits, gallery, workshop events and a journal.

## Install

```bash
npm i next react react-dom lucide-react clsx tailwind-merge
npm i -D tailwindcss postcss autoprefixer typescript @types/react
```

Copy `tailwind.config.ts`, `postcss.config.js`, `app/globals.css`, `lib/cn.ts` and `components/` into your project. Wrap the app:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ToastProvider } from '@/components/feedback/toast';
<ThemeProvider><ToastProvider>{children}</ToastProvider></ThemeProvider>
```

## The Soft UI system in one paragraph

Everything sits on one warm-bone ground (`--nm-bg`). Surfaces are the **same colour** as the ground and are separated only by a pair of shadows — a dark one bottom-right, a light one top-left. Three states cover every component:

| State | Utility | Use |
|---|---|---|
| Raised | `shadow-soft` / `-sm` / `-lg` / `-xs` | Cards, buttons at rest, floating bars |
| Sunken | `shadow-soft-inset` / `-sm` / `-lg` | Inputs, tracks, wells, selected/pressed |
| Flat | `shadow-soft-flat` | Hairline fallback only |

Rules: no borders (shadows do the separating); large radii (`rounded-soft` 20px, `rounded-soft-lg` 28px, `rounded-pill`); the accent (walnut) is used for the primary action, selection and small emphasis only; pressing anything moves it from raised to sunken.

## Tokens

All colours are CSS variables on `:root`, overridden by `.dark`. Use them through Tailwind: `bg-nm-surface text-nm-text text-nm-muted bg-nm-accent text-nm-accent-fg text-nm-success text-nm-warning text-nm-danger`.

Fonts: `font-heading` (DM Serif Display) for headings/prices/quotes; `font-body` (Manrope) for everything else. Loaded via `next/font` in `app/layout.tsx`.

Dark mode: `darkMode: ['class']`. `ThemeProvider` toggles `.dark` on `<html>` and persists to `localStorage`.

## Accessibility

Every interactive component has a visible `:focus-visible` ring (2px accent), ARIA roles/states (`role="switch"`, `aria-pressed`, `aria-checked`, `aria-current`), keyboard support in Lightbox/Modal (Esc, arrows), and a minimum 44px hit target on touch controls.

## Files

- `components/ui` — 26 primitives
- `components/nav`, `marketing`, `product`, `forms`, `cart`, `reviews`, `media`, `events`, `feedback`, `data`, `blog` — 46 composites
- `components/index.ts` — barrel export
- `docs/COMPONENTS.md` — per-component reference (props, usage, notes)
- `showcase/` — the live HTML showcase used for design review
