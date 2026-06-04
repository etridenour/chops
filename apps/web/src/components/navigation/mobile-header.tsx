"use client";

import { useState } from "react";
import { XStack, H2, Button, Menu, X } from "@chops/ui";
import { MobileMenu } from "./mobile-menu";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <XStack
        display="none"
        $md={{ display: "flex" }}
        alignItems="center"
        justifyContent="space-between"
        padding="$4"
        borderBottomWidth={1}
        borderColor="$borderColor"
        backgroundColor="$background"
        position="sticky"
        top={0}
        zIndex={5}
      >
        <H2 fontSize="$5">Chops</H2>
        <Button variant="ghost" size="sm" onPress={() => setOpen(!open)}>
          {open ? <X size={24} color="$color" /> : <Menu size={24} color="$color" />}
        </Button>
      </XStack>
      <MobileMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
