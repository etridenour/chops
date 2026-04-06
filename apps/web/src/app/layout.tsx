import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { NextTamaguiProvider } from "@/components/NextTamaguiProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body className={inter.variable} style={{ fontFamily: inter.style.fontFamily, backgroundColor: '#050505', color: '#dddddd', minHeight: '100vh', margin: 0 }}>
        <NextTamaguiProvider>
          <AuthProvider>{children}</AuthProvider>
        </NextTamaguiProvider>
      </body>
    </html>
  );
}
