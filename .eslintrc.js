module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  parser: "vue-eslint-parser",
  extends: [
    "plugin:vue/vue3-recommended",
    "prettier"
  ],
  plugins: ["prettier", "jest"],
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": "warn",
  },
  overrides: [
    {
      files: [
        "*.test.js",
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
        es2020: true,
      },
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/no-done-callback": "off",
        "jest/expect-expect": "off",
      },
    },
  ],
};
