# Portfolio - Architecture Rewrite

## Project Overview

This project is a full internal rewrite of the portfolio site with behavior parity preserved:

- Same URL surface (single-page hash routes + `404.html` redirect)
- Same visible sections
- Same keyboard flows (`Ctrl/Cmd+K`, `~`, `T`, `Shift+T`, `/`)
- Same overlays (boot, command palette, terminal, project modal)
- Same interaction model (search/filter/toggle/copy/radar/theme/reveal)

The implementation is rebuilt from scratch using modular vanilla ES modules, feature boundaries, and configuration-first rendering.

## Architecture Explanation

The codebase is split by runtime concern, not by file type:

- `src/app`: app composition and platform providers
- `src/features`: domain features (hero, projects, terminal, radar, etc.)
- `src/shared`: reusable configuration, utilities, constants, and shared services/components
- `src/styles`: design tokens + global/layout/component/feature style layers

### Why this architecture

- Reduces coupling: features own their rendering + behavior
- Keeps shared logic explicit: clipboard, text utils, storage keys, router constants
- Scales safely: adding sections/features does not require touching unrelated modules
- Supports migration paths: can move to CMS/localization/dark mode without rewriting core

## Folder Structure

```text
src/
  app/
    bootstrap.js
    layout/
      render-app-shell.js
    providers/
      document-metadata-provider.js
      reveal-provider.js
      service-worker-provider.js
      spotlight-provider.js
      theme-provider.js
    routing/
      hash-router.js
  features/
    background/
    boot/
    command-palette/
    contact/
    education/
    experience/
    hero/
    impact/
    navigation/
    project-modal/
    projects/
    ship-radar/
    skills/
    staff/
    terminal/
  shared/
    components/
    config/
    constants/
    services/
    utils/
  styles/
    tokens.css
    global.css
    layout.css
    components.css
    features.css
    main.css
tests/
  *.test.js
```

## Design Philosophy

1. Configuration-driven UI

- All portfolio content lives in `src/shared/config/content-registry.js`
- User/profile data, app shell identity, and document metadata are sourced from one registry (`src/shared/config/content-registry.js`)
- Components/features map data -> markup
- Repeated card/list structures are rendered via reusable loops

2. High cohesion, low coupling

- Feature modules do not import each other casually
- Cross-feature collaboration is orchestrated centrally in `bootstrap.js`

3. Explicit contracts

- Feature constructors receive dependencies as arguments (`toast`, `router`, callbacks)
- Hidden singleton coupling is avoided

4. Progressive enhancement

- Site remains static-hosting friendly
- Service worker and telemetry fail gracefully

## State Management

No global state library is used.

- Localized state in each feature (search text, active filters, modal open state, terminal history)
- Shared persistence only where needed (`localStorage`, `sessionStorage`)
- Cross-cutting updates use explicit APIs/events (theme custom event)

Rationale: this app does not require cross-page reactive graph state. Feature-local state keeps render updates predictable and cheaper.

## Styling System

Design is tokenized through `src/styles/tokens.css`:

- Central color roles (`--color-*`)
- Radius and spacing scale (`--radius-*`, `--space-*`)
- Typography tokens (`--font-sans`, `--font-mono`)
- Theme variants via `[data-theme="..."]`

Layering:

- `global.css`: reset/base/foundation
- `layout.css`: macro layouts (topbar, hero grid, footer)
- `components.css`: reusable UI building blocks
- `features.css`: section-specific and interaction styles

Implementation note:

- Runtime currently loads consolidated CSS from `src/styles/main.css`
- Style-layer files remain as extension points for future decomposition

## Performance Notes

- Canvas background and radar avoid unnecessary work in reduced-motion mode
- Debounced inputs for experience/projects search
- IntersectionObserver for reveal animation (only once per node)
- Local cache fallback for GitHub ship radar
- No global render loop beyond canvas systems

## Tooling

- ESLint flat config: `eslint.config.js`
- Prettier config: `.prettierrc`
- Test runner: Vitest (`vitest.config.js`)
- Git ignore policy: `.gitignore`
- Git hooks: Husky-backed repository hooks in `.husky/`
- npm scripts:
  - `npm run lint`
  - `npm run test`
  - `npm run validate`
  - `npm run format`
  - `npm run hooks:install`

## How To Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start any static server from repo root (examples):

```bash
npx serve .
```

or

```bash
python -m http.server 8080
```

3. Open the served URL in the browser.

## Git Hooks And Commit Policy

This repository enforces commit and push quality gates:

- `commit-msg`: blocks commits without `Signed-off-by:`
- `pre-commit`: runs `npm run lint`, enforces test coverage threshold (`>= 90%` for lines/statements on core unit-testable modules), regenerates `coverage.html` and `coverage/*`, stages coverage artifacts automatically, and blocks unresolved merge conflict markers
- `pre-push`: runs `npm run test` and verifies outgoing commits are signed off

Install or refresh hooks:

```bash
npm install
npm run hooks:install
```

Create signed-off commits:

```bash
git commit -s -m "your message"
```

Amend latest commit to add sign-off:

```bash
git commit --amend -s
```

## Push Workflow

Recommended flow:

```bash
git status
git add -A
git commit -s -m "describe change"
git push origin <branch-name>
```

If push is blocked:

- Fix lint/test failures reported by hooks
- Ensure all outgoing commits include `Signed-off-by:`
- Push again

## Build Process

No bundler is required for runtime.

- Browser-native ES modules are used
- Import maps provide aliases (`@app/`, `@features/`, `@shared/`)

This keeps deploy output simple for GitHub Pages/static hosting.

## Deployment Notes

- Deploy repository root as static site
- Keep `404.html` for hash-route-friendly redirects
- `sw.js` cache version should be bumped when static asset sets change
- Ensure `resume.pdf` and `assets/*` are present in deploy artifact

## Testing Strategy

Current baseline includes 46 passing Vitest tests across:
- Shared utilities (`text`, `math`, `time`, `async`, `dom`, `platform`)
- Shared services (`clipboard`, `storage repository`)
- Constants and mappings
- App providers (`theme`, `hash router`, `service worker`, `document metadata`)
- Feature behavior (`contact`, `command palette`, `project modal`, `projects`, `experience`, `navigation shortcuts`)

Run coverage locally:
```bash
npm run test:coverage
```

Coverage outputs:
- Terminal summary (text)
- HTML report: `coverage/index.html`
- Deployable entrypoint: `coverage.html` (redirects to `coverage/index.html`)
- LCOV: `coverage/lcov.info`
- Threshold enforcement: `>= 90%` lines/statements (configured in `vitest.config.js`)
- Hook behavior: each commit refreshes and stages `coverage.html` plus the HTML report files

Recommended next layer:
- Terminal command parsing/execution matrix
- Ship radar API/cache fallback contracts
- Full bootstrap integration smoke test
- Browser E2E suite (Playwright) for critical user journeys

## Extension Guidelines

### Add a New Feature

1. Create `src/features/<feature-name>/...`
2. Keep feature state internal
3. Expose `init()`/`render()` style API
4. Register feature in `src/app/bootstrap.js`
5. Add tests for feature logic

### Add a New Section

1. Add section metadata to `content-registry.js` (`routes` + section title)
2. Add mount point in `render-app-shell.js`
3. Implement section feature module
4. Register render/init in bootstrap
5. Add palette action and terminal navigation mapping if needed

### Add New Projects (20+ scale)

Only update `siteContent.projects` in the content registry. Rendering, filtering, modal opening, palette actions, and terminal `projects/open` commands remain unchanged.

### Add Localization Later

- Replace direct strings in config with locale maps
- Add locale provider in `src/app/providers`
- Keep feature modules reading from translated content object

### Add Dark Mode/Themes

Add theme token block in `tokens.css` and append new theme entry in `siteContent.themes`.

### CMS Migration Path

The content registry can be replaced by an adapter layer fetching CMS JSON and normalizing to existing data shape before `bootstrapPortfolio()`.

## Refactoring Guidelines

- Preserve feature boundaries; avoid cross-feature imports unless abstracted into `shared`
- Move any duplicated logic into `shared` services/utilities
- Keep DOM query IDs/classes stable when they are public interaction contracts
- Prefer adding data fields in config over embedding UI copy in features

## Code Conventions

- ES modules only
- Feature constructors accept explicit dependency objects
- No `any`-style dynamic shape assumptions; data shape is explicit in config
- Avoid hidden mutable globals
- Prefer pure helpers in `shared/utils`

## Technical Decisions and Trade-offs

1. Vanilla modular architecture over framework

- Pros: minimal runtime, static-host simplicity, easy drop-in on GitHub Pages
- Trade-off: manual DOM rendering instead of framework abstractions

2. Browser import maps over bundler aliasing

- Pros: no build dependency for runtime
- Trade-off: older browser support constraints

3. Local feature state over global store

- Pros: predictable ownership and reduced accidental coupling
- Trade-off: bootstrap coordinates cross-feature events explicitly

4. Cache-first service worker

- Pros: strong offline resilience for static assets
- Trade-off: requires version bump discipline to invalidate stale caches

