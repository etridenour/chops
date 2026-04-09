# Web — Next.js 15 + Tamagui

## Stack

Next.js 15 (App Router), React 19, Tamagui, react-native-web

## Dev

- `pnpm dev:web` — starts on port 3000
- Env: `NEXT_PUBLIC_API_URL`

## File Structure

- `src/app/` — pages (Next.js App Router), organized by route groups
- `src/app/(auth)/` — auth route group (login, signup, verify, forgot-password, reset-password) with shared layout
- `src/components/feature-name/` — feature-specific components
- `src/components/auth/` — auth-provider, protected-route
- `src/hooks/` — custom hooks (e.g., `use-auth.ts`)
- `src/lib/` — utilities (e.g., `api-client.ts`)
- `src/lib/api/` — API helper functions per domain

## Auth Pattern

- `AuthProvider` context manages user state + token refresh
- `ProtectedRoute` wrapper redirects to `/login` if not authenticated
- Access token stored in memory (not localStorage)
- Refresh token in httpOnly cookie (set by API)
- `apiClient` in `src/lib/api-client.ts` handles 401 → silent refresh automatically

## Tamagui on Web

- `NextTamaguiProvider` wraps the app (in `src/components/`)
- Uses `next-theme` for light/dark mode toggle
- `react-native` aliased to `react-native-web` in `next.config.ts`

## Existing Pages

- `/` — home, shows welcome + logout (protected)
- `/login` — email + password
- `/signup` — email verification flow
- `/verify` — complete account after email verification
- `/forgot-password` — request password reset email
- `/reset-password` — set new password with reset token
