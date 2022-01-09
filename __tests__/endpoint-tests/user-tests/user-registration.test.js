const request = require("supertest");
const db = require("../../config/dbHandler.js");
const email = require("../../config/emailHandler.js");
const assert = require("assert");

afterAll(async () => await db.connect());

const url = "http://localhost:3001";
const username = "test";
const e_mail = "test@mail.de";
const password = "testPass";

describe("user/register/", () => {
  describe("flawless registration", () => {
    let emailURL;
    let confirmationCode;
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
});
