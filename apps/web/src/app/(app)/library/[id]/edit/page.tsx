"use client";

import ExerciseForm from "@/components/exercises/exercise-form";
import { fetchExerciseById } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import {
  Button,
  ChevronLeft,
  ErrorState,
  Spinner,
  YStack,
  XStack,
  Body,
} from "@chops/ui";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SingleExercise() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

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
      <Button
        variant="ghost"
        alignSelf="flex-start"
        onPress={() => router.push("/library")}
      >
        <XStack gap="$2" alignItems="center">
          <ChevronLeft size={18} />
          <Body>Library</Body>
        </XStack>
      </Button>

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
