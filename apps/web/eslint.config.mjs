import { defineConfig } from "eslint/config";
import next from "@chops/eslint-config/next";

export default defineConfig(next, {
  files: ["**/__tests__/**", "src/test/**"],
  rules: { "react/display-name": "off" },
});
