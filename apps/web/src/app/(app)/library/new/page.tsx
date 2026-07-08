"use client";

import ExerciseForm from "@/components/exercises/exercise-form";
import { ExerciseList } from "@/components/exercises/exercise-list";
import { ExerciseListSkeleton } from "@/components/exercises/exercise-list-skeleton";
import { fetchExercises } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise } from "@chops/shared";
import { Button, ErrorState, H1, XStack, YStack } from "@chops/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ExerciseFormPage() {
  const router = useRouter();

  return <ExerciseForm />;
}
