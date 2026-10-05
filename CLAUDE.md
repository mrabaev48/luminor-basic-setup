# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`, project references) then production build to `dist/`
- `npm run lint` — ESLint over the whole repo
- `npm run preview` — serve the production build
- `npm test` — Vitest (jsdom + Testing Library), single run; `npm run test:watch` for watch mode. Run one file with `npx vitest run <path>`.

Tests sit next to the code they cover (`*.test.ts(x)`); shared setup (jest-dom matchers, cleanup, `localStorage.clear()`, mock/global restore) is in `src/shared/config/test-setup.ts`. Type-checking only happens through `npm run build` (or `npx tsc -b`); `vite dev` does not type-check.

## Stack

React 19 + TypeScript 6 + Vite 8 (`@vitejs/plugin-react`, Oxc-based). No router, state library, or CSS framework. React Compiler is not enabled.

## Structure

- Entry: `index.html` → `src/main.tsx` (mounts `<App />` in `StrictMode`) → `src/App.tsx`.
- Shared code lives under `src/shared/` (e.g. `src/shared/lib/` for constants/helpers), suggesting a Feature-Sliced-Design-style layout; follow it when adding new modules.
- Global styles and theme tokens (CSS custom properties, light/dark via `prefers-color-scheme`) are in `src/index.css`.

## TypeScript / lint constraints

- Two tsconfig projects: `tsconfig.app.json` covers `src/` (DOM, bundler resolution); `tsconfig.node.json` covers `vite.config.ts` only.
- `verbatimModuleSyntax` is on: type-only imports must use `import type`.
- `erasableSyntaxOnly` is on: no `enum`, `namespace`, or constructor parameter properties.
- `noUnusedLocals` / `noUnusedParameters` fail the build.
- Imports may include the `.tsx`/`.ts` extension (`allowImportingTsExtensions`), as `main.tsx` does.
- ESLint uses `react-hooks` and `react-refresh` (Vite preset): component files should only export components so HMR keeps working.
