import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function apiClient(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Client-Type": "mobile",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // If 401, attempt a silent refresh
  if (
    response.status === 401 &&
    path !== "/auth/refresh" &&
    path !== "/auth/login"
  ) {
    const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
    if (storedRefreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Type": "mobile",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        accessToken = data.accessToken;
        if (data.refreshToken) {
          await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        }
        headers["Authorization"] = `Bearer ${accessToken}`;
        response = await fetch(`${API_URL}${path}`, {
          ...options,
          headers,
        });
      }
    }
  }

  return response;
}
