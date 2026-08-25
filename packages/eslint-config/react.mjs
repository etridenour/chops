import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import base, { jsxLanguageOptions } from "./base.mjs";

export default defineConfig(
  base,
  jsxLanguageOptions,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat["recommended-latest"],
);
