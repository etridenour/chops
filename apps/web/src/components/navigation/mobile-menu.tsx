"use client";

import { Sheet, YStack, XStack, Body, Button, Separator, LogOut } from "@chops/ui";
import { useAuth } from "@/hooks/use-auth";
import { NavItems } from "./nav-items";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { user, logout } = useAuth();

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      dismissOnOverlayPress
      snapPoints={[50]}
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <NavItems onNavigate={() => onOpenChange(false)} />

        <Separator marginVertical="$3" />

        <Body color="$colorMuted" fontSize="$2" numberOfLines={1}>
          {user?.email}
        </Body>
        <Button
          variant="ghost"
          size="sm"
          marginTop="$2"
          onPress={logout}
        >
          <XStack alignItems="center" gap="$2">
            <LogOut size={16} color="$colorMuted" />
            <Body fontSize="$2" color="$colorMuted">Log Out</Body>
          </XStack>
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
}
