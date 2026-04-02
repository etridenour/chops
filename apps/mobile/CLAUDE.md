# Mobile — Expo + React Native + Tamagui

## Stack

Expo 54, Expo Router (file-based routing), React Native, Tamagui, expo-secure-store

## Dev

- `pnpm dev:mobile` — starts in tunnel mode, scan QR with Expo Go
- Env: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_WEB_URL`

## File Structure

- `app/` — screens (file-based routing via Expo Router)
- `app/_layout.tsx` — root layout with Stack navigator + auth guard
- `src/components/feature-name/` — feature-specific components
- `src/hooks/` — custom hooks (e.g., `use-auth.ts`)
- Register new screens as `Stack.Screen` in `app/_layout.tsx`

## Auth Pattern

- `AuthProvider` uses `expo-secure-store` for refresh token persistence
- Sends `X-Client-Type: mobile` header on all API requests
- Refresh token stored/retrieved via SecureStore (not cookies)
- Auth guard in `_layout.tsx` redirects unauthenticated users to `/login`

## Navigation

- Expo Router with Stack navigator
- File-based: `app/feature.tsx` → `/feature` route
- Nested: `app/feature/index.tsx` → `/feature` route

## Mobile UX Patterns

- Use `KeyboardAvoidingView` for forms
- Use `FlatList` for scrollable lists (not `ScrollView` with `.map()`)
- Test on both iOS and Android

## Web Redirect Pattern

- Forgot password opens the web app via `expo-web-browser` instead of a native screen
- Uses `EXPO_PUBLIC_WEB_URL` env var for the web app URL

## Existing Screens

- `/` (index) — home, shows welcome + logout (protected)
- `/login` — email + password login + forgot password (web redirect)
- `/signup` — email verification flow
