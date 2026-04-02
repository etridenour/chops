# Web Frontend: Adding a New Feature

This guide walks through adding a new feature to the Next.js web app. Follow these steps every time to keep the codebase consistent.

## Example: Adding a "Routines" Feature

### 1. Check Shared Types

Make sure the types you need exist in `packages/shared`. Import them:

```typescript
import { Routine } from "@chops/shared";
```

If new types are needed, add them to the shared package first (see `packages/shared/NEW-FEATURE.md`).

### 2. Create the Page

Create a new route in the App Router at `src/app/routines/page.tsx`:

```typescript
import { YStack, H1 } from "@chops/ui";
import { RoutineList } from "@/components/routines/routine-list";

export default function RoutinesPage() {
  return (
    <YStack flex={1} padding="$6" maxWidth={800} marginHorizontal="auto">
      <H1 marginBottom="$6">My Routines</H1>
      <RoutineList />
    </YStack>
  );
}
```

For dynamic routes (e.g., a single routine), create `src/app/routines/[id]/page.tsx`.

### 3. Create Components

Create a folder for the feature's components at `src/components/routines/`:

```
src/components/routines/
├── routine-list.tsx       # List view
├── routine-card.tsx       # Individual card
└── routine-form.tsx       # Create/edit form
```

```typescript
// src/components/routines/routine-list.tsx
"use client";

import { YStack, Spinner } from "@chops/ui";
import { useRoutines } from "@/hooks/use-routines";
import { RoutineCard } from "./routine-card";

export function RoutineList() {
  const { routines, isLoading } = useRoutines();

  if (isLoading) return <Spinner />;

  return (
    <YStack gap="$3">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </YStack>
  );
}
```

### 4. Styling

All UI components come from `@chops/ui`. **Never hardcode colors, spacing, or font sizes.** Use theme tokens instead.

```typescript
// Good — uses tokens and shared components
import { YStack, Body, Button } from "@chops/ui";

<YStack padding="$4" borderRadius="$2" borderWidth={1} borderColor="$borderColor">
  <Body color="$colorMuted">Description</Body>
  <Button variant="secondary" size="sm">Edit</Button>
</YStack>

// Bad — hardcoded values
<div style={{ padding: 16, borderRadius: 8, border: "1px solid #ccc" }}>
  <p style={{ color: "#666" }}>Description</p>
  <button style={{ backgroundColor: "#eee" }}>Edit</button>
</div>
```

For full theming docs, see `docs/THEMING.md`.

### 5. Create Hooks

Create a custom hook for data fetching at `src/hooks/use-routines.ts`:

```typescript
"use client";

import { useState, useEffect } from "react";
import type { Routine } from "@chops/shared";

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`)
      .then((res) => res.json())
      .then((data) => {
        setRoutines(data);
        setIsLoading(false);
      });
  }, []);

  return { routines, isLoading };
}
```

### 6. Add API Helper (optional)

If the feature has multiple API calls, create a helper at `src/lib/api/routines.ts`:

```typescript
import type { Routine } from "@chops/shared";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchRoutines(): Promise<Routine[]> {
  const res = await fetch(`${API}/routines`);
  return res.json();
}

export async function createRoutine(data: Partial<Routine>): Promise<Routine> {
  const res = await fetch(`${API}/routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

## File Naming Conventions

| Type | Location | Naming |
|------|----------|--------|
| Page | `src/app/feature-name/page.tsx` | Folder = URL path |
| Component | `src/components/feature-name/` | `component-name.tsx` (kebab-case) |
| Hook | `src/hooks/` | `use-feature-name.ts` |
| API helper | `src/lib/api/` | `feature-name.ts` |

## Key Patterns

- **Server vs Client Components**: Pages are server components by default (good for SEO). Add `"use client"` only to components that need interactivity (event handlers, hooks, browser APIs).
- **Shared types**: Always import from `@chops/shared` — never redefine types locally.
- **Component folders**: Group components by feature, not by type.
- **Styling**: Use `@chops/ui` components and theme tokens (`$space.4`, `$colorMuted`). Never hardcode colors or spacing. See `docs/THEMING.md`.
- **Forms**: Wrap form content with native `<form>` elements for semantic HTML.

## Checklist

- [ ] Shared types exist in `@chops/shared`
- [ ] Page created under `src/app/`
- [ ] Components created under `src/components/feature-name/`
- [ ] Custom hook created if the feature fetches data
- [ ] Imports use `@chops/shared` for types
- [ ] Uses `@chops/ui` components and theme tokens (no hardcoded colors/spacing)
- [ ] Page is accessible via the expected URL
