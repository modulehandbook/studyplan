const request = require("supertest");
const db = require("../../config/dbHandler.js");
const email = require("../../config/emailHandler.js");
const assert = require("assert");

afterAll(async () => await db.connect());

const url = "http://localhost:3001";
const username = "test";
const e_mail = "test@mail.de";
const password = "testPass";
const username2 = "test2";
const e_mail2 = "test2@mail.de";
const password2 = "test2Pass";

describe("registration, confirmation and login", () => {
  let emailURL;
  let confirmationCode;
  describe("flawless registration", () => {
    test("send registration request", (done) => {
      request(url)
        .post("/users/register")
        .send({
          username: username,
          email: e_mail,
          password: password,
        })
        .expect((response) => {
          emailURL = response.text + "/message.eml";
        })
        .expect(200, done);
    });
    test("read email", (done) => {
      email.getVerificationCode(emailURL, (res) => {
        confirmationCode = res;
        done();
      });
    });
    test("confirm account", (done) => {
      request(url)
        .get("/users/confirmation/" + confirmationCode)
        .expect(200)
        .then((res) => {
          assert(
            res.text,
            "The account has been verified. Please log in: https://studyplan.herokuapp.com/login"
          );
          done();
        })
        .catch((e) => done(e));
    });
    test("login", (done) => {
      request(url)
        .post("/users/login")
        .send({
          username: username,
          password: password,
        })
        .expect(200)
        .then((res) => {
          assert(res.body.id);
          assert(res.body.username);
          assert(res.body.email);
          assert(res.body.accessToken);
          assert(res.body.password);
          done();
        })
        .catch((e) => done(e));
    });
  });

  describe("duplicate name or email", () => {
    test("send registration request (duplicate name)", (done) => {
      request(url)
        .post("/users/register")
        .send({
          username: username,
          email: "diff_email",
          password: password,
        })
        .expect(400)
        .then((res) => {
          assert(res.text, "Benutzername bereits vergeben!");
          done();
        });
    });
    test("send registration request (duplicate email)", (done) => {
      request(url)
        .post("/users/register")
        .send({
          username: "diff_name",
          email: e_mail,
          password: password,
        })
        .expect(400)
        .then((res) => {
          assert(res.text, "Email bereits vergeben!");
          done();
        });
    });
    test("send registration request (all duplicate)", (done) => {
      request(url)
        .post("/users/register")
        .send({
          username: username,
          email: e_mail,
          password: password,
        })
        .expect(400)
        .then((res) => {
          assert(res.text, "Benutzername bereits vergeben!");
          done();
        });
    });
  });

  describe("confirmation fails", () => {
    test("wrong confirmation code", (done) => {
      request(url)
        .get("/users/confirmation/" + "randomString")
        .expect(400)
        .then((res) => {
          assert(
            res.text,
            "We were unable to find a valid token. Your token may have expired."
          );
          done();
        })
        .catch((e) => done(e));
    });
    test("duplicate confirmation code", (done) => {
      request(url)
        .get("/users/confirmation/" + confirmationCode)
        .expect(400)
        .then((res) => {
          assert(res.text, "Der Nutzer wurde bereits bestätigt.");
          done();
        })
        .catch((e) => done(e));
    });
  });

  describe("resend confirmation", () => {
    test("register user", (done) => {
      request(url)
        .post("/users/register")
        .send({
          username: username2,
          email: e_mail2,
          password: password2,
        })
        .expect((response) => {
          emailURL = response.text + "/message.eml";
        })
        .expect(200, done);
    });
    test("resend email", (done) => {
      request(url)
        .post("/users/resend")
        .send({ email: e_mail2 })
        .expect(200, done);
    });
    test("confirm account", (done) => {
      email.getVerificationCode(emailURL, (res) => {
        request(url)
          .get("/users/confirmation/" + res)
          .expect(200)
          .then((res) => {
            assert(
              res.text,
              "The account has been verified. Please log in: https://studyplan.herokuapp.com/login"
            );
            done();
          })
          .catch((e) => done(e));
      });
    });
  });
  describe("resend confirmation fails", () => {
    test("resend email of already confirmed acc", (done) => {
      request(url)
        .post("/users/resend")
        .send({ email: e_mail2 })
        .expect(400)
        .then((res) => {
          assert(
            res.text,
            "Der Account wurde schon bestätigt. Bitte logge dich ein"
          );
          done();
        })
        .catch((e) => done(e));
    });
  });
  test("resend email of unknown acc", (done) => {
    request(url)
      .post("/users/resend")
      .send({ email: "randomEmail" })
      .expect(400)
      .then((res) => {
        assert(res.text, "Kein Benutzer mit dieser Mailadresse gefunden");
        done();
      })
      .catch((e) => done(e));
  });
});
