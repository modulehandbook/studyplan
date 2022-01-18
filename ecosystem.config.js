module.exports = {
  apps: [
    {
      name: "node-server",
      script: "./main.js",
      env: {
        NODE_ENV: "production",
        MONGODB_URI: "mongodb://localhost:27017/studyplan",
        PORT: "3000",
        TEST_PROD: "false",
        SECRET_PATH: "/var/www/.config/secrets.js",
      },
    },
  ],
};
