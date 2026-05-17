"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XStack } from "@chops/ui";
import type { IconProps } from "@tamagui/helpers-icon";
import type { ComponentType } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
  onPress?: () => void;
}

export function NavLink({ href, label, icon: Icon, onPress }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} onClick={onPress} style={{ textDecoration: "none" }}>
      <XStack
        alignItems="center"
        gap="$3"
        padding="$3"
        borderRadius="$2"
        backgroundColor={isActive ? "$accentBackground" : "transparent"}
        hoverStyle={{ backgroundColor: isActive ? "$accentBackground" : "$gray3" }}
        pressStyle={{ backgroundColor: "$gray4" }}
        cursor="pointer"
      >
        <Icon size={20} color={isActive ? "$accentColor" : "$colorMuted"} />
        <XStack tag="span" color={isActive ? "$accentColor" : "$colorMuted"} fontSize="$3" fontWeight={isActive ? "600" : "400"}>
          {label}
        </XStack>
      </XStack>
    </Link>
  );
}
