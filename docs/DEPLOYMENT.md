# Deployment Guide

## Overview

Each app in the monorepo can be deployed independently:

| App | Recommended Platform | Alternatives |
|-----|---------------------|--------------|
| Web (Next.js) | Vercel | Netlify, AWS Amplify, Railway |
| API (Express) | Railway | Render, Fly.io, AWS ECS |
| Mobile (Expo) | EAS Build + App Stores | Local builds |
| Database | Railway PostgreSQL | Supabase, Neon, AWS RDS |

## Web App (Next.js) → Vercel

### Setup

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build --filter=@chops/web`
   - **Install Command**: `pnpm install`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` → your deployed API URL

### Notes
- Vercel auto-deploys on every push to `main`
- Preview deployments are created for every PR

## API (Express) → Railway

### Setup

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm build`
   - **Start Command**: `pnpm start`
4. Add a PostgreSQL database from Railway's dashboard
5. Add environment variables:
   - `DATABASE_URL` → auto-populated if using Railway PostgreSQL
   - `API_PORT` → `4000` (or Railway assigns a port via `PORT`)

### Database Migrations

After deploying, run migrations:
```bash
cd apps/api
DATABASE_URL="your-production-url" pnpm db:push
```

## Mobile App (Expo) → EAS Build

### Setup

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure EAS from the mobile directory:
   ```bash
   cd apps/mobile
   eas build:configure
   ```

### Build for Testing

```bash
# iOS (internal distribution)
eas build --platform ios --profile preview

# Android (APK for testing)
eas build --platform android --profile preview
```

### Build for App Store / Play Store

```bash
# iOS (App Store submission)
eas build --platform ios --profile production
eas submit --platform ios

# Android (Play Store submission)
eas build --platform android --profile production
eas submit --platform android
```

### Over-the-Air Updates

One of Expo's superpowers — push JS updates without going through the app stores:

```bash
eas update --branch production --message "Bug fix for practice timer"
```

## Environment Variables

### Production checklist

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | API | PostgreSQL connection string |
| `API_PORT` | API | Port for the Express server |
| `NEXT_PUBLIC_API_URL` | Web | Public URL of the deployed API |
| `JWT_SECRET` | API | Secret for signing auth tokens (when auth is implemented) |
