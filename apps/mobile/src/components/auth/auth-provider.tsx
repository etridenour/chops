import { useState, useEffect, useCallback, type ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import type { AuthUser, AuthResponse } from "@chops/shared";
import { AuthContext, type AuthContextType } from "@/hooks/use-auth";
import { apiClient, setAccessToken } from "@/lib/api-client";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const storedRefreshToken =
          await SecureStore.getItemAsync("refreshToken");
        if (storedRefreshToken) {
          const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Client-Type": "mobile",
            },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
          });
          if (res.ok) {
            const data: AuthResponse & { refreshToken?: string } =
              await res.json();
            setAccessToken(data.accessToken);
            if (data.refreshToken) {
              await SecureStore.setItemAsync("refreshToken", data.refreshToken);
            }
            setUser(data.user);
          } else {
            await SecureStore.deleteItemAsync("refreshToken");
          }
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
      const data: AuthResponse & { refreshToken?: string } = await res.json();
      setAccessToken(data.accessToken);
      if (data.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
      }
      setUser(data.user);
      router.replace("/");
    },
    [router]
  );

  const logout = useCallback(async () => {
    const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
    try {
      await apiClient("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });
    } catch {
      // best effort
    }
    setAccessToken(null);
    await SecureStore.deleteItemAsync("refreshToken");
    setUser(null);
    router.replace("/login");
  }, [router]);

  const value: AuthContextType = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
