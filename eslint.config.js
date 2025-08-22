import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unused from "eslint-plugin-unused-imports";
import eslintConfigPrettier from "eslint-config-prettier";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  // Ignore build artifacts
  globalIgnores(["dist", "coverage"]),

  // Base JS + TS recommendations
  js.configs.recommended,

  // Type-aware rules
  ...tseslint.configs.recommendedTypeChecked,

  // React-specific rules
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,

  // Project glues
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Lets TS-ESLint find tsconfig automatically
        project: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "unused-imports": unused,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "unused-imports/no-unused-imports": "error",
    },
  },

  // Disable stylistic rules that conflict with Prettier
  eslintConfigPrettier
);
