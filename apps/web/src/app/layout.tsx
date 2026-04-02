import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import { NextTamaguiProvider } from "@/components/NextTamaguiProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chops",
  description: "Drums & percussion practice app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTamaguiProvider>
          <AuthProvider>{children}</AuthProvider>
        </NextTamaguiProvider>
      </body>
    </html>
  );
}
