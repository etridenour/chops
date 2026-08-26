"use client";

import { Button, Input, XStack, YStack } from "@chops/ui";
import { useState } from "react";

interface TagProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: TagProps) {
  const [tagInput, setTagInput] = useState("");
  const tags = value ?? [];

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setTagInput("");
  };

  return (
    <YStack gap="$2">
      <XStack gap="$2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput((e.target as HTMLInputElement).value)}
          placeholder="Add a tag"
        />
        <Button onPress={addTag}>Add</Button>
      </XStack>
      <XStack gap="$2" flexWrap="wrap">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant="secondary"
            onPress={() => onChange(tags.filter((t) => t !== tag))}
          >
            {`${tag}   x`}
          </Button>
        ))}
      </XStack>
    </YStack>
  );
}
