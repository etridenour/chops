"use client";

import { YStack, ErrorText } from "@chops/ui";

export function AuthError({ error }: { error: string | null }) {
  return (
    <YStack minHeight="$4">
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </YStack>
  );
}
