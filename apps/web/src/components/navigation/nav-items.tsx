"use client";

import { YStack, Home, Drum } from "@chops/ui";
import { NavLink } from "./nav-link";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Drum },
];

interface NavItemsProps {
  onNavigate?: () => void;
}

export function NavItems({ onNavigate }: NavItemsProps) {
  return (
    <YStack gap="$1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          onPress={onNavigate}
        />
      ))}
    </YStack>
  );
}
