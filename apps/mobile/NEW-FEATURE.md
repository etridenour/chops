# Mobile: Adding a New Feature

This guide walks through adding a new feature to the Expo React Native mobile app. Follow these steps every time to keep the codebase consistent.

## Example: Adding a "Routines" Feature

### 1. Check Shared Types

Make sure the types you need exist in `packages/shared`. Import them:

```typescript
import { Routine } from "@chops/shared";
```

If new types are needed, add them to the shared package first (see `packages/shared/NEW-FEATURE.md`).

### 2. Create the Screen

Expo Router uses file-based routing (like Next.js). Create `app/routines/index.tsx`:

```typescript
import { FlatList } from "react-native";
import { YStack, Spinner } from "@chops/ui";
import { useRoutines } from "@/hooks/use-routines";
import { RoutineCard } from "@/components/routines/routine-card";

export default function RoutinesScreen() {
  const { routines, isLoading } = useRoutines();

  if (isLoading) return <Spinner />;

  return (
    <YStack flex={1} padding="$4">
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineCard routine={item} />}
      />
    </YStack>
  );
}
```

For detail screens, create `app/routines/[id].tsx`.

### 3. Add the Screen to Navigation

In `app/_layout.tsx`, add the new screen to the Stack:

```typescript
<Stack.Screen name="routines/index" options={{ title: "Routines" }} />
```

### 4. Create Components

Create a folder for the feature's components at `src/components/routines/`:

```
src/components/routines/
├── routine-card.tsx       # Individual card
└── routine-form.tsx       # Create/edit form
```

```typescript
// src/components/routines/routine-card.tsx
import { YStack, Body } from "@chops/ui";
import type { Routine } from "@chops/shared";

interface RoutineCardProps {
  routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  return (
    <YStack
      padding="$4"
      backgroundColor="$background"
      borderRadius="$2"
      marginBottom="$3"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <Body fontWeight="600" fontSize="$4">{routine.name}</Body>
      {routine.description && (
        <Body color="$colorMuted" fontSize="$2" marginTop="$1">
          {routine.description}
        </Body>
      )}
    </YStack>
  );
}
```

### 5. Styling

All UI components come from `@chops/ui`. **Never hardcode colors, spacing, or font sizes.** Use theme tokens instead.

```typescript
// Good — uses tokens and shared components
import { YStack, Body, Button } from "@chops/ui";

<YStack padding="$4" borderRadius="$2" borderWidth={1} borderColor="$borderColor">
  <Body color="$colorMuted">Description</Body>
  <Button variant="secondary" size="sm">Edit</Button>
</YStack>

// Bad — hardcoded values with StyleSheet
const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 8, borderColor: "#ccc" },
});
```

For full theming docs, see `docs/THEMING.md`.

### 6. Create Hooks

Create a custom hook at `src/hooks/use-routines.ts`:

```typescript
import { useState, useEffect } from "react";
import type { Routine } from "@chops/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/routines`)
      .then((res) => res.json())
      .then((data) => {
        setRoutines(data);
        setIsLoading(false);
      });
  }, []);

  return { routines, isLoading };
}
```

## File Naming Conventions

| Type | Location | Naming |
|------|----------|--------|
| Screen | `app/feature-name/index.tsx` | Folder = route path |
| Component | `src/components/feature-name/` | `component-name.tsx` (kebab-case) |
| Hook | `src/hooks/` | `use-feature-name.ts` |
| Utility | `src/lib/` | `feature-name.ts` |

## Key Patterns

- **Expo Router**: File-based routing in the `app/` folder, similar to Next.js App Router.
- **Shared types**: Always import from `@chops/shared` — never redefine types locally.
- **Styling**: Use `@chops/ui` components and theme tokens. Never use `StyleSheet.create()` or hardcode colors. See `docs/THEMING.md`.
- **Component folders**: Group components by feature, not by type.
- **Lists**: Use `FlatList` for scrollable lists (not `ScrollView` with `.map()`).

## Checklist

- [ ] Shared types exist in `@chops/shared`
- [ ] Screen created under `app/`
- [ ] Screen registered in `app/_layout.tsx`
- [ ] Components created under `src/components/feature-name/`
- [ ] Custom hook created if the feature fetches data
- [ ] Imports use `@chops/shared` for types
- [ ] Uses `@chops/ui` components and theme tokens (no hardcoded colors/spacing)
- [ ] Tested on both iOS and Android (or at least one)
