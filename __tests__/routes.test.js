const request = require("supertest");
const db = require("./config/dbHandler.js");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("users", () => {
  describe("POST users/register", () => {
    test("successful", (done) => {
      request("http://localhost:3001")
          .get("/programs")
        /*.post("/users/register", {
          username: "test",
          email: "test@mail.de",
          password: "testPass",
        })*/
        .expect(200, done);
    });
  });
});
