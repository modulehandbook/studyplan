module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "prettier",
    "eslint:recommended",
    "@vue/prettier",
  ],
  plugins: ["prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": ["warn"],
    "vue/multi-word-component-names": "off",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
