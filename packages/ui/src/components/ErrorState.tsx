import { YStack } from "tamagui";
import { Body, H2 } from "./Text";
import { Button } from "./Button";

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ message, onRetry, title }: ErrorStateProps) {
  return (
    <YStack alignItems="center" gap="$2">
      <H2>{title || "Something went wrong"}</H2>
      <Body>{message}</Body>
      {onRetry && <Button onPress={onRetry}>Try again</Button>}
    </YStack>
  );
}
