module.exports = {
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/client/",
    "ecosystem.config.js",
    "/docker-dev-db/",
    "/node_modules",
    "<rootDir>/__tests__/config/",
    "<rootDir>/__tests__/seeds/",
  ],
};
