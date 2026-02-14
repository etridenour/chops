"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { validateStartSignup } from "@chops/shared";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      <main>
        <h1>Check your email</h1>
        <p>
          We sent a verification link to <strong>{email}</strong>. Click the
          link to create your account.
        </p>
        <p>The link expires in 1 hour.</p>
        <p>
          <Link href="/login">Back to Log In</Link>
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Verification Email"}
        </button>
      </form>
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </main>
  );
}
