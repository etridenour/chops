"use client";

import { ExerciseList } from "@/components/exercises/exercise-list";
import { fetchExercises } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import { Body, YStack } from "@chops/ui";
import { useEffect, useState } from "react";

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  if (isLoading) return <Body>Loading...</Body>;
  if (error) return <Body>{error}</Body>;

  return (
    <YStack flex={1} justifyContent="center">
      <ExerciseList exercises={exercises} />
    </YStack>
  );
}
