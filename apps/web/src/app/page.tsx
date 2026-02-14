"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Chops</h1>
      <p>Welcome, {user?.displayName}!</p>
      <button onClick={logout}>Log Out</button>
    </main>
  );
}
