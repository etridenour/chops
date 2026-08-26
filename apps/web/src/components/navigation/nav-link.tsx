"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XStack, Body } from "@chops/ui";
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
        backgroundColor={isActive ? "$backgroundMuted" : "transparent"}
        hoverStyle={{ backgroundColor: isActive ? "$backgroundMuted" : "$backgroundHover" }}
        pressStyle={{ backgroundColor: "$backgroundPress" }}
        cursor="pointer"
      >
        <Icon size={20} color={isActive ? "$color" : "$colorMuted"} />
        <Body color={isActive ? "$color" : "$colorMuted"} fontSize="$3" fontWeight={isActive ? "600" : "400"}>
          {label}
        </Body>
      </XStack>
    </Link>
  );
}
