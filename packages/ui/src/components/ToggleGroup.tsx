"use client";

import { XStack } from "tamagui";
import { Button } from "./Button";

interface ToggleGroupProps<T> {
  options: T[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
  allowDeselect?: boolean; // difficulty (optional) = true; timeSigBottom (required) = false
}

export function ToggleGroup<T extends string | number>({
  options,
  value,
  onChange,
  allowDeselect = false,
}: ToggleGroupProps<T>) {
  return (
    <XStack gap="$2">
      {options.map((option) => (
        <Button
          width="$8"
          key={option}
          variant={value === option ? "primary" : "secondary"}
          onPress={() =>
            onChange(allowDeselect && value === option ? undefined : option)
          }
        >
          {String(option)}
        </Button>
      ))}
    </XStack>
  );
}
