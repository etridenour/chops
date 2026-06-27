"use client";

import { YStack } from "@chops/ui";
import { ExerciseCardSkeleton } from "./exercise-card-skeleton";

export function ExerciseListSkeleton() {
  return (
    <YStack gap="$2">
      {Array.from({ length: 4 }).map((_, i) => (
        <ExerciseCardSkeleton key={i} />
      ))}
    </YStack>
  );
}
