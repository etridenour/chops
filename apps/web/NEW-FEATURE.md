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
import { RoutineList } from "@/components/routines/routine-list";

export default function RoutinesPage() {
  return (
    <main>
      <h1>My Routines</h1>
      <RoutineList />
    </main>
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

import { useRoutines } from "@/hooks/use-routines";
import { RoutineCard } from "./routine-card";

export function RoutineList() {
  const { routines, isLoading } = useRoutines();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
}
```

### 4. Create Hooks

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

### 5. Add API Helper (optional)

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

## Checklist

- [ ] Shared types exist in `@chops/shared`
- [ ] Page created under `src/app/`
- [ ] Components created under `src/components/feature-name/`
- [ ] Custom hook created if the feature fetches data
- [ ] Imports use `@chops/shared` for types
- [ ] Page is accessible via the expected URL
