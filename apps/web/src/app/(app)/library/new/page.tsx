"use client";

import ExerciseForm from "@/components/exercises/exercise-form";
import { BackButton, YStack } from "@chops/ui";
import { useRouter } from "next/navigation";

export default function ExerciseFormPage() {
  const router = useRouter();
  const toLibrary = () => router.push("/library");

  return (
    <YStack padding="$4" gap="$4">
      <BackButton label="Library" onPress={toLibrary} alignSelf="flex-start" />
      <YStack maxWidth={560} width="100%" alignSelf="center">
        <ExerciseForm onSuccess={toLibrary} onCancel={toLibrary} />
      </YStack>
    </YStack>
  );
}
