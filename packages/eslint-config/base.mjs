import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export const jsxLanguageOptions = {
  files: ["**/*.{jsx,tsx}"],
  languageOptions: {
    globals: { ...globals.browser },
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
};

const USE_A_TOKEN =
  "Use a @chops/ui theme token ($color, $background, ...) instead of a hardcoded color.";

export const noHardcodedColors = {
  files: ["**/*.tsx"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
        message: USE_A_TOKEN,
      },
      {
        selector: "Literal[value=/^(?:rgb|hsl)a?\\(/]",
        message: USE_A_TOKEN,
      },
    ],
  },
};

export default defineConfig(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.expo/**",
      "**/coverage/**",
      "**/*.d.ts",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
