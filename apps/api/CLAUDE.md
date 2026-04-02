# API — Express + Prisma + PostgreSQL

## Stack

Express 4, TypeScript, Prisma 6, PostgreSQL, JWT (jsonwebtoken), bcryptjs, Nodemailer

## Dev

- `pnpm dev:api` — starts on port 4000
- Env vars: `DATABASE_URL`, `API_PORT`, `JWT_SECRET`, `WEB_URL`, `SMTP_USER`, `SMTP_PASS`
- See `.env.example` for setup

## File Structure

- `src/services/` — business logic (one file per domain, e.g., `auth.service.ts`). Services accept plain data, return data or throw `AppError`. No `req`/`res`.
- `src/controllers/` — thin request/response handlers. Parse request, validate, call service, format response. Errors forwarded via `next(err)`.
- `src/routes/` — Express router definitions (one file per domain)
- `src/middleware/` — Express middleware (`auth.middleware.ts` for JWT, `error.middleware.ts` for centralized error handling)
- `src/errors/` — `AppError` class for typed errors with status codes
- `src/utils/` — utilities (`prisma.ts`, `jwt.util.ts`, `email.util.ts`)
- Register new route files in `src/index.ts`

## Error Handling Pattern

- Services throw `AppError(statusCode, message)` for expected errors (400, 401, 404, 409)
- Controllers wrap service calls in try/catch, forward errors via `next(err)`
- Global `errorHandler` middleware in `src/middleware/error.middleware.ts` catches all errors
- `AppError` instances return their status code + message; unknown errors return 500

## Auth Token Handling

- `issueTokens()` in `auth.service.ts` creates access + refresh tokens, returns both
  - Web clients: refresh token set as httpOnly cookie
  - Mobile clients (`X-Client-Type: mobile`): refresh token returned in response body
- Refresh token rotation: old token deleted from DB, new one created on each refresh
- Access tokens: 15min expiry, signed with `JWT_SECRET`
- Refresh tokens: 7-day expiry, stored as crypto-random hex in DB

## Database Workflow

1. Edit `prisma/schema.prisma`
2. `pnpm db:migrate` (creates migration + generates client)
3. `pnpm db:generate` (regenerate client without migrating)
4. `pnpm db:studio` (visual DB browser)

## Validation Pattern

- Import validators from `@chops/shared` (e.g., `validateLogin`)
- Call at top of controller function
- Return `400` with `{ errors: string[] }` if validation fails

## Existing Routes

- `GET /health` — health check
- `POST /auth/signup/start` — send verification email
- `POST /auth/signup/complete` — create account with verification token
- `POST /auth/login` — email + password login
- `POST /auth/logout` — delete refresh token
- `POST /auth/refresh` — rotate refresh token
- `GET /auth/me` — get current user (protected)
- `POST /auth/forgot-password` — send reset email
- `POST /auth/reset-password` — reset password with token
