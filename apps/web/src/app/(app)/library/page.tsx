"use client";

import { ExerciseLibrary } from "@/components/exercises/exercise-library";
import { ExerciseListSkeleton } from "@/components/exercises/exercise-list-skeleton";
import { Button, H1, XStack, YStack } from "@chops/ui";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Exercises() {
  const router = useRouter();

  return (
    <YStack padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <H1>Library</H1>
        <Button onPress={() => router.push("/library/new")}>
          New Exercise
        </Button>
      </XStack>

      <Suspense fallback={<ExerciseListSkeleton />}>
        <ExerciseLibrary />
      </Suspense>
    </YStack>
  );
}
