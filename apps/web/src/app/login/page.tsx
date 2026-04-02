"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { YStack, H1, Input, Button, Label, ErrorText, Body, LinkText } from "@chops/ui";
import { useAuth } from "@/hooks/use-auth";
import { validateLogin } from "@chops/shared";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    <YStack
      flex={1}
      justifyContent="center"
      padding="$6"
      maxWidth={400}
      marginHorizontal="auto"
    >
      <H1 textAlign="center" marginBottom="$6">
        Log In
      </H1>
      <form onSubmit={handleSubmit}>
        <YStack gap="$3">
          <YStack>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              inputMode="email"
              value={email}
              onChangeText={(text: string) => setEmail(text)}
              autoCapitalize="none"
            />
          </YStack>
          <YStack>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              secureTextEntry
              value={password}
              onChangeText={(text: string) => setPassword(text)}
            />
          </YStack>
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Button variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </YStack>
      </form>
      <Body textAlign="center" marginTop="$4">
        <Link href="/forgot-password">
          <LinkText>Forgot password?</LinkText>
        </Link>
      </Body>
      <Body textAlign="center" marginTop="$2">
        Don&apos;t have an account?{" "}
        <Link href="/signup">
          <LinkText>Sign Up</LinkText>
        </Link>
      </Body>
    </YStack>
  );
}
