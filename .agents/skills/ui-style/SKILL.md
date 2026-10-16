---
name: ui-style
description: Maintain one visual style throughout the app. Define shared colors, spacing, typography, and reuse existing design tokens instead of arbitrary values. Prefer a small consistent set of reusable UI components. Use when building screens, styling React Native views, adding UI components, or changing colors, spacing, type, or layout.
---

# Application style and interface

Maintain one visual style throughout the app. Define the shared colors, spacing, typography etc. Reuse existing design tokens instead of arbitrary values. Prefer a small consistant set of reusable ui components.

## Before styling

1. Find the existing token module and UI components (typical paths: `src/theme/`, `src/ui/`, `src/components/`).
2. If tokens or primitives are missing, **define them first** in the change plan (files touched, token names, which components). Do not invent a second palette, type scale, or component kit beside an existing one.
3. New visual direction (palette, dark mode, third-party UI kit) is an architectural decision — ask before implementing.

## Design tokens

Keep tokens in **one** shared module. Screens and components import tokens; they do not hardcode a parallel system.

Define at least:

- **Color** — background, surface, text, muted text, border, primary, danger, success (only what the app uses)
- **Spacing** — a short scale (e.g. 4-based). Layout uses scale keys or values from that scale only
- **Typography** — font family (if set), size, line height, weight for title, body, caption, label
- **Radius** and **elevation/shadow** if used more than once

Rules:

- No magic hex/rgb, font sizes, or spacing numbers in screen files. Use tokens.
- Do not add a one-off color or size “just for this screen.” Extend the token module if the value should be shared; if it is truly unique, say why in the plan.
- `StyleSheet.create` is fine. Token references belong in those styles, not copies of the raw values.
- Native look: use React Native primitives and Expo components. Do not add a UI library unless the user chooses that.

## Reusable UI components

Prefer a **small** set. Grow it only when the same pattern appears (or will appear) on more than one screen.

Typical primitives: `Screen`, `Text` (token variants), `Button`, `TextField`, `Card`. Do not pre-build components the app does not use yet.

- Screens compose primitives; they do not restyle the same button three different ways.
- Variants are token-driven (`primary` / `secondary` / `danger`), not one-off `style` overrides that break the system.
- Props for the difference that matters (label, `onPress`, disabled, accessibility). Do not fork a component for a single screen.
- Accessibility: contrast, hit targets, labels on controls. Match existing primitive patterns.

## Building a screen

1. Map the layout to existing primitives.
2. If a control is new but generic, add it under the shared UI folder and use tokens.
3. If a control is one-screen and trivial, local `StyleSheet` **using tokens** is enough — do not create a component for a single `View`.
4. Spacing between sections comes from the spacing scale (padding/gap/margin), not ad hoc pixels.
5. Check other screens after visual changes so color, type, and space still match.

## Anti-patterns

- Inline hex, `fontSize: 13`, `margin: 17` next to a token scale
- A second `colors` object in a feature folder
- Copy-pasting a button’s styles instead of using `Button`
- Installing NativeWind, Tamagui, Paper, etc. without an explicit decision
- Restyling one screen to “look nicer” in a way nothing else uses
