const request = require("supertest");
const db = require("../../config/dbHandler.js");
const assert = require("assert");

beforeAll(async () => await db.reset());

const url = "http://localhost:3001";
const username = "test_username";
const password = "test_password";
const e_mail = "test@mail.de";

describe("login", () => {
  test("seed", (done) => {
    db.loadSeed("testUser", done);
  });
  test("successfull login", (done) => {
    request(url)
      .post("/users/login")
      .send({
        username: username,
        password: password,
      })
      .expect(200)
      .then((res) => {
        assert(res.body.id);
        assert(res.body.username, username);
        assert(res.body.email, e_mail);
        assert(res.body.accessToken);
        assert(res.body.password, password);
        done();
      })
      .catch((e) => done(e));
  });
  test("wrong password", (done) => {
    request(url)
      .post("/users/login")
      .send({
        username: username,
        password: "randomPass",
      })
      .expect(401)
      .then((res) => {
        assert(res.text, "Falsches Passwort!");
        done();
      });
  });
  test("wrong username", (done) => {
    request(url)
      .post("/users/login")
      .send({
        username: "randomName",
        password: password,
      })
      .expect(404)
      .then((res) => {
        assert(res.text, "Nutzer nicht gefunden!");
        done();
      });
  });
  test("User not verified", (done) => {
    request(url)
      .post("/users/login")
      .send({
        username: username + "2",
        password: password + "2",
      })
      .expect(401)
      .then((res) => {
        assert(
          res.text,
          "Dein Account wurde noch nicht verifiziert. Checke deine E-Mails oder fordere eine neue E-Mail an."
        );
        done();
      });
  });
});
