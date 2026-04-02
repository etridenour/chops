import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { YStack, H2, Input, Button, ErrorText, LinkText, Spinner } from "@chops/ui";
import { useAuth } from "@/hooks/use-auth";
import { validateLogin } from "@chops/shared";

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || "http://localhost:3000";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    const errors = validateLogin({ email, password });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <YStack flex={1} justifyContent="center" padding="$6">
        <H2 textAlign="center" marginBottom="$6">
          Log In
        </H2>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          marginBottom="$3"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          marginBottom="$2"
        />

        <LinkText
          alignSelf="flex-end"
          marginBottom="$3"
          onPress={() => WebBrowser.openBrowserAsync(`${WEB_URL}/forgot-password`)}
        >
          Forgot password?
        </LinkText>

        {error && <ErrorText>{error}</ErrorText>}

        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit}
          disabled={isSubmitting}
          marginBottom="$4"
        >
          {isSubmitting ? <Spinner color="$colorInverse" /> : "Log In"}
        </Button>

        <LinkText onPress={() => router.push("/signup")}>
          Don&apos;t have an account? Sign Up
        </LinkText>
      </YStack>
    </KeyboardAvoidingView>
  );
}
