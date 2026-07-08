import { useFieldArray, Controller, Control } from "react-hook-form";
import { CreateExerciseRequest } from "@chops/shared";
import {
  Body,
  Button,
  Input,
  Separator,
  ToggleGroup,
  XStack,
  YStack,
} from "@chops/ui";
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

  return (
    <YStack gap="$5">
      {fields.map((field, index) => (
        <XStack key={field.id} gap="$4" alignItems="center">
          <Controller
            control={control}
            name={`segments.${index}.measureCount`}
            render={({ field }) => (
              <NumberInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                width="$12"
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
                  onChange={field.onChange}
                />
              )}
            />
          </YStack>

          <Button
            variant="secondary"
            marginLeft={40}
            onPress={() => remove(index)}
          >
            Remove
          </Button>
        </XStack>
      ))}

      <Button
        width={200}
        onPress={() =>
          append({ measureCount: 8, timeSigTop: 4, timeSigBottom: 4 })
        }
      >
        Add Segment
      </Button>
    </YStack>
  );
}
