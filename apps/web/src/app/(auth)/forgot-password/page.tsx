"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  YStack,
  H1,
  Input,
  Button,
  Label,

  Body,
  LinkText,
} from "@chops/ui";
import { AuthError } from "../components/AuthError";
import { validateForgotPassword } from "@chops/shared";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    const errors = validateForgotPassword({ email });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Request failed");
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
      <>
        <H1 textAlign="center" marginBottom="$3">
          Check your email
        </H1>
        <Body textAlign="center" marginBottom="$3">
          If an account exists for <strong>{email}</strong>, we sent a password
          reset link. Click the link to reset your password.
        </Body>
        <Body
          color="$colorSubtle"
          textAlign="center"
          fontSize="$2"
          marginBottom="$6"
        >
          The link expires in 5 minutes.
        </Body>
        <Link href="/login">
          <LinkText>Back to Log In</LinkText>
        </Link>
      </>
    );
  }

  return (
    <>
      <H1 textAlign="center" marginBottom="$3">
        Forgot Password
      </H1>
      <Body textAlign="center" marginBottom="$6">
        Enter your email and we&apos;ll send you a reset link.
      </Body>
      <YStack gap="$3">
        <YStack>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            autoCapitalize="none"
          />
        </YStack>
        <AuthError error={error} />
        <Button
          variant="primary"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit}
        >
          Send Reset Link
        </Button>
      </YStack>
      <Body textAlign="center" marginTop="$4">
        <Link href="/login">
          <LinkText>Back to Log In</LinkText>
        </Link>
      </Body>
    </>
  );
}
