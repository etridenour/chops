"use client";

import ExerciseForm from "@/components/exercises/exercise-form";
import { fetchExerciseById } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import { ErrorState, Spinner, YStack } from "@chops/ui";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SingleExercise() {
  const { id } = useParams<{ id: string }>();

  const [exercise, setExercise] = useState<Exercise>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExerciseById(id);
      setExercise(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <YStack padding="$4" gap="$4">
      {isLoading ? (
        <YStack padding="$4" alignItems="center">
          <Spinner />
        </YStack>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ExerciseForm exercise={exercise} />
      )}
    </YStack>
  );
}
