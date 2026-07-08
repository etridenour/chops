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
import { createExerciseSchema, CreateExerciseRequest } from "@chops/shared";
import { TagInput } from "./tag-input";
import { SegmentsEditor } from "./segments-editor";
import { useState } from "react";
import { createExercise } from "@/lib/api/exercises";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/errors";

export default function ExerciseForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExerciseRequest>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: { title: "", tags: [], segments: [] },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: CreateExerciseRequest) => {
    setSubmitError(null);

    try {
      await createExercise(data);
      router.push("/library");
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    }
  };

  const segmentsError =
    errors.segments?.root?.message ?? errors.segments?.message;

  return (
    <YStack gap="$5">
      <XStack justifyContent="space-between" alignItems="center">
        <H1>New Exercise</H1>
      </XStack>
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

      <Label htmlFor="tags">Tags</Label>
      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <TagInput value={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <SegmentsEditor control={control} />
      {segmentsError && <ErrorText>{segmentsError}</ErrorText>}

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        maxWidth={300}
      >
        Submit
      </Button>
      {submitError && <ErrorText>{submitError}</ErrorText>}
    </YStack>
  );
}
