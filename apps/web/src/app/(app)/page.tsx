"use client";

import { YStack, H1, Body } from "@chops/ui";

export default function Home() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <H1>Chops</H1>
      <Body color="$colorMuted" marginTop="$2">
        Welcome!
      </Body>
    </YStack>
  );
}
