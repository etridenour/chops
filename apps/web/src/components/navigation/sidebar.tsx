"use client";

import { YStack, XStack, H2, Body, Button, Separator, LogOut } from "@chops/ui";
import { useAuth } from "@/hooks/use-auth";
import { NavItems } from "./nav-items";

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <YStack
      width={240}
      height="100vh"
      position="sticky"
      top={0}
      borderRightWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
      padding="$4"
      $md={{ display: "none" }}
      render="aside"
    >
      <H2 fontSize="$5" marginBottom="$4">
        Chops
      </H2>

      <YStack flex={1}>
        <NavItems />
      </YStack>

      <Separator marginVertical="$3" />

      <Body color="$colorMuted" fontSize="$2" numberOfLines={1}>
        {user?.email}
      </Body>
      <Button variant="ghost" size="sm" marginTop="$2" onPress={logout}>
        <XStack alignItems="center" gap="$2">
          <LogOut size={16} color="$colorMuted" />
          <Body fontSize="$2" color="$colorMuted">
            Log Out
          </Body>
        </XStack>
      </Button>
    </YStack>
  );
}
