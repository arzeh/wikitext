import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin"

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  {
    rules: {
      "class-methods-use-this": "error",
      "dot-notation": "error",
      "eqeqeq": "error",
      "no-console": "off",
      "no-duplicate-imports": "error",
      "no-nested-ternary": "error",
      "no-self-compare": "error",
      "no-unassigned-vars": "error",
      "no-use-before-define": "error",
      "no-useless-assignment": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-template": "error",
      "require-await": "error",
      "sort-imports": "error",
      "sort-keys": "error",
    }
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/member-delimiter-style": "error",
      "@stylistic/no-extra-parens": "error",
      "@stylistic/no-extra-semi": "error",
      "@stylistic/no-mixed-spaces-and-tabs": "error",
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-tabs": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/semi": "error",
    }
  }
]);
