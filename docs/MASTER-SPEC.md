# Master Spec Document - Chops (Drum Practice App)

**Status:** Active development
**Last updated:** 2026-06-03

---

## 1. Product Overview

This app is for building technical proficiency when it comes to playing drums. It supports both single users and groups. The core value is letting users create, manage, assign, and run structured practice sessions with an integrated metronome/click system.

**Primary audience:**
- Individual drummers
- Students
- Instructors
- Groups / studios / practice communities

**Core product flow:**
1. Users create exercises
2. Users create click tracks from those exercises or manual parameters
3. Users create practice sessions composed of click tracks
4. Users run those sessions in a live metronome/practice mode
5. Groups/instructors can assign sessions and track progress

---

## 2. User Types / Roles

| Role | Description |
|------|-------------|
| **admin** | Super user. Access to everything for every user in the app |
| **user** | Creates and runs their own practice sessions. Can create a group (becomes that group's owner/admin) |
| **group_member** | Can join a group. Can run sessions assigned to them |
| **group_admin / instructor** | Controls a specific group. Can add users, assign admins, see progress data. Original creator retains ownership unless transferred |

> **Current state:** Only `user` role exists in the database (default role on User model). Group roles and admin are not yet implemented.

---

## 3. Build Progress

### Legend
- [x] Complete
- [~] Partially complete
- [ ] Not started

### Infrastructure & Auth
- [x] Monorepo setup (pnpm + Turborepo)
- [x] API server (Express + TypeScript)
- [x] Web app (Next.js 15 + Tamagui)
- [x] Mobile app (Expo + Tamagui)
- [x] Shared types/validators package (@chops/shared)
- [x] Shared UI component library (@chops/ui)
- [x] PostgreSQL + Prisma ORM
- [x] Email/password signup (2-step with email verification)
- [x] Login / Logout
- [x] JWT access tokens (15min) + refresh token rotation (7 days)
- [x] Password reset (email-based)
- [x] Protected routes (web + mobile)
- [x] Web app layout (sidebar + mobile bottom sheet)
- [ ] Google OAuth
- [ ] User profile / settings

### Core Features
- [ ] Exercise library (CRUD)
- [ ] Click track builder (CRUD)
- [ ] Practice session builder (CRUD)
- [ ] Metronome / live practice screen
- [ ] Groups (create, join, manage, assign)
- [ ] Progress / analytics

---

## 4. Architecture

### Repo Structure
```
chops-app/
├── apps/
│   ├── api/          Express API (port 4000)
│   ├── web/          Next.js 15 web app (port 3000)
│   └── mobile/       Expo React Native app
├── packages/
│   ├── shared/       Types, validators, schemas (Zod)
│   └── ui/           Tamagui design system components
├── docs/             Project documentation
├── turbo.json        Turborepo config
└── pnpm-workspace.yaml
```

### Stack

| Layer | Technology |
|-------|-----------|
| Web | Next.js 15 (App Router), React 19, Tamagui, react-native-web |
| Mobile | Expo, React Native, Tamagui |
| API | Express, TypeScript, Prisma, PostgreSQL |
| Validation | Zod schemas in @chops/shared |
| Auth | JWT access tokens + refresh token rotation |
| Styling | Tamagui tokens, themes, skins (light/dark + retro, neon, etc.) |
| Testing | Vitest + React Testing Library + happy-dom |
| Build | pnpm workspaces + Turborepo |

### API Architecture
```
routes → controllers (thin, req/res only) → services (business logic) → Prisma
```
- Centralized error handling via `AppError` class + error middleware
- All validation uses @chops/shared validators

### Web Architecture
```
app/
├── layout.tsx              Root layout (providers: Tamagui, Auth)
├── (auth)/                 Public auth pages (login, signup, etc.)
│   └── layout.tsx          Centered form layout
├── (app)/                  Protected app pages
│   └── layout.tsx          App shell (sidebar + mobile nav)
```
- `AuthProvider` context manages user state + token refresh
- `ProtectedRoute` enforced at `(app)` layout level via AppShell
- `apiClient` handles 401 → silent token refresh

### Mobile Architecture
- Expo Router with Stack navigator
- Auth guard in root `_layout.tsx`
- Refresh token stored in `expo-secure-store`
- Sends `X-Client-Type: mobile` header for token handling

---

## 5. Database Models

### Currently implemented

```
User
├── id, email, displayName?, role (default: "user"), emailVerified
├── → Account[] (one-to-many)

Account
├── id, userId, provider ("email"), providerAccountId?, passwordHash?
├── Unique: [provider, providerAccountId]

VerificationToken
├── id, email, token (unique), expiresAt

PasswordResetToken
├── id, email, token (unique), expiresAt

RefreshToken
├── id, token (unique), userId, expiresAt
```

### To be implemented

```
Exercise
├── id, name, userId
├── source: "manual" | "musicxml"
├── exerciseItems: [{ timeSignature, numberOfMeasures }]

ClickTrack
├── id, name, userId, tempo
├── countIn config
├── bodyType: "time" | "measures" | "exercise"
├── body config (varies by type)

PracticeSession
├── id, name, userId
├── clickTrackIds (ordered list)
├── assignedToUserIds (for groups)

PracticeLog
├── id, userId, sessionId, duration, date
├── notes?, completedExercises? (later)

Group
├── id, name, ownerId
├── members (many-to-many with roles)
```

---

## 6. Core Features (Detailed)

### Exercise Library
- Create exercises manually
- Each exercise has rows with time signature + number of measures (supports changing time signatures)
- MusicXML import: parsing pipeline is out of scope for v1, only derived data stored
- CRUD operations

### Click Track Builder
Each click track has:
- **Name, tempo**
- **Count-in:** notes, time, measures (if measures, requires time signature)
- **Body type:**
  - Time duration
  - Number of measures
  - Length of exercise from library

### Practice Session Builder
- A session is an ordered collection of click tracks
- Sessions can be assigned to users/groups

### Metronome / Live Practice Screen
- Run a session with integrated metronome
- Display: current exercise, tempo, progress
- Controls: start, stop, next, previous
- **Timing accuracy is paramount** — if UI conflicts with timing, timing wins

### Metronome Engine Requirements (v1)
- Subdivisions: 8ths, triplets, 16ths
- Accent patterns (strong/weak beats, accent within a bar)
- Odd time signatures from the start (5/4, 7/8, 9/8, etc.)
- No polyrhythms in v1
- Audio: simple generated sounds, architecture should support swapping in real sound files later
- v1 uses built-in sound sets only, no user uploads
- Engine should live in a pure/core area, platform-specific audio layer for native vs web

### Groups
- Create / join groups
- Add/remove users
- Assign group admins
- Transfer ownership
- Assign sessions to members
- View group member list

### Progress / Analytics
- Practice history
- Streaks
- Charts / summaries
- User-level and group-level progress views
- v1: computed on read via queries or simple maintained fields, no separate analytics pipeline

---

## 7. Auth & Security

### Implemented
- Email + password auth (2-step signup with email verification)
- JWT access tokens (15min) + refresh token rotation (7 days)
- Password reset via email
- Web: refresh token in httpOnly cookie
- Mobile: refresh token in SecureStore + response body
- Protected routes on web and mobile
- Role checks enforced on backend

### Not yet implemented
- Google OAuth (schema prepared with Account.provider + providerAccountId)
- 2FA/MFA
- Group-level permission checks

---

## 8. Theme / Design System

### Implemented
- Tamagui v2.0.0-rc.14 for cross-platform UI
- Light/dark themes with auto-detection
- 8 skins: retro, neon, purple, bw, ocean, red, cactus, neonGreen
- Token system: `$space`, `$color`, `$fontSize`, `$radius`, `$zIndex`
- Semantic colors: `$background`, `$color`, `$colorMuted`, `$borderColor`
- Components: Button (3 variants, 3 sizes), Input, Text (H1, H2, Body, Label, ErrorText, LinkText), LoadingDrum, SkinSelector
- CSS animation driver (fast, medium, slow, bouncy)
- Fonts: Inter (body + heading)

### Future
- High-contrast theme
- Student-friendly presets
- Potential skeuomorphic styling option

---

## 9. Testing

### Current setup
- **Framework:** Vitest 4.1.2
- **Component testing:** React Testing Library + happy-dom
- **User interaction:** @testing-library/user-event
- **Assertions:** @testing-library/jest-dom matchers

### Test coverage
- Auth pages: login, signup, verify, forgot-password, reset-password
- Navigation: nav-link, nav-items, sidebar, mobile-menu, mobile-header, app-shell
- Shared validators: auth validators

### Testing strategy
- Unit tests for validators and core logic
- Integration tests for components (let children render, mock external dependencies)
- Mock patterns established for Tamagui, Next.js Link, usePathname, useAuth
- Future: E2E tests with Playwright for critical flows

---

## 10. Dev Commands

```bash
# Start all apps
pnpm dev

# Start individually
pnpm dev:web          # port 3000
pnpm dev:api          # port 4000
pnpm dev:mobile       # Expo tunnel

# Build & quality
pnpm build            # build all
pnpm lint             # lint all
pnpm test             # test all

# Database (from apps/api)
pnpm db:push          # push schema (dev iteration)
pnpm db:migrate       # create named migration (production)
pnpm db:generate      # regenerate Prisma client
pnpm db:studio        # Prisma Studio GUI
```

---

## 11. Suggested Build Order

The following order accounts for dependencies between features:

1. ~~Local infra working~~ **Done**
2. ~~Auth end-to-end~~ **Done**
3. ~~App layout (navigation)~~ **Done**
4. Exercise library CRUD
5. Click track builder CRUD
6. Practice session builder CRUD
7. Metronome / live practice core
8. Groups and assignment flows
9. Progress / analytics
10. Polish theming
11. Testing pass
12. Deployment prep

---

## 12. Open Decisions

These areas are not fully locked down:
- Exact screen-by-screen UX flows
- Exact endpoint contracts for feature routes (auth contracts are defined)
- Final Prisma relation details for exercises, click tracks, sessions, groups
- Group invitation / join mechanics
- Session assignment permission edge cases
- Streak calculation rules
- Analytics definitions
- Live practice edge-case behavior
- Onboarding UX
- Email templates / email provider choice (currently Nodemailer)
- Built-in sound set structure
- Monetization / subscriptions / admin tooling
- Production hosting providers (architecture is provider-agnostic)

---

## 13. Guiding Rules

- Timing accuracy of the metronome is paramount
- Theme system is foundational, not bolted on later
- Mobile-first: build for mobile constraints first, then ensure web parity
- Always use @chops/ui tokens — never hardcode colors, spacing, or font sizes
- Always use @chops/shared for API types and validators — never define locally
- Keep code split into understandable pieces
- Prefer explicitness over cleverness
- Prisma schema is the source of truth for DB shape
- During active prototyping, optimize for momentum while keeping architecture sane
- Follow each app's NEW-FEATURE.md playbook when adding features
