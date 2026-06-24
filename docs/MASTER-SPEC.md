# Master Spec Document - Chops (Drum Practice App)

**Status:** Active development
**Last updated:** 2026-06-24

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

> **Current state:** Only `user` role exists in the database (default role on User model). Group roles (`group_member`, `group_admin`) arrive in **v2** with the Groups feature; the `admin` (platform) role is exercised in **v3** with the Platform Admin dashboard.

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

### Core Features

#### v1 — Solo practice (web + mobile)
- [~] Exercise library (CRUD) — API built (types, schema, validators, Prisma model, service, controller, routes); web frontend next
- [ ] Click track builder (CRUD)
- [ ] Practice session builder (CRUD)
- [ ] Metronome / live practice screen
- [ ] User profile / settings
- [ ] Onboarding / first-run
- [ ] Progress / analytics (individual user)
- [ ] Mobile offline support
- [ ] Rate limiting / API security
- [ ] Theming polish

#### v2 — Groups + mobile polish
- [ ] Groups (create, join, manage, assign)
- [ ] Session/program assignment + group permission checks
- [ ] Programs
- [ ] AI Quick Start
- [ ] Notifications (in-app + push)
- [ ] Sharing / content library
- [ ] Progress / analytics (group level)
- [ ] Group Admin / Instructor dashboard

#### v3 — Scale + monetization
- [ ] Platform Admin dashboard
- [ ] Advanced analytics
- [ ] Data export
- [ ] Play-along music loops
- [ ] Google OAuth
- [ ] 2FA / MFA
- [ ] Monetization / subscriptions

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

### Offline Support (Mobile Only)
- Mobile app must work seamlessly offline — musicians practicing with spotty or no wifi can't wait for network requests
- Local database (e.g., SQLite via expo-sqlite or WatermelonDB) stores exercises, click tracks, and sessions on device
- Sync engine pushes local changes to API when connectivity returns
- Conflict resolution strategy TBD (last-write-wins vs merge)
- Web app does not need offline support — it's primarily a management/setup tool
- **Targeted for v1** — built after core CRUD is working but before v1 ships; offline practice prevents user drop-off during real-world (spotty-wifi) use and testing

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

Exercise
├── id, title, userId
├── fromXml (Boolean, default false)
├── totalMeasures (Int)
├── timeSigChangeMeasures (Json) — measure-indexed time signature changes
├── createdAt, updatedAt, @@index([userId])
```

### To be implemented

**v1**
```
ClickTrack
├── id, name, userId, tempo
├── countIn config
├── bodyType: "time" | "measures" | "exercise"
├── body config (varies by type)

PracticeSession
├── id, name, userId
├── clickTrackIds (ordered list)
├── assignedToUserIds? (for groups, v2)

PracticeLog
├── id, userId, sessionId, duration, date
├── notes?, completedExercises? (later)

UserSettings
├── id, userId (unique)
├── theme, skin, defaultSoundSet, defaultCountIn
├── (separate model to avoid bloating User)

User (additions)
├── onboardedAt? (DateTime) — first-run tracking
```

**v2**
```
Group
├── id, name, ownerId
├── members (many-to-many with roles)

Program
├── id, name, userId
├── sessionIds (ordered) / schedule (structure TBD)
├── visibility: "private" | "unlisted" | "public"

Notification
├── id, userId, type, payload (Json), readAt?, createdAt

Sharing (additions to shareable models)
├── visibility: "private" | "unlisted" | "public"
│   on Exercise, ClickTrack, PracticeSession, Program
```

**v3**
```
MusicLoop  (play-along backing loops)
├── id, title, fileUrl (mp3/wav), tempo, genre/tags
├── built-in/curated library — no user uploads in v3
```

---

## 6. Core Features (Detailed)

### Exercise Library · v1
- Create exercises manually (title + total measure count)
- Supports changing time signatures within an exercise — stored as `timeSigChangeMeasures` (a measure-indexed map of where each time signature begins)
- MusicXML import (`fromXml` flag): parsing pipeline is out of scope for v1; only derived data (total measures + time-sig changes) is stored
- CRUD operations

### Click Track Builder · v1
Each click track has:
- **Name, tempo**
- **Count-in:** notes, time, measures (if measures, requires time signature)
- **Body type:**
  - Time duration
  - Number of measures
  - Length of exercise from library

### Practice Session Builder · v1
- A session is an ordered collection of click tracks
- Sessions can be assigned to users/groups (assignment flows land in **v2** with Groups)

### Metronome / Live Practice Screen · v1
- Run a session with integrated metronome
- Display: current exercise, tempo, progress
- Controls: start, stop, next, previous
- **Timing accuracy is paramount** — if UI conflicts with timing, timing wins

### Metronome Engine Requirements · v1
- Subdivisions: 8ths, triplets, 16ths
- Accent patterns (strong/weak beats, accent within a bar)
- Odd time signatures from the start (5/4, 7/8, 9/8, etc.)
- No polyrhythms in v1
- Audio: simple generated sounds, architecture should support swapping in real sound files later
- v1 uses built-in sound sets only, no user uploads
- Engine should live in a pure/core area, platform-specific audio layer for native vs web

### User Profile & Settings · v1
- **Profile:** display name, email, optional avatar
- **Account:** change email (re-verification required), change password, delete account
- **Preferences:** theme (light/dark/auto) + skin, default metronome sound set, default count-in
- Settings persist server-side (separate `UserSettings` model) so they sync across web + mobile

### Onboarding / First-Run · v1
- Triggered after first successful login (tracked via `User.onboardedAt`)
- Goal: get a new solo user from zero → running their first practice session fast
- Lightweight and skippable; re-accessible from settings
- Leaning toward a dismissible dashboard checklist over a full guided step-tour (cheaper, less brittle)

### Programs · v2
- A program is an ordered sequence of practice sessions over time (e.g., "4-week rudiment builder", "beginner independence course")
- Created by users, instructors, or via AI Quick Start
- Can be shared publicly, assigned to group members, or kept private
- Tracks progress through the program (which sessions completed, current position)
- Programs are the primary content unit for instructors and the community/sharing features
- Exact structure TBD (daily schedule vs flexible ordering, branching vs linear, etc.)

### AI Quick Start · v2
- Natural language input that generates practice data structures instantly
- Two modes:
  - **Quick practice:** "I want to practice at 120bpm for 2 minutes, increase by 4 every 2 minutes, 30 minutes total" → generates a temporary session and starts immediately
  - **Program/content creation:** "Create a 2-week program that builds snare rudiments from 80bpm to 140bpm" → generates a full program with sessions
- AI output is validated against existing Zod schemas — it's just translating intent into the data structures that already exist
- Users can save AI-generated content to their library or discard after use
- Requires paid tier with usage limits (per-user rate limiting, potentially model selection)
- Built after manual CRUD flow is stable — the AI layer sits on top of existing schemas

### Groups · v2
- Create / join groups
- Add/remove users
- Assign group admins
- Transfer ownership
- Assign sessions to members
- View group member list

### Notifications · v2
- **In-app** (notification center/feed) + **push** (mobile via Expo push; web optional later)
- Triggers: session/program assigned, group invite, group role change, (later) streak reminders, program milestones
- Backed by a `Notification` model (userId, type, payload, readAt, createdAt)
- User-controllable preferences (per-channel, per-type) under Settings
- Depends on Groups; email as a third channel is TBD

### Sharing / Content Library · v2
- Make exercises, click tracks, and **programs** publicly shareable (programs are the primary shared unit)
- Public/browsable library of community content; clone/import into your own library
- `visibility: private | unlisted | public` field on shareable models
- Moderation/reporting, clone attribution, and curated/featured content deferred — but reserve the visibility field in the data model now

### Progress / Analytics · v1–v3 (by tier)
- Practice history
- Streaks
- Charts / summaries
- User-level and group-level progress views
- v1: computed on read via queries or simple maintained fields, no separate analytics pipeline

### Admin & Analytics Dashboards

Three distinct dashboard levels, each with different audiences and data:

**Platform Admin (app owner / `admin` role) · v3:**
- Total users, signups over time, active users
- Usage metrics (sessions run, exercises created, etc.)
- System health / monitoring
- User management (view, suspend, etc.)
- Scope and exact metrics TBD

**Group Admin / Instructor (`group_admin` role) · v2:**
- Group member list and activity
- Session completion and assignment tracking
- Per-student progress and practice history
- Group-level trends and summaries

**Individual User (`user` role) · v1:**
- Personal practice history, streaks, charts
- Progress on assigned sessions (if in a group)

### Play-Along Loops · v3
- Alternative to the metronome: practice along to premade backing loops instead of (or alongside) a click
- Loops are premade audio files (mp3/wav) — grooves, song sections, click+music beds
- Built-in/curated loop library only — no user uploads in v3 (mirrors the metronome built-in-sound-set approach)
- Fixed-tempo audio: library organized by tempo/genre rather than time-stretched (time-stretching is out of scope — too complex/quality-sensitive for v3)
- Reuses the platform audio layer (native vs web) already built for the metronome
- Open: standalone player vs. a new ClickTrack `bodyType: "loop"` so loops slot into sessions

### Data Export · v3
- Export practice history + user-created content (exercises, click tracks, sessions, programs)
- Formats: JSON (full fidelity, re-importable) at minimum; CSV for practice logs (spreadsheet-friendly)
- User-initiated from settings; async job if datasets get large
- Supports data-portability / "download my data" expectations
- Leaning export-only first; import round-trip is a later consideration

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
- Group-level permission checks (v2)
- Google OAuth (v3) — schema prepared with Account.provider + providerAccountId
- 2FA / MFA (v3)

### Rate Limiting / API Security · v1
- Per-IP and per-user rate limits on all routes; stricter limits on auth routes (login, signup, password reset, email verification) to prevent brute-force and account enumeration
- Standard hardening middleware: `helmet`, CORS allowlist, request body-size limits
- Centralized as Express middleware, configurable per-route
- AI Quick Start carries its own per-user usage quota on top of general limits (ties into the v2 paid tier)
- Open: in-memory limiter (simple, single-instance) for v1 vs. Redis-backed at scale

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

## 11. Version Roadmap & Build Order

Work is organized into three version milestones. Order within each accounts for dependencies between features.

**Foundation (done):** local infra · auth end-to-end · app layout/navigation

### v1 — Solo practice works end-to-end (web + mobile)
*Definition of done: a solo drummer can create content and run real practice sessions on both platforms, secured, with onboarding.*
1. Exercise library CRUD *(API done; web frontend next)*
2. Click track builder CRUD
3. Practice session builder CRUD
4. Metronome / live practice core
5. User profile & settings
6. Onboarding / first-run
7. Progress / analytics (individual user)
8. Mobile offline support
9. Rate limiting / API security
10. Theming polish
11. Testing pass + deployment prep

### v2 — Groups / org context + mobile polish
*Definition of done: instructors and groups; mobile is first-class.*
1. Groups (create, join, manage, roles, ownership transfer)
2. Session/program assignment + group-level permission checks
3. Programs
4. AI Quick Start (incl. per-user paid-tier quota)
5. Notifications (in-app + push)
6. Sharing / content library
7. Progress / analytics (group level) + Group Admin / Instructor dashboard

### v3 — Scale + monetization
*Definition of done: platform operations, growth, revenue.*
1. Platform Admin dashboard
2. Advanced analytics (usage metrics, system health)
3. Data export
4. Play-along music loops
5. Google OAuth
6. 2FA / MFA
7. Monetization / subscriptions

---

## 12. Open Decisions

These areas are not fully locked down. Tagged with the version where each must be resolved.

**v1**
- Exact screen-by-screen UX flows (exercises, click tracks, sessions, live practice)
- Exact endpoint contracts for feature routes (auth contracts are defined)
- Final Prisma relation details for click tracks and sessions
- Streak calculation rules
- Live practice edge-case behavior
- Onboarding UX (guided flow vs. dismissible checklist)
- `UserSettings` model shape (extend User vs. separate model — leaning separate)
- Offline conflict resolution (last-write-wins vs. merge)
- Built-in sound set structure
- Rate limiter backend (in-memory vs. Redis)
- Email templates / email provider choice (currently Nodemailer)

**v2**
- Group invitation / join mechanics
- Session assignment permission edge cases
- Program structure (daily schedule vs. flexible ordering, linear vs. branching)
- Sharing: moderation/reporting, attribution on clones, curated/featured content
- Notification channels (include email? per-type granularity)
- AI Quick Start: model selection, exact usage-limit tiers

**v3**
- Play-along loops: standalone player vs. ClickTrack `bodyType: "loop"`; library organization (tempo/genre)
- Analytics definitions (platform + advanced)
- Monetization / subscriptions / admin tooling
- Data export scope (export-only vs. import round-trip)
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
