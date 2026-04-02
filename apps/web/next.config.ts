import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@chops/shared",
    "@chops/ui",
    "tamagui",
    "@tamagui/core",
    "@tamagui/theme-builder",
  ],
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
    },
  },
};

export default nextConfig;
