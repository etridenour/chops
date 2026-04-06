"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { YStack, XStack, H1, Input, Button, Label, ErrorText, Body, LinkText, Spinner, Eye, EyeOff } from "@chops/ui";
import { validateResetPassword } from "@chops/shared";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </YStack>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
          This password reset link is invalid or missing a token.
        </Body>
      </YStack>
    );
  }

  const handleSubmit = async () => {
    setError(null);

    const errors = validateResetPassword({ token, password, confirmPassword });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Reset failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        padding="$6"
        maxWidth={400}
        marginHorizontal="auto"
      >
        <H1 textAlign="center" marginBottom="$3">
          Password Reset
        </H1>
        <Body textAlign="center" marginBottom="$4">
          Your password has been reset successfully.
        </Body>
        <Link href="/login">
          <LinkText>Log in with your new password</LinkText>
        </Link>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      justifyContent="center"
      padding="$6"
      maxWidth={400}
      marginHorizontal="auto"
    >
      <H1 textAlign="center" marginBottom="$3">
        Reset Your Password
      </H1>
      <Body textAlign="center" marginBottom="$6">
        Enter your new password below.
      </Body>
      <YStack gap="$3">
          <YStack>
            <Label htmlFor="password">New Password</Label>
            <XStack alignItems="center">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <XStack alignItems="center">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                flex={1}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Button variant="primary" fullWidth loading={isSubmitting} onPress={handleSubmit}>
            Reset Password
          </Button>
      </YStack>
    </YStack>
  );
}
