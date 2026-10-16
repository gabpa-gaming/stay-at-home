
his is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


# Project: stay-at-home
## Overview
A small voice-based pre-screening application for an online medical consultation service.

The user records a single voice message describing their symptoms. The application transcribes the recording and uses an external AI service to classify the report according to predefined service eligibility criteria.

This is a short recruitment take-home assignment. Prioritize a working end-to-end flow over extensive architecture.

## Tech Stack
- React Native
- Expo
- TypeScript
- expo-audio for audio recording
- An external AI API for speech transcription and text analysis

The application should run on the web and, where practical, on mobile devices.

## Core User Flow
1. The user enters their own API key.
2. The user records a voice message describing their symptoms.
3. The application transcribes the recording.
4. AI analyzes the transcript against explicit service eligibility criteria.
5. The application displays the transcript and classification result.

## Classification and Safety
- The application performs administrative pre-screening, not medical diagnosis.
- It must not determine whether someone is medically fit to work or entitled to sick leave.
- Uncertain cases must be routed for human review.
- Potential emergency symptoms must not be dismissed as out of scope.
- Clearly distinguish service eligibility from medical urgency.
- Do not present AI-generated classifications as definitive medical decisions.

## Constraints
- No user accounts.
- No database or persistent consultation history.
- No unnecessary backend infrastructure.
- No unnecessary dependencies.
- Do not persist API keys unless explicitly required.
- Clearly communicate API errors and recording failures.

## Development Guidelines
- Use TypeScript and keep types explicit.
- Prefer small, understandable components.
- Avoid overengineering and premature abstractions.
- Use current, compatible Expo APIs.
- Make incremental changes and verify the application still runs.
- Explain important architectural decisions briefly.
- Do not implement features outside the assignment without a clear reason.

## Priorities
1. A working end-to-end flow.
2. Reliable audio recording and transcription.
3. Transparent, structured AI classification.
4. A polished and accessible interface.
5. Clear documentation of design decisions and limitations.
