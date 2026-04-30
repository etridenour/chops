"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  YStack,
  XStack,
  H1,
  Input,
  Button,
  Label,
  Body,
  Spinner,
  Eye,
  EyeOff,
} from "@chops/ui";
import { AuthError } from "../components/AuthError";
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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <>
        <H1 textAlign="center" marginBottom="$3">
          Invalid Link
        </H1>
        <Body textAlign="center">
          This verification link is invalid or missing a token.
        </Body>
      </>
    );
  }

  const handleSubmit = async () => {
    setError(null);

    const errors = validateCompleteSignup({
      token,
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
        body: JSON.stringify({ token, password, confirmPassword }),
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
    <>
      <H1 textAlign="center" marginBottom="$3">
        Complete Your Account
      </H1>
      <Body textAlign="center" marginBottom="$6">
        Set a password.
      </Body>
      <YStack gap="$3">
        <YStack>
          <Label htmlFor="password">Password</Label>
          <XStack alignItems="center">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              flex={1}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: -36,
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? (
                <EyeOff size={20} color="$color" />
              ) : (
                <Eye size={20} color="$color" />
              )}
            </button>
          </XStack>
        </YStack>
        <YStack>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <XStack alignItems="center">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword((e.target as HTMLInputElement).value)
              }
              flex={1}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: -36,
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="$color" />
              ) : (
                <Eye size={20} color="$color" />
              )}
            </button>
          </XStack>
        </YStack>
        <AuthError error={error} />
        <Button
          variant="primary"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit}
        >
          Create Account
        </Button>
      </YStack>
    </>
  );
}
