"use client";

import { Exercise, ExerciseMeasure } from "@chops/shared";
import { Body, H2, XStack, YStack } from "@chops/ui";

function formatTimeSignatures(measures: ExerciseMeasure[]): string {
  if (!measures?.length) {
    return "--";
  }
  let display = "";
  measures.forEach((m, i) => {
    display += `${i === 0 ? "" : " → "}${m.timeSigTop}/${m.timeSigBottom}`;
  });
  return display;
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <YStack>
      <H2>{exercise.title}</H2>
      <XStack gap="$2" padding="$3">
        <Body color="$colorMuted">{exercise.totalMeasures} measures</Body>
        <Body color="$colorMuted">
          {formatTimeSignatures(exercise.timeSigChangeMeasures)}
        </Body>
      </XStack>
    </YStack>
  );
}
