"use client";

import {
  Body,
  Button,
  ErrorText,
  H1,
  Input,
  Label,
  ToggleGroup,
  XStack,
  YStack,
} from "@chops/ui";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createExerciseSchema,
  CreateExerciseRequest,
  Exercise,
  getTotalMeasures,
} from "@chops/shared";
import { TagInput } from "./tag-input";
import { SegmentsEditor } from "./segments-editor";
import { useState } from "react";
import { createExercise, updateExercise } from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";

interface ExerciseFormProps {
  exercise?: Exercise;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExerciseForm({
  exercise,
  onSuccess,
  onCancel,
}: ExerciseFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExerciseRequest>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: exercise
      ? {
          title: exercise.title,
          difficulty: exercise.difficulty,
          tags: exercise.tags,
          segments: exercise.segments,
        }
      : {
          title: "",
          tags: [],
          segments: [{ measureCount: 8, timeSigTop: 4, timeSigBottom: 4 }],
        },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Live total measures (derived, not stored). Coalesce undefined counts from
  // mid-edit empty inputs so the readout doesn't flash NaN.
  const segments = useWatch({ control, name: "segments" }) ?? [];
  const totalMeasures = getTotalMeasures(
    segments.map((s) => ({ ...s, measureCount: s.measureCount || 0 })),
  );

  const onSubmit = async (data: CreateExerciseRequest) => {
    setSubmitError(null);
    try {
      if (exercise?.id) {
        await updateExercise(exercise.id, data);
      } else {
        await createExercise(data);
      }
      onSuccess?.();
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    }
  };

  const segmentsError =
    errors.segments?.root?.message ?? errors.segments?.message;

  return (
    <YStack gap="$7">
      <H1>{exercise?.id ? "Edit Exercise" : "New Exercise"}</H1>

      <YStack gap="$1">
        <Label htmlFor="title">Title</Label>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              id="title"
              value={field.value}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).value)
              }
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
      </YStack>

      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <Label>Time signatures</Label>
          <Body color="$colorMuted">{totalMeasures} measures total</Body>
        </XStack>
        <SegmentsEditor control={control} />
        {segmentsError && <ErrorText>{segmentsError}</ErrorText>}
      </YStack>

      <YStack gap="$1">
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </YStack>

      <YStack gap="$1">
        <Label>Difficulty</Label>
        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <ToggleGroup
              options={[1, 2, 3, 4, 5]}
              value={field.value}
              allowDeselect={true}
              onChange={field.onChange}
            />
          )}
        />
        {errors.difficulty && (
          <ErrorText>{errors.difficulty.message}</ErrorText>
        )}
      </YStack>

      <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
        <Button variant="secondary" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {exercise?.id ? "Save" : "Create"}
        </Button>
      </XStack>
      {submitError && <ErrorText>{submitError}</ErrorText>}
    </YStack>
  );
}
