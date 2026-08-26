import { Button, ButtonProps } from "./Button";
import { Body } from "./Text";
import { XStack } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";

interface BackButtonProps extends ButtonProps {
  label?: string;
}

export function BackButton({ label = "Back", ...rest }: BackButtonProps) {
  return (
    <Button variant="ghost" size="sm" paddingLeft={0} {...rest}>
      <XStack gap="$1" alignItems="center">
        <ChevronLeft size={20} color="$colorMuted" />
        <Body color="$colorMuted">{label}</Body>
      </XStack>
    </Button>
  );
}
