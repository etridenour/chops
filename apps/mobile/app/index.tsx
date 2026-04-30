import { YStack, H1, Body, Button } from "@chops/ui";
import { useAuth } from "@/hooks/use-auth";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
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
