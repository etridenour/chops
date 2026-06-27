"use client";

import { Exercise } from "@chops/shared";
import { Body, YStack } from "@chops/ui";
import { ExerciseCard } from "./exercise-card";

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  if (!exercises.length) {
    return <Body>There are no Exercises yet</Body>;
  }
  return (
    <YStack gap="$2">
      {exercises.map((e) => (
        <ExerciseCard key={e.id} exercise={e} />
      ))}
    </YStack>
  );
}
