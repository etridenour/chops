import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import base, { jsxLanguageOptions, noHardcodedColors } from "./base.mjs";

export default defineConfig(
  base,
  jsxLanguageOptions,
  noHardcodedColors,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat["recommended-latest"],
);
