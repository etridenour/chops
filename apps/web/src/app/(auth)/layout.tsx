"use client";

import { YStack } from "@chops/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      padding="$6"
      maxWidth={400}
      marginHorizontal="auto"
    >
      {children}
    </YStack>
  );
}
