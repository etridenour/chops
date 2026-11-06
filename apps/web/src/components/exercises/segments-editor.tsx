import { CreateExerciseRequest } from "@chops/shared";
import {
  Body,
  Button,
  ErrorText,
  Separator,
  ToggleGroup,
  XStack,
  YStack,
} from "@chops/ui";
import {
  Control,
  Controller,
  useFieldArray,
  useFormState,
} from "react-hook-form";
import { NumberInput } from "./number-input";

export function SegmentsEditor({
  control,
}: {
  control: Control<CreateExerciseRequest>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "segments",
  });
  const { errors } = useFormState({ control, name: "segments" });

  return (
    <YStack gap="$4">
      {fields.map((field, index) => {
        const segmentError = errors.segments?.[index];
        const messages = [
          segmentError?.measureCount?.message,
          segmentError?.timeSigTop?.message,
          segmentError?.timeSigBottom?.message,
        ].filter(Boolean);

        return (
          <YStack key={field.id}>
            <XStack gap="$4" alignItems="center">
              <Controller
                control={control}
                name={`segments.${index}.measureCount`}
                render={({ field }) => (
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    width="$12"
                    aria-label={`Segment ${index + 1} measure count`}
                  />
                )}
              />

              <Body>measures of</Body>
              <YStack gap="$2" alignItems="center">
                <Controller
                  control={control}
                  name={`segments.${index}.timeSigTop`}
                  render={({ field }) => (
                    <NumberInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      width="$9"
                      aria-label={`Segment ${index + 1} beats per measure`}
                    />
                  )}
                />
                <Separator width="100%" borderWidth={3} />
                <Controller
                  control={control}
                  name={`segments.${index}.timeSigBottom`}
                  render={({ field }) => (
                    <ToggleGroup
                      options={[4, 8, 16, 32]}
                      value={field.value}
                      allowDeselect={false}
                      label={`Segment ${index + 1} beat type`}
                      onChange={field.onChange}
                    />
                  )}
                />
              </YStack>

              {fields.length > 1 && (
                <Button
                  variant="secondary"
                  marginLeft="auto"
                  onPress={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </XStack>

            {messages.map((message) => (
              <ErrorText key={message}>{message}</ErrorText>
            ))}
          </YStack>
        );
      })}

      <Button
        alignSelf="flex-start"
        onPress={() =>
          append({ measureCount: 8, timeSigTop: 4, timeSigBottom: 4 })
        }
      >
        Add Segment
      </Button>
    </YStack>
  );
}
