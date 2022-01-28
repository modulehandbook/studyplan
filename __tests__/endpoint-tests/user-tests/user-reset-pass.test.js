const request = require("supertest");
const db = require("../../config/dbHandler.js");
const email = require("../../config/emailHandler.js");
const assert = require("assert");

beforeAll(async () => await db.reset());

const url = "http://localhost:3001";
const username = "test_username";
const password = "test_password";
const e_mail = "test@mail.de";

describe("reset password", () => {
  describe("flawless password reset", () => {
    let emailURL;
    let newPass;
    test("seed", (done) => {
      db.loadSeed("testUser", done);
    });
    test("send reset request", (done) => {
      request(url)
        .post("/users/reset-password")
        .send({
          email: e_mail,
        })
        .expect((response) => {
          emailURL = response.text + "/message.eml";
        })
        .expect(200, done);
    });
    test("read email", (done) => {
      email.getPassword(emailURL, (res) => {
        newPass = res;
        done();
      });
    });
    test("login with old", (done) => {
      request(url)
        .post("/users/login")
        .send({
          username: username,
          password: password,
        })
        .expect(401)
        .then((res) => {
          assert(res.text, "Falsches Passwort!");
          done();
        });
    });
    test("login with new password", (done) => {
      request(url)
        .post("/users/login")
        .send({
          username: username,
          password: newPass,
        })
        .expect(200)
        .then((res) => {
          assert(res.body.id);
          assert(res.body.username, username);
          assert(res.body.email, e_mail);
          assert(res.body.accessToken);
          assert(res.body.password, newPass);
          done();
        })
        .catch((e) => done(e));
    });
  });

  describe("password reset fails", () => {
    test("reset passwort with invalid email", (done) => {
      request(url)
        .post("/users/reset-password")
        .send({
          email: "randomEmail",
        })
        .expect(400)
        .then((res) => {
          assert(res.text, "Kein Benutzer mit dieser E-Mail-Adresse gefunden.");
          done();
        });
    });
    test("reset passwort unverified account", (done) => {
      request(url)
        .post("/users/reset-password")
        .send({
          email: e_mail + "2",
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
});
