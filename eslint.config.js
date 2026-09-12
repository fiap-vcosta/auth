const js = require("@eslint/js");
const n = require("eslint-plugin-n");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**", "eslint-report.json"],
  },
  js.configs.recommended,
  n.configs["flat/recommended"],
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "n/no-unpublished-require": [
        "error",
        {
          allowModules: ["@eslint/js", "eslint-plugin-n", "globals"],
        },
      ],
    },
  },
];
