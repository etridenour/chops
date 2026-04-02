"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { YStack, H1, Input, Button, Label, ErrorText, Body, Spinner } from "@chops/ui";
import { useAuth } from "@/hooks/use-auth";
import { validateCompleteSignup } from "@chops/shared";
import type { AuthResponse } from "@chops/shared";
import { setAccessToken } from "@/lib/api-client";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </YStack>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { login } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        padding="$6"
        maxWidth={400}
        marginHorizontal="auto"
      >
        <H1 textAlign="center" marginBottom="$3">
          Invalid Link
        </H1>
        <Body textAlign="center">
          This verification link is invalid or missing a token.
        </Body>
      </YStack>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors = validateCompleteSignup({
      token,
      displayName,
      password,
      confirmPassword,
    });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/auth/signup/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, displayName, password, confirmPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Verification failed");
      }

      const data: AuthResponse = await res.json();
      setAccessToken(data.accessToken);
      window.location.href = "/";
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
      <H1 textAlign="center" marginBottom="$3">
        Complete Your Account
      </H1>
      <Body textAlign="center" marginBottom="$6">
        Choose a display name and password to finish signing up.
      </Body>
      <form onSubmit={handleSubmit}>
        <YStack gap="$3">
          <YStack>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChangeText={(text: string) => setDisplayName(text)}
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
          <YStack>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text: string) => setConfirmPassword(text)}
            />
          </YStack>
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Button variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </YStack>
      </form>
    </YStack>
  );
}
