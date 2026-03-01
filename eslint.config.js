import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "assets/**",
      "coverage/**",
      "coverage.html",
      "resume.pdf",
      "node_modules/**",
      "dist/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "tests/**/*.js", "sw.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
