"use client";

import { Exercise } from "@chops/shared";
import { Body, YStack } from "@chops/ui";
import { ExerciseCard } from "./exercise-card";

interface ExerciseListProps {
  exercises: Exercise[];
  isFetching?: boolean;
  hasActiveFilters?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExerciseList({
  exercises,
  isFetching = false,
  hasActiveFilters = false,
  onEdit,
  onDelete,
}: ExerciseListProps) {
  return (
    <YStack
      gap="$2"
      opacity={isFetching ? 0.5 : 1}
      pointerEvents={isFetching ? "none" : "auto"}
    >
      {exercises.length === 0 ? (
        <Body textAlign="center">
          {hasActiveFilters
            ? "No exercises match these filters"
            : "There are no exercises yet"}
        </Body>
      ) : (
        exercises.map((e) => (
          <ExerciseCard
            key={e.id}
            exercise={e}
            onEdit={() => e.id && onEdit(e.id)}
            onDelete={() => e.id && onDelete(e.id)}
          />
        ))
      )}
    </YStack>
  );
}
