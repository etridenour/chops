"use client";

import { ExerciseList } from "@/components/exercises/exercise-list";
import { ExerciseListSkeleton } from "@/components/exercises/exercise-list-skeleton";
import { fetchExercises } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import { ErrorState, YStack } from "@chops/ui";
import { useCallback, useEffect, useState } from "react";

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExercises();
      setExercises(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) return <ExerciseListSkeleton />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <YStack flex={1} justifyContent="center">
      <ExerciseList exercises={exercises} />
    </YStack>
  );
}
