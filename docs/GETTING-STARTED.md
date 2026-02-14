# Getting Started

## Prerequisites

- **Node.js** v20+ ([download](https://nodejs.org))
- **pnpm** v9+ (`npm install -g pnpm`)
- **PostgreSQL** running locally or a remote database URL
- **Expo Go** app on your phone (for mobile development) — or iOS Simulator / Android Emulator

## Initial Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd chops-app
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/chops?schema=public"
```

### 3. Set up the database

```bash
cd apps/api
pnpm db:push        # Push the Prisma schema to your database
pnpm db:generate    # Generate the Prisma client
cd ../..
```

## Starting the Apps

### Start everything at once

```bash
pnpm dev
```

This uses Turborepo to start all apps simultaneously:
- **Web**: http://localhost:3000
- **API**: http://localhost:4000
- **Mobile**: Expo dev server (scan QR code with Expo Go)

### Start individual apps

```bash
pnpm dev:web      # Web frontend only → http://localhost:3000
pnpm dev:api      # API backend only  → http://localhost:4000
pnpm dev:mobile   # Mobile app only   → Expo dev server
```

## Viewing the Apps

### Web App
Open http://localhost:3000 in your browser.

### API
Open http://localhost:4000/health in your browser or use curl:
```bash
curl http://localhost:4000/health
```

### Mobile App

1. Run `pnpm dev:mobile`
2. A QR code appears in the terminal
3. **iOS**: Scan the QR code with your phone's Camera app (Expo Go must be installed)
4. **Android**: Scan the QR code inside the Expo Go app
5. **Simulator/Emulator**: Press `i` for iOS Simulator or `a` for Android Emulator in the terminal

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm dev:web` | Start web only |
| `pnpm dev:api` | Start API only |
| `pnpm dev:mobile` | Start mobile only |
| `cd apps/api && pnpm db:studio` | Open Prisma Studio (database GUI) |
| `cd apps/api && pnpm db:migrate` | Run database migrations |

## Project Structure

```
chops-app/
├── apps/
│   ├── web/        → Next.js frontend (port 3000)
│   ├── api/        → Express API (port 4000)
│   └── mobile/     → Expo React Native
├── packages/
│   └── shared/     → Shared types, services, validators
└── docs/           → Project documentation
```

## Troubleshooting

**`pnpm install` fails with workspace errors**
Make sure you're running `pnpm install` from the root `chops-app/` directory, not from inside an app folder.

**Database connection errors**
Ensure PostgreSQL is running and your `DATABASE_URL` in `.env` is correct. You can test the connection with:
```bash
cd apps/api && pnpm db:studio
```

**Mobile app can't connect to API**
When running on a physical device, `localhost` won't work. Use your computer's local IP address instead of `localhost` in the API URL.
