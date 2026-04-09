"use client";

import React, { useState } from "react";
import Link from "next/link";
import { YStack, H1, Input, Button, Label, ErrorText, Body, LinkText } from "@chops/ui";
import { validateStartSignup } from "@chops/shared";

export default function SignupPage() {
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
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/auth/signup/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <>
        <H1 textAlign="center" marginBottom="$3">
          Check your email
        </H1>
        <Body textAlign="center" marginBottom="$3">
          We sent a verification link to <strong>{email}</strong>.
          Click the link to create your account.
        </Body>
        <Body color="$colorSubtle" textAlign="center" fontSize="$2" marginBottom="$6">
          The link expires in 1 hour.
        </Body>
        <Link href="/login">
          <LinkText>Back to Log In</LinkText>
        </Link>
      </>
    );
  }

  return (
    <>
      <H1 textAlign="center" marginBottom="$6">
        Sign Up
      </H1>
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
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <Button variant="primary" fullWidth loading={isSubmitting} onPress={handleSubmit}>
          Send Verification Email
        </Button>
      </YStack>
      <Body textAlign="center" marginTop="$4">
        Already have an account?{" "}
        <Link href="/login">
          <LinkText>Log In</LinkText>
        </Link>
      </Body>
    </>
  );
}
