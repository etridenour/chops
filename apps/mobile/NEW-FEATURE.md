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
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRoutines } from "@/hooks/use-routines";
import { RoutineCard } from "@/components/routines/routine-card";

export default function RoutinesScreen() {
  const { routines, isLoading } = useRoutines();

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineCard routine={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
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
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Routine } from "@chops/shared";

interface RoutineCardProps {
  routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  return (
    <Pressable style={styles.card}>
      <Text style={styles.name}>{routine.name}</Text>
      {routine.description && (
        <Text style={styles.description}>{routine.description}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
```

### 5. Create Hooks

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
- **StyleSheet**: Use `StyleSheet.create()` for all styles, defined at the bottom of the file.
- **Component folders**: Group components by feature, not by type.
- **Lists**: Use `FlatList` for scrollable lists (not `ScrollView` with `.map()`).

## Checklist

- [ ] Shared types exist in `@chops/shared`
- [ ] Screen created under `app/`
- [ ] Screen registered in `app/_layout.tsx`
- [ ] Components created under `src/components/feature-name/`
- [ ] Custom hook created if the feature fetches data
- [ ] Imports use `@chops/shared` for types
- [ ] Styles use `StyleSheet.create()`
- [ ] Tested on both iOS and Android (or at least one)
