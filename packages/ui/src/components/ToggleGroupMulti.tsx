"use client";

import { XStack } from "tamagui";
import { Button } from "./Button";

interface ToggleGroupMultiProps<T> {
  options: T[];
  value: T[];
  onChange: (v: T[]) => void;
}

export function ToggleGroupMulti<T extends string | number>({
  options,
  value,
  onChange,
}: ToggleGroupMultiProps<T>) {
  const handleChange = (option: T) => {
    if (value.includes(option)) {
      const newValue = value.filter((v) => v !== option);
      onChange(newValue);
    } else {
      const newValue = [...value, option];
      onChange(newValue);
    }
  };
  return (
    <XStack gap="$2">
      {options.map((option) => (
        <Button
          key={option}
          // See ToggleGroup: always set, so an unselected option still reads
          // as a toggle rather than a plain button.
          aria-pressed={value.includes(option)}
          variant={value.includes(option) ? "primary" : "secondary"}
          onPress={() => handleChange(option)}
        >
          {String(option)}
        </Button>
      ))}
    </XStack>
  );
}
