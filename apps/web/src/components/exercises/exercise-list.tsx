"use client";

import { Exercise } from "@chops/shared";
import { Body, YStack } from "@chops/ui";
import { ExerciseCard } from "./exercise-card";

interface ExerciseListProps {
  exercises: Exercise[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExerciseList({
  exercises,
  onEdit,
  onDelete,
}: ExerciseListProps) {
  if (!exercises.length) {
    return <Body textAlign="center">There are no Exercises yet</Body>;
  }
  return (
    <YStack gap="$2">
      {exercises.map((e) => (
        <ExerciseCard
          key={e.id}
          exercise={e}
          onEdit={() => e.id && onEdit(e.id)}
          onDelete={() => e.id && onDelete(e.id)}
        />
      ))}
    </YStack>
  );
}
