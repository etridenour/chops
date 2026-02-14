# Chops

Drums & percussion practice app.

## Tech Stack

- **Web**: Next.js + TypeScript
- **API**: Express + TypeScript + Prisma + PostgreSQL
- **Mobile**: Expo (React Native) + TypeScript
- **Shared**: TypeScript package for shared types & business logic
- **Monorepo**: pnpm workspaces + Turborepo

## Quick Start

```bash
pnpm install #NODE_ENV=development pnpm install because node is set to production on my machine
cp .env   # Edit with your database URL
pnpm dev               # Starts all apps
```

- Web: http://localhost:3000
- API: http://localhost:4000
- Mobile: Scan QR code with Expo Go

## Documentation

- [Getting Started](docs/GETTING-STARTED.md) — Setup, running, and viewing the apps
- [Turborepo Guide](docs/TURBOREPO.md) — How the monorepo build system works
- [Deployment](docs/DEPLOYMENT.md) — Deploying each app to production

## Feature Playbooks

Each app has a `NEW-FEATURE.md` at its root that describes how to add a new feature following the project's conventions:

- [Web Feature Guide](apps/web/NEW-FEATURE.md)
- [API Feature Guide](apps/api/NEW-FEATURE.md)
- [Mobile Feature Guide](apps/mobile/NEW-FEATURE.md)
- [Shared Package Guide](packages/shared/NEW-FEATURE.md)

## Project Structure

```
chops-app/
├── apps/
│   ├── web/        → Next.js frontend
│   ├── api/        → Express API server
│   └── mobile/     → Expo React Native app
├── packages/
│   └── shared/     → Shared types, services, validators
└── docs/           → Project documentation
```
