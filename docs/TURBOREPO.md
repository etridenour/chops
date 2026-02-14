# Turborepo Guide

## What is Turborepo?

Turborepo is a build system for JavaScript/TypeScript monorepos. Instead of running commands in each app one at a time, Turborepo runs them **in parallel** and **caches the results** so repeated builds are near-instant.

## How It Works in This Project

Our monorepo has 4 packages:

| Package | Location | Description |
|---------|----------|-------------|
| `@chops/web` | `apps/web` | Next.js frontend |
| `@chops/api` | `apps/api` | Express backend |
| `@chops/mobile` | `apps/mobile` | Expo mobile app |
| `@chops/shared` | `packages/shared` | Shared types & business logic |

Turborepo understands the dependency graph between these packages. For example, `@chops/web` depends on `@chops/shared`, so Turborepo knows to build `shared` before `web`.

## Configuration (`turbo.json`)

The `turbo.json` file at the root defines **tasks** (called pipelines):

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

- **`dev`**: Starts dev servers for all apps in parallel. `persistent: true` means they keep running. `cache: false` because dev servers don't produce cacheable output.
- **`build`**: Builds all packages. `dependsOn: ["^build"]` means "build my dependencies first." `outputs` tells Turbo what to cache.
- **`lint`**: Runs linting across all packages after dependencies are built.

## Common Commands

### Run all dev servers at once
```bash
pnpm dev
```
This starts the web app, API server, and mobile app simultaneously.

### Run a specific app only
```bash
pnpm dev:web      # Just the Next.js frontend
pnpm dev:api      # Just the Express backend
pnpm dev:mobile   # Just the Expo mobile app
```

### Build everything
```bash
pnpm build
```
Turborepo will build `shared` first (since others depend on it), then build `web`, `api`, and `mobile` in parallel.

### Lint everything
```bash
pnpm lint
```

### Filter to a specific package
```bash
pnpm turbo dev --filter=@chops/web
pnpm turbo build --filter=@chops/api
```

### See the dependency graph
```bash
pnpm turbo build --graph
```
This outputs a visual graph showing the build order.

## Caching

When you run `pnpm build`, Turborepo hashes the inputs (source files, env vars, dependencies) and caches the outputs. If nothing changed, the next `pnpm build` replays the cached result instantly.

You'll see output like:
```
@chops/shared:build: cache hit, replaying logs
@chops/web:build: cache miss, executing
```

To clear the cache:
```bash
pnpm turbo build --force
```

## Key Concepts

- **Task**: A script defined in `package.json` (like `dev`, `build`, `lint`)
- **Pipeline**: The configuration in `turbo.json` that defines how tasks relate to each other
- **`^` prefix**: Means "run this task in my dependencies first" (e.g., `^build` = build dependencies before me)
- **`persistent`**: The task runs indefinitely (like a dev server)
- **Cache**: Turborepo stores build outputs and replays them when inputs haven't changed
