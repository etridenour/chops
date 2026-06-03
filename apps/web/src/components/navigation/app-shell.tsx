"use client";

import { XStack, YStack } from "@chops/ui";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Sidebar } from "./sidebar";
import { MobileHeader } from "./mobile-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <XStack flex={1} minHeight="100vh">
        <Sidebar />
        <YStack flex={1}>
          <MobileHeader />
          <YStack flex={1} padding="$6">
            {children}
          </YStack>
        </YStack>
      </XStack>
    </ProtectedRoute>
  );
}
