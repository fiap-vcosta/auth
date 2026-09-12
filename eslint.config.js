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
      "n/no-extraneous-require": [
        "error",
        {
          allowModules: [
            "@domain/documento.js",
            "@application/emitir-token-cliente.js",
            "@presentation/auth-handler.js",
            "@infrastructure/config.js",
            "@infrastructure/gateways",
            "@infrastructure/jwt",
            "@infrastructure/http",
            "@test/helpers",
          ],
        },
      ],
    },
  },
];
