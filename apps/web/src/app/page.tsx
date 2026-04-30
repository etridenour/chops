"use client";

import { YStack, H1, Body, Button } from "@chops/ui";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const { user, logout } = useAuth();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
      <H1>Chops</H1>
      <Body color="$colorMuted" marginTop="$2">
        Welcome!
      </Body>
      <Button variant="secondary" size="sm" marginTop="$6" onPress={logout}>
        Log Out
      </Button>
    </YStack>
  );
}
