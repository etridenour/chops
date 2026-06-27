"use client";

import { Skeleton, XStack, YStack } from "@chops/ui";

export function ExerciseCardSkeleton() {
  return (
    <YStack gap="$2">
      <Skeleton width={180} height={24} /> {/* title bar */}
      <XStack gap="$2">
        <Skeleton width={80} height={16} /> {/* measures */}
        <Skeleton width={100} height={16} /> {/* time sig */}
      </XStack>
    </YStack>
  );
}
