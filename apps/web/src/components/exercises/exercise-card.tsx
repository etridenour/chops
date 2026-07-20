"use client";

import {
  Exercise,
  TimeSignatureSegment,
  getTotalMeasures,
} from "@chops/shared";
import { Body, Card, Chip, XStack } from "@chops/ui";
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

  return (
    <Card
      onPress={onEdit}
      cursor="pointer"
      role="button"
      tabIndex={0}
      focusStyle={{ borderColor: "$borderColorFocus" }}
      pressStyle={{ backgroundColor: "$backgroundMutedPress" }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return; // came from the kebab, not the card
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
    >
      <XStack justifyContent="space-between" alignItems="center" gap="$2">
        <Body flex={1} numberOfLines={1} fontWeight="600">
          {exercise.title}
        </Body>
        <XStack onPress={(e) => e.stopPropagation()}>
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
