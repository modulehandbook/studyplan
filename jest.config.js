module.exports = {
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/client/",
    "/docker-dev-db/",
    "/node_modules",
    "<rootDir>/__tests__/config/",
  ],
};
