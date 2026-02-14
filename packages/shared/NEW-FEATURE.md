# Shared Package: Adding Shared Code

This guide walks through adding shared types, services, validators, or constants that are used by both the web frontend and mobile app.

## When to Add to Shared

Add code here when:
- A **type/interface** is used by more than one app (web, mobile, or API)
- **Business logic** (calculations, formatting, validation) is the same across web and mobile
- **Constants** (enums, config values) are referenced in multiple apps

Do NOT add here:
- UI components (React Native and React DOM are different)
- API-only logic (keep it in `apps/api`)
- Platform-specific code

## Example: Adding a "Routine" Type and Validator

### 1. Create the Type

Create `src/types/routine.ts`:

```typescript
export interface Routine {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoutineInput {
  name: string;
  description?: string;
}
```

Export from `src/types/index.ts`:

```typescript
export * from "./routine";
```

### 2. Create a Validator (optional)

If the same validation is needed on both frontend and mobile, create `src/validators/routine.validator.ts`:

```typescript
import type { CreateRoutineInput } from "../types";

export function validateCreateRoutine(input: CreateRoutineInput): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (input.name && input.name.length > 100) {
    errors.push("Name must be 100 characters or less");
  }

  return errors;
}
```

Export from `src/validators/index.ts` and then from `src/index.ts`.

### 3. Create a Service (optional)

For shared business logic, create `src/services/routine.service.ts`:

```typescript
import type { Routine } from "../types";

export function formatRoutineDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function sortRoutinesByDate(routines: Routine[]): Routine[] {
  return [...routines].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
```

### 4. Export from the Barrel

Make sure everything is exported through `src/index.ts`:

```typescript
export * from "./types";
export * from "./services/routine.service";
export * from "./validators/routine.validator";
```

### 5. Use in Other Apps

```typescript
// In apps/web or apps/mobile
import { Routine, validateCreateRoutine, formatRoutineDuration } from "@chops/shared";
```

## File Naming Conventions

| Type | Location | Naming |
|------|----------|--------|
| Type/Interface | `src/types/` | `feature-name.ts` |
| Service | `src/services/` | `feature-name.service.ts` |
| Validator | `src/validators/` | `feature-name.validator.ts` |
| Constants | `src/constants/` | `feature-name.constants.ts` |

## Key Rules

- **Always export from `src/index.ts`** — this is the public API of the package. Other apps should only import from `@chops/shared`, never from deep paths.
- **No platform-specific code** — nothing from `react`, `react-native`, `next`, or `express` should be imported here.
- **Keep it pure** — shared code should be pure TypeScript functions and types with no side effects.

## Checklist

- [ ] Type/interface created in `src/types/`
- [ ] Exported from `src/types/index.ts`
- [ ] Service or validator created (if applicable)
- [ ] Everything re-exported from `src/index.ts`
- [ ] No platform-specific imports
- [ ] Used correctly in web and/or mobile app
