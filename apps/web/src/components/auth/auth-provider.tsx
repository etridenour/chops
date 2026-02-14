"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, AuthResponse } from "@chops/shared";
import { AuthContext, type AuthContextType } from "@/hooks/use-auth";
import { apiClient, setAccessToken } from "@/lib/api-client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount, try to restore session via refresh token cookie
  useEffect(() => {
    const init = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.ok) {
          const data: AuthResponse = await res.json();
          setAccessToken(data.accessToken);
          setUser(data.user);
        }
      } catch {
        // No valid session
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      const data: AuthResponse = await res.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      router.push("/");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await apiClient("/auth/logout", { method: "POST" });
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value: AuthContextType = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
