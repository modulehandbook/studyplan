module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier", "jest"],
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
        es2021: true,
      },
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/no-done-callback": "off",
        "jest/expect-expect": "off",
      },
    },
  ],
};
