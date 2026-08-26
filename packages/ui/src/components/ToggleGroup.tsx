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
          // Always set, never omitted: `aria-pressed="false"` is what tells
          // assistive tech this is a toggle that happens to be off. Dropping it
          // would make an unselected option read as an ordinary button.
          aria-pressed={value === option}
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
