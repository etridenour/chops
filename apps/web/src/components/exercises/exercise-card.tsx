"use client";

import {
  Exercise,
  TimeSignatureSegment,
  getTotalMeasures,
} from "@chops/shared";
import { Body, Card, Chip, XStack } from "@chops/ui";
import { useState } from "react";
import { ExerciseCardMenu } from "./exercise-card-menu";

const MAX_TAGS = 3;

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

function formatMeta(exercise: Exercise): string {
  const parts = [
    `${getTotalMeasures(exercise.segments)} measures`,
    formatTimeSignatures(exercise.segments),
  ];
  if (exercise.difficulty != null) {
    parts.push(`Difficulty ${exercise.difficulty}`);
  }
  return parts.join(" · ");
}

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
  const tags = exercise.tags ?? [];
  const visibleTags = tags.slice(0, MAX_TAGS);
  const overflowCount = tags.length - visibleTags.length;
  const [pressed, setPressed] = useState(false);

  return (
    <Card
      role="listitem"
      onPress={onEdit}
      cursor="pointer"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      backgroundColor={pressed ? "$backgroundMutedPress" : "$backgroundMuted"}
    >
      <XStack justifyContent="space-between" alignItems="center" gap="$2">
        <Body
          render="button"
          flex={1}
          numberOfLines={1}
          fontWeight="600"
          textAlign="left"
          backgroundColor="transparent"
          borderWidth={0}
          padding={0}
          cursor="pointer"
          focusVisibleStyle={{
            outlineColor: "$borderColorFocus",
            outlineWidth: 2,
            outlineStyle: "solid",
          }}
        >
          {exercise.title}
        </Body>
        <XStack
          onPress={(e) => e.stopPropagation()}
          onPressIn={(e) => e.stopPropagation()}
          onPressOut={(e) => e.stopPropagation()}
        >
          <ExerciseCardMenu onEdit={onEdit} onDelete={onDelete} />
        </XStack>
      </XStack>
      <XStack alignItems="center" gap="$2" flexWrap="nowrap">
        <Body
          flexShrink={1}
          numberOfLines={1}
          fontSize="$2"
          color="$colorMuted"
        >
          {formatMeta(exercise)}
        </Body>
        {visibleTags.map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
        {overflowCount > 0 && <Chip>+{overflowCount}</Chip>}
      </XStack>
    </Card>
  );
}
