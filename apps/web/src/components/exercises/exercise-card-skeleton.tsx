"use client";

import { Skeleton, XStack, YStack } from "@chops/ui";

export function ExerciseCardSkeleton() {
  return (
    <YStack gap="$2">
      {/* title bar */}
      <Skeleton width={180} height={24} />
      <XStack gap="$2">
        {/* measures */}
        <Skeleton width={80} height={16} />
        {/* time sig */}
        <Skeleton width={100} height={16} />
      </XStack>
    </YStack>
  );
}
