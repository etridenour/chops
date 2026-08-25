# Chops — Drums & Percussion Practice App

Monorepo: `apps/web` (Next.js), `apps/api` (Express), `apps/mobile` (Expo), `packages/ui` (Tamagui), `packages/shared` (types/validators), `packages/eslint-config` (shared lint presets)

## Dev Commands

- `pnpm dev` — start all apps simultaneously
- `pnpm dev:web` / `pnpm dev:api` / `pnpm dev:mobile` — start individually
- `pnpm build` — build all packages and apps
- `pnpm lint` — ESLint across all packages and apps
- `pnpm typecheck` — `tsc --noEmit` across all packages and apps
- `pnpm check` — both of the above; the pre-commit command
- Turborepo stops at the first failing package — add `--continue` to see every failure
- Database (run from `apps/api`): `pnpm db:push`, `pnpm db:migrate`, `pnpm db:generate`, `pnpm db:studio`

## Coding Standards

- Write simple, concise, readable code. Always look for the simplest solution first.
- Break into components when necessary, but don't over-abstract.
- Always use `@chops/ui` tokens (`$space`, `$color`, `$fontSize`, etc.) — never hardcode colors, spacing, or font sizes.
- Always use `@chops/shared` for API request/response types and validators — never define them locally in an app.
- Follow each app's `NEW-FEATURE.md` playbook when adding features.
- Run `pnpm build` after changing `packages/shared` or `packages/ui` to verify nothing breaks.

## Platform Strategy

- **Mobile-first**: build for mobile constraints first, then ensure web parity.
- When modifying `@chops/ui`, verify behavior on both web and mobile.

## Workflow Rules

- Never auto-commit unless explicitly asked.
- Proactively flag commit points: pause and suggest committing when a self-contained unit is complete, builds/passes, and tells one clear story (if the subject needs an "and", it's probably two commits). Keep unrelated concerns in separate commits (e.g. a build fix vs. feature work).
- Explain planned changes before editing files.
- Prefer editing existing files over creating new ones.
- Keep changes minimal — no drive-by refactors or cleanups.

## Maintaining CLAUDE.md Files

- When adding a new feature, update the relevant CLAUDE.md with any new patterns, conventions, or gotchas discovered.
- When adding new shared types/validators, note the pattern in `packages/shared/CLAUDE.md`.
- When adding new UI components, note them in `packages/ui/CLAUDE.md`.
- When adding new API routes/models, note the pattern in `apps/api/CLAUDE.md`.
- When a new architectural decision is made, document it in this root CLAUDE.md.
- Keep entries concise — a single bullet point per pattern.

## Architecture Decisions

- **Tamagui** for cross-platform UI (shared components across web + mobile)
- **Express** for API (simple, well-known, sufficient for needs)
- **Prisma ORM** with PostgreSQL
- **JWT access tokens** (15min) + **refresh token rotation** (7 days)
- Web: refresh token in httpOnly cookie. Mobile: refresh token in SecureStore + response body.
- **pnpm workspaces** + **Turborepo** for monorepo orchestration
- **@tamagui/animations-css** driver configured in tamagui.config.ts (named animations: fast, medium, slow, bouncy)
- **REST for the whole API** — GraphQL was planned and cut (Aug 2026). Services stay transport-agnostic (plain data in, no `req`/`res`) so a second transport would be additive
- **ESLint** via `packages/eslint-config`, three flat-config presets: `base` (shared, api), `react` (ui, mobile), `next` (web). Each package's `eslint.config.mjs` is a three-line re-export

## Key Gotchas

- React 19 enforced via pnpm overrides in root `package.json`
- Tamagui is on RC (v2.0.0-rc.14) — check Tamagui docs for RC-specific behavior
- ESLint pinned to **9**, not 10: `eslint-plugin-jsx-a11y` and `eslint-config-next@15` both cap there. npm reports 9 as unsupported; lifts with the Next 16 upgrade
- `next.mjs` re-asserts `tseslint.parser` **after** `next/core-web-vitals` — Next 15 substitutes its own parser, which crashes `@typescript-eslint/no-unused-vars`. Do not remove until Next 16
- `eslint-plugin-jsx-a11y` only sees real DOM elements, so it is near-blind inside Tamagui components. It earns its keep in `apps/web`, not `packages/ui`
- Shared packages (`@chops/shared`, `@chops/ui`) must be listed in `transpilePackages` in `apps/web/next.config.ts`
- `react-native` is aliased to `react-native-web` in `next.config.ts` for Turbopack compatibility

## Documentation

- [Getting Started](docs/GETTING-STARTED.md) — Setup, prerequisites, running the apps
- [Testing Guide](docs/TESTING.md) — Stack, per-package setup, mock boundary, how to write tests
- [Theming Guide](docs/THEMING.md) — Tamagui tokens, themes, skins, components
- [Turborepo Guide](docs/TURBOREPO.md) — Monorepo build system
- [Deployment](docs/DEPLOYMENT.md) — Deploying web, API, and mobile to production
