---
name: expo-react-native
description: Develop React Native applications with Expo and TypeScript. Prefer current Expo APIs, minimal dependencies, small incremental changes, and explain important technical decisions. Use when writing or changing Expo, React Native, TypeScript, Expo Router, EAS, native config, or Expo module code.
---

# Expo React Native TypeScript

Prefer current Expo APIs, minimal dependencies, small incremental changes, and explain important technical decisions.

## Before any change

Before any change, plan out the scope. Do not edit files until the plan is written in the conversation.

Give a full plan of the features, including files touched. The plan must include:

1. **Goal** — what will be true when the work is done
2. **Features / steps** — ordered, each step small enough to land independently
3. **Files touched** — create / modify / delete, with path and why
4. **Out of scope** — what this change will not do
5. **Verification** — lint, typecheck, and the user-visible flow to exercise
6. **Open decisions** — anything architectural or ambiguous (see below)

Wait for confirmation when the user asked for a plan first, the change is large, or any architectural item is unresolved.

## Architectural decisions

Whenever an architectural decision is to be made, ask before making the decision.

Do not choose among these without asking:

- Navigation structure (tabs vs stack, route groups, file layout)
- State management approach (local state vs context vs a library)
- Adding a dependency (especially non-Expo libraries)
- Persistence (storage, API keys, history)
- Native vs JS implementation, Expo Go vs development build
- Backend, auth, or extra infrastructure
- Folder structure that other screens or modules must follow
- Third-party UI kits vs React Native primitives / Expo components

Ask with the options, a short recommendation, and the tradeoff. Proceed only after the user chooses, or if they already decided in this conversation.

After implementing, explain important technical decisions briefly (why this API, why this file, what was rejected).

## Current Expo APIs

Do not trust training data for Expo, EAS, or React Native APIs. They change every SDK.

Before writing code that touches those APIs:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. Otherwise fetch `https://docs.expo.dev/llms.txt` and follow links to the specific page. Never answer Expo API questions from memory.

Prefer recommended Expo modules over third-party libraries. Add a package only when existing code and Expo modules cannot do the job. Install with:

```bash
npx expo install <package>   # if bun.lock is present, use bunx expo install
```

Never `npm`/`yarn`/`pnpm`/`bun add` for Expo-related packages — versions must match the SDK.

## Commands

Use `bunx` instead of `npx` when `bun.lock` is present.

```bash
npx expo install <package>
npx expo start
npx expo lint
npx tsc --noEmit
npx expo-doctor
npx expo install --fix
```

Run lint and typecheck before declaring work done.

## Project layout

- Use **Expo Router** for navigation. Routes live in `src/app/` (or `app/` if that is what the repo already uses). Every file there is a screen; `_layout.tsx` files define navigators.
- Keep non-route code (components, hooks, utils, types) **outside** the routes directory.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- TypeScript: explicit types, no `any` unless unavoidable and commented.
- Small, understandable components. No premature abstractions.
- If `ios/` and `android/` do not exist, they are Continuous Native Generation. Never create or edit them by hand — configure native behavior in `app.json` / `app.config.*` and config plugins.
- Expo Go only includes bundled native modules. After adding a library with native code, the app needs a development build (`npx expo run:ios|android` or `eas build --profile development`).
- EAS CLI: `bunx eas-cli <command>` in Bun projects, otherwise `npx eas-cli@latest <command>`. Do not assume a global `eas` binary.

## Incremental work

- One coherent feature (or fix) per change set.
- Keep the app runnable after each step.
- Do not implement features outside the requested scope.
- Match existing file patterns in the repo; do not invent a new architecture in the same change as a feature.

## Verification

- `npx expo lint` and `npx tsc --noEmit` (or `bunx` equivalents).
- For UI, layout, routing, or client state: exercise the changed flow end to end (web via browser tools when available; otherwise the closest substitute). Confirm behavior, not only a screenshot.
- State that must stay consistent across screens: check every route that reads or writes it.
- Report what could not be verified (no simulator, no API key, etc.).
