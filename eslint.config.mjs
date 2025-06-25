import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "@typescript-eslint/no-inferrable-types": "off",
      // "space-before-function-paren": ["error", "never"],
      // "no-return-assign": "off",
      // "unicode-bom": ["error", "never"],
      // "arrow-parens": ["error", "as-needed"],
    },
  },
];
