"use client";

import { ExerciseList } from "@/components/exercises/exercise-list";
import { ExerciseListSkeleton } from "@/components/exercises/exercise-list-skeleton";
import { deleteExercise, fetchExercises } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import { Button, ErrorState, H1, XStack, YStack } from "@chops/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Exercises() {
  const router = useRouter();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExercises();
      setExercises(data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleEdit = (id: string) => {
    router.push(`/library/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExercise(id);
      const filteredExercises = exercises.filter((e) => e.id !== id);
      setExercises(filteredExercises);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <YStack padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <H1>Library</H1>
        <Button onPress={() => router.push("/library/new")}>
          New Exercise
        </Button>
      </XStack>

      {isLoading ? (
        <ExerciseListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ExerciseList
          exercises={exercises}
          onEdit={(id) => handleEdit(id)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </YStack>
  );
}
