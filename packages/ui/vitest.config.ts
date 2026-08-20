import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": '"test"',
  },
  test: {
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "dist/**"],
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    server: {
      deps: {
        inline: [/lucide-icons/, /react-native-svg/],
      },
    },
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "react-native-svg": "react-native-svg-web",
    },
  },
});
