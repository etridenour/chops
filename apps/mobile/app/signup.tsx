import { useState } from "react";
import { useRouter } from "expo-router";
import { YStack, H2, Body, Input, Button, ErrorText, LinkText, Spinner } from "@chops/ui";
import { validateStartSignup } from "@chops/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    const errors = validateStartSignup({ email });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Type": "mobile",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <YStack flex={1} justifyContent="center" padding="$6">
        <H2 textAlign="center" marginBottom="$3">
          Check your email
        </H2>
        <Body color="$colorMuted" textAlign="center" marginBottom="$3">
          We sent a verification link to {email}. Open the link in your browser
          to create your account, then come back here to log in.
        </Body>
        <Body color="$colorSubtle" textAlign="center" fontSize="$2" marginBottom="$6">
          The link expires in 1 hour.
        </Body>
        <LinkText onPress={() => router.push("/login")}>
          Back to Log In
        </LinkText>
      </YStack>
    );
  }

  return (
    <YStack flex={1} justifyContent="center" padding="$6">
      <H2 textAlign="center" marginBottom="$6">
        Sign Up
      </H2>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        marginBottom="$3"
      />

      {error && <ErrorText>{error}</ErrorText>}

      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit}
        disabled={isSubmitting}
        marginBottom="$4"
      >
        {isSubmitting ? <Spinner color="$colorInverse" /> : "Send Verification Email"}
      </Button>

      <LinkText onPress={() => router.push("/login")}>
        Already have an account? Log In
      </LinkText>
    </YStack>
  );
}
