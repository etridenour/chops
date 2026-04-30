"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  YStack,
  Input,
  H1,
  Button,
  Label,

  Body,
  LinkText,
  Eye,
  EyeOff,
} from "@chops/ui";
import { AuthError } from "../components/AuthError";
import { useAuth } from "@/hooks/use-auth";
import { validateLogin } from "@chops/shared";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setEmailInvalid(false);

    const errors = validateLogin({ email, password });
    if (errors.length > 0) {
      setError(errors[0]);
      setEmailInvalid(errors[0].toLowerCase().includes("email"));
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
    <>
      <H1 textAlign="center" marginBottom="$6">
        Log In
      </H1>
      <YStack gap="$3">
        <YStack>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail((e.target as HTMLInputElement).value);
              if (error) setError(null);
              if (emailInvalid) setEmailInvalid(false);
            }}
            autoCapitalize="none"
            error={emailInvalid}
          />
        </YStack>
        <YStack>
          <Label htmlFor="password">Password</Label>
          <YStack position="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              paddingRight={40}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
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
          </YStack>
        </YStack>
        <AuthError error={error} />
        <Button
          variant="primary"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit}
        >
          Log In
        </Button>
      </YStack>
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
    </>
  );
}
