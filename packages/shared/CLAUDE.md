# Shared — Types, Validators & Services

## Purpose

Pure TypeScript types, validators, and services shared across all apps (web, API, mobile).

## Rules

- No React, React Native, Express, or any framework imports. Pure functions only.
- No side effects — all functions must be deterministic.

## Schema Conventions (Zod)

- Schemas live in `src/schemas/` with a file per domain (e.g., `auth.schema.ts`)
- Request types are inferred from Zod schemas via `z.infer<typeof schema>` in `src/types/`
- Response/payload types remain plain interfaces (no Zod — they aren't validated from user input)

## Type Conventions

- Request types end in `Request` (e.g., `LoginRequest`) — inferred from Zod schemas
- Response types end in `Response` (e.g., `AuthResponse`) — plain interfaces
- All types live in `src/types/` with a file per domain (e.g., `auth.ts`)

## Validator Conventions

- Functions named `validate{Action}` (e.g., `validateLogin`, `validateStartSignup`)
- Return `string[]` of error messages — empty array means valid
- Use Zod `.safeParse()` internally — all validators in `src/validators/` with a file per domain (e.g., `auth.validator.ts`)

## Exports

- Everything must be re-exported through `src/index.ts` barrel file.
- Apps import from `@chops/shared` — never from deep paths.

## Existing Types

- `User` — full DB model shape (includes `role`, `emailVerified`, timestamps)
- `AuthUser` — safe subset for API responses (`id`, `email`, `displayName`, `role`, `emailVerified`)
- `AccessTokenPayload`, `AuthResponse`
- `StartSignupRequest`, `CompleteSignupRequest`, `LoginRequest`
- `ForgotPasswordRequest`, `ResetPasswordRequest`

## After Changes

Run `pnpm build` to verify. All three apps depend on this package.
