"use client";

import {
  Button,
  ErrorText,
  H1,
  Input,
  Label,
  ToggleGroup,
  XStack,
  YStack,
} from "@chops/ui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createExerciseSchema,
  CreateExerciseRequest,
  Exercise,
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
      : { title: "", tags: [], segments: [] },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

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
    <YStack gap="$5">
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

      <YStack gap="$1">
        <Label htmlFor="difficulty">Difficulty</Label>
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

      <YStack gap="$1">
        <Label htmlFor="tags">Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </YStack>

      <SegmentsEditor control={control} />
      {segmentsError && <ErrorText>{segmentsError}</ErrorText>}

      <XStack gap="$3">
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
