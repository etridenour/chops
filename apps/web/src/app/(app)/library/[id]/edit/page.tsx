"use client";

import ExerciseForm from "@/components/exercises/exercise-form";
import { fetchExerciseById } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import { BackButton, ErrorState, Spinner, YStack } from "@chops/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SingleExercise() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toLibrary = () => router.push("/library");

  const [exercise, setExercise] = useState<Exercise>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setError(null);
      setIsLoading(true);

      try {
        const data = await fetchExerciseById(id);
        if (!ignore) {
          setExercise(data);
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    load();

    return () => {
      ignore = true;
    };
  }, [retryCount, id]);

  return (
    <YStack padding="$4" gap="$4">
      <BackButton label="Library" onPress={toLibrary} alignSelf="flex-start" />

      <YStack maxWidth={560} width="100%" alignSelf="center">
        {isLoading ? (
          <YStack padding="$4" alignItems="center">
            <Spinner />
          </YStack>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        ) : (
          <ExerciseForm
            exercise={exercise}
            onSuccess={toLibrary}
            onCancel={toLibrary}
          />
        )}
      </YStack>
    </YStack>
  );
}
