import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@chops/shared",
    "@chops/ui",
    "tamagui",
    "@tamagui/core",
    "@tamagui/theme-builder",
    "@tamagui/lucide-icons",
  ],
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
      "react-native-svg": "react-native-svg-web",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "react-native-svg": "react-native-svg-web",
    };
    return config;
  },
};

export default nextConfig;
