"use client";

import {
  Exercise,
  TimeSignatureSegment,
  getTotalMeasures,
} from "@chops/shared";
import { Body, H2, Label, XStack, YStack } from "@chops/ui";

function formatTimeSignatures(segments: TimeSignatureSegment[]): string {
  if (!segments?.length) {
    return "--";
  }
  let display = "";
  segments.forEach((m, i) => {
    display += `${i === 0 ? "" : " → "}${m.timeSigTop}/${m.timeSigBottom}`;
  });
  return display;
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <YStack>
      <H2>{exercise.title}</H2>
      <XStack gap="$2" padding="$3">
        <Body color="$colorMuted">
          {getTotalMeasures(exercise.segments)} measures
        </Body>
        <Body color="$colorMuted">
          {formatTimeSignatures(exercise.segments)}
        </Body>
        {exercise.difficulty != null && (
          <Body color="$colorMuted">Difficulty: {exercise.difficulty}</Body>
        )}
      </XStack>
      {exercise.tags && exercise.tags.length > 0 && (
        <XStack gap="$2">
          {exercise.tags.map((tag) => (
            <Label key={tag}>{tag}</Label>
          ))}
        </XStack>
      )}
    </YStack>
  );
}
