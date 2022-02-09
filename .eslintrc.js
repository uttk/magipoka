module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "prettier",
  ],

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },

  plugins: ["@typescript-eslint"],

  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },

  ignorePatterns: [".eslintrc.js", "dist"],

  overrides: [
    {
      files: ["./src/**/*.{js,jsx,ts,tsx,css,scss,svg}"],
      rules: {
        "import/order": [
          "error",
          {
            groups: ["type", "external", "internal", "sibling"],
            pathGroups: [],
            alphabetize: {
              order: "asc",
            },
            "newlines-between": "always",
          },
        ],
      },
    },
  ],

  rules: {},
};
